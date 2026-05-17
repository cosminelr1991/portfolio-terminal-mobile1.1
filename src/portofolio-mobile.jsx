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
// Live quotes are fetched through the Vercel API proxy to avoid browser CORS limits.
async function fetchYahooQuotes(symbols) {
  const joined = symbols.join(",");
  const url = `/api/quotes?symbols=${encodeURIComponent(joined)}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.quotes && Object.keys(data.quotes).length > 0 ? data.quotes : null;
  } catch (e) {
    console.warn("Live quote fetch failed:", e.message);
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
