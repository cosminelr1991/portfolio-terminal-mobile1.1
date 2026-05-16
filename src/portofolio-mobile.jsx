import React, { useState, useEffect, useCallback } from "react";

const THEME = {
  bg: "#0D1117", surface: "#161B22", border: "#21262D",
  text: "#C9D1D9", dim: "#8B949E", gold: "#E8C468",
  blue: "#4A9EFF", green: "#2ECC71", red: "#E74C3C",
};

const DEMO_PORTFOLIO = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", shares: 50, avgCost: 145.20, price: 213.49, prevPrice: 210.12, pe: 33.2, divYield: 0.52, beta: 1.24, payout: 15.2, mktCap: 3210, profitMargin: 0.26, roe: 1.47, currentRatio: 1.04, debtEq: 1.77 },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", shares: 30, avgCost: 290.00, price: 415.20, prevPrice: 412.40, pe: 36.8, divYield: 0.72, beta: 0.90, payout: 24.1, mktCap: 3080, profitMargin: 0.36, roe: 0.38, currentRatio: 1.35, debtEq: 0.40 },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", shares: 40, avgCost: 155.00, price: 148.30, prevPrice: 149.80, pe: 22.1, divYield: 3.28, beta: 0.55, payout: 48.6, mktCap: 356, profitMargin: 0.19, roe: 0.22, currentRatio: 1.12, debtEq: 0.48 },
  { symbol: "KO", name: "Coca-Cola Co.", sector: "Consumer Def.", shares: 80, avgCost: 58.00, price: 63.45, prevPrice: 63.10, pe: 24.7, divYield: 3.08, beta: 0.58, payout: 72.3, mktCap: 273, profitMargin: 0.22, roe: 0.41, currentRatio: 1.13, debtEq: 1.70 },
  { symbol: "O",    name: "Realty Income", sector: "Real Estate", shares: 60, avgCost: 52.00, price: 57.80, prevPrice: 57.20, pe: 41.8, divYield: 5.58, beta: 0.94, payout: 82.1, mktCap: 53, profitMargin: 0.14, roe: 0.03, currentRatio: 0.58, debtEq: 0.90 },
  { symbol: "V",    name: "Visa Inc.", sector: "Financial", shares: 20, avgCost: 210.00, price: 275.60, prevPrice: 273.90, pe: 30.2, divYield: 0.77, beta: 0.96, payout: 21.8, mktCap: 553, profitMargin: 0.52, roe: 0.52, currentRatio: 1.50, debtEq: 0.52 },
  { symbol: "PG",   name: "Procter & Gamble", sector: "Consumer Def.", shares: 35, avgCost: 130.00, price: 168.90, prevPrice: 167.50, pe: 27.3, divYield: 2.31, beta: 0.54, payout: 60.4, mktCap: 397, profitMargin: 0.18, roe: 0.31, currentRatio: 0.82, debtEq: 0.64 },
];

const DIV_MONTHS = {
  AAPL: [1,4,7,10], MSFT: [2,5,8,11], JNJ: [2,5,8,11],
  KO: [0,3,6,9], O: [0,1,2,3,4,5,6,7,8,9,10,11],
  V: [2,5,8,11], PG: [1,4,7,10],
};

function calcPortfolio(data) {
  return data.map(s => ({
    ...s,
    value: s.shares * s.price,
    prevValue: s.shares * s.prevPrice,
    invested: s.shares * s.avgCost,
    profit: s.shares * (s.price - s.avgCost),
    profitPct: ((s.price - s.avgCost) / s.avgCost) * 100,
    dailyChg: ((s.price - s.prevPrice) / s.prevPrice) * 100,
    annualDiv: s.divYield > 0 ? (s.price * s.divYield / 100) * s.shares : 0,
  }));
}

const fmt = (n, decimals = 2) => n.toLocaleString("ro-RO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtUSD = (n) => "$" + fmt(Math.abs(n));
const clr = (n) => n >= 0 ? THEME.green : THEME.red;
const sign = (n) => n >= 0 ? "+" : "";

// ── COMPONENTS ──────────────────────────────────────────────────────────────

function TopBar({ onRefresh }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: THEME.surface, borderBottom: `1px solid ${THEME.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: THEME.gold, letterSpacing: 1 }}>PORTFOLIO TERMINAL</div>
        <div style={{ fontSize: 10, color: THEME.dim, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>Market Dashboard</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 10, color: THEME.dim, textAlign: "right" }}>
          <div style={{ color: THEME.text }}>{time.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div>
          <div>live demo</div>
        </div>
        <button onClick={onRefresh} style={{ background: "transparent", border: `1px solid ${THEME.border}`, color: THEME.gold, borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 14 }}>↻</button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, delta, deltaColor }) {
  return (
    <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderTop: `2px solid ${THEME.gold}`, padding: "12px 14px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.text, fontWeight: 500, lineHeight: 1.2 }}>{value}</div>
      {delta && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: deltaColor || THEME.dim, marginTop: 4 }}>{delta}</div>}
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}`, overflowX: "auto", scrollbarWidth: "none", background: THEME.bg }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flexShrink: 0, background: "transparent", border: "none", borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent", color: active === t.id ? THEME.gold : THEME.dim, padding: "10px 14px", fontSize: 11, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Badge({ text, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, color, background: bg }}>{text}</span>;
}

// ── TAB: OVERVIEW ────────────────────────────────────────────────────────────
function OverviewTab({ portfolio, totals }) {
  const sorted = [...portfolio].sort((a, b) => b.dailyChg - a.dailyChg);
  const gainers = sorted.slice(0, 3);
  const losers = [...sorted].reverse().slice(0, 3);

  const sectors = {};
  portfolio.forEach(s => {
    sectors[s.sector] = (sectors[s.sector] || 0) + s.value;
  });
  const totalV = totals.value;

  const sectorColors = { Technology: THEME.blue, Healthcare: THEME.green, "Consumer Def.": THEME.gold, "Real Estate": THEME.red, Financial: "#9B59B6" };

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Mișcările zilei */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>MIȘCĂRILE ZILEI</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: THEME.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>▲ Creșteri</div>
            {gainers.map(s => (
              <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: THEME.text }}>{s.symbol}</div>
                  <div style={{ fontSize: 10, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: THEME.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>▼ Scăderi</div>
            {losers.map(s => (
              <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: THEME.text }}>{s.symbol}</div>
                  <div style={{ fontSize: 10, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alocare pe sectoare */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>ALOCARE SECTOARE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(sectors).sort((a,b) => b[1]-a[1]).map(([sec, val]) => {
            const pct = (val / totalV) * 100;
            const col = sectorColors[sec] || THEME.dim;
            return (
              <div key={sec}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: THEME.text }}>{sec}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.dim }}>{fmt(pct, 1)}%</span>
                </div>
                <div style={{ height: 4, background: THEME.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabel complet */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>TOATE POZIȚIILE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...portfolio].sort((a,b) => b.value - a.value).map(s => (
            <div key={s.symbol} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.gold, fontWeight: 500 }}>{s.symbol}</span>
                  <span style={{ fontSize: 11, color: THEME.dim, marginLeft: 8 }}>{s.sector}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.text }}>${fmt(s.price)}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  { l: "Valoare", v: fmtUSD(s.value) },
                  { l: "Profit", v: `${sign(s.profit)}${fmtUSD(s.profit)}`, c: clr(s.profit) },
                  { l: "Return", v: `${sign(s.profitPct)}${fmt(s.profitPct, 1)}%`, c: clr(s.profitPct) },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "6px 8px" }}>
                    <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 2 }}>{x.l}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: x.c || THEME.text }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── TAB: DIVIDENDE ───────────────────────────────────────────────────────────
function DivTab({ portfolio }) {
  const LUNI = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
  const monthly = Array(12).fill(0);
  const monthlyDetail = Array(12).fill(null).map(() => []);

  portfolio.forEach(s => {
    if (s.annualDiv <= 0) return;
    const months = DIV_MONTHS[s.symbol] || [];
    if (months.length === 0) return;
    const perMonth = s.annualDiv / months.length;
    months.forEach(m => {
      monthly[m] += perMonth;
      monthlyDetail[m].push({ symbol: s.symbol, amount: perMonth });
    });
  });

  const maxMonth = Math.max(...monthly);
  const totalAnnual = monthly.reduce((a, b) => a + b, 0);

  const divStocks = portfolio.filter(s => s.annualDiv > 0).sort((a, b) => b.annualDiv - a.annualDiv);

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Total anual */}
      <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.gold}`, padding: "14px 16px" }}>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>FLUX ANUAL ESTIMAT</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: THEME.gold }}>${fmt(totalAnnual)}</div>
        <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>${fmt(totalAnnual / 12)} / lună medie</div>
      </div>

      {/* Calendar lunar */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>CALENDAR LUNAR</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LUNI.map((luna, i) => {
            const val = monthly[i];
            const barW = maxMonth > 0 ? (val / maxMonth) * 100 : 0;
            const detail = monthlyDetail[i].map(d => d.symbol).join(", ");
            return (
              <div key={luna} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: THEME.dim, width: 26, flexShrink: 0 }}>{luna}</div>
                <div style={{ flex: 1, height: 20, background: THEME.border, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  {val > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barW}%`, background: THEME.gold, borderRadius: 4, opacity: 0.85 }} />}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: val > 0 ? THEME.gold : THEME.dim, width: 52, textAlign: "right", flexShrink: 0 }}>{val > 0 ? `$${fmt(val, 0)}` : "—"}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Per stoc */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>VENIT PE ACȚIUNE</div>
        {divStocks.map(s => (
          <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: THEME.text, fontWeight: 500 }}>{s.symbol}</div>
              <div style={{ fontSize: 10, color: THEME.dim }}>{s.shares} acțiuni · {fmt(s.divYield, 2)}% yield</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: THEME.gold }}>${fmt(s.annualDiv)}</div>
              <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.annualDiv / 12, 2)}/lună</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ── TAB: DIAGNOZĂ ────────────────────────────────────────────────────────────
function DiagTab({ portfolio, totals }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const runAI = useCallback(async () => {
    setLoading(true);
    setAiText("");
    const lines = portfolio.map(s =>
      `- ${s.symbol}: P/E=${s.pe.toFixed(1)}, Beta=${s.beta.toFixed(2)}, Profit%=${s.profitPct.toFixed(1)}%, Pondere=${fmt((s.value/totals.value)*100,1)}%, DivYield=${s.divYield.toFixed(2)}%, Payout=${s.payout.toFixed(0)}%, ProfitMargin=${(s.profitMargin*100).toFixed(1)}%, ROE=${(s.roe*100).toFixed(1)}%, CurrentRatio=${s.currentRatio.toFixed(2)}, Sector=${s.sector}`
    ).join("\n");
    const pct = ((totals.profit / totals.invested) * 100).toFixed(1);
    const prompt = `Ești un analist financiar senior. Analizează acest portofoliu și oferă un comentariu profesionist în română (max 200 cuvinte, fără markdown, doar text simplu cu secțiuni separate prin newline).\n\nPortofoliu: Valoare $${totals.value.toFixed(0)}, Profit $${totals.profit.toFixed(0)} (${pct}%), Dividende anuale $${totals.divIncome.toFixed(0)}\n\n${lines}\n\nRăspunde cu: REZUMAT (2 fraze), PUNCTE FORTE (2 aspecte), RISCURI (2 concrete), RECOMANDĂRI (2 acțiuni). Fii concis și specific cu ticker-ele.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setAiText(data.content?.[0]?.text || "Eroare la generare.");
    } catch (e) {
      setAiText("Eroare de conexiune.");
    }
    setLoading(false);
  }, [portfolio, totals]);

  const flags = [
    { label: "P/E > 35", color: THEME.gold, items: portfolio.filter(s => s.pe > 35 && s.pe < 500).sort((a,b) => b.pe - a.pe), fmt: s => `P/E ${s.pe.toFixed(1)}` },
    { label: "Risc tăiere dividend (Payout > 80%)", color: THEME.red, items: portfolio.filter(s => s.payout > 80 && s.annualDiv > 0).sort((a,b) => b.payout - a.payout), fmt: s => `Payout ${s.payout.toFixed(0)}%` },
    { label: "Beta > 1.5", color: THEME.blue, items: portfolio.filter(s => s.beta > 1.5).sort((a,b) => b.beta - a.beta), fmt: s => `β ${s.beta.toFixed(2)}` },
    { label: "Current Ratio < 1", color: THEME.red, items: portfolio.filter(s => s.currentRatio > 0 && s.currentRatio < 1 && s.sector !== "Financial").sort((a,b) => a.currentRatio - b.currentRatio), fmt: s => `CR ${s.currentRatio.toFixed(2)}` },
    { label: "Concentrare > 20%", color: THEME.gold, items: portfolio.filter(s => (s.value / totals.value) * 100 > 20).sort((a,b) => b.value - a.value), fmt: s => `${((s.value/totals.value)*100).toFixed(1)}%` },
  ];

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* AI */}
      <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.gold}`, padding: "14px 16px" }}>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>DIAGNOZĂ NARATIVĂ — CLAUDE AI</div>
        <button onClick={runAI} disabled={loading} style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Se analizează..." : "🧠 Generează Analiză AI"}
        </button>
        {aiText && (
          <div style={{ fontSize: 12, color: THEME.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{aiText}</div>
        )}
        {!aiText && !loading && (
          <div style={{ fontSize: 11, color: THEME.dim, fontStyle: "italic" }}>Apasă butonul pentru analiză narativă.</div>
        )}
      </div>

      {/* Flag-uri */}
      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: -8, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>ALERTE AUTOMATE</div>
      {flags.map(f => (
        <div key={f.label} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${f.color}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: f.color, letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</div>
          {f.items.length === 0 ? (
            <div style={{ fontSize: 11, color: THEME.dim }}>✓ Nicio problemă detectată</div>
          ) : f.items.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: THEME.text }}>{s.symbol}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: f.color }}>{f.fmt(s)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── TAB: WATCHLIST ────────────────────────────────────────────────────────────
function WatchlistTab({ portfolio, totals }) {
  const medianWeight = [...portfolio].sort((a,b) => (a.value/totals.value)-(b.value/totals.value))[Math.floor(portfolio.length/2)]?.value/totals.value * 100 || 5;

  const scored = portfolio.map(s => {
    const weight = (s.value / totals.value) * 100;
    const discount = ((s.avgCost - s.price) / s.avgCost) * 100;
    let score = 0;
    const reasons = [];

    if (discount > 0) { score += Math.min(28, discount * 1.4); reasons.push(`sub cost cu ${discount.toFixed(1)}%`); }
    else if (s.profitPct < 5) { score += 5; reasons.push("aproape de cost mediu"); }

    if (s.pe > 0 && s.pe <= 15) { score += 20; reasons.push("P/E atractiv"); }
    else if (s.pe <= 25) { score += 12; reasons.push("P/E rezonabil"); }
    else if (s.pe <= 35) { score += 5; }

    if (s.divYield >= 4) { score += 15; reasons.push("yield ridicat"); }
    else if (s.divYield >= 2) { score += 9; reasons.push("yield decent"); }
    else if (s.divYield > 0) { score += 4; }

    if (s.divYield > 0) {
      if (s.sector === "Real Estate") { score += 8; reasons.push("REIT"); }
      else if (s.payout <= 65) { score += 14; reasons.push("payout sănătos"); }
      else if (s.payout <= 85) { score += 7; reasons.push("payout acceptabil"); }
    }

    if (s.dailyChg < 0) { score += Math.min(10, Math.abs(s.dailyChg) * 2); reasons.push("slăbiciune zilnică"); }
    if (weight <= medianWeight) { score += 6; reasons.push("pondere sub mediană"); }

    score = Math.min(100, Math.round(score));
    return { ...s, score, reasons: reasons.slice(0, 3), discount, weight };
  }).sort((a, b) => b.score - a.score);

  const getSignal = (score) => {
    if (score >= 70) return { label: "Prioritate", color: THEME.green, bg: "rgba(46,204,113,0.12)" };
    if (score >= 50) return { label: "De urmărit", color: THEME.gold, bg: "rgba(232,196,104,0.12)" };
    return { label: "Candidat", color: THEME.blue, bg: "rgba(74,158,255,0.12)" };
  };

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>OPORTUNITĂȚI DCA — RANKED</div>
      {scored.map(s => {
        const sig = getSignal(s.score);
        return (
          <div key={s.symbol} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: THEME.text, fontWeight: 500 }}>{s.symbol}</span>
                <Badge text={sig.label} color={sig.color} bg={sig.bg} />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: sig.color, fontWeight: 500 }}>{s.score}</div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ height: 4, background: THEME.border, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${s.score}%`, background: sig.color, borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              {[
                { l: "Preț live", v: `$${fmt(s.price)}` },
                { l: "Cost mediu", v: `$${fmt(s.avgCost)}` },
                { l: "P/E", v: s.pe > 0 ? s.pe.toFixed(1) : "N/A" },
                { l: "Div Yield", v: `${s.divYield.toFixed(2)}%` },
              ].map(x => (
                <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "5px 8px" }}>
                  <div style={{ fontSize: 9, color: THEME.dim }}>{x.l}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.text }}>{x.v}</div>
                </div>
              ))}
            </div>
            {s.reasons.length > 0 && (
              <div style={{ fontSize: 10, color: THEME.dim }}>
                {s.reasons.join(" · ")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const portfolio = calcPortfolio(DEMO_PORTFOLIO);
  const totals = {
    value: portfolio.reduce((a, s) => a + s.value, 0),
    prevValue: portfolio.reduce((a, s) => a + s.prevValue, 0),
    invested: portfolio.reduce((a, s) => a + s.invested, 0),
    profit: portfolio.reduce((a, s) => a + s.profit, 0),
    divIncome: portfolio.reduce((a, s) => a + s.annualDiv, 0),
  };
  totals.dailyChgUSD = totals.value - totals.prevValue;
  totals.dailyChgPct = (totals.dailyChgUSD / totals.prevValue) * 100;
  totals.profitPct = (totals.profit / totals.invested) * 100;

  const tabs = [
    { id: "overview", label: "Portofoliu" },
    { id: "dividende", label: "Dividende" },
    { id: "diagnoza", label: "Diagnoză AI" },
    { id: "watchlist", label: "Watchlist" },
  ];

  return (
    <div style={{ background: THEME.bg, minHeight: "100vh", color: THEME.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", maxWidth: 420, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <TopBar onRefresh={() => setRefreshKey(k => k + 1)} />

      {/* Metrici sumar */}
      <div style={{ padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <MetricCard label="Valoare Totală" value={`$${fmt(totals.value)}`} />
          <MetricCard label="Profit Nerealizat" value={`${sign(totals.profit)}$${fmt(Math.abs(totals.profit))}`} delta={`${sign(totals.profitPct)}${fmt(totals.profitPct, 2)}%`} deltaColor={clr(totals.profit)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <MetricCard label="Evoluție Zilnică" value={`${sign(totals.dailyChgUSD)}$${fmt(Math.abs(totals.dailyChgUSD))}`} delta={`${sign(totals.dailyChgPct)}${fmt(totals.dailyChgPct, 2)}%`} deltaColor={clr(totals.dailyChgUSD)} />
          <MetricCard label="Flux Dividende" value={`$${fmt(totals.divIncome)}/an`} delta={`$${fmt(totals.divIncome / 12)}/lună`} />
        </div>
      </div>

      <div style={{ paddingTop: 12 }}>
        <TabBar tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === "overview" && <OverviewTab portfolio={portfolio} totals={totals} />}
      {tab === "dividende" && <DivTab portfolio={portfolio} />}
      {tab === "diagnoza" && <DiagTab portfolio={portfolio} totals={totals} />}
      {tab === "watchlist" && <WatchlistTab portfolio={portfolio} totals={totals} />}

      <div style={{ height: 32 }} />
    </div>
  );
}
