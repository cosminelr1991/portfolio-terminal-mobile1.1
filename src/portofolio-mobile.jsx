import React, { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

// â”€â”€ THEME SYSTEM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// Module-level mutable â€” lets helper fns (clr etc.) read current theme without prop drilling
let THEME = { ...DARK };

// â”€â”€ LIVE QUOTES HOOK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Yahoo Finance query2 â€” funcÈ›ioneazÄƒ direct din browser fÄƒrÄƒ CORS issues
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
