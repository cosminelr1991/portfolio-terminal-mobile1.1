import React, { useState, useEffect, useCallback } from "react";

const THEME = {
  bg: "#0D1117", surface: "#161B22", border: "#21262D",
  text: "#C9D1D9", dim: "#8B949E", gold: "#E8C468",
  blue: "#4A9EFF", green: "#2ECC71", red: "#E74C3C",
};

const PORTFOLIO_DATA = [
  { symbol: "KO",    name: "The Coca Cola Company",             sector: "Consumer Staples",       shares: 10,  avgCost: 62.98,  price: 80.82,  prevPrice: 79.80,  pe: 24.7,  divYield: 3.23, beta: 0.58, payout: 72.3, mktCap: 273,  profitMargin: 0.22, roe: 0.41, currentRatio: 1.13, debtEq: 1.70 },
  { symbol: "BAC",   name: "Bank Of America",                   sector: "Financials",             shares: 20,  avgCost: 42.97,  price: 49.77,  prevPrice: 49.20,  pe: 13.2,  divYield: 2.60, beta: 1.40, payout: 30.0, mktCap: 390,  profitMargin: 0.28, roe: 0.10, currentRatio: 0.90, debtEq: 1.20 },
  { symbol: "PG",    name: "Procter & Gamble Company",          sector: "Consumer Staples",       shares: 3,   avgCost: 154.84, price: 141.57, prevPrice: 142.10, pe: 27.3,  divYield: 2.71, beta: 0.54, payout: 60.4, mktCap: 397,  profitMargin: 0.18, roe: 0.31, currentRatio: 0.82, debtEq: 0.64 },
  { symbol: "CSCO",  name: "Cisco Systems Inc",                 sector: "Information Technology", shares: 20,  avgCost: 53.85,  price: 118.21, prevPrice: 117.50, pe: 28.5,  divYield: 2.97, beta: 0.82, payout: 45.0, mktCap: 480,  profitMargin: 0.22, roe: 0.32, currentRatio: 1.40, debtEq: 0.45 },
  { symbol: "UNP",   name: "Union Pacific Corporation",         sector: "Industrials",            shares: 2,   avgCost: 218.35, price: 270.56, prevPrice: 269.80, pe: 21.4,  divYield: 2.52, beta: 1.05, payout: 48.0, mktCap: 155,  profitMargin: 0.29, roe: 0.55, currentRatio: 0.75, debtEq: 1.80 },
  { symbol: "BTI",   name: "British American Tobacco",          sector: "Consumer Staples",       shares: 25,  avgCost: 35.47,  price: 65.09,  prevPrice: 64.50,  pe: 8.5,   divYield: 7.88, beta: 0.65, payout: 65.0, mktCap: 72,   profitMargin: 0.28, roe: 0.12, currentRatio: 0.85, debtEq: 0.95 },
  { symbol: "ESS",   name: "Essex Property Trust",              sector: "Real Estate",            shares: 2,   avgCost: 225.53, price: 267.06, prevPrice: 266.00, pe: 38.2,  divYield: 4.55, beta: 0.80, payout: 82.0, mktCap: 18,   profitMargin: 0.14, roe: 0.05, currentRatio: 0.58, debtEq: 1.10 },
  { symbol: "TSN",   name: "Tyson Foods, Inc",                  sector: "Consumer Staples",       shares: 10,  avgCost: 54.92,  price: 65.79,  prevPrice: 65.20,  pe: 18.5,  divYield: 3.71, beta: 0.70, payout: 55.0, mktCap: 24,   profitMargin: 0.04, roe: 0.06, currentRatio: 1.60, debtEq: 0.55 },
  { symbol: "VZ",    name: "Verizon Communications",            sector: "Communication Services", shares: 10,  avgCost: 40.49,  price: 46.37,  prevPrice: 45.90,  pe: 10.2,  divYield: 6.61, beta: 0.40, payout: 58.0, mktCap: 195,  profitMargin: 0.15, roe: 0.22, currentRatio: 0.75, debtEq: 1.60 },
  { symbol: "PFE",   name: "Pfizer, Inc",                       sector: "Health Care",            shares: 40,  avgCost: 28.27,  price: 25.33,  prevPrice: 25.80,  pe: 22.1,  divYield: 6.07, beta: 0.55, payout: 85.0, mktCap: 143,  profitMargin: 0.02, roe: 0.02, currentRatio: 1.20, debtEq: 0.70 },
  { symbol: "O",     name: "Realty Income Corporation",         sector: "Real Estate",            shares: 30,  avgCost: 53.51,  price: 61.12,  prevPrice: 60.50,  pe: 41.8,  divYield: 6.05, beta: 0.94, payout: 82.1, mktCap: 53,   profitMargin: 0.14, roe: 0.03, currentRatio: 0.58, debtEq: 0.90 },
  { symbol: "AAPL",  name: "Apple Inc",                         sector: "Information Technology", shares: 3,   avgCost: 209.65, price: 300.23, prevPrice: 298.50, pe: 33.2,  divYield: 0.50, beta: 1.24, payout: 15.2, mktCap: 3210, profitMargin: 0.26, roe: 1.47, currentRatio: 1.04, debtEq: 1.77 },
  { symbol: "TXN",   name: "Texas Instruments Inc",             sector: "Information Technology", shares: 4,   avgCost: 167.12, price: 302.73, prevPrice: 300.90, pe: 35.5,  divYield: 3.39, beta: 1.05, payout: 65.0, mktCap: 110,  profitMargin: 0.35, roe: 0.55, currentRatio: 4.50, debtEq: 0.80 },
  { symbol: "VICI",  name: "VICI Properties Inc",               sector: "Real Estate",            shares: 35,  avgCost: 29.55,  price: 27.90,  prevPrice: 27.60,  pe: 14.5,  divYield: 6.08, beta: 0.85, payout: 78.0, mktCap: 33,   profitMargin: 0.50, roe: 0.08, currentRatio: 0.40, debtEq: 0.75 },
  { symbol: "BLK",   name: "BlackRock, Inc.",                   sector: "Financials",             shares: 1,   avgCost: 633.50, price: 1081.90,prevPrice: 1075.00,pe: 22.8,  divYield: 3.28, beta: 1.30, payout: 52.0, mktCap: 162,  profitMargin: 0.31, roe: 0.15, currentRatio: 0.90, debtEq: 0.35 },
  { symbol: "BMY",   name: "Bristol-Myers Squibb",              sector: "Health Care",            shares: 20,  avgCost: 46.46,  price: 57.00,  prevPrice: 56.50,  pe: 15.2,  divYield: 5.33, beta: 0.50, payout: 75.0, mktCap: 115,  profitMargin: 0.10, roe: 0.18, currentRatio: 1.10, debtEq: 1.20 },
  { symbol: "DLR",   name: "Digital Realty Trust",              sector: "Real Estate",            shares: 2,   avgCost: 144.60, price: 188.51, prevPrice: 187.00, pe: 85.0,  divYield: 3.37, beta: 0.70, payout: 80.0, mktCap: 55,   profitMargin: 0.08, roe: 0.02, currentRatio: 0.50, debtEq: 1.30 },
  { symbol: "SBUX",  name: "Starbucks Corporation",             sector: "Consumer Staples",       shares: 5,   avgCost: 82.78,  price: 106.82, prevPrice: 105.90, pe: 28.5,  divYield: 2.99, beta: 0.90, payout: 65.0, mktCap: 120,  profitMargin: 0.12, roe: 0.00, currentRatio: 0.65, debtEq: 5.00 },
  { symbol: "CMCSA", name: "Comcast Corp.",                     sector: "Communication Services", shares: 15,  avgCost: 33.79,  price: 24.76,  prevPrice: 25.10,  pe: 9.5,   divYield: 3.90, beta: 1.00, payout: 38.0, mktCap: 95,   profitMargin: 0.12, roe: 0.18, currentRatio: 0.75, debtEq: 1.40 },
  { symbol: "MAA",   name: "Mid-America Apt. Communities",      sector: "Real Estate",            shares: 5,   avgCost: 145.12, price: 125.71, prevPrice: 124.80, pe: 32.5,  divYield: 4.16, beta: 0.75, payout: 78.0, mktCap: 15,   profitMargin: 0.22, roe: 0.06, currentRatio: 0.40, debtEq: 0.80 },
  { symbol: "ADC",   name: "Agree Realty Corporation",          sector: "Real Estate",            shares: 10,  avgCost: 74.07,  price: 74.46,  prevPrice: 73.90,  pe: 35.8,  divYield: 4.05, beta: 0.65, payout: 78.0, mktCap: 7,    profitMargin: 0.30, roe: 0.04, currentRatio: 0.35, debtEq: 0.65 },
  { symbol: "PM",    name: "Philip Morris International",       sector: "Consumer Staples",       shares: 2,   avgCost: 125.96, price: 189.61, prevPrice: 188.00, pe: 22.5,  divYield: 4.66, beta: 0.80, payout: 88.0, mktCap: 220,  profitMargin: 0.28, roe: 0.00, currentRatio: 0.80, debtEq: 5.00 },
  { symbol: "MO",    name: "Altria Group, Inc.",                sector: "Consumer Staples",       shares: 5,   avgCost: 52.80,  price: 73.09,  prevPrice: 72.50,  pe: 10.5,  divYield: 8.02, beta: 0.55, payout: 80.0, mktCap: 62,   profitMargin: 0.48, roe: 0.00, currentRatio: 0.55, debtEq: 5.00 },
  { symbol: "HSY",   name: "The Hershey Company",               sector: "Consumer Staples",       shares: 5,   avgCost: 150.21, price: 186.98, prevPrice: 185.50, pe: 22.8,  divYield: 3.64, beta: 0.38, payout: 62.0, mktCap: 38,   profitMargin: 0.16, roe: 0.55, currentRatio: 0.90, debtEq: 1.50 },
  { symbol: "DEO",   name: "Diageo plc",                        sector: "Consumer Staples",       shares: 3,   avgCost: 112.76, price: 81.69,  prevPrice: 82.20,  pe: 14.5,  divYield: 2.66, beta: 0.55, payout: 55.0, mktCap: 55,   profitMargin: 0.22, roe: 0.35, currentRatio: 1.20, debtEq: 1.10 },
  { symbol: "NKE",   name: "NIKE, Inc.",                        sector: "Consumer Staples",       shares: 10,  avgCost: 49.84,  price: 41.88,  prevPrice: 42.30,  pe: 20.5,  divYield: 3.29, beta: 1.05, payout: 55.0, mktCap: 62,   profitMargin: 0.09, roe: 0.28, currentRatio: 2.50, debtEq: 0.75 },
  { symbol: "ARE",   name: "Alexandria Real Estate Equities",   sector: "Real Estate",            shares: 10,  avgCost: 59.99,  price: 44.97,  prevPrice: 44.50,  pe: 22.5,  divYield: 4.80, beta: 0.85, payout: 80.0, mktCap: 8,    profitMargin: 0.12, roe: 0.03, currentRatio: 0.40, debtEq: 0.90 },
  { symbol: "LMT",   name: "Lockheed Martin Corporation",       sector: "Industrials",            shares: 1,   avgCost: 463.57, price: 516.01, prevPrice: 514.00, pe: 18.5,  divYield: 2.97, beta: 0.50, payout: 48.0, mktCap: 125,  profitMargin: 0.10, roe: 0.55, currentRatio: 1.20, debtEq: 2.20 },
  { symbol: "MSFT",  name: "Microsoft Corporation",             sector: "Information Technology", shares: 1,   avgCost: 430.59, price: 421.92, prevPrice: 423.00, pe: 36.8,  divYield: 0.84, beta: 0.90, payout: 24.1, mktCap: 3080, profitMargin: 0.36, roe: 0.38, currentRatio: 1.35, debtEq: 0.40 },
  { symbol: "V",     name: "Visa Inc.",                         sector: "Financials",             shares: 2,   avgCost: 324.59, price: 325.75, prevPrice: 324.00, pe: 30.2,  divYield: 0.82, beta: 0.96, payout: 21.8, mktCap: 553,  profitMargin: 0.52, roe: 0.52, currentRatio: 1.50, debtEq: 0.52 },
  { symbol: "MA",    name: "Mastercard Incorporated",           sector: "Financials",             shares: 1,   avgCost: 504.70, price: 494.20, prevPrice: 496.00, pe: 38.5,  divYield: 0.69, beta: 1.10, payout: 22.0, mktCap: 455,  profitMargin: 0.46, roe: 0.18, currentRatio: 1.20, debtEq: 1.80 },
  { symbol: "GOOGL", name: "Alphabet Inc (Google) Class A",     sector: "Information Technology", shares: 2,   avgCost: 338.00, price: 396.78, prevPrice: 394.50, pe: 19.5,  divYield: 0.25, beta: 1.05, payout: 5.0,  mktCap: 2400, profitMargin: 0.29, roe: 0.32, currentRatio: 1.85, debtEq: 0.08 },
];

const DIV_MONTHS = {
  KO:[0,3,6,9], BAC:[2,5,8,11], PG:[1,4,7,10], CSCO:[0,3,6,9], UNP:[2,5,8,11],
  BTI:[1,7], ESS:[2,5,8,11], TSN:[2,5,8,11], VZ:[1,4,7,10], PFE:[2,5,8,11],
  O:[0,1,2,3,4,5,6,7,8,9,10,11], AAPL:[1,4,7,10], TXN:[1,4,7,10], VICI:[0,3,6,9],
  BLK:[2,5,8,11], BMY:[1,4,7,10], DLR:[2,5,8,11], SBUX:[1,4,7,10], CMCSA:[0,3,6,9],
  MAA:[2,5,8,11], ADC:[0,1,2,3,4,5,6,7,8,9,10,11], PM:[0,3,6,9], MO:[0,3,6,9],
  HSY:[2,5,8,11], DEO:[1,7], NKE:[2,5,8,11], ARE:[2,5,8,11], LMT:[2,5,8,11],
  MSFT:[2,5,8,11], V:[2,5,8,11], MA:[1,4,7,10], GOOGL:[],
};

const fmt = (n, d = 2) => Number(n).toLocaleString("ro-RO", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUSD = (n) => "$" + fmt(Math.abs(n));
const clr = (n) => n >= 0 ? THEME.green : THEME.red;
const sign = (n) => n >= 0 ? "+" : "";

function calcPortfolio() {
  return PORTFOLIO_DATA.map(s => ({
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

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Card({ children, accent, style = {} }) {
  return (
    <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: accent ? `3px solid ${accent}` : undefined, padding: "12px 14px", ...style }}>
      {children}
    </div>
  );
}

function Badge({ text, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, color, background: bg }}>{text}</span>;
}

function MetricRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${THEME.border}` }}>
      <span style={{ fontSize: 12, color: THEME.dim }}>{label}</span>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: color || THEME.text }}>{value}</span>
    </div>
  );
}

function TopBar({ onRefresh }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: THEME.surface, borderBottom: `1px solid ${THEME.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: THEME.gold, letterSpacing: 1 }}>PORTFOLIO TERMINAL</div>
        <div style={{ fontSize: 10, color: THEME.dim, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>Market Intelligence Dashboard</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 10, color: THEME.dim, textAlign: "right" }}>
          <div style={{ color: THEME.text }}>{time.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div>
          <div>demo</div>
        </div>
        <button onClick={onRefresh} style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 14 }}>↻</button>
      </div>
    </div>
  );
}

function SummaryMetrics({ totals }) {
  const pct = (totals.profit / totals.invested) * 100;
  const yoc = (totals.divIncome / totals.invested) * 100;
  const metrics = [
    { label: "VALOARE TOTALĂ", value: `$${fmt(totals.value)}`, delta: null },
    { label: "PROFIT NEREALIZAT", value: `${sign(totals.profit)}$${fmt(Math.abs(totals.profit))}`, delta: `${sign(pct)}${fmt(pct, 2)}%`, dc: clr(totals.profit) },
    { label: "EVOLUȚIE ZILNICĂ", value: `${sign(totals.dailyChgUSD)}$${fmt(Math.abs(totals.dailyChgUSD))}`, delta: `${sign(totals.dailyChgPct)}${fmt(totals.dailyChgPct, 2)}%`, dc: clr(totals.dailyChgUSD) },
    { label: "FLUX DIVIDENDE/AN", value: `$${fmt(totals.divIncome)}`, delta: null },
    { label: "RANDAMENT YoC", value: `${fmt(yoc, 2)}%`, delta: null },
  ];
  return (
    <div style={{ padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {metrics.slice(0, 2).map(m => (
          <div key={m.label} style={{ flex: 1, background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderTop: `2px solid ${THEME.gold}`, padding: "10px 12px" }}>
            <div style={{ fontSize: 8, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: THEME.text }}>{m.value}</div>
            {m.delta && <div style={{ fontFamily: "monospace", fontSize: 11, color: m.dc, marginTop: 2 }}>{m.delta}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {metrics.slice(2).map(m => (
          <div key={m.label} style={{ flex: 1, background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderTop: `2px solid ${THEME.gold}`, padding: "10px 12px" }}>
            <div style={{ fontSize: 8, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: m.dc || THEME.text }}>{m.value}</div>
            {m.delta && <div style={{ fontFamily: "monospace", fontSize: 11, color: m.dc, marginTop: 2 }}>{m.delta}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}`, overflowX: "auto", scrollbarWidth: "none", background: THEME.bg, WebkitOverflowScrolling: "touch" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flexShrink: 0, background: "transparent", border: "none", borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent", color: active === t.id ? THEME.gold : THEME.dim, padding: "10px 12px", fontSize: 10, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── TAB 1: MATRICEA PORTOFOLIULUI ────────────────────────────────────────────
function MatriceTab({ portfolio, totals }) {
  const sorted = [...portfolio].sort((a, b) => b.dailyChg - a.dailyChg);
  const gainers = sorted.slice(0, 5);
  const losers = [...sorted].reverse().slice(0, 5);

  const sectors = {};
  portfolio.forEach(s => { sectors[s.sector] = (sectors[s.sector] || 0) + s.value; });
  const sectorColors = {
    "Information Technology": THEME.blue, "Consumer Staples": THEME.gold,
    "Real Estate": THEME.green, "Financials": "#9B59B6",
    "Health Care": "#E91E8C", "Industrials": "#FF9800",
    "Communication Services": THEME.red,
  };

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
      <section>
        <SectionHeader>MIȘCĂRILE ZILEI — TOP 5</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: THEME.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>▲ Creșteri</div>
            {gainers.map(s => (
              <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: THEME.text }}>{s.symbol}</div>
                  <div style={{ fontSize: 9, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: THEME.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>▼ Scăderi</div>
            {losers.map(s => (
              <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${THEME.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: THEME.text }}>{s.symbol}</div>
                  <div style={{ fontSize: 9, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>HARTĂ PROFITABILITATE PE SECTOARE</SectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(sectors).sort((a, b) => b[1] - a[1]).map(([sec, val]) => {
            const pct = (val / totals.value) * 100;
            const col = sectorColors[sec] || THEME.dim;
            const secStocks = portfolio.filter(s => s.sector === sec);
            const avgProfit = secStocks.reduce((a, s) => a + s.profitPct, 0) / secStocks.length;
            return (
              <div key={sec} style={{ background: THEME.surface, borderRadius: 6, border: `1px solid ${THEME.border}`, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: THEME.text }}>{sec}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: col }}>{fmt(pct, 1)}%</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: clr(avgProfit) }}>{sign(avgProfit)}{fmt(avgProfit, 1)}%</span>
                  </div>
                </div>
                <div style={{ height: 4, background: THEME.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {secStocks.map(s => (
                    <span key={s.symbol} style={{ fontSize: 9, color: clr(s.profitPct), background: THEME.bg, borderRadius: 4, padding: "2px 5px" }}>
                      {s.symbol} {sign(s.profitPct)}{fmt(s.profitPct, 1)}%
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader>REGISTRUL CENTRAL</SectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...portfolio].sort((a, b) => b.value - a.value).map(s => (
            <Card key={s.symbol}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: THEME.gold }}>{s.symbol}</div>
                  <div style={{ fontSize: 10, color: THEME.dim }}>{s.sector}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: THEME.text }}>${fmt(s.price)}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                {[
                  { l: "Valoare", v: fmtUSD(s.value) },
                  { l: "Profit $", v: `${sign(s.profit)}${fmtUSD(s.profit)}`, c: clr(s.profit) },
                  { l: "Return %", v: `${sign(s.profitPct)}${fmt(s.profitPct, 1)}%`, c: clr(s.profitPct) },
                  { l: "Acțiuni", v: s.shares },
                  { l: "Cost Med.", v: `$${fmt(s.avgCost)}` },
                  { l: "P/E", v: s.pe > 0 ? fmt(s.pe, 1) : "N/A" },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "5px 7px" }}>
                    <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: x.c || THEME.text }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── TAB 2: DIAGNOZĂ AI ────────────────────────────────────────────────────────
function DiagTab({ portfolio, totals }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const runAI = useCallback(async () => {
    setLoading(true);
    setAiText("");
    const lines = portfolio.map(s =>
      `- ${s.symbol}: P/E=${s.pe.toFixed(1)}, Beta=${s.beta.toFixed(2)}, Profit%=${s.profitPct.toFixed(1)}%, Pondere=${fmt((s.value / totals.value) * 100, 1)}%, DivYield=${s.divYield.toFixed(2)}%, Payout=${s.payout.toFixed(0)}%, ProfitMargin=${(s.profitMargin * 100).toFixed(1)}%, ROE=${(s.roe * 100).toFixed(1)}%, CurrentRatio=${s.currentRatio.toFixed(2)}, Sector=${s.sector}`
    ).join("\n");
    const pct = ((totals.profit / totals.invested) * 100).toFixed(1);
    const prompt = `Ești un analist financiar senior. Analizează acest portofoliu și oferă comentariu profesionist în română (max 250 cuvinte, fără markdown, text simplu cu secțiuni pe linii noi).\n\nPortofoliu: Valoare $${totals.value.toFixed(0)}, Profit $${totals.profit.toFixed(0)} (${pct}%), Dividende anuale $${totals.divIncome.toFixed(0)}\n\n${lines}\n\nStructură răspuns:\nREZUMAT EXECUTIV (2-3 fraze)\nPUNCTE FORTE (max 3, cu ticker-ele specifice)\nRISCURI IDENTIFICATE (max 3 concrete)\nRECOMANDĂRI (max 3 acțiuni concrete)`;
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
    { label: "Evaluare Excesivă (P/E > 35)", color: THEME.gold, items: portfolio.filter(s => s.pe > 35 && s.pe < 500).sort((a, b) => b.pe - a.pe), val: s => `P/E ${s.pe.toFixed(1)}` },
    { label: "Risc Tăiere Dividend (Payout > 80%)", color: THEME.red, items: portfolio.filter(s => s.payout > 80 && s.annualDiv > 0 && s.sector !== "Real Estate").sort((a, b) => b.payout - a.payout), val: s => `${s.payout.toFixed(0)}%` },
    { label: "Volatilitate Ridicată (Beta > 1.5)", color: THEME.blue, items: portfolio.filter(s => s.beta > 1.5).sort((a, b) => b.beta - a.beta), val: s => `β ${s.beta.toFixed(2)}` },
    { label: "Lichiditate Scăzută (CR < 1)", color: THEME.red, items: portfolio.filter(s => s.currentRatio > 0 && s.currentRatio < 1 && s.sector !== "Financials").sort((a, b) => a.currentRatio - b.currentRatio), val: s => `CR ${s.currentRatio.toFixed(2)}` },
    { label: "Marjă Profit Negativă", color: THEME.red, items: portfolio.filter(s => s.profitMargin < 0), val: s => `${(s.profitMargin * 100).toFixed(1)}%` },
    { label: "Concentrare Excesivă (> 15%)", color: THEME.gold, items: portfolio.filter(s => (s.value / totals.value) * 100 > 15).sort((a, b) => b.value - a.value), val: s => `${((s.value / totals.value) * 100).toFixed(1)}%` },
  ];

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <Card accent={THEME.gold}>
        <SectionHeader>DIAGNOZĂ NARATIVĂ — CLAUDE AI</SectionHeader>
        <button onClick={runAI} disabled={loading} style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, opacity: loading ? 0.6 : 1, width: "100%" }}>
          {loading ? "⏳ Se analizează portofoliul..." : "🧠 Generează Analiză AI a Portofoliului"}
        </button>
        {aiText ? (
          <div style={{ fontSize: 12, color: THEME.text, lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {aiText.split("\n").map((line, i) => {
              const isHeader = ["REZUMAT", "PUNCTE", "RISCURI", "RECOMAND", "1.", "2.", "3.", "4."].some(h => line.trim().startsWith(h));
              return <div key={i} style={{ color: isHeader ? THEME.gold : THEME.text, fontSize: isHeader ? 10 : 12, textTransform: isHeader ? "uppercase" : "none", letterSpacing: isHeader ? 1.5 : 0, marginTop: isHeader ? 10 : 0 }}>{line}</div>;
            })}
          </div>
        ) : !loading && (
          <div style={{ fontSize: 11, color: THEME.dim, fontStyle: "italic" }}>Apasă butonul pentru analiză narativă AI a portofoliului.</div>
        )}
      </Card>

      <SectionHeader>RAPORT DE SĂNĂTATE — ALERTE AUTOMATE</SectionHeader>
      {flags.map(f => (
        <Card key={f.label} accent={f.color}>
          <div style={{ fontSize: 10, color: f.color, letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</div>
          {f.items.length === 0 ? (
            <div style={{ fontSize: 11, color: THEME.dim }}>✓ Nicio problemă detectată</div>
          ) : f.items.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: THEME.text }}>{s.symbol}</span>
                <span style={{ fontSize: 10, color: THEME.dim, marginLeft: 6 }}>{s.name.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: f.color }}>{f.val(s)}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ── TAB 3: FLUXURI & EVENIMENTE ───────────────────────────────────────────────
function FluxTab({ portfolio }) {
  const LUNI = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthly = Array(12).fill(0);
  const monthlyDetail = Array(12).fill(null).map(() => []);

  portfolio.forEach(s => {
    if (s.annualDiv <= 0) return;
    const months = DIV_MONTHS[s.symbol] || [];
    if (!months.length) return;
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
      <Card accent={THEME.gold}>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>FLUX ANUAL ESTIMAT DIVIDENDE</div>
        <div style={{ fontFamily: "monospace", fontSize: 26, color: THEME.gold }}>${fmt(totalAnnual)}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(totalAnnual / 12)}<span style={{ color: THEME.dim }}> / lună medie</span></div>
          <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(totalAnnual / 52)}<span style={{ color: THEME.dim }}> / săptămână</span></div>
        </div>
      </Card>

      <section>
        <SectionHeader>PROIECȚIE FLUX LUNAR DIVIDENDE</SectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {LUNI.map((luna, i) => {
            const val = monthly[i];
            const barW = maxMonth > 0 ? (val / maxMonth) * 100 : 0;
            const tickers = monthlyDetail[i].map(d => d.symbol).join(", ");
            return (
              <div key={luna}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: THEME.dim, width: 26, flexShrink: 0 }}>{luna}</div>
                  <div style={{ flex: 1, height: 22, background: THEME.border, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    {val > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barW}%`, background: THEME.gold, borderRadius: 4, opacity: 0.85 }} />}
                    {val > 0 && <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, display: "flex", alignItems: "center", fontSize: 9, color: THEME.bg, fontFamily: "monospace" }}>{tickers}</div>}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: val > 0 ? THEME.gold : THEME.dim, width: 55, textAlign: "right", flexShrink: 0 }}>{val > 0 ? `$${fmt(val, 0)}` : "—"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader>DISTRIBUȚIE NOMINALĂ DIVIDENDE</SectionHeader>
        {divStocks.map(s => (
          <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: THEME.text }}>{s.symbol}</div>
              <div style={{ fontSize: 9, color: THEME.dim }}>{s.shares} acț · {fmt(s.divYield, 2)}% yield · {(DIV_MONTHS[s.symbol] || []).length}x/an</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: THEME.gold }}>${fmt(s.annualDiv)}/an</div>
              <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.annualDiv / 12, 2)}/lună</div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <SectionHeader>RADAR EVENIMENTE FINANCIARE</SectionHeader>
        <Card>
          <div style={{ fontSize: 11, color: THEME.dim, marginBottom: 10 }}>Date aproximative — verificați brokerul pentru confirmare</div>
          {portfolio.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: THEME.gold }}>{s.symbol}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: THEME.dim }}>Div: <span style={{ color: THEME.text }}>N/A</span></div>
                <div style={{ fontSize: 10, color: THEME.dim }}>Earn: <span style={{ color: THEME.text }}>N/A</span></div>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}

// ── TAB 4: REBALANSARE ────────────────────────────────────────────────────────
function RebalTab({ portfolio, totals }) {
  const [capital, setCapital] = useState(0);
  const [targets, setTargets] = useState(() => {
    const t = {};
    const eq = (100 / portfolio.length).toFixed(2);
    portfolio.forEach(s => { t[s.symbol] = parseFloat(eq); });
    return t;
  });

  const totalValue = totals.value + capital;
  const sumaTargets = Object.values(targets).reduce((a, b) => a + b, 0);

  const suggestions = portfolio.map(s => {
    const targetVal = (targets[s.symbol] / 100) * totalValue;
    const diff = targetVal - s.value;
    const shares = Math.floor(diff / s.price);
    return { ...s, targetPct: targets[s.symbol], diff, shares };
  }).filter(s => s.shares >= 1).sort((a, b) => b.shares - a.shares);

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader>ALGORITM DE OPTIMIZARE PERSONALIZAT</SectionHeader>

      <Card>
        <div style={{ fontSize: 10, color: THEME.dim, marginBottom: 6 }}>CAPITAL NOU (DCA) $</div>
        <input
          type="number"
          value={capital}
          onChange={e => setCapital(Number(e.target.value))}
          style={{ background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 6, padding: "8px 12px", fontSize: 14, fontFamily: "monospace", width: "100%", boxSizing: "border-box" }}
          min={0} step={100}
        />
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: THEME.dim }}>Total alocat:</div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: Math.abs(sumaTargets - 100) <= 0.1 ? THEME.green : THEME.red }}>
          {fmt(sumaTargets, 2)}% / 100%
        </div>
      </div>

      <section>
        <SectionHeader>PONDERI CURENTE VS ȚINTĂ</SectionHeader>
        {portfolio.map(s => {
          const currentPct = (s.value / totals.value) * 100;
          return (
            <div key={s.symbol} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div style={{ width: 48, fontFamily: "monospace", fontSize: 11, color: THEME.gold, flexShrink: 0 }}>{s.symbol}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: THEME.dim }}>Actual: {fmt(currentPct, 1)}%</span>
                  <span style={{ fontSize: 9, color: THEME.gold }}>Țintă: {fmt(targets[s.symbol], 1)}%</span>
                </div>
                <div style={{ height: 6, background: THEME.border, borderRadius: 3, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(currentPct, 100)}%`, background: THEME.blue, borderRadius: 3, opacity: 0.6 }} />
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(targets[s.symbol], 100)}%`, background: THEME.gold, borderRadius: 3, opacity: 0.4 }} />
                </div>
              </div>
              <input
                type="number"
                value={targets[s.symbol]}
                onChange={e => setTargets(prev => ({ ...prev, [s.symbol]: parseFloat(e.target.value) || 0 }))}
                style={{ width: 48, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, padding: "3px 5px", fontSize: 10, fontFamily: "monospace", textAlign: "right" }}
                min={0} max={100} step={0.5}
              />
            </div>
          );
        })}
      </section>

      {Math.abs(sumaTargets - 100) <= 0.1 && suggestions.length > 0 && (
        <section>
          <SectionHeader>VECTORI DE ACHIZIȚIE</SectionHeader>
          {suggestions.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: THEME.gold }}>{s.symbol}</div>
                <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.price)} / acțiune</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: THEME.green }}>+{s.shares} acț.</div>
                <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.shares * s.price)}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

// ── TAB 5: WATCHLIST ──────────────────────────────────────────────────────────
function WatchlistTab({ portfolio, totals }) {
  const [minScore, setMinScore] = useState(35);
  const medianWeight = [...portfolio].sort((a, b) => a.value - b.value)[Math.floor(portfolio.length / 2)]?.value / totals.value * 100 || 5;

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
      else if (s.payout <= 85) { score += 7; }
    }
    if (s.dailyChg < 0) { score += Math.min(10, Math.abs(s.dailyChg) * 2); reasons.push("slăbiciune zilnică"); }
    if (weight <= medianWeight) { score += 6; reasons.push("pondere sub mediană"); }
    score = Math.min(100, Math.round(score));
    return { ...s, score, reasons: reasons.slice(0, 3), discount, weight };
  }).filter(s => s.score >= minScore).sort((a, b) => b.score - a.score);

  const getSignal = (score) => {
    if (score >= 70) return { label: "Prioritate Mare", color: THEME.green, bg: "rgba(46,204,113,0.12)" };
    if (score >= 50) return { label: "De Urmărit", color: THEME.gold, bg: "rgba(232,196,104,0.12)" };
    return { label: "Candidat", color: THEME.blue, bg: "rgba(74,158,255,0.12)" };
  };

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader>WATCHLIST — OPORTUNITĂȚI DCA</SectionHeader>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, color: THEME.dim, flexShrink: 0 }}>Scor minim:</span>
        <input type="range" min={0} max={100} step={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontFamily: "monospace", fontSize: 12, color: THEME.gold, width: 30 }}>{minScore}</span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { l: "Candidați", v: scored.length },
          { l: "Scor Max", v: scored[0]?.score || 0 },
          { l: "Sub Cost", v: scored.filter(s => s.discount > 0).length },
        ].map(x => (
          <div key={x.l} style={{ flex: 1, background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "10px", textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 18, color: THEME.gold }}>{x.v}</div>
            <div style={{ fontSize: 9, color: THEME.dim, marginTop: 2 }}>{x.l}</div>
          </div>
        ))}
      </div>

      {scored.map(s => {
        const sig = getSignal(s.score);
        return (
          <Card key={s.symbol}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 14, color: THEME.text }}>{s.symbol}</span>
                <Badge text={sig.label} color={sig.color} bg={sig.bg} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 22, color: sig.color }}>{s.score}</div>
            </div>
            <div style={{ height: 4, background: THEME.border, borderRadius: 2, marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${s.score}%`, background: sig.color, borderRadius: 2 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              {[
                { l: "Preț Live", v: `$${fmt(s.price)}` },
                { l: "Cost Mediu", v: `$${fmt(s.avgCost)}` },
                { l: "P/E", v: s.pe > 0 ? s.pe.toFixed(1) : "N/A" },
                { l: "Div Yield", v: `${s.divYield.toFixed(2)}%` },
                { l: "Discount", v: s.discount > 0 ? `${s.discount.toFixed(1)}%` : "—", c: s.discount > 0 ? THEME.green : THEME.dim },
                { l: "Pondere", v: `${s.weight.toFixed(1)}%` },
              ].map(x => (
                <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "5px 8px" }}>
                  <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: x.c || THEME.text }}>{x.v}</div>
                </div>
              ))}
            </div>
            {s.reasons.length > 0 && <div style={{ fontSize: 10, color: THEME.dim }}>{s.reasons.join(" · ")}</div>}
          </Card>
        );
      })}
    </div>
  );
}

// ── TAB 6: DEEP DIVE (FULL) ───────────────────────────────────────────────────
const AV_API_KEY = "X5RO0IYNYQ3CBFSY";

function MiniSparkline({ data, color, height = 48 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 300, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TechnicalChart({ closes, avgCost }) {
  if (!closes || closes.length < 26) return null;
  const n = closes.length;
  const w = 340, h = 120;

  // SMA20
  const sma20 = closes.map((_, i) => {
    if (i < 19) return null;
    return closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0) / 20;
  });

  const allVals = [...closes, ...sma20.filter(Boolean)];
  const minV = Math.min(...allVals) * 0.995;
  const maxV = Math.max(...allVals) * 1.005;
  const range = maxV - minV || 1;

  const toY = v => h - ((v - minV) / range) * h;
  const toX = i => (i / (n - 1)) * w;

  const closePath = closes.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const fillPath = closePath + ` L${toX(n-1)},${h} L0,${h} Z`;
  const smaPath = sma20.map((v, i) => v !== null ? `${sma20.slice(0, i).every(x => x === null) ? "M" : "L"}${toX(i)},${toY(v)}` : "").filter(Boolean).join(" ");

  const avgY = avgCost ? toY(avgCost) : null;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#priceGrad)" />
      <path d={closePath} fill="none" stroke="#4A9EFF" strokeWidth="2" strokeLinejoin="round" />
      <path d={smaPath} fill="none" stroke="#E8C468" strokeWidth="1.4" strokeDasharray="4,3" strokeLinejoin="round" />
      {avgY !== null && (
        <>
          <line x1={0} y1={avgY} x2={w} y2={avgY} stroke="#E8C468" strokeWidth="1" strokeDasharray="5,4" opacity="0.8" />
          <text x={4} y={avgY - 3} fill="#E8C468" fontSize="8" fontFamily="monospace">Cost: ${avgCost?.toFixed(2)}</text>
        </>
      )}
    </svg>
  );
}

function RSIChart({ closes }) {
  if (!closes || closes.length < 15) return null;
  const w = 340, h = 50;
  const rsiVals = [];
  for (let i = 14; i < closes.length; i++) {
    const slice = closes.slice(i - 14, i + 1);
    const gains = [], losses = [];
    for (let j = 1; j < slice.length; j++) {
      const d = slice[j] - slice[j - 1];
      gains.push(d > 0 ? d : 0);
      losses.push(d < 0 ? -d : 0);
    }
    const ag = gains.reduce((a, b) => a + b, 0) / 14;
    const al = losses.reduce((a, b) => a + b, 0) / 14;
    rsiVals.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al));
  }
  const toX = i => (i / (rsiVals.length - 1)) * w;
  const toY = v => h - (v / 100) * h;
  const path = rsiVals.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const last = rsiVals[rsiVals.length - 1];
  const rsiColor = last > 70 ? "#E74C3C" : last < 30 ? "#2ECC71" : "#E8C468";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 50 }} preserveAspectRatio="none">
      <line x1={0} y1={toY(70)} x2={w} y2={toY(70)} stroke="#E74C3C" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
      <line x1={0} y1={toY(30)} x2={w} y2={toY(30)} stroke="#2ECC71" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
      <path d={path} fill="none" stroke={rsiColor} strokeWidth="1.6" strokeLinejoin="round" />
      <text x={w - 4} y={10} fill={rsiColor} fontSize="9" fontFamily="monospace" textAnchor="end">{last.toFixed(1)}</text>
    </svg>
  );
}

function MACDChart({ closes }) {
  if (!closes || closes.length < 30) return null;
  const w = 340, h = 50;

  const ema = (data, period) => {
    const k = 2 / (period + 1);
    let e = data[0];
    return data.map(v => { e = v * k + e * (1 - k); return e; });
  };

  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signal = ema(macdLine.slice(25), 9);
  const hist = macdLine.slice(34).map((v, i) => v - signal[i]);

  const allV = [...hist];
  const minV = Math.min(...allV);
  const maxV = Math.max(...allV);
  const range = maxV - minV || 1;
  const toY = v => h / 2 - (v / (range / 2)) * (h / 2 - 2);
  const toX = i => (i / (hist.length - 1)) * w;
  const barW = w / hist.length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 50 }} preserveAspectRatio="none">
      <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="#21262D" strokeWidth="0.8" />
      {hist.map((v, i) => {
        const y0 = h / 2;
        const y1 = toY(v);
        return (
          <rect key={i} x={toX(i)} y={Math.min(y0, y1)} width={barW - 0.5} height={Math.abs(y0 - y1) || 0.5}
            fill={v >= 0 ? "#2ECC71" : "#E74C3C"} opacity="0.75" />
        );
      })}
    </svg>
  );
}

function VaRDistribution({ returns }) {
  if (!returns || returns.length < 20) return null;
  const var95 = [...returns].sort((a, b) => a - b)[Math.floor(returns.length * 0.05)];
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const std = Math.sqrt(returns.map(r => (r - mean) ** 2).reduce((a, b) => a + b, 0) / returns.length);
  const winRate = returns.filter(r => r > 0).length / returns.length * 100;
  const sharpe = (mean * 252) / (std * Math.sqrt(252));
  const annVol = std * Math.sqrt(252);
  const maxDD = Math.min(...returns);

  const bins = 24;
  const minR = Math.min(...returns), maxR = Math.max(...returns);
  const binW = (maxR - minR) / bins;
  const counts = Array(bins).fill(0);
  returns.forEach(r => {
    const idx = Math.min(bins - 1, Math.floor((r - minR) / binW));
    counts[idx]++;
  });
  const maxCount = Math.max(...counts);
  const chartW = 320, chartH = 60;

  return (
    <div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: 60 }} preserveAspectRatio="none">
        {counts.map((c, i) => {
          const bx = (i / bins) * chartW;
          const bw = (1 / bins) * chartW - 0.5;
          const bh = (c / maxCount) * (chartH - 4);
          const centerVal = minR + (i + 0.5) * binW;
          return <rect key={i} x={bx} y={chartH - bh} width={bw} height={bh} fill={centerVal < 0 ? "#E74C3C" : "#4A9EFF"} opacity="0.7" />;
        })}
        {/* VaR 95% line */}
        {(() => {
          const varX = ((var95 - minR) / (maxR - minR)) * chartW;
          return <line x1={varX} y1={0} x2={varX} y2={chartH} stroke="#E8C468" strokeWidth="1.5" strokeDasharray="3,2" />;
        })()}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
        {[
          { l: "VaR 95% Zilnic", v: `${var95.toFixed(2)}%`, good: var95 > -2 },
          { l: "Sharpe Ratio (1Y)", v: sharpe.toFixed(2), good: sharpe > 1 },
          { l: "Win Rate", v: `${winRate.toFixed(1)}%`, good: winRate > 52 },
          { l: "Volatilitate Anuală", v: `${annVol.toFixed(1)}%`, good: annVol < 25 },
          { l: "Cel mai rău Drawdown", v: `${maxDD.toFixed(2)}%`, good: maxDD > -5 },
          { l: "Medie Zilnică", v: `${mean.toFixed(3)}%`, good: mean > 0 },
        ].map(x => (
          <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "6px 8px" }}>
            <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: x.good ? THEME.green : THEME.red }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeepDiveTab({ portfolio, totals }) {
  const [selected, setSelected] = useState(portfolio[0]?.symbol || "");
  const [chartData, setChartData] = useState({});
  const [loadingChart, setLoadingChart] = useState(false);
  const [deepSubTab, setDeepSubTab] = useState("tehnic");

  const s = portfolio.find(p => p.symbol === selected) || portfolio[0];
  if (!s) return null;

  useEffect(() => {
    if (chartData[selected]) return;
    setLoadingChart(true);
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selected}&outputsize=full&apikey=${AV_API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const ts = data["Time Series (Daily)"];
        if (!ts) { setLoadingChart(false); return; }
        const sorted = Object.entries(ts)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-252);
        const closes = sorted.map(([, v]) => parseFloat(v["4. close"]));
        const returns = closes.slice(1).map((v, i) => ((v - closes[i]) / closes[i]) * 100);
        setChartData(prev => ({ ...prev, [selected]: { closes, returns } }));
        setLoadingChart(false);
      })
      .catch(() => setLoadingChart(false));
  }, [selected]);

  const cd = chartData[selected];
  const closes = cd?.closes || [];
  const returns = cd?.returns || [];

  const scorecard = [
    { label: "Net Profit Margin", value: `${(s.profitMargin * 100).toFixed(1)}%`, good: s.profitMargin > 0.10, note: "Profitabilitate netă" },
    { label: "Return on Equity (ROE)", value: `${(s.roe * 100).toFixed(1)}%`, good: s.roe > 0.10, note: "Eficiența capitalului propriu" },
    { label: "Debt / Equity", value: `${s.debtEq.toFixed(2)}x`, good: s.debtEq < 1.0, note: "Levierul financiar" },
    { label: "Current Ratio", value: `${s.currentRatio.toFixed(2)}x`, good: s.currentRatio >= 1.5, note: "Capacitate plată termen scurt" },
    { label: "Payout Ratio", value: `${s.payout.toFixed(1)}%`, good: s.payout <= 65, note: "Sustenabilitatea dividendului" },
    { label: "P/E Ratio", value: s.pe > 0 ? s.pe.toFixed(1) : "N/A", good: s.pe > 0 && s.pe <= 25, note: "Evaluare față de profit" },
    { label: "Dividend Yield", value: `${s.divYield.toFixed(2)}%`, good: s.divYield >= 2, note: "Randament dividend" },
    { label: "Beta", value: s.beta.toFixed(2), good: s.beta <= 1.2, note: "Volatilitate față de piață" },
  ];

  const radarItems = [
    { label: "Profitabilitate", score: Math.min(100, s.profitMargin * 400) },
    { label: "ROE", score: Math.min(100, s.roe * 200) },
    { label: "Stabilitate (β)", score: Math.max(0, 100 - (s.beta - 0.5) * 66) },
    { label: "Evaluare (P/E)", score: s.pe > 0 ? Math.max(0, 100 - (s.pe - 10) * 2.5) : 50 },
    { label: "Randament Div.", score: Math.min(100, s.divYield * 12) },
    { label: "Lichiditate", score: Math.min(100, s.currentRatio * 40) },
  ];

  const low52 = closes.length > 0 ? Math.min(...closes) : s.price * 0.78;
  const high52 = closes.length > 0 ? Math.max(...closes) : s.price * 1.22;
  const posInRange = ((s.price - low52) / (high52 - low52)) * 100;

  const subTabs = [
    { id: "tehnic", label: "Tehnic" },
    { id: "financiar", label: "Financiar" },
    { id: "risc", label: "Risc" },
    { id: "pozitie", label: "Poziție" },
  ];

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader>ANALIZĂ DETALIATĂ PER ACTIV</SectionHeader>

      {/* Selector ticker */}
      <select
        value={selected}
        onChange={e => { setSelected(e.target.value); setDeepSubTab("tehnic"); }}
        style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 6, padding: "10px 12px", fontSize: 13, fontFamily: "monospace", width: "100%" }}
      >
        {[...portfolio].sort((a, b) => a.symbol.localeCompare(b.symbol)).map(p => (
          <option key={p.symbol} value={p.symbol}>{p.symbol} — {p.name}</option>
        ))}
      </select>

      {/* Header companie */}
      <Card accent={THEME.gold}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: THEME.text, lineHeight: 1.3 }}>{s.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: THEME.gold, marginTop: 2 }}>{s.symbol} · {s.sector}</div>
          </div>
          <div style={{ textAlign: "right", marginLeft: 10 }}>
            <div style={{ fontFamily: "monospace", fontSize: 20, color: clr(s.dailyChg) }}>${fmt(s.price)}</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
          </div>
        </div>
        {/* 5 key metrics row */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { l: "P/E", v: s.pe > 0 ? s.pe.toFixed(1) : "N/A" },
            { l: "Mkt Cap", v: `$${s.mktCap}B` },
            { l: "Div Yield", v: `${s.divYield.toFixed(2)}%` },
            { l: "Beta", v: s.beta.toFixed(2) },
            { l: "Margin", v: `${(s.profitMargin*100).toFixed(1)}%` },
          ].map(x => (
            <div key={x.l} style={{ flex: "1 0 18%", background: THEME.bg, borderRadius: 5, padding: "5px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 7, color: THEME.dim, marginBottom: 2 }}>{x.l}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: THEME.text }}>{x.v}</div>
            </div>
          ))}
        </div>
        {/* Sparkline preview */}
        {closes.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <MiniSparkline data={closes} color={closes[closes.length-1] >= closes[0] ? THEME.green : THEME.red} height={40} />
          </div>
        )}
        {loadingChart && <div style={{ fontSize: 10, color: THEME.dim, marginTop: 6, textAlign: "center" }}>⏳ Se încarcă date Alpha Vantage...</div>}
      </Card>

      {/* Sub-tab navigation */}
      <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}`, overflowX: "auto", scrollbarWidth: "none" }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setDeepSubTab(t.id)}
            style={{ flexShrink: 0, background: "transparent", border: "none",
              borderBottom: deepSubTab === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent",
              color: deepSubTab === t.id ? THEME.gold : THEME.dim,
              padding: "8px 14px", fontSize: 10, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SUB-TAB: TEHNIC ── */}
      {deepSubTab === "tehnic" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Preț + BB + SMA20 */}
          <Card>
            <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              PREȚ + SMA 20 &nbsp;<span style={{ color: THEME.gold }}>———</span>&nbsp; Cost Mediu &nbsp;<span style={{ color: THEME.blue }}>———</span>&nbsp; Close
            </div>
            {closes.length >= 26 ? (
              <TechnicalChart closes={closes} avgCost={s.avgCost} />
            ) : (
              <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: THEME.dim, fontSize: 11 }}>
                {loadingChart ? "Se preiau date din Alpha Vantage..." : "Date insuficiente"}
              </div>
            )}
            {closes.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 9, color: THEME.dim }}>52W Low: <span style={{ color: THEME.red }}>${low52.toFixed(2)}</span></span>
                <span style={{ fontSize: 9, color: THEME.dim }}>52W High: <span style={{ color: THEME.green }}>${high52.toFixed(2)}</span></span>
              </div>
            )}
          </Card>

          {/* RSI */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5 }}>RSI (14)</div>
              <div style={{ display: "flex", gap: 10, fontSize: 9, color: THEME.dim }}>
                <span style={{ color: THEME.red }}>— 70 Supracumpărat</span>
                <span style={{ color: THEME.green }}>— 30 Supravândut</span>
              </div>
            </div>
            {closes.length >= 15 ? (
              <RSIChart closes={closes} />
            ) : (
              <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", color: THEME.dim, fontSize: 11 }}>
                {loadingChart ? "..." : "Date insuficiente"}
              </div>
            )}
          </Card>

          {/* MACD */}
          <Card>
            <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>MACD Histogramă (12/26/9)</div>
            {closes.length >= 35 ? (
              <MACDChart closes={closes} />
            ) : (
              <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", color: THEME.dim, fontSize: 11 }}>
                {loadingChart ? "..." : "Date insuficiente"}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 9, color: THEME.dim }}>
              <span style={{ color: THEME.green }}>▮ Pozitiv (momentum bullish)</span>
              <span style={{ color: THEME.red }}>▮ Negativ (momentum bearish)</span>
            </div>
          </Card>

          {/* 52W Range */}
          <Card>
            <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>COMPARAȚIE 52W HIGH / LOW</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: THEME.red }}>${low52.toFixed(2)}<br /><span style={{ fontSize: 8, color: THEME.dim }}>52W Low</span></span>
              <span style={{ fontFamily: "monospace", fontSize: 14, color: THEME.gold }}>${fmt(s.price)}</span>
              <span style={{ fontSize: 10, color: THEME.green, textAlign: "right" }}>${high52.toFixed(2)}<br /><span style={{ fontSize: 8, color: THEME.dim }}>52W High</span></span>
            </div>
            <div style={{ height: 10, background: `linear-gradient(to right, ${THEME.red}33, ${THEME.gold}55, ${THEME.green}33)`, borderRadius: 5, position: "relative" }}>
              <div style={{ position: "absolute", left: `${Math.max(0, Math.min(100, posInRange))}%`, top: -3, width: 16, height: 16, background: THEME.gold, borderRadius: "50%", transform: "translateX(-50%)", border: `2px solid ${THEME.bg}` }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: THEME.dim }}>
              Poziție în range: <span style={{ color: THEME.gold, fontFamily: "monospace" }}>{Math.max(0, Math.min(100, posInRange)).toFixed(1)}%</span>
            </div>
          </Card>

          {/* Heatmap randamente zilnice */}
          {returns.length > 50 && (
            <Card>
              <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>CALENDAR RANDAMENTE ZILNICE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {returns.slice(-60).map((r, i) => {
                  const intensity = Math.min(1, Math.abs(r) / 3);
                  const bg = r >= 0
                    ? `rgba(46,204,113,${0.1 + intensity * 0.7})`
                    : `rgba(231,76,60,${0.1 + intensity * 0.7})`;
                  return (
                    <div key={i} title={`${r.toFixed(2)}%`} style={{ width: 10, height: 10, borderRadius: 2, background: bg, cursor: "default" }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 8, color: THEME.dim }}>
                <span>■ <span style={{ color: THEME.green }}>Pozitiv</span></span>
                <span>■ <span style={{ color: THEME.red }}>Negativ</span></span>
                <span style={{ marginLeft: "auto" }}>Ultimele 60 zile</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── SUB-TAB: FINANCIAR ── */}
      {deepSubTab === "financiar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Scorecard */}
          <section>
            <SectionHeader>SCORECARD FINANCIAR</SectionHeader>
            <Card>
              {scorecard.map((item, i) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < scorecard.length - 1 ? `1px solid ${THEME.border}` : "none" }}>
                  <div>
                    <div style={{ fontSize: 12, color: THEME.text }}>{item.label}</div>
                    <div style={{ fontSize: 9, color: THEME.dim }}>{item.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: THEME.gold }}>{item.value}</div>
                    <Badge
                      text={item.good ? "BINE" : "ATENȚIE"}
                      color={item.good ? THEME.green : THEME.red}
                      bg={item.good ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.12)"}
                    />
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* EPS Proiecție */}
          <section>
            <SectionHeader>PROIECȚIE EPS</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Card accent={THEME.blue}>
                <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>EPS ISTORIC (TTM)</div>
                <div style={{ fontFamily: "monospace", fontSize: 22, color: THEME.text }}>${(s.pe > 0 ? s.price / s.pe : 0).toFixed(2)}</div>
                <div style={{ fontSize: 9, color: THEME.dim, marginTop: 4 }}>trailing 12M</div>
              </Card>
              <Card accent={THEME.gold}>
                <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>EPS ESTIMAT FWD</div>
                {(() => {
                  const trEps = s.pe > 0 ? s.price / s.pe : 0;
                  const fwdEps = trEps * 1.08;
                  const growth = ((fwdEps - trEps) / Math.abs(trEps || 1)) * 100;
                  return (
                    <>
                      <div style={{ fontFamily: "monospace", fontSize: 22, color: clr(growth) }}>${fwdEps.toFixed(2)}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: clr(growth), marginTop: 4 }}>{sign(growth)}{growth.toFixed(1)}% est.</div>
                    </>
                  );
                })()}
              </Card>
            </div>
          </section>

          {/* Dividend info */}
          {s.divYield > 0 && (
            <section>
              <SectionHeader>DETALII DIVIDEND</SectionHeader>
              <Card accent={THEME.gold}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { l: "Yield Anual", v: `${s.divYield.toFixed(2)}%`, c: THEME.gold },
                    { l: "Div/Acțiune/An", v: `$${(s.price * s.divYield / 100).toFixed(2)}` },
                    { l: "Venit Anual", v: `$${fmt(s.annualDiv)}`, c: THEME.green },
                    { l: "Payout Ratio", v: `${s.payout.toFixed(1)}%`, c: s.payout > 80 ? THEME.red : THEME.text },
                    { l: "Frecvență", v: `${(DIV_MONTHS[s.symbol] || []).length}x/an` },
                    { l: "YoC", v: `${((s.annualDiv / s.invested) * 100).toFixed(2)}%`, c: THEME.gold },
                  ].map(x => (
                    <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "7px 8px" }}>
                      <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: x.c || THEME.text }}>{x.v}</div>
                    </div>
                  ))}
                </div>
                {/* Payout sustainability bar */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: THEME.dim }}>Sustenabilitate payout</span>
                    <span style={{ fontSize: 9, color: s.payout > 80 ? THEME.red : s.payout > 65 ? THEME.gold : THEME.green }}>{s.payout > 80 ? "RISC" : s.payout > 65 ? "ATENȚIE" : "SIGUR"}</span>
                  </div>
                  <div style={{ height: 6, background: THEME.border, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${Math.min(100, s.payout)}%`, background: s.payout > 80 ? THEME.red : s.payout > 65 ? THEME.gold : THEME.green, borderRadius: 3 }} />
                  </div>
                </div>
              </Card>
            </section>
          )}
        </div>
      )}

      {/* ── SUB-TAB: RISC ── */}
      {deepSubTab === "risc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Radar performanță */}
          <section>
            <SectionHeader>RADAR PERFORMANȚĂ MULTIDIMENSIONAL</SectionHeader>
            <Card>
              {radarItems.map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: THEME.text }}>{item.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: item.score >= 60 ? THEME.green : item.score >= 35 ? THEME.gold : THEME.red }}>
                      {Math.round(item.score)}/100
                    </span>
                  </div>
                  <div style={{ height: 8, background: THEME.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${item.score}%`,
                      background: item.score >= 60
                        ? `linear-gradient(to right, ${THEME.green}99, ${THEME.green})`
                        : item.score >= 35
                        ? `linear-gradient(to right, ${THEME.gold}99, ${THEME.gold})`
                        : `linear-gradient(to right, ${THEME.red}99, ${THEME.red})`,
                      borderRadius: 4,
                      transition: "width 0.6s ease"
                    }} />
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* VaR & Risk Metrics */}
          <section>
            <SectionHeader>DISTRIBUȚIE RANDAMENTE & RISK METRICS</SectionHeader>
            <Card>
              {returns.length >= 20 ? (
                <VaRDistribution returns={returns} />
              ) : (
                <div style={{ color: THEME.dim, fontSize: 11, textAlign: "center", padding: "20px 0" }}>
                  {loadingChart ? "⏳ Se calculează metricile de risc..." : "Date insuficiente pentru analiza de risc"}
                </div>
              )}
            </Card>
          </section>

          {/* Factori de risc */}
          <section>
            <SectionHeader>FACTORI DE RISC IDENTIFICAȚI</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { cond: s.pe > 35 && s.pe < 500, label: "Evaluare Excesivă", desc: `P/E de ${s.pe.toFixed(1)} depășește 35x`, color: THEME.gold },
                { cond: s.payout > 80 && s.divYield > 0 && s.sector !== "Real Estate", label: "Risc Tăiere Dividend", desc: `Payout de ${s.payout.toFixed(0)}% poate fi nesustenabil`, color: THEME.red },
                { cond: s.beta > 1.5, label: "Volatilitate Ridicată", desc: `Beta de ${s.beta.toFixed(2)} indică volatilitate mare față de piață`, color: THEME.blue },
                { cond: s.currentRatio < 1 && s.sector !== "Financials", label: "Lichiditate Scăzută", desc: `Current Ratio ${s.currentRatio.toFixed(2)} sub 1.0`, color: THEME.red },
                { cond: s.profitMargin < 0, label: "Marjă Negativă", desc: `Compania operează în pierdere`, color: THEME.red },
                { cond: (s.value / totals.value) * 100 > 15, label: "Concentrare Excesivă", desc: `Pondere de ${((s.value/totals.value)*100).toFixed(1)}% în portofoliu`, color: THEME.gold },
              ].filter(r => r.cond).map(r => (
                <div key={r.label} style={{ background: THEME.bg, borderLeft: `3px solid ${r.color}`, borderRadius: "0 6px 6px 0", padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: r.color, fontWeight: 500 }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>{r.desc}</div>
                </div>
              ))}
              {[
                s.pe <= 35 || s.pe >= 500,
                s.payout <= 80 || s.divYield === 0 || s.sector === "Real Estate",
                s.beta <= 1.5,
                s.currentRatio >= 1 || s.sector === "Financials",
                s.profitMargin >= 0,
                (s.value / totals.value) * 100 <= 15,
              ].every(Boolean) && (
                <div style={{ background: THEME.bg, borderLeft: `3px solid ${THEME.green}`, borderRadius: "0 6px 6px 0", padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: THEME.green }}>✓ Niciun risc major identificat</div>
                  <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>Toți indicatorii sunt în parametri normali</div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ── SUB-TAB: POZIȚIE ── */}
      {deepSubTab === "pozitie" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Detalii poziție */}
          <section>
            <SectionHeader>DETALII POZIȚIE</SectionHeader>
            <Card accent={THEME.gold}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Valoare Actuală", v: fmtUSD(s.value), c: THEME.text },
                  { l: "Valoare Investită", v: fmtUSD(s.invested), c: THEME.dim },
                  { l: "Profit Net ($)", v: `${sign(s.profit)}${fmtUSD(s.profit)}`, c: clr(s.profit) },
                  { l: "Return (%)", v: `${sign(s.profitPct)}${fmt(s.profitPct, 2)}%`, c: clr(s.profitPct) },
                  { l: "Nr. Acțiuni", v: s.shares, c: THEME.text },
                  { l: "Preț Mediu", v: `$${fmt(s.avgCost)}`, c: THEME.text },
                  { l: "Preț Curent", v: `$${fmt(s.price)}`, c: clr(s.dailyChg) },
                  { l: "Pondere Port.", v: `${fmt((s.value / totals.value) * 100, 2)}%`, c: THEME.gold },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: x.c, marginTop: 2 }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Breakeven analysis */}
          <section>
            <SectionHeader>ANALIZĂ BREAKEVEN</SectionHeader>
            <Card>
              {(() => {
                const gap = s.price - s.avgCost;
                const gapPct = (gap / s.avgCost) * 100;
                const toBreak = gap < 0 ? Math.abs(gap) : 0;
                const toBreakPct = gap < 0 ? Math.abs(gapPct) : 0;
                return (
                  <>
                    <MetricRow label="Diferență față de cost" value={`${sign(gap)}$${Math.abs(gap).toFixed(2)}`} color={clr(gap)} />
                    <MetricRow label="Return vs cost mediu" value={`${sign(gapPct)}${gapPct.toFixed(2)}%`} color={clr(gapPct)} />
                    {toBreak > 0 && <MetricRow label="Necesar la breakeven" value={`+$${toBreak.toFixed(2)} (+${toBreakPct.toFixed(1)}%)`} color={THEME.gold} />}
                    {s.divYield > 0 && <MetricRow label="YoC (Yield on Cost)" value={`${((s.annualDiv / s.invested) * 100).toFixed(2)}%`} color={THEME.gold} />}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>Recuperare investiție prin dividende</div>
                      <div style={{ height: 8, background: THEME.border, borderRadius: 4 }}>
                        {s.annualDiv > 0 && (
                          <div style={{
                            height: "100%",
                            width: `${Math.min(100, (s.annualDiv / s.invested) * 100 * 15)}%`,
                            background: THEME.gold, borderRadius: 4
                          }} />
                        )}
                      </div>
                      <div style={{ fontSize: 9, color: THEME.dim, marginTop: 3 }}>
                        {s.annualDiv > 0
                          ? `Recuperare completă în ~${(s.invested / s.annualDiv).toFixed(0)} ani la dividendul actual`
                          : "Fără dividend — recuperare exclusiv prin aprecierea prețului"}
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          </section>

          {/* Scenarii DCA */}
          <section>
            <SectionHeader>SCENARII ACHIZIȚIE ADIȚIONALĂ</SectionHeader>
            <Card>
              <div style={{ fontSize: 10, color: THEME.dim, marginBottom: 10 }}>Impact DCA la prețul curent de ${fmt(s.price)}</div>
              {[100, 250, 500, 1000].map(cap => {
                const newShares = Math.floor(cap / s.price);
                const totalShares = s.shares + newShares;
                const totalInvested = s.invested + cap;
                const newAvg = totalInvested / totalShares;
                const newProfit = totalShares * s.price - totalInvested;
                return (
                  <div key={cap} style={{ padding: "8px 0", borderBottom: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: THEME.gold }}>${cap}</div>
                      <div style={{ fontSize: 9, color: THEME.dim }}>+{newShares} acț · nou avg ${fmt(newAvg)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: clr(newProfit) }}>{sign(newProfit)}${Math.abs(newProfit).toFixed(0)}</div>
                      <div style={{ fontSize: 9, color: THEME.dim }}>{totalShares} acț total</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </section>

          {/* Evoluție zilnică vs portofoliu */}
          <section>
            <SectionHeader>CONTRIBUȚIE LA MIȘCAREA ZILNICĂ</SectionHeader>
            <Card>
              {(() => {
                const stockDailyUSD = s.prevValue * (s.dailyChg / 100);
                const portDailyUSD = totals.value - totals.prevValue;
                const contribution = portDailyUSD !== 0 ? (stockDailyUSD / portDailyUSD) * 100 : 0;
                return (
                  <>
                    <MetricRow label="Mișcare activ ($)" value={`${sign(stockDailyUSD)}$${Math.abs(stockDailyUSD).toFixed(2)}`} color={clr(stockDailyUSD)} />
                    <MetricRow label="Variație zilnică (%)" value={`${sign(s.dailyChg)}${fmt(s.dailyChg, 2)}%`} color={clr(s.dailyChg)} />
                    <MetricRow label="Contribuție la port." value={`${sign(contribution)}${Math.abs(contribution).toFixed(1)}%`} color={clr(contribution)} />
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>Contribuție la mișcarea totală a zilei</div>
                      <div style={{ height: 8, background: THEME.border, borderRadius: 4, position: "relative", overflow: "hidden" }}>
                        <div style={{
                          position: "absolute",
                          left: contribution < 0 ? `${Math.max(0, 50 + contribution / 2)}%` : "50%",
                          width: `${Math.min(50, Math.abs(contribution) / 2)}%`,
                          top: 0, bottom: 0,
                          background: clr(contribution),
                          borderRadius: 4
                        }} />
                        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: THEME.dim }} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}

// ── TAB 7: ALERTE PREȚ ────────────────────────────────────────────────────────
function AlerteTab({ portfolio }) {
  const [alerts, setAlerts] = useState(() => {
    const a = {};
    portfolio.forEach(s => { a[s.symbol] = { buy: 0, sell: 0 }; });
    return a;
  });

  const triggered = portfolio.filter(s => {
    const a = alerts[s.symbol] || {};
    return (a.buy > 0 && s.price <= a.buy) || (a.sell > 0 && s.price >= a.sell);
  });

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader>SISTEM ALERTE PREȚ</SectionHeader>

      {triggered.length > 0 && (
        <Card accent={THEME.gold}>
          <div style={{ fontSize: 10, color: THEME.gold, marginBottom: 8 }}>🔔 ALERTE ACTIVE</div>
          {triggered.map(s => {
            const a = alerts[s.symbol];
            const isBuy = a.buy > 0 && s.price <= a.buy;
            return (
              <div key={s.symbol} style={{ padding: "6px 0", borderBottom: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: isBuy ? THEME.green : THEME.red }}>
                  {isBuy ? "▲ BUY" : "▼ SELL"} {s.symbol}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: THEME.text }}>${fmt(s.price)}</span>
              </div>
            );
          })}
        </Card>
      )}

      <div style={{ fontSize: 10, color: THEME.dim, marginBottom: -8 }}>Lasă 0 pentru a dezactiva alerta</div>

      {portfolio.map(s => {
        const a = alerts[s.symbol] || { buy: 0, sell: 0 };
        const status = a.buy > 0 && s.price <= a.buy ? "▲ DECLANȘAT BUY" :
                       a.sell > 0 && s.price >= a.sell ? "▼ DECLANȘAT SELL" :
                       (a.buy > 0 || a.sell > 0) ? "◉ Armat" : "— Inactiv";
        const statusColor = status.includes("BUY") ? THEME.green : status.includes("SELL") ? THEME.red : status.includes("Armat") ? THEME.gold : THEME.dim;

        return (
          <Card key={s.symbol}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: THEME.gold }}>{s.symbol}</span>
                <span style={{ fontSize: 10, color: THEME.dim, marginLeft: 8 }}>Live: ${fmt(s.price)}</span>
              </div>
              <span style={{ fontSize: 10, color: statusColor }}>{status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: THEME.green, marginBottom: 3 }}>CUMPĂRĂ SUB $</div>
                <input
                  type="number"
                  value={a.buy || ""}
                  onChange={e => setAlerts(prev => ({ ...prev, [s.symbol]: { ...prev[s.symbol], buy: parseFloat(e.target.value) || 0 } }))}
                  placeholder="0.00"
                  style={{ width: "100%", background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 5, padding: "6px 8px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }}
                  min={0} step={0.5}
                />
              </div>
              <div>
                <div style={{ fontSize: 9, color: THEME.red, marginBottom: 3 }}>VINDE PESTE $</div>
                <input
                  type="number"
                  value={a.sell || ""}
                  onChange={e => setAlerts(prev => ({ ...prev, [s.symbol]: { ...prev[s.symbol], sell: parseFloat(e.target.value) || 0 } }))}
                  placeholder="0.00"
                  style={{ width: "100%", background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 5, padding: "6px 8px", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }}
                  min={0} step={0.5}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("matrice");
  const [, setRefresh] = useState(0);

  const portfolio = calcPortfolio();
  const totals = {
    value: portfolio.reduce((a, s) => a + s.value, 0),
    prevValue: portfolio.reduce((a, s) => a + s.prevValue, 0),
    invested: portfolio.reduce((a, s) => a + s.invested, 0),
    profit: portfolio.reduce((a, s) => a + s.profit, 0),
    divIncome: portfolio.reduce((a, s) => a + s.annualDiv, 0),
  };
  totals.dailyChgUSD = totals.value - totals.prevValue;
  totals.dailyChgPct = (totals.dailyChgUSD / totals.prevValue) * 100;

  const tabs = [
    { id: "matrice",   label: "Matricea" },
    { id: "diagnoza",  label: "Diagnoză AI" },
    { id: "fluxuri",   label: "Fluxuri" },
    { id: "rebal",     label: "Rebalansare" },
    { id: "watchlist", label: "Watchlist" },
    { id: "deepdive",  label: "Deep Dive" },
    { id: "alerte",    label: "Alerte Preț" },
  ];

  return (
    <div style={{ background: THEME.bg, minHeight: "100vh", color: THEME.text, fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <TopBar onRefresh={() => setRefresh(k => k + 1)} />
      <SummaryMetrics totals={totals} />
      <div style={{ paddingTop: 12 }}>
        <TabBar tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {tab === "matrice"   && <MatriceTab   portfolio={portfolio} totals={totals} />}
      {tab === "diagnoza"  && <DiagTab      portfolio={portfolio} totals={totals} />}
      {tab === "fluxuri"   && <FluxTab      portfolio={portfolio} />}
      {tab === "rebal"     && <RebalTab     portfolio={portfolio} totals={totals} />}
      {tab === "watchlist" && <WatchlistTab portfolio={portfolio} totals={totals} />}
      {tab === "deepdive"  && <DeepDiveTab  portfolio={portfolio} totals={totals} />}
      {tab === "alerte"    && <AlerteTab    portfolio={portfolio} />}
      <div style={{ height: 40 }} />
    </div>
  );
}
