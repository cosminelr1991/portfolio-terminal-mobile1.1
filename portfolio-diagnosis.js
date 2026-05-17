function compactHolding(h) {
  return {
    symbol: h.symbol,
    name: h.name,
    sector: h.sector,
    weight: Number(h.weight || 0).toFixed(1) + "%",
    value: Math.round(h.value || 0),
    profitPct: Number(h.profitPct || 0).toFixed(1) + "%",
    dailyChg: Number(h.dailyChg || 0).toFixed(2) + "%",
    pe: h.pe != null ? Number(h.pe).toFixed(1) : "N/A",
    beta: h.beta != null ? Number(h.beta).toFixed(2) : "N/A",
    divYield: h.divYield != null ? Number(h.divYield).toFixed(2) + "%" : "N/A",
    annualDiv: Math.round(h.annualDiv || 0),
    payout: h.payout != null ? Number(h.payout).toFixed(0) + "%" : "N/A",
    margin: h.profitMargin != null ? Number(h.profitMargin * 100).toFixed(1) + "%" : "N/A",
    roe: h.roe != null ? Number(h.roe * 100).toFixed(1) + "%" : "N/A",
    currentRatio: h.currentRatio != null ? Number(h.currentRatio).toFixed(2) : "N/A",
    debtEq: h.debtEq != null ? Number(h.debtEq).toFixed(2) : "N/A",
  };
}

function localFallback(totals, holdings) {
  const invested = totals?.invested || 0;
  const profit = totals?.profit || 0;
  const profitPct = invested ? (profit / invested) * 100 : 0;
  const top = [...holdings].sort((a, b) => (b.profitPct || 0) - (a.profitPct || 0)).slice(0, 3).map(h => h.symbol).join(", ");
  const risks = holdings
    .filter(h => (h.payout > 80 && h.divYield > 0) || (h.pe > 35 && h.pe < 500) || h.beta > 1.5)
    .slice(0, 4)
    .map(h => h.symbol)
    .join(", ") || "none";

  return [
    "EXECUTIVE SUMMARY",
    `Portfolio value is $${Math.round(totals?.value || 0)}, with unrealized P/L of ${profit >= 0 ? "+" : "-"}$${Math.abs(Math.round(profit))} (${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(1)}%). Estimated annual dividend income is $${Math.round(totals?.divIncome || 0)}.`,
    "",
    "STRENGTHS",
    `Best contributors by return: ${top || "not available"}. The portfolio spans ${new Set(holdings.map(h => h.sector)).size} sectors.`,
    "",
    "RISKS",
    `Primary watchlist tickers: ${risks}. Review payout ratios, valuation, volatility, and concentration before adding capital.`,
    "",
    "ACTIONS",
    "Deploy new capital selectively, prioritize resilient dividend coverage, and avoid adding heavily to already concentrated positions."
  ].join("\n");
}

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const part of item.content || []) {
      if (part.type === "output_text" && part.text) chunks.push(part.text);
      if (part.type === "text" && part.text) chunks.push(part.text);
    }
  }
  return chunks.join("\n").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const { totals = {}, holdings = [] } = body;

  if (!Array.isArray(holdings) || holdings.length === 0) {
    return res.status(400).json({ error: "Missing holdings" });
  }

  if (!apiKey) {
    return res.status(200).json({
      analysis: localFallback(totals, holdings),
      source: "local",
      warning: "OPENAI_API_KEY is not configured",
    });
  }

  const compact = holdings
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .map(compactHolding);

  const prompt = [
    "Analyze this dividend-oriented equity portfolio for a mobile finance dashboard.",
    "Write in English. Use plain text, no Markdown. Keep it under 220 words.",
    "Use exactly these section headers on separate lines: EXECUTIVE SUMMARY, STRENGTHS, RISKS, ACTIONS.",
    "Mention specific tickers where relevant. Do not provide personalized financial advice or guarantees.",
    "",
    `Portfolio totals: value=$${Math.round(totals.value || 0)}, invested=$${Math.round(totals.invested || 0)}, unrealized P/L=$${Math.round(totals.profit || 0)}, annual dividend income=$${Math.round(totals.divIncome || 0)}, daily change=$${Math.round(totals.dailyChgUSD || 0)}.`,
    "",
    "Holdings:",
    JSON.stringify(compact),
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        max_output_tokens: 650,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI response error:", data);
      return res.status(200).json({
        analysis: localFallback(totals, holdings),
        source: "local",
        warning: data?.error?.message || "OpenAI request failed",
      });
    }

    const analysis = extractOutputText(data) || localFallback(totals, holdings);
    return res.status(200).json({ analysis, source: "openai" });
  } catch (error) {
    console.error("Portfolio diagnosis error:", error);
    return res.status(200).json({
      analysis: localFallback(totals, holdings),
      source: "local",
      warning: "OpenAI request failed",
    });
  }
}
