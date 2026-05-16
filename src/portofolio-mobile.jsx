import { useState, useEffect, useCallback } from "react";

const THEME = {
  bg: "#0D1117", surface: "#161B22", surface2: "#1C2128", border: "#21262D",
  text: "#C9D1D9", dim: "#8B949E", gold: "#E8C468", goldLight: "#F0D080",
  blue: "#4A9EFF", green: "#2ECC71", red: "#E74C3C", purple: "#9B59B6",
  orange: "#E67E22",
};

const DEMO_PORTFOLIO = [
  { symbol: "KO",    name: "The Coca Cola Company",             sector: "Consumer Staples",       shares: 10,  avgCost: 62.98,  price: 80.82,  prevPrice: 79.80,  pe: 24.7,  divYield: 3.23, beta: 0.58, payout: 72.3, mktCap: 273,  profitMargin: 0.22, roe: 0.41, currentRatio: 1.13, debtEq: 1.70 },
  { symbol: "BAC",   name: "Bank Of America",                   sector: "Financials",             shares: 20,  avgCost: 42.97,  price: 49.77,  prevPrice: 49.20,  pe: 13.2,  divYield: 2.60, beta: 1.40, payout: 30.0, mktCap: 390,  profitMargin: 0.28, roe: 0.10, currentRatio: 0.90, debtEq: 1.20 },
  { symbol: "PG",    name: "Procter & Gamble Company",          sector: "Consumer Staples",       shares: 3,   avgCost: 154.84, price: 141.57, prevPrice: 142.10, pe: 27.3,  divYield: 2.71, beta: 0.54, payout: 60.4, mktCap: 397,  profitMargin: 0.18, roe: 0.31, currentRatio: 0.82, debtEq: 0.64 },
  { symbol: "CSCO",  name: "Cisco Systems Inc",                 sector: "Information Technology", shares: 20,  avgCost: 53.85,  price: 118.21, prevPrice: 117.50, pe: 28.5,  divYield: 2.97, beta: 0.82, payout: 45.0, mktCap: 480,  profitMargin: 0.22, roe: 0.32, currentRatio: 1.40, debtEq: 0.45 },
  { symbol: "UNP",   name: "Union Pacific Corporation",         sector: "Industrials",            shares: 2,   avgCost: 218.35, price: 270.56, prevPrice: 269.80, pe: 21.4,  divYield: 2.52, beta: 1.05, payout: 48.0, mktCap: 155,  profitMargin: 0.29, roe: 0.55, currentRatio: 0.75, debtEq: 1.80 },
  { symbol: "BTI",   name: "British American Tobacco",          sector: "Consumer Staples",       shares: 25,  avgCost: 35.47,  price: 65.09,  prevPrice: 64.50,  pe: 8.5,   divYield: 7.88, beta: 0.65, payout: 65.0, mktCap: 72,   profitMargin: 0.28, roe: 0.12, currentRatio: 0.85, debtEq: 0.95 },
  { symbol: "ESS",   name: "Essex Property Trust, Inc",         sector: "Real Estate",            shares: 2,   avgCost: 225.53, price: 267.06, prevPrice: 266.00, pe: 38.2,  divYield: 4.55, beta: 0.80, payout: 82.0, mktCap: 18,   profitMargin: 0.14, roe: 0.05, currentRatio: 0.58, debtEq: 1.10 },
  { symbol: "TSN",   name: "Tyson Foods, Inc",                  sector: "Consumer Staples",       shares: 10,  avgCost: 54.92,  price: 65.79,  prevPrice: 65.20,  pe: 18.5,  divYield: 3.71, beta: 0.70, payout: 55.0, mktCap: 24,   profitMargin: 0.04, roe: 0.06, currentRatio: 1.60, debtEq: 0.55 },
  { symbol: "VZ",    name: "Verizon Communications Inc",        sector: "Communication Services", shares: 10,  avgCost: 40.49,  price: 46.37,  prevPrice: 45.90,  pe: 10.2,  divYield: 6.61, beta: 0.40, payout: 58.0, mktCap: 195,  profitMargin: 0.15, roe: 0.22, currentRatio: 0.75, debtEq: 1.60 },
  { symbol: "PFE",   name: "Pfizer, Inc",                       sector: "Health Care",            shares: 40,  avgCost: 28.27,  price: 25.33,  prevPrice: 25.80,  pe: 22.1,  divYield: 6.07, beta: 0.55, payout: 85.0, mktCap: 143,  profitMargin: 0.02, roe: 0.02, currentRatio: 1.20, debtEq: 0.70 },
  { symbol: "O",     name: "Realty Income Corporation",         sector: "Real Estate",            shares: 30,  avgCost: 53.51,  price: 61.12,  prevPrice: 60.50,  pe: 41.8,  divYield: 6.05, beta: 0.94, payout: 82.1, mktCap: 53,   profitMargin: 0.14, roe: 0.03, currentRatio: 0.58, debtEq: 0.90 },
  { symbol: "AAPL",  name: "Apple Inc",                         sector: "Information Technology", shares: 3,   avgCost: 209.65, price: 300.23, prevPrice: 298.50, pe: 33.2,  divYield: 0.50, beta: 1.24, payout: 15.2, mktCap: 3210, profitMargin: 0.26, roe: 1.47, currentRatio: 1.04, debtEq: 1.77 },
  { symbol: "TXN",   name: "Texas Instruments Incorporated",    sector: "Information Technology", shares: 4,   avgCost: 167.12, price: 302.73, prevPrice: 300.90, pe: 35.5,  divYield: 3.39, beta: 1.05, payout: 65.0, mktCap: 110,  profitMargin: 0.35, roe: 0.55, currentRatio: 4.50, debtEq: 0.80 },
  { symbol: "VICI",  name: "VICI Properties Inc",               sector: "Real Estate",            shares: 35,  avgCost: 29.55,  price: 27.90,  prevPrice: 27.60,  pe: 14.5,  divYield: 6.08, beta: 0.85, payout: 78.0, mktCap: 33,   profitMargin: 0.50, roe: 0.08, currentRatio: 0.40, debtEq: 0.75 },
  { symbol: "BLK",   name: "BlackRock, Inc.",                   sector: "Financials",             shares: 1,   avgCost: 633.50, price: 1081.90,prevPrice: 1075.00,pe: 22.8,  divYield: 3.28, beta: 1.30, payout: 52.0, mktCap: 162,  profitMargin: 0.31, roe: 0.15, currentRatio: 0.90, debtEq: 0.35 },
  { symbol: "BMY",   name: "Bristol-Myers Squibb Company",      sector: "Health Care",            shares: 20,  avgCost: 46.46,  price: 57.00,  prevPrice: 56.50,  pe: 15.2,  divYield: 5.33, beta: 0.50, payout: 75.0, mktCap: 115,  profitMargin: 0.10, roe: 0.18, currentRatio: 1.10, debtEq: 1.20 },
  { symbol: "DLR",   name: "Digital Realty Trust, Inc.",        sector: "Real Estate",            shares: 2,   avgCost: 144.60, price: 188.51, prevPrice: 187.00, pe: 85.0,  divYield: 3.37, beta: 0.70, payout: 80.0, mktCap: 55,   profitMargin: 0.08, roe: 0.02, currentRatio: 0.50, debtEq: 1.30 },
  { symbol: "SBUX",  name: "Starbucks Corporation",             sector: "Consumer Staples",       shares: 5,   avgCost: 82.78,  price: 106.82, prevPrice: 105.90, pe: 28.5,  divYield: 2.99, beta: 0.90, payout: 65.0, mktCap: 120,  profitMargin: 0.12, roe: 0.00, currentRatio: 0.65, debtEq: 5.00 },
  { symbol: "CMCSA", name: "Comcast Corp.",                     sector: "Communication Services", shares: 15,  avgCost: 33.79,  price: 24.76,  prevPrice: 25.10,  pe: 9.5,   divYield: 3.90, beta: 1.00, payout: 38.0, mktCap: 95,   profitMargin: 0.12, roe: 0.18, currentRatio: 0.75, debtEq: 1.40 },
  { symbol: "MAA",   name: "Mid-America Apt. Communities",      sector: "Real Estate",            shares: 5,   avgCost: 145.12, price: 125.71, prevPrice: 124.80, pe: 32.5,  divYield: 4.16, beta: 0.75, payout: 78.0, mktCap: 15,   profitMargin: 0.22, roe: 0.06, currentRatio: 0.40, debtEq: 0.80 },
  { symbol: "ADC",   name: "Agree Realty Corporation",          sector: "Real Estate",            shares: 10,  avgCost: 74.07,  price: 74.46,  prevPrice: 73.90,  pe: 35.8,  divYield: 4.05, beta: 0.65, payout: 78.0, mktCap: 7,    profitMargin: 0.30, roe: 0.04, currentRatio: 0.35, debtEq: 0.65 },
  { symbol: "PM",    name: "Philip Morris International Inc",   sector: "Consumer Staples",       shares: 2,   avgCost: 125.96, price: 189.61, prevPrice: 188.00, pe: 22.5,  divYield: 4.66, beta: 0.80, payout: 88.0, mktCap: 220,  profitMargin: 0.28, roe: 0.00, currentRatio: 0.80, debtEq: 5.00 },
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

// Full dividend month schedule (matching web version)
const DIV_MONTHS = {
  AAPL:  [1,4,7,10], MSFT: [2,5,8,11], KO:   [0,3,6,9],
  O:     [0,1,2,3,4,5,6,7,8,9,10,11],  V:    [2,5,8,11],
  PG:    [1,4,7,10],  VZ:  [0,3,6,9],  BAC:  [2,5,8,11],
  PFE:   [2,5,8,11],  BMY: [1,4,7,10], BLK:  [2,5,8,11],
  CSCO:  [0,3,6,9],   TXN: [1,4,7,10], ESS:  [0,3,6,9],
  TSN:   [2,5,8,11],  BTI: [1,7],       UNP:  [2,5,8,11],
  VICI:  [0,3,6,9],   DLR: [0,3,6,9],  MAA:  [0,3,6,9],
  ADC:   [0,1,2,3,4,5,6,7,8,9,10,11],  LMT:  [2,5,8,11],
  PM:    [0,3,6,9],   MO:  [0,3,6,9],  HSY:  [2,5,8,11],
  DEO:   [3,9],       NKE: [0,3,6,9],  ARE:  [0,3,6,9],
  SBUX:  [2,5,8,11],  CMCSA:[0,3,6,9], BMY:  [1,4,7,10],
};

const SECTOR_COLORS = {
  "Consumer Staples":       "#E8C468",
  "Information Technology": "#4A9EFF",
  "Real Estate":            "#2ECC71",
  "Financials":             "#9B59B6",
  "Health Care":            "#E74C3C",
  "Communication Services": "#E67E22",
  "Industrials":            "#1ABC9C",
};

function calcPortfolio(data) {
  return data.map(s => ({
    ...s,
    value:      s.shares * s.price,
    prevValue:  s.shares * s.prevPrice,
    invested:   s.shares * s.avgCost,
    profit:     s.shares * (s.price - s.avgCost),
    profitPct:  ((s.price - s.avgCost) / s.avgCost) * 100,
    dailyChg:   ((s.price - s.prevPrice) / s.prevPrice) * 100,
    annualDiv:  s.divYield > 0 ? (s.price * s.divYield / 100) * s.shares : 0,
  }));
}

const fmt    = (n, d = 2) => n.toLocaleString("ro-RO", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUSD = (n)        => "$" + fmt(Math.abs(n));
const clr    = (n)        => n >= 0 ? THEME.green : THEME.red;
const sign   = (n)        => n >= 0 ? "+" : "";

// ── TOPBAR ───────────────────────────────────────────────────────────────────
function TopBar({ onRefresh }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
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

// ── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, delta, deltaColor }) {
  return (
    <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderTop: `2px solid ${THEME.gold}`, padding: "12px 14px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.text, fontWeight: 500, lineHeight: 1.2 }}>{value}</div>
      {delta && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: deltaColor || THEME.dim, marginTop: 4 }}>{delta}</div>}
    </div>
  );
}

// ── TAB BAR ──────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}`, overflowX: "auto", scrollbarWidth: "none", background: THEME.bg }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ flexShrink: 0, background: "transparent", border: "none", borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent", color: active === t.id ? THEME.gold : THEME.dim, padding: "10px 14px", fontSize: 11, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Badge({ text, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, color, background: bg }}>{text}</span>;
}

// ── MINI PIE CHART (SVG) ─────────────────────────────────────────────────────
function MiniPieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const cx = 60, cy = 60, r = 50, inner = 28;

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const xi1 = cx + inner * Math.cos(cumAngle - angle);
    const yi1 = cy + inner * Math.sin(cumAngle - angle);
    const xi2 = cx + inner * Math.cos(cumAngle);
    const yi2 = cy + inner * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${xi1},${yi1} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${large},0 ${xi1},${yi1} Z`;
    return { ...d, path };
  });

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke={THEME.bg} strokeWidth={1.5} />
      ))}
      <circle cx={cx} cy={cy} r={inner - 1} fill={THEME.surface} />
    </svg>
  );
}

// ── HEAT MAP POSITIONS ────────────────────────────────────────────────────────
function HeatMap({ portfolio, totals }) {
  const maxAbs = Math.max(...portfolio.map(s => Math.abs(s.dailyChg)));
  const sorted = [...portfolio].sort((a, b) => Math.abs(b.dailyChg) - Math.abs(a.dailyChg));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {sorted.map(s => {
        const intensity = Math.min(1, Math.abs(s.dailyChg) / (maxAbs || 1));
        const isPos = s.dailyChg >= 0;
        const baseColor = isPos ? "46,204,113" : "231,76,60";
        const bg = `rgba(${baseColor},${0.12 + intensity * 0.55})`;
        const weight = (s.value / totals.value) * 100;
        const size = Math.max(38, Math.min(72, 38 + weight * 3));
        return (
          <div key={s.symbol} style={{ width: size, height: size, background: bg, border: `1px solid rgba(${baseColor},0.35)`, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 2 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: Math.max(8, size * 0.18), color: THEME.text, fontWeight: 600, lineHeight: 1 }}>{s.symbol}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: Math.max(7, size * 0.14), color: clr(s.dailyChg), lineHeight: 1.2 }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 1)}%</div>
          </div>
        );
      })}
    </div>
  );
}

// ── TAB: OVERVIEW ────────────────────────────────────────────────────────────
function OverviewTab({ portfolio, totals }) {
  const [subView, setSubView] = useState("pozitii"); // pozitii | heatmap | sectoare
  const sorted = [...portfolio].sort((a, b) => b.dailyChg - a.dailyChg);
  const gainers = sorted.slice(0, 3);
  const losers = [...sorted].reverse().slice(0, 3);

  const sectors = {};
  portfolio.forEach(s => { sectors[s.sector] = (sectors[s.sector] || 0) + s.value; });
  const sectorArr = Object.entries(sectors).sort((a, b) => b[1] - a[1]);

  const pieData = sectorArr.map(([sec, val]) => ({
    label: sec, value: val,
    color: SECTOR_COLORS[sec] || THEME.dim,
  }));

  const SubBtn = ({ id, label }) => (
    <button onClick={() => setSubView(id)} style={{ flex: 1, background: subView === id ? THEME.surface2 : "transparent", border: `1px solid ${subView === id ? THEME.border : "transparent"}`, color: subView === id ? THEME.gold : THEME.dim, borderRadius: 6, padding: "6px 4px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
      {label}
    </button>
  );

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>

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
                  <div style={{ fontSize: 9, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
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
                  <div style={{ fontSize: 9, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-view selector */}
      <div style={{ display: "flex", gap: 6 }}>
        <SubBtn id="pozitii"  label="📋 Poziții" />
        <SubBtn id="heatmap"  label="🟩 Heatmap" />
        <SubBtn id="sectoare" label="🥧 Sectoare" />
      </div>

      {/* Sub-view: Poziții */}
      {subView === "pozitii" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...portfolio].sort((a, b) => b.value - a.value).map(s => (
            <div key={s.symbol} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.gold, fontWeight: 500 }}>{s.symbol}</span>
                  <span style={{ fontSize: 10, color: THEME.dim, marginLeft: 8 }}>{s.sector}</span>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
                {[
                  { l: "Acțiuni", v: s.shares },
                  { l: "Cost Mediu", v: `$${fmt(s.avgCost)}` },
                  { l: "Div Yield", v: `${fmt(s.divYield, 2)}%` },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "6px 8px" }}>
                    <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 2 }}>{x.l}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.text }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view: Heatmap */}
      {subView === "heatmap" && (
        <section>
          <div style={{ fontSize: 9, color: THEME.dim, letterSpacing: 2, marginBottom: 10 }}>Dimensiune = pondere în portofoliu · Culoare = variație zilnică</div>
          <HeatMap portfolio={portfolio} totals={totals} />
        </section>
      )}

      {/* Sub-view: Sectoare */}
      {subView === "sectoare" && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <MiniPieChart data={pieData} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {pieData.slice(0, 5).map(d => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: THEME.dim, flex: 1, lineHeight: 1.2 }}>{d.label.replace("Information Technology", "Tech").replace("Communication Services", "Comm.")}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: THEME.text }}>{fmt((d.value / totals.value) * 100, 1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sectorArr.map(([sec, val]) => {
              const pct = (val / totals.value) * 100;
              const col = SECTOR_COLORS[sec] || THEME.dim;
              const count = portfolio.filter(s => s.sector === sec).length;
              return (
                <div key={sec}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                      <span style={{ fontSize: 11, color: THEME.text }}>{sec}</span>
                      <span style={{ fontSize: 9, color: THEME.dim }}>({count})</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: THEME.dim }}>{fmtUSD(val)}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.text }}>{fmt(pct, 1)}%</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: THEME.border, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ── TAB: DIVIDENDE ───────────────────────────────────────────────────────────
function DivTab({ portfolio }) {
  const LUNI = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
  const [selectedMonth, setSelectedMonth] = useState(null);

  const monthly = Array(12).fill(0);
  const monthlyDetail = Array(12).fill(null).map(() => []);

  portfolio.forEach(s => {
    if (s.annualDiv <= 0) return;
    const months = DIV_MONTHS[s.symbol] || [];
    if (months.length === 0) return;
    const perMonth = s.annualDiv / months.length;
    months.forEach(m => {
      monthly[m] += perMonth;
      monthlyDetail[m].push({ symbol: s.symbol, amount: perMonth, divYield: s.divYield, shares: s.shares });
    });
  });

  const maxMonth = Math.max(...monthly);
  const totalAnnual = monthly.reduce((a, b) => a + b, 0);
  const avgMonthly = totalAnnual / 12;
  const nonZeroMonths = monthly.filter(v => v > 0).length;

  const divStocks = portfolio.filter(s => s.annualDiv > 0).sort((a, b) => b.annualDiv - a.annualDiv);

  // Summary stats
  const topYield = [...divStocks].sort((a,b) => b.divYield - a.divYield).slice(0, 3);
  const portYieldOnCost = (totalAnnual / portfolio.reduce((a,s) => a + s.invested, 0)) * 100;
  const portYieldOnValue = (totalAnnual / portfolio.reduce((a,s) => a + s.value, 0)) * 100;

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* KPI-uri dividend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.gold}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>ANUAL ESTIMAT</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: THEME.gold }}>${fmt(totalAnnual)}</div>
          <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>${fmt(avgMonthly)}/lună</div>
        </div>
        <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.blue}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>YIELD PORTOFOLIU</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: THEME.blue }}>{fmt(portYieldOnValue, 2)}%</div>
          <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>cost: {fmt(portYieldOnCost, 2)}%</div>
        </div>
        <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.green}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>ACȚIUNI DIV.</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: THEME.green }}>{divStocks.length}</div>
          <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>{nonZeroMonths} luni active</div>
        </div>
        <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.purple}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>TOP YIELD</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: THEME.purple }}>{topYield[0]?.symbol}</div>
          <div style={{ fontSize: 10, color: THEME.dim, marginTop: 2 }}>{fmt(topYield[0]?.divYield, 2)}% yield</div>
        </div>
      </div>

      {/* Calendar lunar interactiv */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>CALENDAR LUNAR — apasă pe lună</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {LUNI.map((luna, i) => {
            const val = monthly[i];
            const barW = maxMonth > 0 ? (val / maxMonth) * 100 : 0;
            const isSelected = selectedMonth === i;
            return (
              <div key={luna}>
                <div onClick={() => setSelectedMonth(isSelected ? null : i)}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: val > 0 ? "pointer" : "default", padding: "2px 0" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: isSelected ? THEME.gold : THEME.dim, width: 28, flexShrink: 0 }}>{luna}</div>
                  <div style={{ flex: 1, height: 22, background: THEME.border, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    {val > 0 && (
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barW}%`, background: isSelected ? THEME.goldLight : THEME.gold, borderRadius: 4, opacity: 0.85, transition: "width 0.4s ease" }} />
                    )}
                    <div style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: val > 0 ? THEME.bg : THEME.dim, fontFamily: "'DM Mono', monospace", zIndex: 1 }}>
                      {monthlyDetail[i].map(d => d.symbol).join(", ")}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: val > 0 ? (isSelected ? THEME.gold : THEME.gold) : THEME.dim, width: 56, textAlign: "right", flexShrink: 0 }}>
                    {val > 0 ? `$${fmt(val, 0)}` : "—"}
                  </div>
                </div>
                {isSelected && val > 0 && (
                  <div style={{ marginLeft: 36, marginTop: 4, marginBottom: 4, background: THEME.surface2, borderRadius: 6, padding: "8px 10px", border: `1px solid ${THEME.border}` }}>
                    {monthlyDetail[i].sort((a,b) => b.amount - a.amount).map(d => (
                      <div key={d.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${THEME.border}` }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.text }}>{d.symbol}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.gold }}>${fmt(d.amount, 2)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: THEME.dim }}>Total {luna}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.gold, fontWeight: 600 }}>${fmt(val)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Top yield */}
      <section>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>TOP DIVIDEND YIELD</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[...divStocks].sort((a,b) => b.divYield - a.divYield).slice(0, 8).map((s, idx) => (
            <div key={s.symbol} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}` }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: THEME.dim, width: 16 }}>#{idx+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: THEME.text, fontWeight: 500 }}>{s.symbol}</div>
                <div style={{ fontSize: 9, color: THEME.dim }}>{s.shares} acț. · payout {fmt(s.payout, 0)}%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: THEME.gold }}>{fmt(s.divYield, 2)}%</div>
                <div style={{ fontSize: 9, color: THEME.dim }}>${fmt(s.annualDiv)}/an</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Venit pe acțiune complet */}
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

// ── TAB: DIAGNOZĂ AI ─────────────────────────────────────────────────────────
function DiagTab({ portfolio, totals }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState("general"); // general | dividende | risc

  const runAI = useCallback(async () => {
    setLoading(true);
    setAiText("");
    const lines = portfolio.map(s =>
      `- ${s.symbol}: P/E=${s.pe.toFixed(1)}, Beta=${s.beta.toFixed(2)}, Profit%=${s.profitPct.toFixed(1)}%, Pondere=${fmt((s.value/totals.value)*100,1)}%, DivYield=${s.divYield.toFixed(2)}%, Payout=${s.payout.toFixed(0)}%, ProfitMargin=${(s.profitMargin*100).toFixed(1)}%, ROE=${(s.roe*100).toFixed(1)}%, CurrentRatio=${s.currentRatio.toFixed(2)}, Sector=${s.sector}`
    ).join("\n");
    const pct = ((totals.profit / totals.invested) * 100).toFixed(1);

    let prompt;
    if (aiMode === "dividende") {
      prompt = `Ești un analist financiar expert în dividende. Analizează fluxul de dividende al acestui portofoliu în română (max 180 cuvinte, fără markdown, text simplu cu secțiuni separate prin newline).\n\nPortofoliu: Valoare $${totals.value.toFixed(0)}, Dividende anuale $${totals.divIncome.toFixed(0)}, Yield ${((totals.divIncome/totals.value)*100).toFixed(2)}%\n\n${lines}\n\nRăspunde cu: SUSTENABILITATE DIVIDENDE (2 fraze), RISCURI TĂIERE (2 acțiuni concrete), OPORTUNITĂȚI CREȘTERE YIELD (2 sugestii). Fii specific cu ticker-ele.`;
    } else if (aiMode === "risc") {
      prompt = `Ești un manager de risc senior. Evaluează riscurile acestui portofoliu în română (max 180 cuvinte, fără markdown, text simplu cu secțiuni separate prin newline).\n\nPortofoliu: Valoare $${totals.value.toFixed(0)}, Beta mediu portofoliu, Profit ${pct}%\n\n${lines}\n\nRăspunde cu: EXPUNERE LA VOLATILITATE (beta și concentrare), RISCURI SECTORIALE (2 concrete), RISCURI SPECIFICE (2 acțiuni), HEDGING (1 sugestie). Fii concis și specific.`;
    } else {
      prompt = `Ești un analist financiar senior. Analizează acest portofoliu și oferă un comentariu profesionist în română (max 200 cuvinte, fără markdown, doar text simplu cu secțiuni separate prin newline).\n\nPortofoliu: Valoare $${totals.value.toFixed(0)}, Profit $${totals.profit.toFixed(0)} (${pct}%), Dividende anuale $${totals.divIncome.toFixed(0)}\n\n${lines}\n\nRăspunde cu: REZUMAT (2 fraze), PUNCTE FORTE (2 aspecte), RISCURI (2 concrete), RECOMANDĂRI (2 acțiuni). Fii concis și specific cu ticker-ele.`;
    }

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
  }, [portfolio, totals, aiMode]);

  const flags = [
    { label: "P/E > 35 (Supraevaluat)", color: THEME.gold,
      items: portfolio.filter(s => s.pe > 35 && s.pe < 500).sort((a,b) => b.pe - a.pe),
      fmt: s => `P/E ${s.pe.toFixed(1)}` },
    { label: "Risc tăiere dividend (Payout > 80%)", color: THEME.red,
      items: portfolio.filter(s => s.payout > 80 && s.annualDiv > 0).sort((a,b) => b.payout - a.payout),
      fmt: s => `Payout ${s.payout.toFixed(0)}%` },
    { label: "Volatilitate ridicată (Beta > 1.2)", color: THEME.blue,
      items: portfolio.filter(s => s.beta > 1.2).sort((a,b) => b.beta - a.beta),
      fmt: s => `β ${s.beta.toFixed(2)}` },
    { label: "Lichiditate slabă (Current Ratio < 0.6)", color: THEME.red,
      items: portfolio.filter(s => s.currentRatio > 0 && s.currentRatio < 0.6 && !["Financials","Real Estate"].includes(s.sector)).sort((a,b) => a.currentRatio - b.currentRatio),
      fmt: s => `CR ${s.currentRatio.toFixed(2)}` },
    { label: "Concentrare > 15% (Risc concentrare)", color: THEME.gold,
      items: portfolio.filter(s => (s.value / totals.value) * 100 > 15).sort((a,b) => b.value - a.value),
      fmt: s => `${((s.value/totals.value)*100).toFixed(1)}%` },
    { label: "ROE negativ / ≈ 0 (Profitabilitate slabă)", color: THEME.orange,
      items: portfolio.filter(s => s.roe < 0.02).sort((a,b) => a.roe - b.roe),
      fmt: s => `ROE ${(s.roe*100).toFixed(1)}%` },
    { label: "Pierdere nerealizată > 10%", color: THEME.red,
      items: portfolio.filter(s => s.profitPct < -10).sort((a,b) => a.profitPct - b.profitPct),
      fmt: s => `${s.profitPct.toFixed(1)}%` },
    { label: "Levered >4x (Datorie excesivă)", color: THEME.orange,
      items: portfolio.filter(s => s.debtEq > 4).sort((a,b) => b.debtEq - a.debtEq),
      fmt: s => `D/E ${s.debtEq.toFixed(1)}x` },
  ];

  const alertCount = flags.filter(f => f.items.length > 0).length;

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* AI bloc */}
      <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${THEME.gold}`, padding: "14px 16px" }}>
        <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>DIAGNOZĂ NARATIVĂ — CLAUDE AI</div>

        {/* Mod analiză */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[
            { id: "general",   label: "General" },
            { id: "dividende", label: "Dividende" },
            { id: "risc",      label: "Risc" },
          ].map(m => (
            <button key={m.id} onClick={() => setAiMode(m.id)}
              style={{ flex: 1, background: aiMode === m.id ? "rgba(232,196,104,0.15)" : "transparent", border: `1px solid ${aiMode === m.id ? THEME.gold : THEME.border}`, color: aiMode === m.id ? THEME.gold : THEME.dim, borderRadius: 6, padding: "5px 4px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
              {m.label}
            </button>
          ))}
        </div>

        <button onClick={runAI} disabled={loading}
          style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, opacity: loading ? 0.6 : 1, width: "100%" }}>
          {loading ? "Se analizează..." : "🧠 Generează Analiză AI"}
        </button>

        {aiText && (
          <div style={{ fontSize: 12, color: THEME.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{aiText}</div>
        )}
        {!aiText && !loading && (
          <div style={{ fontSize: 11, color: THEME.dim, fontStyle: "italic" }}>Selectează tipul de analiză și apasă butonul.</div>
        )}
      </div>

      {/* Sumar alerte */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}` }}>
        <span style={{ fontSize: 11, color: THEME.dim }}>ALERTE AUTOMATE ACTIVE</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: alertCount > 3 ? THEME.red : THEME.gold }}>{alertCount}/{flags.length}</span>
      </div>

      {/* Flag-uri */}
      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>ALERTE DETALIATE</div>
      {flags.map(f => (
        <div key={f.label} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: `3px solid ${f.items.length > 0 ? f.color : THEME.border}`, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: f.items.length > 0 ? f.color : THEME.dim, letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</div>
          {f.items.length === 0 ? (
            <div style={{ fontSize: 11, color: THEME.green }}>✓ Nicio problemă detectată</div>
          ) : f.items.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: THEME.text }}>{s.symbol}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: f.color }}>{f.fmt(s)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── TAB: WATCHLIST / DCA ──────────────────────────────────────────────────────
function WatchlistTab({ portfolio, totals }) {
  const [filterSig, setFilterSig] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const medianWeight = [...portfolio].sort((a,b) => (a.value/totals.value)-(b.value/totals.value))[Math.floor(portfolio.length/2)]?.value/totals.value * 100 || 5;

  const scored = portfolio.map(s => {
    const weight = (s.value / totals.value) * 100;
    const discount = ((s.avgCost - s.price) / s.avgCost) * 100;
    let score = 0;
    const reasons = [];

    if (discount > 0)          { score += Math.min(28, discount * 1.4); reasons.push(`sub cost cu ${discount.toFixed(1)}%`); }
    else if (s.profitPct < 5)  { score += 5;  reasons.push("aproape de cost mediu"); }

    if (s.pe > 0 && s.pe <= 15)      { score += 20; reasons.push("P/E atractiv"); }
    else if (s.pe <= 25)             { score += 12; reasons.push("P/E rezonabil"); }
    else if (s.pe <= 35)             { score += 5; }

    if (s.divYield >= 4)        { score += 15; reasons.push("yield ridicat"); }
    else if (s.divYield >= 2)   { score += 9;  reasons.push("yield decent"); }
    else if (s.divYield > 0)    { score += 4; }

    if (s.divYield > 0) {
      if (s.sector === "Real Estate") { score += 8; reasons.push("REIT"); }
      else if (s.payout <= 65) { score += 14; reasons.push("payout sănătos"); }
      else if (s.payout <= 85) { score += 7;  reasons.push("payout acceptabil"); }
    }

    if (s.dailyChg < 0) { score += Math.min(10, Math.abs(s.dailyChg) * 2); reasons.push("slăbiciune zilnică"); }
    if (weight <= medianWeight) { score += 6; reasons.push("pondere sub mediană"); }
    if (s.roe > 0.3) { score += 8; reasons.push("ROE excelent"); }
    if (s.profitMargin > 0.25) { score += 5; reasons.push("marjă ridicată"); }
    if (s.beta < 0.7) { score += 4; reasons.push("volatilitate scăzută"); }

    score = Math.min(100, Math.round(score));
    return { ...s, score, reasons: reasons.slice(0, 3), discount, weight };
  });

  const getSignal = (score) => {
    if (score >= 70) return { label: "Prioritate", color: THEME.green,  bg: "rgba(46,204,113,0.12)" };
    if (score >= 50) return { label: "De urmărit", color: THEME.gold,   bg: "rgba(232,196,104,0.12)" };
    return              { label: "Candidat",   color: THEME.blue,   bg: "rgba(74,158,255,0.12)" };
  };

  let displayed = [...scored];
  if (filterSig !== "all") {
    displayed = displayed.filter(s => {
      const sig = getSignal(s.score);
      return sig.label === filterSig;
    });
  }
  if (sortBy === "score")    displayed.sort((a,b) => b.score - a.score);
  if (sortBy === "discount") displayed.sort((a,b) => b.discount - a.discount);
  if (sortBy === "yield")    displayed.sort((a,b) => b.divYield - a.divYield);

  const priorityCount  = scored.filter(s => s.score >= 70).length;
  const urmaritCount   = scored.filter(s => s.score >= 50 && s.score < 70).length;
  const candidatCount  = scored.filter(s => s.score < 50).length;

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Sumar semnale */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "Prioritate", count: priorityCount, color: THEME.green,  sig: "Prioritate" },
          { label: "De urmărit", count: urmaritCount,  color: THEME.gold,   sig: "De urmărit" },
          { label: "Candidat",   count: candidatCount, color: THEME.blue,   sig: "Candidat" },
        ].map(b => (
          <button key={b.sig} onClick={() => setFilterSig(filterSig === b.sig ? "all" : b.sig)}
            style={{ background: filterSig === b.sig ? `rgba(${b.color === THEME.green ? "46,204,113" : b.color === THEME.gold ? "232,196,104" : "74,158,255"},0.15)` : THEME.surface, border: `1px solid ${filterSig === b.sig ? b.color : THEME.border}`, borderRadius: 8, padding: "10px 6px", cursor: "pointer", fontFamily: "inherit" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: b.color }}>{b.count}</div>
            <div style={{ fontSize: 9, color: THEME.dim, marginTop: 2 }}>{b.label}</div>
          </button>
        ))}
      </div>

      {/* Sortare */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1 }}>Sort:</span>
        {[
          { id: "score",    label: "Scor DCA" },
          { id: "discount", label: "Discount" },
          { id: "yield",    label: "Yield" },
        ].map(opt => (
          <button key={opt.id} onClick={() => setSortBy(opt.id)}
            style={{ background: sortBy === opt.id ? "rgba(232,196,104,0.15)" : "transparent", border: `1px solid ${sortBy === opt.id ? THEME.gold : THEME.border}`, color: sortBy === opt.id ? THEME.gold : THEME.dim, borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 2, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 6 }}>
        OPORTUNITĂȚI DCA — {displayed.length} acțiuni
      </div>

      {displayed.map(s => {
        const sig = getSignal(s.score);
        return (
          <div key={s.symbol} style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: THEME.text, fontWeight: 500 }}>{s.symbol}</span>
                <Badge text={sig.label} color={sig.color} bg={sig.bg} />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: sig.color, fontWeight: 500 }}>{s.score}</div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ height: 4, background: THEME.border, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${s.score}%`, background: sig.color, borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              {[
                { l: "Preț live",   v: `$${fmt(s.price)}` },
                { l: "Cost mediu",  v: `$${fmt(s.avgCost)}` },
                { l: "Discount",    v: s.discount > 0 ? `${fmt(s.discount, 1)}%` : `+${fmt(-s.discount, 1)}%`, c: s.discount > 0 ? THEME.green : THEME.red },
              ].map(x => (
                <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "5px 8px" }}>
                  <div style={{ fontSize: 9, color: THEME.dim }}>{x.l}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: x.c || THEME.text }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              {[
                { l: "P/E",       v: s.pe > 0 ? s.pe.toFixed(1) : "N/A" },
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

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const portfolio = calcPortfolio(DEMO_PORTFOLIO);
  const totals = {
    value:     portfolio.reduce((a, s) => a + s.value, 0),
    prevValue: portfolio.reduce((a, s) => a + s.prevValue, 0),
    invested:  portfolio.reduce((a, s) => a + s.invested, 0),
    profit:    portfolio.reduce((a, s) => a + s.profit, 0),
    divIncome: portfolio.reduce((a, s) => a + s.annualDiv, 0),
  };
  totals.dailyChgUSD = totals.value - totals.prevValue;
  totals.dailyChgPct = (totals.dailyChgUSD / totals.prevValue) * 100;
  totals.profitPct   = (totals.profit / totals.invested) * 100;

  const tabs = [
    { id: "overview",  label: "Portofoliu" },
    { id: "dividende", label: "Dividende" },
    { id: "diagnoza",  label: "Diagnoză AI" },
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

      {tab === "overview"  && <OverviewTab  portfolio={portfolio} totals={totals} key={refreshKey} />}
      {tab === "dividende" && <DivTab       portfolio={portfolio} key={refreshKey} />}
      {tab === "diagnoza"  && <DiagTab      portfolio={portfolio} totals={totals} key={refreshKey} />}
      {tab === "watchlist" && <WatchlistTab portfolio={portfolio} totals={totals} key={refreshKey} />}

      <div style={{ height: 32 }} />
    </div>
  );
}
