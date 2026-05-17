const YAHOO_FIELDS = [
  "regularMarketPrice",
  "regularMarketPreviousClose",
  "trailingPE",
  "dividendYield",
  "marketCap",
  "beta",
  "trailingAnnualDividendRate",
  "payoutRatio",
  "profitMargins",
  "returnOnEquity",
  "currentRatio",
  "debtToEquity",
].join(",");

function normalizeQuote(q) {
  return {
    price: q.regularMarketPrice ?? null,
    prevPrice: q.regularMarketPreviousClose ?? null,
    pe: q.trailingPE ?? null,
    divYield: q.dividendYield != null ? q.dividendYield * 100 : null,
    mktCap: q.marketCap != null ? Math.round(q.marketCap / 1e9) : null,
    beta: q.beta ?? null,
    divRate: q.trailingAnnualDividendRate ?? null,
    payout: q.payoutRatio != null ? q.payoutRatio * 100 : null,
    profitMargin: q.profitMargins ?? null,
    roe: q.returnOnEquity ?? null,
    currentRatio: q.currentRatio ?? null,
    debtEq: q.debtToEquity != null ? q.debtToEquity / 100 : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const symbols = String(req.query.symbols || "")
    .split(",")
    .map(s => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 80);

  if (symbols.length === 0) {
    return res.status(400).json({ error: "Missing symbols" });
  }

  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(","))}&fields=${YAHOO_FIELDS}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 PortfolioTerminal/1.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Yahoo Finance HTTP ${response.status}` });
    }

    const data = await response.json();
    const quotes = {};

    for (const q of data?.quoteResponse?.result || []) {
      if (q.symbol) quotes[q.symbol] = normalizeQuote(q);
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      source: "yahoo",
      updatedAt: new Date().toISOString(),
      count: Object.keys(quotes).length,
      quotes,
    });
  } catch (error) {
    console.error("Quote proxy failed:", error);
    return res.status(502).json({ error: "Quote provider unavailable" });
  }
}
