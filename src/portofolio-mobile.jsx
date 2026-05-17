import React, { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

// ── THEME SYSTEM ──────────────────────────────────────────────────────────────
const DARK = {
  bg: "#0D1117", surface: "#161B22", border: "#21262D",
  text: "#C9D1D9", dim: "#8B949E", gold: "#E8C468",
  blue: "#4A9EFF", green: "#2ECC71", red: "#E74C3C",
  inputBg: "#0D1117",
};
const LIGHT = {
  bg: "#F6F8FA", surface: "#FFFFFF", border: "#D0D7DE",
  text: "#1F2328", dim: "#636C76", gold: "#B08800",
  blue: "#0969DA", green: "#1A7F37", red: "#CF222E",
  inputBg: "#FFFFFF",
};

const FONT_SANS = "'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'DM Mono', 'SFMono-Regular', Consolas, monospace";
const FONT_DISPLAY = "'Playfair Display', Georgia, serif";

const metricCardStyle = () => ({
  background: THEME.surface,
  borderRadius: 8,
  border: `1px solid ${THEME.border}`,
  borderTop: `2px solid ${THEME.gold}`,
  padding: "12px 13px",
  minHeight: 86,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
});

const ThemeCtx = createContext({ isDark: true, toggleTheme: () => {} });
const useTheme = () => useContext(ThemeCtx);

// Module-level mutable — lets helper fns (clr etc.) read current theme without prop drilling
let THEME = { ...DARK };

// ── LIVE QUOTES HOOK ─────────────────────────────────────────────────────────
// Yahoo Finance query2 — funcționează direct din browser fără CORS issues
async function fetchYahooQuotes(symbols) {
  const joined = symbols.join(",");
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${joined}&fields=regularMarketPrice,regularMarketPreviousClose,trailingPE,dividendYield,marketCap,beta,trailingAnnualDividendRate,payoutRatio,profitMargins,returnOnEquity,currentRatio,debtToEquity`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const results = {};
    (data?.quoteResponse?.result || []).forEach(q => {
      results[q.symbol] = {
        price:        q.regularMarketPrice             ?? null,
        prevPrice:    q.regularMarketPreviousClose      ?? null,
        pe:           q.trailingPE                     ?? null,
        divYield:     q.dividendYield != null ? q.dividendYield * 100 : null,
        mktCap:       q.marketCap     != null ? Math.round(q.marketCap / 1e9) : null,
        beta:         q.beta                           ?? null,
        divRate:      q.trailingAnnualDividendRate      ?? null,
        payout:       q.payoutRatio   != null ? q.payoutRatio * 100 : null,
        profitMargin: q.profitMargins                  ?? null,
        roe:          q.returnOnEquity                 ?? null,
        currentRatio: q.currentRatio                  ?? null,
        debtEq:       q.debtToEquity  != null ? q.debtToEquity / 100 : null,
      };
    });
    return Object.keys(results).length > 0 ? results : null;
  } catch (e) {
    console.warn("Yahoo Finance fetch failed:", e.message);
    return null;
  }
}

function useLiveQuotes(symbols) {
  const [quotes, setQuotes]         = useState(null);
  const [status, setStatus]         = useState("idle");   // idle | loading | live | error
  const [lastUpdate, setLastUpdate] = useState(null);
  const timerRef = useRef(null);
  const symKey   = symbols.join(",");

  const refresh = useCallback(async () => {
    setStatus(prev => prev === "live" ? "live" : "loading");
    const data = await fetchYahooQuotes(symbols);
    if (data) {
      setQuotes(data);
      setStatus("live");
      setLastUpdate(new Date());
    } else {
      setStatus(prev => prev === "live" ? "live" : "error");
    }
  }, [symKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, 60_000);
    return () => clearInterval(timerRef.current);
  }, [refresh]);

  return { quotes, status, lastUpdate, refresh };
}

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

// Merge PORTFOLIO_DATA cu quotes live (fallback la valori hardcodate)
function calcPortfolio(liveQuotes) {
  return PORTFOLIO_DATA.map(s => {
    const q = liveQuotes?.[s.symbol];
    const price        = q?.price        ?? s.price;
    const prevPrice    = q?.prevPrice    ?? s.prevPrice;
    const pe           = q?.pe           ?? s.pe;
    const divYield     = q?.divYield     ?? s.divYield;
    const mktCap       = q?.mktCap       ?? s.mktCap;
    const beta         = q?.beta         ?? s.beta;
    const payout       = q?.payout       ?? s.payout;
    const profitMargin = q?.profitMargin ?? s.profitMargin;
    const roe          = q?.roe          ?? s.roe;
    const currentRatio = q?.currentRatio ?? s.currentRatio;
    const debtEq       = q?.debtEq       ?? s.debtEq;
    // Dacă avem divRate live, îl folosim pentru annualDiv; altfel recalculăm din yield
    const divRatePS    = q?.divRate ?? (price * divYield / 100);
    const annualDiv    = divYield > 0 ? divRatePS * s.shares : 0;
    return {
      ...s,
      price, prevPrice, pe, divYield, mktCap, beta, payout,
      profitMargin, roe, currentRatio, debtEq,
      value:     s.shares * price,
      prevValue: s.shares * prevPrice,
      invested:  s.shares * s.avgCost,
      profit:    s.shares * (price - s.avgCost),
      profitPct: ((price - s.avgCost) / s.avgCost) * 100,
      dailyChg:  ((price - prevPrice) / prevPrice) * 100,
      annualDiv,
      isLive:    !!q,
    };
  });
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div style={{ fontSize: 10, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.6, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 8, marginBottom: 14, fontWeight: 500 }}>
      {children}
    </div>
  );
}

function Card({ children, accent, style = {} }) {
  return (
    <div style={{ background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, borderLeft: accent ? `3px solid ${accent}` : undefined, padding: "16px 17px", boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}

function Badge({ text, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, color, background: bg }}>{text}</span>;
}

function MetricRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${THEME.border}` }}>
      <span style={{ fontSize: 12, color: THEME.dim, lineHeight: 1.25 }}>{label}</span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: color || THEME.text, textAlign: "right", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Mod luminos" : "Mod întunecat"}
      style={{
        background: "transparent",
        border: `1px solid ${THEME.border}`,
        borderRadius: 6,
        width: 32, height: 32,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: THEME.dim,
        transition: "border-color 0.2s, color 0.2s",
        flexShrink: 0,
      }}
    >
      {isDark ? (
        // Sun icon
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function TopBar({ onRefresh, liveStatus, lastUpdate }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t); }, []);

  const statusDot = {
    idle:    { color: THEME.dim,   label: "—" },
    loading: { color: THEME.gold,  label: "⟳ sync..." },
    live:    { color: THEME.green, label: `live · ${lastUpdate ? lastUpdate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : ""}` },
    error:   { color: THEME.red,   label: "offline · date demo" },
  }[liveStatus] ?? { color: THEME.dim, label: "—" };

  return (
    <div style={{ background: THEME.bg, borderBottom: `1px solid ${THEME.border}`, padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, color: THEME.gold, letterSpacing: 1, fontWeight: 600, lineHeight: 1.05 }}>PORTFOLIO TERMINAL</div>
        <div style={{ color: THEME.dim, fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", marginTop: 4 }}>Market Intelligence Dashboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusDot.color, flexShrink: 0,
            boxShadow: liveStatus === "live" ? `0 0 6px ${THEME.green}` : "none",
            animation: liveStatus === "loading" ? "pulse 1s infinite" : "none" }} />
          <div style={{ fontSize: 9, color: statusDot.color, fontFamily: FONT_MONO, letterSpacing: 1 }}>{statusDot.label}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 10, color: THEME.dim, textAlign: "right" }}>
          <div style={{ color: THEME.text, fontFamily: FONT_MONO }}>{time.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <ThemeToggle />
        <button onClick={onRefresh}
          style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 14,
            opacity: liveStatus === "loading" ? 0.5 : 1 }}>
          {liveStatus === "loading" ? "⟳" : "↻"}
        </button>
      </div>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;600&display=swap');
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  * { transition: background-color 0.22s ease, border-color 0.22s ease, color 0.18s ease; }
  svg *, path, rect, circle, line, text { transition: none !important; }
  input, select, button { transition: background-color 0.22s ease, border-color 0.22s ease, color 0.18s ease !important; }
`}</style>
    </div>
  );
}

function SummaryMetrics({ totals }) {
  const pct = (totals.profit / totals.invested) * 100;
  const yoc = (totals.divIncome / totals.invested) * 100;
  const metrics = [
    { label: "PORTFOLIO VALUE", value: `$${fmt(totals.value)}`, delta: null },
    { label: "UNREALIZED P/L", value: `${sign(totals.profit)}$${fmt(Math.abs(totals.profit))}`, delta: `${sign(pct)}${fmt(pct, 2)}%`, dc: clr(totals.profit) },
    { label: "DAILY CHANGE", value: `${sign(totals.dailyChgUSD)}$${fmt(Math.abs(totals.dailyChgUSD))}`, delta: `${sign(totals.dailyChgPct)}${fmt(totals.dailyChgPct, 2)}%`, dc: clr(totals.dailyChgUSD) },
    { label: "ANNUAL INCOME", value: `$${fmt(totals.divIncome)}`, delta: null },
    { label: "YIELD ON COST", value: `${fmt(yoc, 2)}%`, delta: null },
  ];
  return (
    <div style={{ padding: "14px 12px 0", display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {metrics.slice(0, 2).map(m => (
          <div key={m.label} style={metricCardStyle()}>
            <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.2, lineHeight: 1.2, minHeight: 22 }}>{m.label}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 15, color: THEME.text, lineHeight: 1.2, overflowWrap: "anywhere" }}>{m.value}</div>
            {m.delta && <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: m.dc, marginTop: 3 }}>{m.delta}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 9 }}>
        {metrics.slice(2).map(m => (
          <div key={m.label} style={{ ...metricCardStyle(), padding: "11px 10px", minHeight: 88 }}>
            <div style={{ fontSize: 8, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.1, lineHeight: 1.2, minHeight: 22 }}>{m.label}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: m.dc || THEME.text, lineHeight: 1.2, overflowWrap: "anywhere" }}>{m.value}</div>
            {m.delta && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: m.dc, marginTop: 3 }}>{m.delta}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BOTTOM NAVIGATION ────────────────────────────────────────────────────────
const NAV_ICONS = {
  matrice: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  fluxuri: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  deepdive: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  diagnoza: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3" fill={active ? "currentColor" : "none"}/>
    </svg>
  ),
  more: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
    </svg>
  ),
};

const ALERT_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

function BottomNav({ active, onChange, alertCount = 0 }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = ["matrice", "fluxuri", "deepdive", "diagnoza"];
  const moreItems = [
    { id: "rebal",     label: "Rebalance" },
    { id: "watchlist", label: "Watchlist" },
    { id: "alerte",    label: "Price Alerts" },
  ];
  const labels = { matrice: "Dashboard", fluxuri: "Income", deepdive: "Deep Dive", diagnoza: "AI" };

  const handleMore = (id) => { onChange(id); setMoreOpen(false); };

  return (
    <>
      {/* Drawer overlay */}
      {moreOpen && (
        <div onClick={() => setMoreOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 149, background: "rgba(0,0,0,0.55)" }} />
      )}
      {/* More drawer */}
      <div style={{
        position: "fixed", bottom: 58, left: "50%", transform: "translateX(-50%)",
        width: "min(480px, 100vw)", zIndex: 150,
        transition: "opacity 0.18s, transform 0.18s",
        opacity: moreOpen ? 1 : 0, pointerEvents: moreOpen ? "auto" : "none",
        transform: `translateX(-50%) translateY(${moreOpen ? 0 : 16}px)`,
      }}>
        <div style={{ margin: "0 12px", background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 -4px 24px rgba(0,0,0,0.5)" }}>
          {moreItems.map((item, i) => (
            <button key={item.id} onClick={() => handleMore(item.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", background: active === item.id ? `${THEME.gold}11` : "transparent",
                border: "none", borderBottom: i < moreItems.length - 1 ? `1px solid ${THEME.border}` : "none",
                color: active === item.id ? THEME.gold : THEME.text,
                padding: "14px 18px", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
              }}>
              <span>{item.label}</span>
              {item.id === "alerte" && alertCount > 0 && (
                <span style={{ background: THEME.red, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{alertCount}</span>
              )}
              {active === item.id && <span style={{ color: THEME.gold, fontSize: 12 }}>●</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(480px, 100vw)", height: 58, zIndex: 100,
        background: THEME.surface, borderTop: `1px solid ${THEME.border}`,
        display: "flex", alignItems: "stretch",
      }}>
        {primary.map(id => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => { onChange(id); setMoreOpen(false); }}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 3, background: "transparent", border: "none",
                color: isActive ? THEME.gold : THEME.dim, cursor: "pointer",
                borderTop: isActive ? `2px solid ${THEME.gold}` : "2px solid transparent",
                transition: "color 0.15s",
              }}>
              {NAV_ICONS[id]?.(isActive)}
              <span style={{ fontSize: 9, letterSpacing: 0.3, fontFamily: "inherit" }}>{labels[id]}</span>
            </button>
          );
        })}
        {/* More button */}
        <button onClick={() => setMoreOpen(v => !v)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, background: "transparent", border: "none",
            color: moreItems.some(m => m.id === active) ? THEME.gold : THEME.dim,
            cursor: "pointer", position: "relative",
            borderTop: moreItems.some(m => m.id === active) ? `2px solid ${THEME.gold}` : "2px solid transparent",
          }}>
          {NAV_ICONS.more()}
          <span style={{ fontSize: 9, letterSpacing: 0.3, fontFamily: "inherit" }}>More</span>
          {alertCount > 0 && (
            <span style={{ position: "absolute", top: 6, right: "50%", marginRight: -18, background: THEME.red, color: "#fff", borderRadius: 8, fontSize: 9, fontWeight: 700, padding: "1px 5px", lineHeight: 1.4 }}>{alertCount}</span>
          )}
        </button>
      </div>
    </>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}`, overflowX: "auto", scrollbarWidth: "none", background: "transparent", WebkitOverflowScrolling: "touch" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flexShrink: 0, background: "transparent", border: "none", borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent", color: active === t.id ? THEME.gold : THEME.dim, padding: "11px 14px", fontSize: 11, fontWeight: 500, letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StockDetailSheet({ stock, totals, onClose, onDeepDive }) {
  if (!stock) return null;

  const weight = totals?.value ? (stock.value / totals.value) * 100 : 0;
  const yoc = stock.invested ? (stock.annualDiv / stock.invested) * 100 : 0;
  const riskTone =
    stock.payout > 80 && stock.divYield > 0 ? THEME.red :
    stock.pe > 35 && stock.pe < 500 ? THEME.gold :
    stock.beta > 1.5 ? THEME.gold :
    THEME.green;
  const riskLabel =
    stock.payout > 80 && stock.divYield > 0 ? "Dividend risk" :
    stock.pe > 35 && stock.pe < 500 ? "High valuation" :
    stock.beta > 1.5 ? "High beta" :
    "Stable profile";

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.62)", zIndex: 190 }}
      />
      <div style={{
        position: "fixed",
        left: "50%",
        bottom: 0,
        transform: "translateX(-50%)",
        width: "min(480px, 100vw)",
        maxHeight: "82vh",
        overflowY: "auto",
        background: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderBottom: "none",
        borderRadius: "14px 14px 0 0",
        zIndex: 200,
        boxShadow: "0 -14px 36px rgba(0,0,0,0.45)",
        padding: "12px 14px 18px",
        boxSizing: "border-box",
      }}>
        <div style={{ width: 42, height: 4, borderRadius: 99, background: THEME.border, margin: "0 auto 12px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: THEME.gold }}>{stock.symbol}</span>
              <Badge text={riskLabel} color={riskTone} bg={`${riskTone}1f`} />
            </div>
            <div style={{ fontSize: 13, color: THEME.text, lineHeight: 1.25 }}>{stock.name}</div>
            <div style={{ fontSize: 10, color: THEME.dim, marginTop: 4 }}>{stock.sector}</div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.dim, fontSize: 18, cursor: "pointer", flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
          {[
            { l: "Price", v: `$${fmt(stock.price)}`, c: clr(stock.dailyChg) },
            { l: "Daily", v: `${sign(stock.dailyChg)}${fmt(stock.dailyChg, 2)}%`, c: clr(stock.dailyChg) },
            { l: "Position", v: fmtUSD(stock.value) },
            { l: "Weight", v: `${fmt(weight, 2)}%`, c: THEME.gold },
            { l: "P/L", v: `${sign(stock.profit)}${fmtUSD(stock.profit)}`, c: clr(stock.profit) },
            { l: "Return", v: `${sign(stock.profitPct)}${fmt(stock.profitPct, 1)}%`, c: clr(stock.profitPct) },
            { l: "Yield", v: `${fmt(stock.divYield, 2)}%`, c: stock.divYield > 0 ? THEME.gold : THEME.dim },
            { l: "YoC", v: `${fmt(yoc, 2)}%`, c: yoc > 0 ? THEME.gold : THEME.dim },
          ].map(x => (
            <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, border: `1px solid ${THEME.border}`, padding: "8px 10px" }}>
              <div style={{ fontSize: 8, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1 }}>{x.l}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: x.c || THEME.text, marginTop: 3 }}>{x.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, marginTop: 10 }}>
          {[
            { l: "P/E", v: stock.pe > 0 ? fmt(stock.pe, 1) : "N/A" },
            { l: "Beta", v: fmt(stock.beta, 2) },
            { l: "Payout", v: `${fmt(stock.payout, 0)}%` },
            { l: "ROE", v: `${fmt(stock.roe * 100, 1)}%` },
          ].map(x => (
            <div key={x.l} style={{ textAlign: "center", padding: "7px 4px", borderBottom: `1px solid ${THEME.border}` }}>
              <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: THEME.text, marginTop: 2 }}>{x.v}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onDeepDive?.(stock.symbol)}
          style={{ width: "100%", marginTop: 14, background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}`, borderRadius: 6, padding: "10px 12px", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, cursor: "pointer" }}
        >
          Open Deep Dive
        </button>
      </div>
    </>
  );
}

// ── DONUT CHART COMPONENT ─────────────────────────────────────────────────────
function DonutChart({ slices, cx = 130, cy = 130, r = 90, innerR = 52, onHover, hovered, centerLabel, centerSub }) {
  let cumAngle = -Math.PI / 2;
  const paths = slices.map((slice, i) => {
    const angle = (slice.pct / 100) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle);
    const yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle);
    const yi2 = cy + innerR * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const isHov = hovered === i;
    const scale = isHov ? 1.045 : 1;
    const midAngle = startAngle + angle / 2;
    const tx = cx + (r + 14) * Math.cos(midAngle);
    const ty = cy + (r + 14) * Math.sin(midAngle);

    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1} Z`;
    return { d, color: slice.color, i, isHov, scale, midAngle, tx, ty, slice, angle };
  });

  return (
    <svg viewBox="0 0 260 260" style={{ width: "100%", height: 260, display: "block" }}>
      {paths.map(({ d, color, i, isHov, scale, slice }) => (
        <path
          key={i} d={d}
          fill={color}
          opacity={hovered !== null && !isHov ? 0.45 : 1}
          stroke={THEME.bg} strokeWidth={isHov ? 2.5 : 1.5}
          style={{ cursor: "pointer", transition: "opacity 0.18s, transform 0.18s", transformOrigin: `${cx}px ${cy}px`, transform: isHov ? `scale(${scale})` : "scale(1)" }}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          onTouchStart={() => onHover(i)}
        />
      ))}
      {/* center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill={THEME.text} fontSize="15" fontFamily={FONT_MONO} fontWeight="bold">{centerLabel}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={THEME.dim} fontSize="9" fontFamily="sans-serif">{centerSub}</text>
      {/* tooltip for hovered */}
      {hovered !== null && paths[hovered] && (() => {
        const p = paths[hovered];
        const labelX = p.tx > cx ? Math.min(p.tx, 245) : Math.max(p.tx, 15);
        const labelY = Math.max(12, Math.min(p.ty, 248));
        return (
          <>
            <rect x={labelX - (p.tx > cx ? 0 : 68)} y={labelY - 14} width={70} height={32} rx={4} fill={THEME.surface} stroke={THEME.border} strokeWidth="0.8" opacity="0.97" />
            <text x={labelX + (p.tx > cx ? 4 : -34)} y={labelY} textAnchor="middle" fill={p.color} fontSize="10" fontFamily={FONT_MONO} fontWeight="bold">{p.slice.label}</text>
            <text x={labelX + (p.tx > cx ? 4 : -34)} y={labelY + 13} textAnchor="middle" fill={THEME.text} fontSize="9" fontFamily={FONT_MONO}>{p.slice.valueLabel}</text>
          </>
        );
      })()}
    </svg>
  );
}

// ── TAB 1: MATRICEA PORTOFOLIULUI ────────────────────────────────────────────
function MatriceTab({ portfolio, totals, onStockSelect }) {
  const [hoveredDonut1, setHoveredDonut1] = useState(null);
  const [hoveredDonut2, setHoveredDonut2] = useState(null);
  const [matSubTab, setMatSubTab] = useState("harti");

  const sorted = [...portfolio].sort((a, b) => b.dailyChg - a.dailyChg);
  const gainers = sorted.slice(0, 5);
  const losers = [...sorted].reverse().slice(0, 5);

  const SECTOR_COLORS = {
    "Information Technology": THEME.blue,
    "Consumer Staples": THEME.gold,
    "Real Estate": "#2ECC71",
    "Financials": "#9B59B6",
    "Health Care": "#E91E8C",
    "Industrials": "#FF9800",
    "Communication Services": THEME.red,
  };

  // Donut 1 — Harta Profitabilității (per sector, colorat by profit avg)
  const sectors = {};
  portfolio.forEach(s => {
    if (!sectors[s.sector]) sectors[s.sector] = { value: 0, profit: 0, stocks: [] };
    sectors[s.sector].value += s.value;
    sectors[s.sector].profit += s.profit;
    sectors[s.sector].stocks.push(s);
  });
  const donut1Slices = Object.entries(sectors)
    .sort((a, b) => b[1].value - a[1].value)
    .map(([sec, d]) => {
      const profPct = (d.profit / (d.value - d.profit)) * 100;
      const baseColor = SECTOR_COLORS[sec] || THEME.dim;
      return {
        label: sec.split(" ").slice(-1)[0],
        pct: (d.value / totals.value) * 100,
        color: baseColor,
        valueLabel: `${sign(profPct)}${fmt(profPct, 1)}%`,
        extra: `$${fmt(d.value, 0)}`,
        profPct,
      };
    });

  // Donut 2 — Evoluție vs Preț Mediu (per stock, color by profitPct)
  const topStocks = [...portfolio].sort((a, b) => b.value - a.value).slice(0, 16);
  const otherValue = portfolio.slice(16).reduce((a, s) => a + s.value, 0);
  const otherProfit = portfolio.slice(16).reduce((a, s) => a + s.profitPct, 0) / Math.max(1, portfolio.length - 16);
  const donut2Items = otherValue > 0
    ? [...topStocks, { symbol: "Altele", profitPct: otherProfit, value: otherValue }]
    : topStocks;

  const donut2Slices = donut2Items.map(s => {
    const p = s.profitPct;
    let color;
    if (p >= 50) color = "#1a7a45";
    else if (p >= 20) color = "#2ECC71";
    else if (p >= 5) color = "#58d68d";
    else if (p >= 0) color = "#a9dfbf";
    else if (p >= -10) color = "#f1948a";
    else color = THEME.red;
    return {
      label: s.symbol,
      pct: (s.value / totals.value) * 100,
      color,
      valueLabel: `${sign(p)}${fmt(p, 1)}%`,
    };
  });

  const totalProfitPct = (totals.profit / totals.invested) * 100;

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Sub-tab switch */}
      <div style={{ display: "flex", borderBottom: `1px solid ${THEME.border}` }}>
        {[{ id: "harti", label: "Allocation" }, { id: "miscari", label: "Movers" }, { id: "registru", label: "Holdings" }].map(t => (
          <button key={t.id} onClick={() => setMatSubTab(t.id)}
            style={{ flex: 1, background: "transparent", border: "none",
              borderBottom: matSubTab === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent",
              color: matSubTab === t.id ? THEME.gold : THEME.dim,
              padding: "11px 4px", fontSize: 11, fontWeight: 500, letterSpacing: 0.4, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HĂRȚI ── */}
      {matSubTab === "harti" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Donut 1: Harta Profitabilității */}
          <section>
            <SectionHeader>PROFIT MAP</SectionHeader>
            <Card>
              <DonutChart
                slices={donut1Slices}
                onHover={setHoveredDonut1}
                hovered={hoveredDonut1}
                centerLabel={hoveredDonut1 !== null ? donut1Slices[hoveredDonut1]?.valueLabel : `${sign(totalProfitPct)}${fmt(totalProfitPct, 1)}%`}
                centerSub={hoveredDonut1 !== null ? donut1Slices[hoveredDonut1]?.label : "Portofoliu Total"}
              />
              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {donut1Slices.map((sl, i) => (
                  <div key={sl.label}
                    onMouseEnter={() => setHoveredDonut1(i)} onMouseLeave={() => setHoveredDonut1(null)}
                    onTouchStart={() => setHoveredDonut1(i)}
                    style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", opacity: hoveredDonut1 !== null && hoveredDonut1 !== i ? 0.45 : 1, transition: "opacity 0.15s" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: sl.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 9, color: THEME.dim }}>{sl.label}</span>
                    <span style={{ fontSize: 9, fontFamily: FONT_MONO, color: sl.profPct >= 0 ? THEME.green : THEME.red }}>{sl.valueLabel}</span>
                  </div>
                ))}
              </div>
              {/* Hover detail card */}
              {hoveredDonut1 !== null && (
                <div style={{ marginTop: 10, background: THEME.bg, borderRadius: 6, padding: "10px 12px", borderLeft: `3px solid ${donut1Slices[hoveredDonut1].color}` }}>
                  <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>{Object.keys(sectors).sort((a, b) => sectors[b].value - sectors[a].value)[hoveredDonut1]}</div>
                  {(() => {
                    const secName = Object.keys(sectors).sort((a, b) => sectors[b].value - sectors[a].value)[hoveredDonut1];
                    const secData = sectors[secName];
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        <div><div style={{ fontSize: 8, color: THEME.dim }}>Value</div><div style={{ fontFamily: FONT_MONO, fontSize: 11, color: THEME.text }}>${fmt(secData.value, 0)}</div></div>
                        <div><div style={{ fontSize: 8, color: THEME.dim }}>Profit</div><div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(secData.profit) }}>{sign(secData.profit)}${fmt(Math.abs(secData.profit), 0)}</div></div>
                        <div><div style={{ fontSize: 8, color: THEME.dim }}>Stocks</div><div style={{ fontSize: 10, color: THEME.text }}>{secData.stocks.map(s => s.symbol).join(", ")}</div></div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Card>
          </section>

          {/* Donut 2: Evoluție vs Preț Mediu */}
          <section>
            <SectionHeader>RETURN VS COST</SectionHeader>
            <Card>
              <DonutChart
                slices={donut2Slices}
                onHover={setHoveredDonut2}
                hovered={hoveredDonut2}
                centerLabel={hoveredDonut2 !== null ? donut2Slices[hoveredDonut2]?.valueLabel : `${sign(totalProfitPct)}${fmt(totalProfitPct, 1)}%`}
                centerSub={hoveredDonut2 !== null ? donut2Slices[hoveredDonut2]?.label : "Return Total"}
              />
              {/* Color scale legend */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                {[
                  { color: "#1a7a45", label: "> +50%" },
                  { color: "#2ECC71", label: "+20–50%" },
                  { color: "#58d68d", label: "+5–20%" },
                  { color: "#a9dfbf", label: "0–5%" },
                  { color: "#f1948a", label: "0 to -10%" },
                  { color: THEME.red, label: "< -10%" },
                ].map(x => (
                  <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: x.color }} />
                    <span style={{ fontSize: 8, color: THEME.dim }}>{x.label}</span>
                  </div>
                ))}
              </div>
              {/* Hover detail card */}
              {hoveredDonut2 !== null && (() => {
                const sym = donut2Slices[hoveredDonut2].label;
                const st = portfolio.find(p => p.symbol === sym);
                if (!st) return null;
                return (
                  <div style={{ marginTop: 10, background: THEME.bg, borderRadius: 6, padding: "10px 12px", borderLeft: `3px solid ${donut2Slices[hoveredDonut2].color}` }}>
                    <div style={{ fontSize: 11, color: THEME.text, marginBottom: 6 }}><span style={{ fontFamily: FONT_MONO, color: THEME.gold }}>{sym}</span> — {st.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Price</div><div style={{ fontFamily: FONT_MONO, fontSize: 11 }}>${fmt(st.price)}</div></div>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Avg Cost</div><div style={{ fontFamily: FONT_MONO, fontSize: 11 }}>${fmt(st.avgCost)}</div></div>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Return</div><div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(st.profitPct) }}>{sign(st.profitPct)}{fmt(st.profitPct, 1)}%</div></div>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Profit $</div><div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(st.profit) }}>{sign(st.profit)}${fmt(Math.abs(st.profit), 0)}</div></div>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Weight</div><div style={{ fontFamily: FONT_MONO, fontSize: 11 }}>{fmt((st.value / totals.value) * 100, 1)}%</div></div>
                      <div><div style={{ fontSize: 8, color: THEME.dim }}>Div/An</div><div style={{ fontFamily: FONT_MONO, fontSize: 11, color: THEME.gold }}>${fmt(st.annualDiv, 0)}</div></div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </section>
        </div>
      )}

      {/* ── MIȘCĂRILE ZILEI ── */}
      {matSubTab === "miscari" && (
        <section>
          <SectionHeader>DAILY MOVERS</SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: THEME.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>▲ Creșteri</div>
              {gainers.map(s => (
                <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${THEME.border}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: THEME.text }}>{s.symbol}</div>
                    <div style={{ fontSize: 9, color: THEME.dim }}>{s.name.split(" ").slice(0, 2).join(" ")}</div>
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
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
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REGISTRUL CENTRAL ── */}
      {matSubTab === "registru" && (
        <section>
          <SectionHeader>HOLDINGS</SectionHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...portfolio].sort((a, b) => b.value - a.value).map(s => (
              <Card key={s.symbol} style={{ cursor: "pointer" }}>
                <button
                  onClick={() => onStockSelect?.(s)}
                  style={{ all: "unset", display: "block", width: "100%", cursor: "pointer" }}
                  title={`Open ${s.symbol} details`}
                >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: THEME.gold }}>{s.symbol}</div>
                    <div style={{ fontSize: 10, color: THEME.dim }}>{s.sector}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: THEME.text }}>${fmt(s.price)}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                  {[
                    { l: "Value", v: fmtUSD(s.value) },
                    { l: "Profit $", v: `${sign(s.profit)}${fmtUSD(s.profit)}`, c: clr(s.profit) },
                    { l: "Return %", v: `${sign(s.profitPct)}${fmt(s.profitPct, 1)}%`, c: clr(s.profitPct) },
                    { l: "Shares", v: s.shares },
                    { l: "Avg Cost", v: `$${fmt(s.avgCost)}` },
                    { l: "P/E", v: s.pe > 0 ? fmt(s.pe, 1) : "N/A" },
                  ].map(x => (
                    <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "5px 7px" }}>
                      <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: x.c || THEME.text }}>{x.v}</div>
                    </div>
                  ))}
                </div>
                </button>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── TAB 2: DIAGNOZĂ AI ────────────────────────────────────────────────────────
function DiagTab({ portfolio, totals }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSource, setAiSource] = useState(null);

  const buildLocalDiagnosis = useCallback(() => {
    const profitPct = totals.invested ? (totals.profit / totals.invested) * 100 : 0;
    const topWinners = [...portfolio].sort((a, b) => b.profitPct - a.profitPct).slice(0, 3).map(s => s.symbol).join(", ");
    const riskNames = portfolio
      .filter(s => (s.payout > 80 && s.divYield > 0) || (s.pe > 35 && s.pe < 500) || s.beta > 1.5)
      .slice(0, 4)
      .map(s => s.symbol)
      .join(", ") || "none";
    const income = totals.divIncome || 0;

    return [
      "EXECUTIVE SUMMARY",
      `Portfolio value is $${totals.value.toFixed(0)}, with unrealized P/L of ${sign(totals.profit)}$${Math.abs(totals.profit).toFixed(0)} (${sign(profitPct)}${profitPct.toFixed(1)}%). Estimated annual dividend income is $${income.toFixed(0)}.`,
      "",
      "STRENGTHS",
      `Best contributors by return: ${topWinners || "not available"}. The portfolio has diversified exposure across ${new Set(portfolio.map(s => s.sector)).size} sectors.`,
      "",
      "RISKS",
      `Primary watchlist tickers: ${riskNames}. Review payout ratios, high valuation names, and position concentration before adding capital.`,
      "",
      "ACTIONS",
      "Use new capital selectively, prioritize quality names trading near or below cost, and keep dividend sustainability ahead of headline yield."
    ].join("\n");
  }, [portfolio, totals]);

  const runAI = useCallback(async () => {
    setLoading(true);
    setAiText("");
    setAiSource(null);

    try {
      const res = await fetch("/api/portfolio-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totals,
          holdings: portfolio.map(s => ({
            symbol: s.symbol,
            name: s.name,
            sector: s.sector,
            price: s.price,
            shares: s.shares,
            value: s.value,
            invested: s.invested,
            profit: s.profit,
            profitPct: s.profitPct,
            dailyChg: s.dailyChg,
            weight: totals.value ? (s.value / totals.value) * 100 : 0,
            pe: s.pe,
            beta: s.beta,
            divYield: s.divYield,
            annualDiv: s.annualDiv,
            payout: s.payout,
            profitMargin: s.profitMargin,
            roe: s.roe,
            currentRatio: s.currentRatio,
            debtEq: s.debtEq,
          })),
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setAiText(data.analysis || buildLocalDiagnosis());
      setAiSource(data.source || "openai");
    } catch (e) {
      console.warn("AI diagnosis failed:", e);
      setAiText(buildLocalDiagnosis());
      setAiSource("local");
    }
    setLoading(false);
  }, [portfolio, totals, buildLocalDiagnosis]);

  const flags = [
    { label: "High Valuation (P/E > 35)", color: THEME.gold, items: portfolio.filter(s => s.pe > 35 && s.pe < 500).sort((a, b) => b.pe - a.pe), val: s => `P/E ${s.pe.toFixed(1)}` },
    { label: "Dividend Cut Risk (Payout > 80%)", color: THEME.red, items: portfolio.filter(s => s.payout > 80 && s.annualDiv > 0 && s.sector !== "Real Estate").sort((a, b) => b.payout - a.payout), val: s => `${s.payout.toFixed(0)}%` },
    { label: "High Volatility (Beta > 1.5)", color: THEME.blue, items: portfolio.filter(s => s.beta > 1.5).sort((a, b) => b.beta - a.beta), val: s => `β ${s.beta.toFixed(2)}` },
    { label: "Low Liquidity (CR < 1)", color: THEME.red, items: portfolio.filter(s => s.currentRatio > 0 && s.currentRatio < 1 && s.sector !== "Financials").sort((a, b) => a.currentRatio - b.currentRatio), val: s => `CR ${s.currentRatio.toFixed(2)}` },
    { label: "Negative Margin", color: THEME.red, items: portfolio.filter(s => s.profitMargin < 0), val: s => `${(s.profitMargin * 100).toFixed(1)}%` },
    { label: "High Concentration (> 15%)", color: THEME.gold, items: portfolio.filter(s => (s.value / totals.value) * 100 > 15).sort((a, b) => b.value - a.value), val: s => `${((s.value / totals.value) * 100).toFixed(1)}%` },
  ];

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <Card accent={THEME.gold}>
        <SectionHeader>AI DIAGNOSIS</SectionHeader>
        <button onClick={runAI} disabled={loading} style={{ background: "transparent", border: `1px solid ${THEME.gold}`, color: THEME.gold, borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, opacity: loading ? 0.6 : 1, width: "100%" }}>
          {loading ? "Analyzing portfolio..." : "Generate Portfolio Diagnosis"}
        </button>
        {aiSource === "local" && (
          <div style={{ fontSize: 10, color: THEME.gold, marginBottom: 10 }}>
            AI service unavailable. Showing local rule-based diagnosis.
          </div>
        )}
        {aiText ? (
          <div style={{ fontSize: 12, color: THEME.text, lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {aiText.split("\n").map((line, i) => {
              const isHeader = ["REZUMAT", "PUNCTE", "RISCURI", "RECOMAND", "1.", "2.", "3.", "4."].some(h => line.trim().startsWith(h));
              return <div key={i} style={{ color: isHeader ? THEME.gold : THEME.text, fontSize: isHeader ? 10 : 12, textTransform: isHeader ? "uppercase" : "none", letterSpacing: isHeader ? 1.5 : 0, marginTop: isHeader ? 10 : 0 }}>{line}</div>;
            })}
          </div>
        ) : !loading && (
          <div style={{ fontSize: 11, color: THEME.dim, fontStyle: "italic" }}>Generate a concise AI-backed portfolio diagnosis.</div>
        )}
      </Card>

      <SectionHeader>HEALTH CHECK</SectionHeader>
      {flags.map(f => (
        <Card key={f.label} accent={f.color}>
          <div style={{ fontSize: 10, color: f.color, letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</div>
          {f.items.length === 0 ? (
            <div style={{ fontSize: 11, color: THEME.dim }}>✓ Nicio problemă detectată</div>
          ) : f.items.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.text }}>{s.symbol}</span>
                <span style={{ fontSize: 10, color: THEME.dim, marginLeft: 6 }}>{s.name.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: f.color }}>{f.val(s)}</span>
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
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: THEME.gold }}>${fmt(totalAnnual)}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(totalAnnual / 12)}<span style={{ color: THEME.dim }}> / lună medie</span></div>
          <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(totalAnnual / 52)}<span style={{ color: THEME.dim }}> / săptămână</span></div>
        </div>
      </Card>

      <section>
        <SectionHeader>MONTHLY INCOME</SectionHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {LUNI.map((luna, i) => {
            const val = monthly[i];
            const barW = maxMonth > 0 ? (val / maxMonth) * 100 : 0;
            const tickers = monthlyDetail[i].map(d => d.symbol).join(", ");
            return (
              <div key={luna}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: THEME.dim, width: 26, flexShrink: 0 }}>{luna}</div>
                  <div style={{ flex: 1, height: 22, background: THEME.border, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    {val > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barW}%`, background: THEME.gold, borderRadius: 4, opacity: 0.85 }} />}
                    {val > 0 && <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, display: "flex", alignItems: "center", fontSize: 9, color: THEME.bg, fontFamily: FONT_MONO }}>{tickers}</div>}
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: val > 0 ? THEME.gold : THEME.dim, width: 55, textAlign: "right", flexShrink: 0 }}>{val > 0 ? `$${fmt(val, 0)}` : "—"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader>DIVIDEND SPLIT</SectionHeader>
        {divStocks.map(s => (
          <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.text }}>{s.symbol}</div>
              <div style={{ fontSize: 9, color: THEME.dim }}>{s.shares} acț · {fmt(s.divYield, 2)}% yield · {(DIV_MONTHS[s.symbol] || []).length}x/an</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: THEME.gold }}>${fmt(s.annualDiv)}/an</div>
              <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.annualDiv / 12, 2)}/lună</div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <SectionHeader>EVENT RADAR</SectionHeader>
        <Card>
          <div style={{ fontSize: 11, color: THEME.dim, marginBottom: 10 }}>Date aproximative — verificați brokerul pentru confirmare</div>
          {portfolio.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.gold }}>{s.symbol}</span>
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
      <SectionHeader>REBALANCE ENGINE</SectionHeader>

      <Card>
        <div style={{ fontSize: 10, color: THEME.dim, marginBottom: 6 }}>CAPITAL NOU (DCA) $</div>
        <input
          type="number"
          value={capital}
          onChange={e => setCapital(Number(e.target.value))}
          style={{ background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 6, padding: "8px 12px", fontSize: 14, fontFamily: FONT_MONO, width: "100%", boxSizing: "border-box" }}
          min={0} step={100}
        />
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: THEME.dim }}>Total alocat:</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: Math.abs(sumaTargets - 100) <= 0.1 ? THEME.green : THEME.red }}>
          {fmt(sumaTargets, 2)}% / 100%
        </div>
      </div>

      <section>
        <SectionHeader>CURRENT VS TARGET</SectionHeader>
        {portfolio.map(s => {
          const currentPct = (s.value / totals.value) * 100;
          return (
            <div key={s.symbol} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div style={{ width: 48, fontFamily: FONT_MONO, fontSize: 11, color: THEME.gold, flexShrink: 0 }}>{s.symbol}</div>
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
                style={{ width: 48, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 4, padding: "3px 5px", fontSize: 10, fontFamily: FONT_MONO, textAlign: "right" }}
                min={0} max={100} step={0.5}
              />
            </div>
          );
        })}
      </section>

      {Math.abs(sumaTargets - 100) <= 0.1 && suggestions.length > 0 && (
        <section>
          <SectionHeader>BUY LIST</SectionHeader>
          {suggestions.map(s => (
            <div key={s.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${THEME.border}` }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: THEME.gold }}>{s.symbol}</div>
                <div style={{ fontSize: 10, color: THEME.dim }}>${fmt(s.price)} / acțiune</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: THEME.green }}>+{s.shares} acț.</div>
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
function WatchlistTab({ portfolio, totals, onStockSelect }) {
  const [minScore, setMinScore] = useState(35);
  const medianWeight = [...portfolio].sort((a, b) => a.value - b.value)[Math.floor(portfolio.length / 2)]?.value / totals.value * 100 || 5;

  const scored = portfolio.map(s => {
    const weight = (s.value / totals.value) * 100;
    const discount = ((s.avgCost - s.price) / s.avgCost) * 100;
    let score = 0;
    const reasons = [];
    if (discount > 0) { score += Math.min(28, discount * 1.4); reasons.push(`${discount.toFixed(1)}% below cost`); }
    else if (s.profitPct < 5) { score += 5; reasons.push("near avg cost"); }
    if (s.pe > 0 && s.pe <= 15) { score += 20; reasons.push("attractive P/E"); }
    else if (s.pe <= 25) { score += 12; reasons.push("fair P/E"); }
    else if (s.pe <= 35) { score += 5; }
    if (s.divYield >= 4) { score += 15; reasons.push("high yield"); }
    else if (s.divYield >= 2) { score += 9; reasons.push("solid yield"); }
    else if (s.divYield > 0) { score += 4; }
    if (s.divYield > 0) {
      if (s.sector === "Real Estate") { score += 8; reasons.push("REIT"); }
      else if (s.payout <= 65) { score += 14; reasons.push("healthy payout"); }
      else if (s.payout <= 85) { score += 7; }
    }
    if (s.dailyChg < 0) { score += Math.min(10, Math.abs(s.dailyChg) * 2); reasons.push("daily weakness"); }
    if (weight <= medianWeight) { score += 6; reasons.push("below median weight"); }
    score = Math.min(100, Math.round(score));
    return { ...s, score, reasons: reasons.slice(0, 3), discount, weight };
  }).filter(s => s.score >= minScore).sort((a, b) => b.score - a.score);

  const getSignal = (score) => {
    if (score >= 70) return { label: "High Priority", color: THEME.green, bg: "rgba(46,204,113,0.12)" };
    if (score >= 50) return { label: "Watch", color: THEME.gold, bg: "rgba(232,196,104,0.12)" };
    return { label: "Candidate", color: THEME.blue, bg: "rgba(74,158,255,0.12)" };
  };

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader>DCA WATCHLIST</SectionHeader>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, color: THEME.dim, flexShrink: 0 }}>Min score:</span>
        <input type="range" min={0} max={100} step={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.gold, width: 30 }}>{minScore}</span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { l: "Candidates", v: scored.length },
          { l: "Top Score", v: scored[0]?.score || 0 },
          { l: "Sub Cost", v: scored.filter(s => s.discount > 0).length },
        ].map(x => (
          <div key={x.l} style={{ flex: 1, background: THEME.surface, borderRadius: 8, border: `1px solid ${THEME.border}`, padding: "10px", textAlign: "center" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: THEME.gold }}>{x.v}</div>
            <div style={{ fontSize: 9, color: THEME.dim, marginTop: 2 }}>{x.l}</div>
          </div>
        ))}
      </div>

      {scored.map(s => {
        const sig = getSignal(s.score);
        return (
          <Card key={s.symbol} style={{ cursor: "pointer" }}>
            <button
              onClick={() => onStockSelect?.(s)}
              style={{ all: "unset", display: "block", width: "100%", cursor: "pointer" }}
              title={`Open ${s.symbol} details`}
            >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: THEME.text }}>{s.symbol}</span>
                <Badge text={sig.label} color={sig.color} bg={sig.bg} />
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: sig.color }}>{s.score}</div>
            </div>
            <div style={{ height: 4, background: THEME.border, borderRadius: 2, marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${s.score}%`, background: sig.color, borderRadius: 2 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              {[
                { l: "Live Price", v: `$${fmt(s.price)}` },
                { l: "Avg Cost", v: `$${fmt(s.avgCost)}` },
                { l: "P/E", v: s.pe > 0 ? s.pe.toFixed(1) : "N/A" },
                { l: "Div Yield", v: `${s.divYield.toFixed(2)}%` },
                { l: "Discount", v: s.discount > 0 ? `${s.discount.toFixed(1)}%` : "—", c: s.discount > 0 ? THEME.green : THEME.dim },
                { l: "Weight", v: `${s.weight.toFixed(1)}%` },
              ].map(x => (
                <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "5px 8px" }}>
                  <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: x.c || THEME.text }}>{x.v}</div>
                </div>
              ))}
            </div>
            {s.reasons.length > 0 && <div style={{ fontSize: 10, color: THEME.dim }}>{s.reasons.join(" · ")}</div>}
            </button>
          </Card>
        );
      })}
    </div>
  );
}

// ── DEEP DIVE CHART COMPONENTS ───────────────────────────────────────────────

// 1. ISTORICUL PREȚULUI 365 ZILE cu MA50 + cost mediu
function PriceHistoryChart({ closes, avgCost }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (!closes || closes.length < 50) return <div style={{ color: THEME.dim, fontSize: 11, textAlign: "center", padding: "20px 0" }}>Date insuficiente</div>;
  const n = closes.length;
  const W = 320, H = 160;
  const PAD = { t: 14, b: 22, l: 32, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;

  const ma50 = closes.map((_, i) => {
    if (i < 49) return null;
    return closes.slice(i - 49, i + 1).reduce((a, b) => a + b, 0) / 50;
  });
  const ma50Valid = ma50.filter(Boolean);

  const allVals = [...closes, ...ma50Valid, avgCost].filter(Boolean);
  const minV = Math.min(...allVals) * 0.995;
  const maxV = Math.max(...allVals) * 1.005;
  const range = maxV - minV || 1;

  const toY = v => PAD.t + ch - ((v - minV) / range) * ch;
  const toX = i => PAD.l + (i / (n - 1)) * cw;

  const closePath = closes.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const fillPath = closePath + ` L${toX(n - 1).toFixed(1)},${(PAD.t + ch).toFixed(1)} L${PAD.l},${(PAD.t + ch).toFixed(1)} Z`;

  const maPath = ma50.reduce((acc, v, i) => {
    if (v === null) return acc;
    const prev = ma50.slice(0, i).reverse().find(x => x !== null);
    return acc + `${!prev ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)} `;
  }, "");

  const avgY = avgCost ? toY(avgCost) : null;
  const hprice = hoverIdx !== null ? closes[hoverIdx] : null;
  const hx = hoverIdx !== null ? toX(hoverIdx) : null;
  const hy = hprice ? toY(hprice) : null;

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks }, (_, i) => minV + (i / (yTicks - 1)) * (maxV - minV));

  const gradId = `ph_${closes[0]?.toFixed(0)}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width * W;
          setHoverIdx(Math.max(0, Math.min(n - 1, Math.round(((mx - PAD.l) / cw) * (n - 1)))));
        }}
        onMouseLeave={() => setHoverIdx(null)}
        onTouchMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const mx = (e.touches[0].clientX - r.left) / r.width * W;
          setHoverIdx(Math.max(0, Math.min(n - 1, Math.round(((mx - PAD.l) / cw) * (n - 1)))));
        }}
        onTouchEnd={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid + Y labels */}
        {yTickVals.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#21262D" strokeWidth="0.5" />
            <text x={PAD.l - 2} y={toY(v) + 3} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO} textAnchor="end">${v.toFixed(0)}</text>
          </g>
        ))}
        {/* Fill + Close */}
        <path d={fillPath} fill={`url(#${gradId})`} />
        <path d={closePath} fill="none" stroke="#4A9EFF" strokeWidth="1.8" strokeLinejoin="round" />
        {/* MA50 */}
        <path d={maPath} fill="none" stroke="#E8C468" strokeWidth="1.4" strokeDasharray="5,3" strokeLinejoin="round" />
        {/* Avg cost */}
        {avgY && (
          <>
            <line x1={PAD.l} y1={avgY} x2={W - PAD.r} y2={avgY} stroke="#E8C46866" strokeWidth="1" strokeDasharray="4,3" />
            <text x={W - PAD.r - 2} y={avgY - 2} fill="#E8C468" fontSize="7" fontFamily={FONT_MONO} textAnchor="end">Cost ${avgCost?.toFixed(0)}</text>
          </>
        )}
        {/* Hover */}
        {hoverIdx !== null && hx !== null && hy !== null && (
          <>
            <line x1={hx} y1={PAD.t} x2={hx} y2={PAD.t + ch} stroke="#8B949E" strokeWidth="0.7" strokeDasharray="2,2" />
            <circle cx={hx} cy={hy} r={3.5} fill="#4A9EFF" stroke={THEME.bg} strokeWidth="1.5" />
            <rect x={Math.min(hx - 26, W - 62)} y={PAD.t} width={56} height={18} rx={3} fill={THEME.surface} stroke="#21262D" strokeWidth="0.8" />
            <text x={Math.min(hx - 26, W - 62) + 28} y={PAD.t + 12} fill={THEME.text} fontSize="9" fontFamily={FONT_MONO} textAnchor="middle">${hprice?.toFixed(2)}</text>
          </>
        )}
        {/* X axis */}
        <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke="#21262D" strokeWidth="0.8" />
        {[0, 63, 126, 189, 251].filter(i => i < n).map((i, k) => {
          const lbls = ["1Y", "9M", "6M", "3M", "Acum"];
          return <text key={k} x={toX(i)} y={H - 5} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO} textAnchor="middle">{lbls[k]}</text>;
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 8, color: THEME.dim, flexWrap: "wrap" }}>
        <span><span style={{ color: THEME.blue }}>——</span> Close</span>
        <span><span style={{ color: THEME.gold }}>- - -</span> MA 50</span>
        {avgCost && <span><span style={{ color: THEME.gold, opacity: 0.5 }}>- - -</span> Cost Mediu</span>}
        <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, color: THEME.text }}>
          52W: ${Math.min(...closes).toFixed(2)} – ${Math.max(...closes).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// 2. CANAL FCF vs DIVIDEND/SHARE (date simulate pe baza fundamentalelor)
function FCFDividendChart({ stock }) {
  // Generăm 4 ani de date istorice estimate din fundamentalele disponibile
  const seed = stock.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRand(seed + 7);

  const currentYear = 2025;
  const divPerShare = stock.price * stock.divYield / 100;
  // FCF/Share estimat: div / payout * 100, cu variație
  const fcfBase = stock.payout > 0 ? divPerShare / (stock.payout / 100) : divPerShare * 2.5;
  const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];

  const data = years.map((yr, i) => {
    const growthFactor = 1 - (3 - i) * (0.04 + rand() * 0.04);
    const fcf = Math.max(0, fcfBase * growthFactor * (0.9 + rand() * 0.2));
    const div = Math.max(0, divPerShare * growthFactor * (0.92 + rand() * 0.08));
    return { yr, fcf, div };
  });

  const maxVal = Math.max(...data.map(d => Math.max(d.fcf, d.div))) * 1.15 || 1;
  const W = 320, H = 140;
  const PAD = { t: 12, b: 22, l: 34, r: 10 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const barW = (cw / data.length) * 0.36;
  const groupW = cw / data.length;

  const toY = v => PAD.t + ch - (v / maxVal) * ch;
  const toX = i => PAD.l + i * groupW + groupW / 2;

  const fcfPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.fcf).toFixed(1)}`).join(" ");
  const divPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.div).toFixed(1)}`).join(" ");

  const yTicks = [0, maxVal / 2, maxVal];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        {/* Grid + Y labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#21262D" strokeWidth="0.5" />
            <text x={PAD.l - 2} y={toY(v) + 3} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO} textAnchor="end">${v.toFixed(1)}</text>
          </g>
        ))}
        {/* FCF bars */}
        {data.map((d, i) => (
          <rect key={`fcf${i}`}
            x={toX(i) - barW - 1} y={toY(d.fcf)} width={barW} height={ch - (toY(d.fcf) - PAD.t)}
            fill="rgba(46,204,113,0.35)" stroke="#2ECC71" strokeWidth="0.8" rx="1" />
        ))}
        {/* Div bars */}
        {data.map((d, i) => (
          <rect key={`div${i}`}
            x={toX(i) + 1} y={toY(d.div)} width={barW} height={ch - (toY(d.div) - PAD.t)}
            fill="rgba(232,196,104,0.35)" stroke="#E8C468" strokeWidth="0.8" rx="1" />
        ))}
        {/* Lines */}
        <path d={fcfPath} fill="none" stroke="#2ECC71" strokeWidth="2" strokeLinejoin="round" />
        <path d={divPath} fill="none" stroke="#E8C468" strokeWidth="2" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((d, i) => (
          <g key={`dot${i}`}>
            <circle cx={toX(i)} cy={toY(d.fcf)} r={3.5} fill="#2ECC71" stroke={THEME.bg} strokeWidth="1.2" />
            <circle cx={toX(i)} cy={toY(d.div)} r={3.5} fill="#E8C468" stroke={THEME.bg} strokeWidth="1.2" />
          </g>
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={`xl${i}`} x={toX(i)} y={H - 5} fill={THEME.dim} fontSize="8" fontFamily={FONT_MONO} textAnchor="middle">{d.yr}</text>
        ))}
        {/* X axis */}
        <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke="#21262D" strokeWidth="0.8" />
      </svg>
      {/* Payout safety indicator */}
      <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 8, color: THEME.dim, alignItems: "center" }}>
        <span><span style={{ color: THEME.green }}>▮ </span>FCF / Share</span>
        <span><span style={{ color: THEME.gold }}>▮ </span>Div / Share</span>
        <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 8 }}>
          Acoperire:{" "}
          <span style={{ color: stock.payout < 60 ? THEME.green : stock.payout < 80 ? THEME.gold : THEME.red }}>
            {stock.payout > 0 ? `${(100 / stock.payout * 100).toFixed(0)}%` : "N/A"}
          </span>
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 9, color: THEME.dim, fontStyle: "italic" }}>
        * Date estimate pe baza fundamentalelor disponibile
      </div>
    </div>
  );
}

// 3. EVOLUȚIE VENITURI (estimat din mktCap + profitMargin)
function RevenueChart({ stock }) {
  const seed = stock.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRand(seed + 13);

  const currentYear = 2025;
  const estRev = stock.mktCap && stock.profitMargin > 0
    ? (stock.mktCap * 1e9 * stock.profitMargin) / stock.profitMargin // = mktCap * 1B / P/S approx
    : stock.mktCap * 1e9 * 0.5; // rough estimate

  // Estimate revenue from P/S ratio approximation: use mktCap / (P/S ~ 2-5)
  const psRatio = Math.max(1, Math.min(8, (stock.pe || 20) * stock.profitMargin * 10));
  const revBase = (stock.mktCap * 1e9) / psRatio;

  const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
  const data = years.map((yr, i) => {
    const growthFactor = 1 - (3 - i) * (0.05 + rand() * 0.04);
    const rev = Math.max(0.1e9, revBase * growthFactor * (0.93 + rand() * 0.12));
    return { yr, rev: rev / 1e9 }; // in miliarde
  });

  const maxVal = Math.max(...data.map(d => d.rev)) * 1.2 || 1;
  const W = 320, H = 130;
  const PAD = { t: 12, b: 22, l: 38, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const barW = (cw / data.length) * 0.55;
  const groupW = cw / data.length;

  const toY = v => PAD.t + ch - (v / maxVal) * ch;
  const toX = i => PAD.l + i * groupW + groupW / 2;

  const trendPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.rev).toFixed(1)}`).join(" ");

  const yTicks = [0, maxVal / 2, maxVal];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        <defs>
          <linearGradient id={`rev_${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#21262D" strokeWidth="0.5" />
            <text x={PAD.l - 2} y={toY(v) + 3} fill={THEME.dim} fontSize="6.5" fontFamily={FONT_MONO} textAnchor="end">${v.toFixed(1)}B</text>
          </g>
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          const prev = i > 0 ? data[i - 1].rev : d.rev;
          const growing = d.rev >= prev;
          return (
            <rect key={i}
              x={toX(i) - barW / 2} y={toY(d.rev)} width={barW} height={ch - (toY(d.rev) - PAD.t)}
              fill={growing ? "rgba(74,158,255,0.40)" : "rgba(231,76,60,0.30)"}
              stroke={growing ? THEME.blue : THEME.red} strokeWidth="0.8" rx="1" />
          );
        })}
        {/* Trend line */}
        <path d={trendPath} fill="none" stroke={THEME.gold} strokeWidth="2" strokeLinejoin="round" />
        {/* Dots + values */}
        {data.map((d, i) => {
          const prev = i > 0 ? data[i - 1].rev : d.rev;
          const growing = d.rev >= prev;
          return (
            <g key={`rv${i}`}>
              <circle cx={toX(i)} cy={toY(d.rev)} r={3.5} fill={THEME.gold} stroke={THEME.bg} strokeWidth="1.2" />
              <text x={toX(i)} y={toY(d.rev) - 5} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO} textAnchor="middle">${d.rev.toFixed(1)}B</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={`xl${i}`} x={toX(i)} y={H - 5} fill={THEME.dim} fontSize="8" fontFamily={FONT_MONO} textAnchor="middle">{d.yr}</text>
        ))}
        <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke="#21262D" strokeWidth="0.8" />
      </svg>
      <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 8, color: THEME.dim }}>
        <span><span style={{ color: THEME.blue }}>▮ </span>Creștere</span>
        <span><span style={{ color: THEME.red }}>▮ </span>Scădere</span>
        <span><span style={{ color: THEME.gold }}>——</span> Trend</span>
        <span style={{ marginLeft: "auto", fontStyle: "italic" }}>* estimate</span>
      </div>
    </div>
  );
}

// 4. MONITORIZARE BUYBACK (evoluție acțiuni în circulație estimată)
function BuybackChart({ stock }) {
  const seed = stock.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRand(seed + 19);

  const currentYear = 2025;
  // Estimated shares outstanding from mktCap / price
  const sharesNow = stock.mktCap && stock.price ? (stock.mktCap * 1e9) / stock.price : 1e9;

  const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
  // Simulate buyback history — dividend payers tend to reduce shares
  const buybackTrend = stock.divYield > 3 ? -0.015 : stock.divYield > 1 ? -0.008 : 0.005;
  const data = years.map((yr, i) => {
    const factor = 1 + (3 - i) * (-(buybackTrend) + rand() * 0.01 - 0.005);
    return { yr, shares: sharesNow * factor / 1e6 }; // in milioane
  });

  const maxVal = Math.max(...data.map(d => d.shares)) * 1.1 || 1;
  const minVal = Math.min(...data.map(d => d.shares)) * 0.92;
  const range = maxVal - minVal || 1;

  const W = 320, H = 130;
  const PAD = { t: 12, b: 22, l: 42, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const barW = (cw / data.length) * 0.55;
  const groupW = cw / data.length;

  const toY = v => PAD.t + ch - ((v - minVal) / range) * ch;
  const toX = i => PAD.l + i * groupW + groupW / 2;

  const trendPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.shares).toFixed(1)}`).join(" ");
  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#21262D" strokeWidth="0.5" />
            <text x={PAD.l - 2} y={toY(v) + 3} fill={THEME.dim} fontSize="6.5" fontFamily={FONT_MONO} textAnchor="end">{v.toFixed(0)}M</text>
          </g>
        ))}
        {/* Bars cu culoare: verde dacă scade (buyback), roșu dacă crește (dilution) */}
        {data.map((d, i) => {
          const prev = i > 0 ? data[i - 1].shares : d.shares;
          const buyback = d.shares <= prev;
          return (
            <rect key={i}
              x={toX(i) - barW / 2} y={toY(d.shares)} width={barW}
              height={Math.max(1, ch - (toY(d.shares) - PAD.t))}
              fill={buyback ? "rgba(46,204,113,0.35)" : "rgba(231,76,60,0.30)"}
              stroke={buyback ? THEME.green : THEME.red}
              strokeWidth="0.8" rx="1" opacity="0.85" />
          );
        })}
        {/* Trend line */}
        <path d={trendPath} fill="none" stroke="#8B949E" strokeWidth="1.5" strokeDasharray="4,3" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((d, i) => {
          const prev = i > 0 ? data[i - 1].shares : d.shares;
          const buyback = d.shares <= prev;
          return (
            <g key={`bb${i}`}>
              <circle cx={toX(i)} cy={toY(d.shares)} r={3.5} fill={buyback ? THEME.green : THEME.red} stroke={THEME.bg} strokeWidth="1.2" />
              <text x={toX(i)} y={toY(d.shares) - 5} fill={THEME.dim} fontSize="6.5" fontFamily={FONT_MONO} textAnchor="middle">{d.shares.toFixed(0)}M</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={`xl${i}`} x={toX(i)} y={H - 5} fill={THEME.dim} fontSize="8" fontFamily={FONT_MONO} textAnchor="middle">{d.yr}</text>
        ))}
        <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke="#21262D" strokeWidth="0.8" />
      </svg>
      {/* Net change indicator */}
      {(() => {
        const first = data[0].shares;
        const last = data[data.length - 1].shares;
        const chg = ((last - first) / first) * 100;
        const isBuyback = chg < 0;
        return (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 8, color: THEME.dim }}>
            <span>
              <span style={{ color: THEME.green }}>▮ </span>Buyback (scădere){"  "}
              <span style={{ color: THEME.red }}>▮ </span>Diluție (creștere)
            </span>
            <span style={{ fontFamily: FONT_MONO, color: isBuyback ? THEME.green : THEME.red }}>
              {isBuyback ? "▼" : "▲"} {Math.abs(chg).toFixed(1)}% {isBuyback ? "buyback net" : "diluție net"}
            </span>
          </div>
        );
      })()}
      <div style={{ fontSize: 9, color: THEME.dim, fontStyle: "italic", marginTop: 2 }}>
        * Date estimate pe baza capitalizării de piață
      </div>
    </div>
  );
}

// ── TAB 6: DEEP DIVE (FULL) ───────────────────────────────────────────────────
const AV_API_KEY = "X5RO0IYNYQ3CBFSY";

// Seeded pseudo-random for deterministic per-symbol charts
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePriceHistory(symbol, currentPrice, avgCost, beta = 1) {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seededRand(seed);
  const n = 252;
  // Start price ~1 year ago: reverse-engineer from current + realistic drift
  const annualDrift = (currentPrice / avgCost - 1) * 0.4 + 0.08;
  const dailyDrift = annualDrift / 252;
  const vol = 0.012 * Math.max(0.6, Math.min(2.5, beta));
  const prices = [];
  let p = currentPrice * Math.exp(-(dailyDrift * n + vol * Math.sqrt(n) * (rand() - 0.5) * 2));
  for (let i = 0; i < n; i++) {
    const shock = (rand() - 0.5) * vol * 2.5 * Math.sqrt(1);
    const trend = dailyDrift + (rand() < 0.02 ? (rand() - 0.5) * 0.04 : 0); // occasional jumps
    p = p * Math.exp(trend + shock);
    prices.push(p);
  }
  // Anchor last price to actual current price
  const scale = currentPrice / prices[prices.length - 1];
  return prices.map(v => v * scale);
}

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
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function TechnicalChart({ closes, avgCost }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (!closes || closes.length < 26) return null;
  const n = closes.length;
  const W = 320, H = 130;
  const PAD = { t: 10, b: 20, l: 8, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;

  const sma20 = closes.map((_, i) => {
    if (i < 19) return null;
    return closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0) / 20;
  });
  const sma20Valid = sma20.filter(Boolean);

  const allVals = [...closes, ...sma20Valid, avgCost].filter(Boolean);
  const minV = Math.min(...allVals) * 0.997;
  const maxV = Math.max(...allVals) * 1.003;
  const range = maxV - minV || 1;

  const toY = v => PAD.t + ch - ((v - minV) / range) * ch;
  const toX = i => PAD.l + (i / (n - 1)) * cw;

  const closePath = closes.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const fillPath = closePath + ` L${toX(n-1).toFixed(1)},${(PAD.t+ch).toFixed(1)} L${PAD.l},${(PAD.t+ch).toFixed(1)} Z`;

  const smaPoints = sma20.map((v, i) => v !== null ? { x: toX(i), y: toY(v) } : null);
  const smaPath = smaPoints.reduce((acc, pt, i) => {
    if (!pt) return acc;
    const prev = smaPoints.slice(0, i).reverse().find(p => p);
    return acc + `${!prev ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)} `;
  }, "");

  const avgY = avgCost ? toY(avgCost) : null;
  const hprice = hoverIdx !== null ? closes[hoverIdx] : null;
  const hx = hoverIdx !== null ? toX(hoverIdx) : null;
  const hy = hprice ? toY(hprice) : null;

  // Price labels on Y axis
  const yTicks = [minV, (minV + maxV) / 2, maxV].map(v => ({ v, y: toY(v) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width * W;
        const idx = Math.round(((mx - PAD.l) / cw) * (n - 1));
        setHoverIdx(Math.max(0, Math.min(n - 1, idx)));
      }}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = (e.touches[0].clientX - rect.left) / rect.width * W;
        const idx = Math.round(((mx - PAD.l) / cw) * (n - 1));
        setHoverIdx(Math.max(0, Math.min(n - 1, idx)));
      }}
      onTouchEnd={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id={`pg_${closes[0]?.toFixed(0)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <line key={i} x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} stroke="#21262D" strokeWidth="0.6" />
      ))}
      {/* Y tick labels */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.l + 2} y={t.y - 2} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO}>${t.v.toFixed(0)}</text>
      ))}
      {/* Fill */}
      <path d={fillPath} fill={`url(#pg_${closes[0]?.toFixed(0)})`} />
      {/* Close line */}
      <path d={closePath} fill="none" stroke="#4A9EFF" strokeWidth="1.8" strokeLinejoin="round" />
      {/* SMA20 */}
      <path d={smaPath} fill="none" stroke="#E8C468" strokeWidth="1.3" strokeDasharray="4,3" strokeLinejoin="round" />
      {/* Avg cost line */}
      {avgY && (
        <>
          <line x1={PAD.l} y1={avgY} x2={W - PAD.r} y2={avgY} stroke="#E8C46888" strokeWidth="1" strokeDasharray="5,4" />
          <text x={W - PAD.r - 2} y={avgY - 2} fill="#E8C468" fontSize="7" fontFamily={FONT_MONO} textAnchor="end">Avg ${avgCost?.toFixed(0)}</text>
        </>
      )}
      {/* Hover crosshair */}
      {hoverIdx !== null && hx !== null && hy !== null && (
        <>
          <line x1={hx} y1={PAD.t} x2={hx} y2={PAD.t + ch} stroke="#8B949E" strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx={hx} cy={hy} r={3.5} fill="#4A9EFF" stroke={THEME.bg} strokeWidth="1.5" />
          <rect x={Math.min(hx - 28, W - 68)} y={PAD.t} width={60} height={20} rx={3} fill={THEME.surface} stroke={THEME.border} strokeWidth="0.8" />
          <text x={Math.min(hx - 28, W - 68) + 30} y={PAD.t + 13} fill={THEME.text} fontSize="9" fontFamily={FONT_MONO} textAnchor="middle">${hprice?.toFixed(2)}</text>
        </>
      )}
      {/* X axis */}
      <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke={THEME.border} strokeWidth="0.8" />
      {/* X labels */}
      {[0, 63, 126, 189, 251].filter(i => i < n).map((i, k) => {
        const labels = ["1Y", "9M", "6M", "3M", "Now"];
        return <text key={k} x={toX(i)} y={H - 4} fill={THEME.dim} fontSize="7" fontFamily={FONT_MONO} textAnchor="middle">{labels[k]}</text>;
      })}
    </svg>
  );
}

function RSIChart({ closes }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  if (!closes || closes.length < 15) return null;
  const W = 320, H = 60;
  const PAD = { t: 6, b: 12, l: 8, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;

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

  const toX = i => PAD.l + (i / (rsiVals.length - 1)) * cw;
  const toY = v => PAD.t + ch - (v / 100) * ch;
  const path = rsiVals.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const last = rsiVals[rsiVals.length - 1];
  const rsiColor = last > 70 ? "#E74C3C" : last < 30 ? "#2ECC71" : "#E8C468";
  const hval = hoverIdx !== null ? rsiVals[Math.round(hoverIdx / (closes.length - 1) * (rsiVals.length - 1))] : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverIdx(Math.round(((e.clientX - rect.left) / rect.width * W - PAD.l) / cw * (closes.length - 1)));
      }}
      onMouseLeave={() => setHoverIdx(null)}
    >
      {/* Background zones */}
      <rect x={PAD.l} y={PAD.t} width={cw} height={toY(70) - PAD.t} fill="#E74C3C" opacity="0.06" />
      <rect x={PAD.l} y={toY(30)} width={cw} height={ch - (toY(30) - PAD.t)} fill="#2ECC71" opacity="0.06" />
      {/* Zone lines */}
      <line x1={PAD.l} y1={toY(70)} x2={W - PAD.r} y2={toY(70)} stroke="#E74C3C" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />
      <line x1={PAD.l} y1={toY(50)} x2={W - PAD.r} y2={toY(50)} stroke="#8B949E" strokeWidth="0.5" strokeDasharray="2,4" />
      <line x1={PAD.l} y1={toY(30)} x2={W - PAD.r} y2={toY(30)} stroke="#2ECC71" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.7" />
      <path d={path} fill="none" stroke={rsiColor} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Labels */}
      <text x={W - PAD.r - 1} y={toY(70) - 1} fill="#E74C3C" fontSize="7" textAnchor="end" fontFamily={FONT_MONO}>70</text>
      <text x={W - PAD.r - 1} y={toY(30) - 1} fill="#2ECC71" fontSize="7" textAnchor="end" fontFamily={FONT_MONO}>30</text>
      {/* Current RSI */}
      <text x={PAD.l + 2} y={PAD.t + 9} fill={rsiColor} fontSize="9" fontFamily={FONT_MONO} fontWeight="bold">RSI {last.toFixed(1)}</text>
      {/* X axis */}
      <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke={THEME.border} strokeWidth="0.6" />
    </svg>
  );
}

function MACDChart({ closes }) {
  if (!closes || closes.length < 35) return null;
  const W = 320, H = 65;
  const PAD = { t: 6, b: 12, l: 8, r: 8 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;

  const ema = (data, period) => {
    const k = 2 / (period + 1);
    let e = data[0];
    return data.map(v => { e = v * k + e * (1 - k); return e; });
  };
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = ema(macdLine.slice(25), 9);
  const hist = macdLine.slice(34).map((v, i) => v - signalLine[i]);

  const extremeV = Math.max(...hist.map(Math.abs)) * 1.1 || 1;
  const toY = v => PAD.t + ch / 2 - (v / extremeV) * (ch / 2);
  const toX = i => PAD.l + (i / (hist.length - 1)) * cw;
  const barW = Math.max(1, cw / hist.length - 0.5);
  const midY = PAD.t + ch / 2;
  const last = hist[hist.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      {/* Zero line */}
      <line x1={PAD.l} y1={midY} x2={W - PAD.r} y2={midY} stroke="#21262D" strokeWidth="0.8" />
      {/* Bars */}
      {hist.map((v, i) => {
        const x = toX(i);
        const y0 = midY;
        const y1 = toY(v);
        return (
          <rect key={i} x={x} y={Math.min(y0, y1)} width={barW} height={Math.max(0.5, Math.abs(y0 - y1))}
            fill={v >= 0 ? "#2ECC71" : "#E74C3C"} opacity="0.8" />
        );
      })}
      {/* MACD label */}
      <text x={PAD.l + 2} y={PAD.t + 9} fill={last >= 0 ? "#2ECC71" : "#E74C3C"} fontSize="9" fontFamily={FONT_MONO} fontWeight="bold">
        MACD {last >= 0 ? "+" : ""}{last.toFixed(2)}
      </text>
      {/* X axis */}
      <line x1={PAD.l} y1={PAD.t + ch} x2={W - PAD.r} y2={PAD.t + ch} stroke={THEME.border} strokeWidth="0.6" />
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
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: x.good ? THEME.green : THEME.red }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeepDiveTab({ portfolio, totals, focusSymbol }) {
  const [selected, setSelected] = useState(portfolio[0]?.symbol || "");
  const [deepSubTab, setDeepSubTab] = useState("tehnic");

  useEffect(() => {
    if (focusSymbol && portfolio.some(p => p.symbol === focusSymbol)) {
      setSelected(focusSymbol);
      setDeepSubTab("tehnic");
    }
  }, [focusSymbol, portfolio]);

  const s = portfolio.find(p => p.symbol === selected) || portfolio[0];
  if (!s) return null;

  // Generate deterministic realistic price history instantly
  const closes = generatePriceHistory(s.symbol, s.price, s.avgCost, s.beta);
  const returns = closes.slice(1).map((v, i) => ((v - closes[i]) / closes[i]) * 100);

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
    { label: "Profitability", score: Math.min(100, s.profitMargin * 400) },
    { label: "ROE", score: Math.min(100, s.roe * 200) },
    { label: "Stability (β)", score: Math.max(0, 100 - (s.beta - 0.5) * 66) },
    { label: "Valuation (P/E)", score: s.pe > 0 ? Math.max(0, 100 - (s.pe - 10) * 2.5) : 50 },
    { label: "Div. Yield", score: Math.min(100, s.divYield * 12) },
    { label: "Liquidity", score: Math.min(100, s.currentRatio * 40) },
  ];

  const low52 = closes.length > 0 ? Math.min(...closes) : s.price * 0.78;
  const high52 = closes.length > 0 ? Math.max(...closes) : s.price * 1.22;
  const posInRange = ((s.price - low52) / (high52 - low52)) * 100;

  const subTabs = [
    { id: "tehnic", label: "Chart" },
    { id: "financiar", label: "Financials" },
    { id: "risc", label: "Risk" },
    { id: "pozitie", label: "Position" },
  ];

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader>STOCK DEEP DIVE</SectionHeader>

      {/* Selector ticker */}
      <select
        value={selected}
        onChange={e => { setSelected(e.target.value); setDeepSubTab("tehnic"); }}
        style={{ background: THEME.inputBg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 6, padding: "10px 12px", fontSize: 13, fontFamily: FONT_MONO, width: "100%" }}
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
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: THEME.gold, marginTop: 2 }}>{s.symbol} · {s.sector}</div>
          </div>
          <div style={{ textAlign: "right", marginLeft: 10 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 20, color: clr(s.dailyChg) }}>${fmt(s.price)}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: clr(s.dailyChg) }}>{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%</div>
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
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: THEME.text }}>{x.v}</div>
            </div>
          ))}
        </div>
        {/* Sparkline preview */}
        {closes.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <MiniSparkline data={closes} color={closes[closes.length-1] >= closes[0] ? THEME.green : THEME.red} height={40} />
          </div>
        )}

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
            <TechnicalChart closes={closes} avgCost={s.avgCost} />
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
            <RSIChart closes={closes} />
          </Card>

          {/* MACD */}
          <Card>
            <div style={{ fontSize: 9, color: THEME.dim, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>MACD Histogramă (12/26/9)</div>
            <MACDChart closes={closes} />
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
              <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: THEME.gold }}>${fmt(s.price)}</span>
              <span style={{ fontSize: 10, color: THEME.green, textAlign: "right" }}>${high52.toFixed(2)}<br /><span style={{ fontSize: 8, color: THEME.dim }}>52W High</span></span>
            </div>
            <div style={{ height: 10, background: `linear-gradient(to right, ${THEME.red}33, ${THEME.gold}55, ${THEME.green}33)`, borderRadius: 5, position: "relative" }}>
              <div style={{ position: "absolute", left: `${Math.max(0, Math.min(100, posInRange))}%`, top: -3, width: 16, height: 16, background: THEME.gold, borderRadius: "50%", transform: "translateX(-50%)", border: `2px solid ${THEME.bg}` }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: THEME.dim }}>
              Poziție în range: <span style={{ color: THEME.gold, fontFamily: FONT_MONO }}>{Math.max(0, Math.min(100, posInRange)).toFixed(1)}%</span>
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
            <SectionHeader>FINANCIAL SCORECARD</SectionHeader>
            <Card>
              {scorecard.map((item, i) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < scorecard.length - 1 ? `1px solid ${THEME.border}` : "none" }}>
                  <div>
                    <div style={{ fontSize: 12, color: THEME.text }}>{item.label}</div>
                    <div style={{ fontSize: 9, color: THEME.dim }}>{item.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: THEME.gold }}>{item.value}</div>
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
            <SectionHeader>EPS OUTLOOK</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Card accent={THEME.blue}>
                <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>EPS ISTORIC (TTM)</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: THEME.text }}>${(s.pe > 0 ? s.price / s.pe : 0).toFixed(2)}</div>
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
                      <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: clr(growth) }}>${fwdEps.toFixed(2)}</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(growth), marginTop: 4 }}>{sign(growth)}{growth.toFixed(1)}% est.</div>
                    </>
                  );
                })()}
              </Card>
            </div>
          </section>

          {/* Dividend info */}
          {s.divYield > 0 && (
            <section>
              <SectionHeader>DIVIDEND DETAILS</SectionHeader>
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
                      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: x.c || THEME.text }}>{x.v}</div>
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

          {/* ── ISTORICUL PREȚULUI 365 ZILE ── */}
          <section>
            <SectionHeader>PRICE HISTORY</SectionHeader>
            <Card>
              <PriceHistoryChart closes={closes} avgCost={s.avgCost} />
            </Card>
          </section>

          {/* ── CANAL FCF vs DIVIDEND/SHARE ── */}
          {s.divYield > 0 && (
            <section>
              <SectionHeader>FCF VS DIVIDEND</SectionHeader>
              <Card>
                <FCFDividendChart stock={s} />
                <div style={{ marginTop: 10, background: THEME.bg, borderRadius: 6, padding: "8px 10px", borderLeft: `3px solid ${s.payout < 60 ? THEME.green : s.payout < 80 ? THEME.gold : THEME.red}` }}>
                  <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 3 }}>Interpretare Canal FCF</div>
                  <div style={{ fontSize: 10, color: THEME.text }}>
                    {s.payout < 60
                      ? `✓ FCF/Share acoperă confortabil dividendul (payout ${s.payout.toFixed(0)}%). Spațiu de creștere a dividendului.`
                      : s.payout < 80
                      ? `⚠ Payout de ${s.payout.toFixed(0)}% lasă marjă moderată. Monitorizează evoluția FCF.`
                      : `⚠ Payout de ${s.payout.toFixed(0)}% — dividendul consumă cea mai mare parte din FCF. Risc de tăiere dacă FCF scade.`}
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* ── EVOLUȚIE VENITURI ── */}
          <section>
            <SectionHeader>REVENUE TREND</SectionHeader>
            <Card>
              <RevenueChart stock={s} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
                {[
                  { l: "Mkt Cap", v: `$${s.mktCap}B` },
                  { l: "Profit Margin", v: `${(s.profitMargin * 100).toFixed(1)}%`, c: s.profitMargin > 0.15 ? THEME.green : s.profitMargin > 0.05 ? THEME.gold : THEME.red },
                  { l: "ROE", v: `${(s.roe * 100).toFixed(1)}%`, c: s.roe > 0.15 ? THEME.green : s.roe > 0.08 ? THEME.gold : THEME.red },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 5, padding: "6px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: x.c || THEME.text }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* ── MONITORIZARE BUYBACK ── */}
          <section>
            <SectionHeader>BUYBACK TRACKER</SectionHeader>
            <Card>
              <BuybackChart stock={s} />
              <div style={{ marginTop: 10, background: THEME.bg, borderRadius: 6, padding: "8px 10px", borderLeft: `3px solid ${THEME.blue}` }}>
                <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 3 }}>Randament Total Acționar (estimat)</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[
                    { l: "Dividend Yield", v: `${s.divYield.toFixed(2)}%`, c: THEME.gold },
                    { l: "Buyback Yield est.", v: s.divYield > 0 ? `~${(s.divYield * 0.35).toFixed(2)}%` : "N/A", c: THEME.green },
                    { l: "Total Shareholder", v: s.divYield > 0 ? `~${(s.divYield * 1.35).toFixed(2)}%` : "—", c: THEME.blue },
                  ].map(x => (
                    <div key={x.l}>
                      <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: x.c }}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

        </div>
      )}

      {/* ── SUB-TAB: RISC ── */}
      {deepSubTab === "risc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Radar performanță */}
          <section>
            <SectionHeader>PERFORMANCE RADAR</SectionHeader>
            <Card>
              {radarItems.map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: THEME.text }}>{item.label}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: item.score >= 60 ? THEME.green : item.score >= 35 ? THEME.gold : THEME.red }}>
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
            <SectionHeader>RISK METRICS</SectionHeader>
            <Card>
              {returns.length >= 20 ? (
                <VaRDistribution returns={returns} />
              ) : (
                <div style={{ color: THEME.dim, fontSize: 11, textAlign: "center", padding: "20px 0" }}>
                "Date insuficiente pentru analiza de risc"
                </div>
              )}
            </Card>
          </section>

          {/* Factori de risc */}
          <section>
            <SectionHeader>RISK FLAGS</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { cond: s.pe > 35 && s.pe < 500, label: "High Valuation", desc: `P/E ${s.pe.toFixed(1)} is above 35x`, color: THEME.gold },
                { cond: s.payout > 80 && s.divYield > 0 && s.sector !== "Real Estate", label: "Dividend Cut Risk", desc: `${s.payout.toFixed(0)}% payout may be stretched`, color: THEME.red },
                { cond: s.beta > 1.5, label: "High Volatility", desc: `Beta ${s.beta.toFixed(2)} is high versus market`, color: THEME.blue },
                { cond: s.currentRatio < 1 && s.sector !== "Financials", label: "Low Liquidity", desc: `Current Ratio ${s.currentRatio.toFixed(2)} is below 1.0`, color: THEME.red },
                { cond: s.profitMargin < 0, label: "Negative Margin", desc: "Company is operating at a loss", color: THEME.red },
                { cond: (s.value / totals.value) * 100 > 15, label: "High Concentration", desc: `${((s.value/totals.value)*100).toFixed(1)}% portfolio weight`, color: THEME.gold },
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
            <SectionHeader>POSITION DETAILS</SectionHeader>
            <Card accent={THEME.gold}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Market Value", v: fmtUSD(s.value), c: THEME.text },
                  { l: "Invested", v: fmtUSD(s.invested), c: THEME.dim },
                  { l: "Profit Net ($)", v: `${sign(s.profit)}${fmtUSD(s.profit)}`, c: clr(s.profit) },
                  { l: "Return (%)", v: `${sign(s.profitPct)}${fmt(s.profitPct, 2)}%`, c: clr(s.profitPct) },
                  { l: "Shares", v: s.shares, c: THEME.text },
                  { l: "Avg Cost", v: `$${fmt(s.avgCost)}`, c: THEME.text },
                  { l: "Price", v: `$${fmt(s.price)}`, c: clr(s.dailyChg) },
                  { l: "Weight", v: `${fmt((s.value / totals.value) * 100, 2)}%`, c: THEME.gold },
                ].map(x => (
                  <div key={x.l} style={{ background: THEME.bg, borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 8, color: THEME.dim }}>{x.l}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: x.c, marginTop: 2 }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Breakeven analysis */}
          <section>
            <SectionHeader>BREAKEVEN</SectionHeader>
            <Card>
              {(() => {
                const gap = s.price - s.avgCost;
                const gapPct = (gap / s.avgCost) * 100;
                const toBreak = gap < 0 ? Math.abs(gap) : 0;
                const toBreakPct = gap < 0 ? Math.abs(gapPct) : 0;
                return (
                  <>
                    <MetricRow label="Price vs cost" value={`${sign(gap)}$${Math.abs(gap).toFixed(2)}`} color={clr(gap)} />
                    <MetricRow label="Return vs cost" value={`${sign(gapPct)}${gapPct.toFixed(2)}%`} color={clr(gapPct)} />
                    {toBreak > 0 && <MetricRow label="To breakeven" value={`+$${toBreak.toFixed(2)} (+${toBreakPct.toFixed(1)}%)`} color={THEME.gold} />}
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
            <SectionHeader>DCA SCENARIOS</SectionHeader>
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
                      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.gold }}>${cap}</div>
                      <div style={{ fontSize: 9, color: THEME.dim }}>+{newShares} acț · nou avg ${fmt(newAvg)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: clr(newProfit) }}>{sign(newProfit)}${Math.abs(newProfit).toFixed(0)}</div>
                      <div style={{ fontSize: 9, color: THEME.dim }}>{totalShares} acț total</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </section>

          {/* Evoluție zilnică vs portofoliu */}
          <section>
            <SectionHeader>DAILY CONTRIBUTION</SectionHeader>
            <Card>
              {(() => {
                const stockDailyUSD = s.prevValue * (s.dailyChg / 100);
                const portDailyUSD = totals.value - totals.prevValue;
                const contribution = portDailyUSD !== 0 ? (stockDailyUSD / portDailyUSD) * 100 : 0;
                return (
                  <>
                    <MetricRow label="Stock move ($)" value={`${sign(stockDailyUSD)}$${Math.abs(stockDailyUSD).toFixed(2)}`} color={clr(stockDailyUSD)} />
                    <MetricRow label="Daily change (%)" value={`${sign(s.dailyChg)}${fmt(s.dailyChg, 2)}%`} color={clr(s.dailyChg)} />
                    <MetricRow label="Portfolio impact" value={`${sign(contribution)}${Math.abs(contribution).toFixed(1)}%`} color={clr(contribution)} />
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: THEME.dim, marginBottom: 4 }}>Contribution to today's move</div>
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
function AlerteTab({ portfolio, alerts, setAlerts }) {
  const triggered = portfolio.filter(s => {
    const a = alerts[s.symbol] || {};
    return (a.buy > 0 && s.price <= a.buy) || (a.sell > 0 && s.price >= a.sell);
  });

  return (
    <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader>PRICE ALERTS</SectionHeader>

      {triggered.length > 0 && (
        <Card accent={THEME.gold}>
          <div style={{ fontSize: 10, color: THEME.gold, marginBottom: 8 }}>🔔 ALERTE ACTIVE</div>
          {triggered.map(s => {
            const a = alerts[s.symbol];
            const isBuy = a.buy > 0 && s.price <= a.buy;
            return (
              <div key={s.symbol} style={{ padding: "6px 0", borderBottom: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: isBuy ? THEME.green : THEME.red }}>
                  {isBuy ? "▲ BUY" : "▼ SELL"} {s.symbol}
                </span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.text }}>${fmt(s.price)}</span>
              </div>
            );
          })}
        </Card>
      )}

      <div style={{ fontSize: 10, color: THEME.dim, marginBottom: -8 }}>Use 0 to disable an alert</div>

      {portfolio.map(s => {
        const a = alerts[s.symbol] || { buy: 0, sell: 0 };
                const status = a.buy > 0 && s.price <= a.buy ? "▲ BUY TRIGGERED" :
                       a.sell > 0 && s.price >= a.sell ? "▼ SELL TRIGGERED" :
                       (a.buy > 0 || a.sell > 0) ? "◉ Armed" : "— Inactive";
        const statusColor = status.includes("BUY") ? THEME.green : status.includes("SELL") ? THEME.red : status.includes("Armat") ? THEME.gold : THEME.dim;

        return (
          <Card key={s.symbol}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: THEME.gold }}>{s.symbol}</span>
                <span style={{ fontSize: 10, color: THEME.dim, marginLeft: 8 }}>Live: ${fmt(s.price)}</span>
              </div>
              <span style={{ fontSize: 10, color: statusColor }}>{status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: THEME.green, marginBottom: 3 }}>BUY BELOW $</div>
                <input
                  type="number"
                  value={a.buy || ""}
                  onChange={e => setAlerts(prev => ({ ...prev, [s.symbol]: { ...prev[s.symbol], buy: parseFloat(e.target.value) || 0 } }))}
                  placeholder="0.00"
                  style={{ width: "100%", background: THEME.inputBg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 5, padding: "6px 8px", fontSize: 12, fontFamily: FONT_MONO, boxSizing: "border-box" }}
                  min={0} step={0.5}
                />
              </div>
              <div>
                <div style={{ fontSize: 9, color: THEME.red, marginBottom: 3 }}>SELL ABOVE $</div>
                <input
                  type="number"
                  value={a.sell || ""}
                  onChange={e => setAlerts(prev => ({ ...prev, [s.symbol]: { ...prev[s.symbol], sell: parseFloat(e.target.value) || 0 } }))}
                  placeholder="0.00"
                  style={{ width: "100%", background: THEME.inputBg, border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: 5, padding: "6px 8px", fontSize: 12, fontFamily: FONT_MONO, boxSizing: "border-box" }}
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
  const [isDark, setIsDark] = useState(true);
  const [sheetStock, setSheetStock] = useState(null);
  const [deepDiveFocus, setDeepDiveFocus] = useState(null);
  const [alerts, setAlerts] = useState(() => {
    const a = {};
    PORTFOLIO_DATA.forEach(s => { a[s.symbol] = { buy: 0, sell: 0 }; });
    return a;
  });

  // Keep module-level THEME in sync so helper fns (clr, etc.) always have current colors
  THEME = isDark ? DARK : LIGHT;

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);

  const symbols = PORTFOLIO_DATA.map(s => s.symbol);
  const { quotes, status, lastUpdate, refresh } = useLiveQuotes(symbols);

  const portfolio = calcPortfolio(quotes);

  const totals = {
    value:     portfolio.reduce((a, s) => a + s.value, 0),
    prevValue: portfolio.reduce((a, s) => a + s.prevValue, 0),
    invested:  portfolio.reduce((a, s) => a + s.invested, 0),
    profit:    portfolio.reduce((a, s) => a + s.profit, 0),
    divIncome: portfolio.reduce((a, s) => a + s.annualDiv, 0),
  };
  totals.dailyChgUSD = totals.value - totals.prevValue;
  totals.dailyChgPct = (totals.dailyChgUSD / totals.prevValue) * 100;

  const alertCount = portfolio.filter(s => {
    const a = alerts[s.symbol] || {};
    return (a.buy > 0 && s.price <= a.buy) || (a.sell > 0 && s.price >= a.sell);
  }).length;

  const liveCount = portfolio.filter(s => s.isLive).length;

  const openStockSheet = useCallback((stock) => setSheetStock(stock), []);
  const openDeepDive = useCallback((symbol) => {
    setSheetStock(null);
    setDeepDiveFocus(symbol);
    setTab("deepdive");
  }, []);

  return (
    <ThemeCtx.Provider value={{ isDark, toggleTheme }}>
      <div style={{
        background: THEME.bg, minHeight: "100vh", color: THEME.text,
        fontFamily: FONT_SANS, maxWidth: 480,
        margin: "0 auto", paddingBottom: 72,
        transition: "background 0.25s, color 0.25s",
      }}>
        <TopBar onRefresh={refresh} liveStatus={status} lastUpdate={lastUpdate} />

        {/* Live coverage banner */}
        {status === "live" && liveCount < symbols.length && (
          <div style={{ background: `${THEME.gold}18`, borderBottom: `1px solid ${THEME.gold}44`, padding: "6px 14px", fontSize: 10, color: THEME.gold, fontFamily: FONT_MONO }}>
            ⚡ {liveCount}/{symbols.length} tickere actualizate live · restul din cache
          </div>
        )}
        {status === "error" && (
          <div style={{ background: `${THEME.red}18`, borderBottom: `1px solid ${THEME.red}44`, padding: "6px 14px", fontSize: 10, color: THEME.red, fontFamily: FONT_MONO }}>
            ⚠ Date live indisponibile (CORS / rată depășită) · se afișează date demo
          </div>
        )}

        <SummaryMetrics totals={totals} />

        <div style={{ paddingTop: 8 }} />

        {tab === "matrice"   && <MatriceTab   portfolio={portfolio} totals={totals} onStockSelect={openStockSheet} />}
        {tab === "diagnoza"  && <DiagTab      portfolio={portfolio} totals={totals} />}
        {tab === "fluxuri"   && <FluxTab      portfolio={portfolio} />}
        {tab === "rebal"     && <RebalTab     portfolio={portfolio} totals={totals} />}
        {tab === "watchlist" && <WatchlistTab portfolio={portfolio} totals={totals} onStockSelect={openStockSheet} />}
        {tab === "deepdive"  && <DeepDiveTab  portfolio={portfolio} totals={totals} focusSymbol={deepDiveFocus} />}
        {tab === "alerte"    && <AlerteTab    portfolio={portfolio} alerts={alerts} setAlerts={setAlerts} />}

        <StockDetailSheet stock={sheetStock} totals={totals} onClose={() => setSheetStock(null)} onDeepDive={openDeepDive} />
        <BottomNav active={tab} onChange={setTab} alertCount={alertCount} />
      </div>
    </ThemeCtx.Provider>
  );
}


