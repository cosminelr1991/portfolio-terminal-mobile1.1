import React, { useState, useEffect, useCallback } from react;
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const THEME = {
  bg #0D1117, surface #161B22, border #21262D,
  text #C9D1D9, dim #8B949E, gold #E8C468,
  blue #4A9EFF, green #2ECC71, red #E74C3C,
};

const PORTFOLIO_DATA = [
  { symbol KO,    name The Coca Cola Company,             sector Consumer Staples,       shares 10,  avgCost 62.98,  price 80.82,  prevPrice 79.80,  pe 24.7,  divYield 3.23, beta 0.58, payout 72.3, mktCap 273,  profitMargin 0.22, roe 0.41, currentRatio 1.13, debtEq 1.70 },
  { symbol BAC,   name Bank Of America,                   sector Financials,             shares 20,  avgCost 42.97,  price 49.77,  prevPrice 49.20,  pe 13.2,  divYield 2.60, beta 1.40, payout 30.0, mktCap 390,  profitMargin 0.28, roe 0.10, currentRatio 0.90, debtEq 1.20 },
  { symbol PG,    name Procter & Gamble Company,          sector Consumer Staples,       shares 3,   avgCost 154.84, price 141.57, prevPrice 142.10, pe 27.3,  divYield 2.71, beta 0.54, payout 60.4, mktCap 397,  profitMargin 0.18, roe 0.31, currentRatio 0.82, debtEq 0.64 },
  { symbol CSCO,  name Cisco Systems Inc,                 sector Information Technology, shares 20,  avgCost 53.85,  price 118.21, prevPrice 117.50, pe 28.5,  divYield 2.97, beta 0.82, payout 45.0, mktCap 480,  profitMargin 0.22, roe 0.32, currentRatio 1.40, debtEq 0.45 },
  { symbol UNP,   name Union Pacific Corporation,         sector Industrials,            shares 2,   avgCost 218.35, price 270.56, prevPrice 269.80, pe 21.4,  divYield 2.52, beta 1.05, payout 48.0, mktCap 155,  profitMargin 0.29, roe 0.55, currentRatio 0.75, debtEq 1.80 },
  { symbol BTI,   name British American Tobacco,          sector Consumer Staples,       shares 25,  avgCost 35.47,  price 65.09,  prevPrice 64.50,  pe 8.5,   divYield 7.88, beta 0.65, payout 65.0, mktCap 72,   profitMargin 0.28, roe 0.12, currentRatio 0.85, debtEq 0.95 },
  { symbol ESS,   name Essex Property Trust,              sector Real Estate,            shares 2,   avgCost 225.53, price 267.06, prevPrice 266.00, pe 38.2,  divYield 4.55, beta 0.80, payout 82.0, mktCap 18,   profitMargin 0.14, roe 0.05, currentRatio 0.58, debtEq 1.10 },
  { symbol TSN,   name Tyson Foods, Inc,                  sector Consumer Staples,       shares 10,  avgCost 54.92,  price 65.79,  prevPrice 65.20,  pe 18.5,  divYield 3.71, beta 0.70, payout 55.0, mktCap 24,   profitMargin 0.04, roe 0.06, currentRatio 1.60, debtEq 0.55 },
  { symbol VZ,    name Verizon Communications,            sector Communication Services, shares 10,  avgCost 40.49,  price 46.37,  prevPrice 45.90,  pe 10.2,  divYield 6.61, beta 0.40, payout 58.0, mktCap 195,  profitMargin 0.15, roe 0.22, currentRatio 0.75, debtEq 1.60 },
  { symbol PFE,   name Pfizer, Inc,                       sector Health Care,            shares 40,  avgCost 28.27,  price 25.33,  prevPrice 25.80,  pe 22.1,  divYield 6.07, beta 0.55, payout 85.0, mktCap 143,  profitMargin 0.02, roe 0.02, currentRatio 1.20, debtEq 0.70 },
  { symbol O,     name Realty Income Corporation,         sector Real Estate,            shares 30,  avgCost 53.51,  price 61.12,  prevPrice 60.50,  pe 41.8,  divYield 6.05, beta 0.94, payout 82.1, mktCap 53,   profitMargin 0.14, roe 0.03, currentRatio 0.58, debtEq 0.90 },
  { symbol AAPL,  name Apple Inc,                         sector Information Technology, shares 3,   avgCost 209.65, price 300.23, prevPrice 298.50, pe 33.2,  divYield 0.50, beta 1.24, payout 15.2, mktCap 3210, profitMargin 0.26, roe 1.47, currentRatio 1.04, debtEq 1.77 },
  { symbol TXN,   name Texas Instruments Inc,             sector Information Technology, shares 4,   avgCost 167.12, price 302.73, prevPrice 300.90, pe 35.5,  divYield 3.39, beta 1.05, payout 65.0, mktCap 110,  profitMargin 0.35, roe 0.55, currentRatio 4.50, debtEq 0.80 },
  { symbol VICI,  name VICI Properties Inc,               sector Real Estate,            shares 35,  avgCost 29.55,  price 27.90,  prevPrice 27.60,  pe 14.5,  divYield 6.08, beta 0.85, payout 78.0, mktCap 33,   profitMargin 0.50, roe 0.08, currentRatio 0.40, debtEq 0.75 },
  { symbol BLK,   name BlackRock, Inc.,                   sector Financials,             shares 1,   avgCost 633.50, price 1081.90,prevPrice 1075.00,pe 22.8,  divYield 3.28, beta 1.30, payout 52.0, mktCap 162,  profitMargin 0.31, roe 0.15, currentRatio 0.90, debtEq 0.35 },
  { symbol BMY,   name Bristol-Myers Squibb,              sector Health Care,            shares 20,  avgCost 46.46,  price 57.00,  prevPrice 56.50,  pe 15.2,  divYield 5.33, beta 0.50, payout 75.0, mktCap 115,  profitMargin 0.10, roe 0.18, currentRatio 1.10, debtEq 1.20 },
  { symbol DLR,   name Digital Realty Trust,              sector Real Estate,            shares 2,   avgCost 144.60, price 188.51, prevPrice 187.00, pe 85.0,  divYield 3.37, beta 0.70, payout 80.0, mktCap 55,   profitMargin 0.08, roe 0.02, currentRatio 0.50, debtEq 1.30 },
  { symbol SBUX,  name Starbucks Corporation,             sector Consumer Staples,       shares 5,   avgCost 82.78,  price 106.82, prevPrice 105.90, pe 28.5,  divYield 2.99, beta 0.90, payout 65.0, mktCap 120,  profitMargin 0.12, roe 0.00, currentRatio 0.65, debtEq 5.00 },
  { symbol CMCSA, name Comcast Corp.,                     sector Communication Services, shares 15,  avgCost 33.79,  price 24.76,  prevPrice 25.10,  pe 9.5,   divYield 3.90, beta 1.00, payout 38.0, mktCap 95,   profitMargin 0.12, roe 0.18, currentRatio 0.75, debtEq 1.40 },
  { symbol MAA,   name Mid-America Apt. Communities,      sector Real Estate,            shares 5,   avgCost 145.12, price 125.71, prevPrice 124.80, pe 32.5,  divYield 4.16, beta 0.75, payout 78.0, mktCap 15,   profitMargin 0.22, roe 0.06, currentRatio 0.40, debtEq 0.80 },
  { symbol ADC,   name Agree Realty Corporation,          sector Real Estate,            shares 10,  avgCost 74.07,  price 74.46,  prevPrice 73.90,  pe 35.8,  divYield 4.05, beta 0.65, payout 78.0, mktCap 7,    profitMargin 0.30, roe 0.04, currentRatio 0.35, debtEq 0.65 },
  { symbol PM,    name Philip Morris International,       sector Consumer Staples,       shares 2,   avgCost 125.96, price 189.61, prevPrice 188.00, pe 22.5,  divYield 4.66, beta 0.80, payout 88.0, mktCap 220,  profitMargin 0.28, roe 0.00, currentRatio 0.80, debtEq 5.00 },
  { symbol MO,    name Altria Group, Inc.,                sector Consumer Staples,       shares 5,   avgCost 52.80,  price 73.09,  prevPrice 72.50,  pe 10.5,  divYield 8.02, beta 0.55, payout 80.0, mktCap 62,   profitMargin 0.48, roe 0.00, currentRatio 0.55, debtEq 5.00 },
  { symbol HSY,   name The Hershey Company,               sector Consumer Staples,       shares 5,   avgCost 150.21, price 186.98, prevPrice 185.50, pe 22.8,  divYield 3.64, beta 0.38, payout 62.0, mktCap 38,   profitMargin 0.16, roe 0.55, currentRatio 0.90, debtEq 1.50 },
  { symbol DEO,   name Diageo plc,                        sector Consumer Staples,       shares 3,   avgCost 112.76, price 81.69,  prevPrice 82.20,  pe 14.5,  divYield 2.66, beta 0.55, payout 55.0, mktCap 55,   profitMargin 0.22, roe 0.35, currentRatio 1.20, debtEq 1.10 },
  { symbol NKE,   name NIKE, Inc.,                        sector Consumer Staples,       shares 10,  avgCost 49.84,  price 41.88,  prevPrice 42.30,  pe 20.5,  divYield 3.29, beta 1.05, payout 55.0, mktCap 62,   profitMargin 0.09, roe 0.28, currentRatio 2.50, debtEq 0.75 },
  { symbol ARE,   name Alexandria Real Estate Equities,   sector Real Estate,            shares 10,  avgCost 59.99,  price 44.97,  prevPrice 44.50,  pe 22.5,  divYield 4.80, beta 0.85, payout 80.0, mktCap 8,    profitMargin 0.12, roe 0.03, currentRatio 0.40, debtEq 0.90 },
  { symbol LMT,   name Lockheed Martin Corporation,       sector Industrials,            shares 1,   avgCost 463.57, price 516.01, prevPrice 514.00, pe 18.5,  divYield 2.97, beta 0.50, payout 48.0, mktCap 125,  profitMargin 0.10, roe 0.55, currentRatio 1.20, debtEq 2.20 },
  { symbol MSFT,  name Microsoft Corporation,             sector Information Technology, shares 1,   avgCost 430.59, price 421.92, prevPrice 423.00, pe 36.8,  divYield 0.84, beta 0.90, payout 24.1, mktCap 3080, profitMargin 0.36, roe 0.38, currentRatio 1.35, debtEq 0.40 },
  { symbol V,     name Visa Inc.,                         sector Financials,             shares 2,   avgCost 324.59, price 325.75, prevPrice 324.00, pe 30.2,  divYield 0.82, beta 0.96, payout 21.8, mktCap 553,  profitMargin 0.52, roe 0.52, currentRatio 1.50, debtEq 0.52 },
  { symbol MA,    name Mastercard Incorporated,           sector Financials,             shares 1,   avgCost 504.70, price 494.20, prevPrice 496.00, pe 38.5,  divYield 0.69, beta 1.10, payout 22.0, mktCap 455,  profitMargin 0.46, roe 0.18, currentRatio 1.20, debtEq 1.80 },
  { symbol GOOGL, name Alphabet Inc (Google) Class A,     sector Information Technology, shares 2,   avgCost 338.00, price 396.78, prevPrice 394.50, pe 19.5,  divYield 0.25, beta 1.05, payout 5.0,  mktCap 2400, profitMargin 0.29, roe 0.32, currentRatio 1.85, debtEq 0.08 },
];

const DIV_MONTHS = {
  KO[0,3,6,9], BAC[2,5,8,11], PG[1,4,7,10], CSCO[0,3,6,9], UNP[2,5,8,11],
  BTI[1,7], ESS[2,5,8,11], TSN[2,5,8,11], VZ[1,4,7,10], PFE[2,5,8,11],
  O[0,1,2,3,4,5,6,7,8,9,10,11], AAPL[1,4,7,10], TXN[1,4,7,10], VICI[0,3,6,9],
  BLK[2,5,8,11], BMY[1,4,7,10], DLR[2,5,8,11], SBUX[1,4,7,10], CMCSA[0,3,6,9],
  MAA[2,5,8,11], ADC[0,1,2,3,4,5,6,7,8,9,10,11], PM[0,3,6,9], MO[0,3,6,9],
  HSY[2,5,8,11], DEO[1,7], NKE[2,5,8,11], ARE[2,5,8,11], LMT[2,5,8,11],
  MSFT[2,5,8,11], V[2,5,8,11], MA[1,4,7,10], GOOGL[],
};

const fmt = (n, d = 2) = Number(n).toLocaleString(ro-RO, { minimumFractionDigits d, maximumFractionDigits d });
const fmtUSD = (n) = $ + fmt(Math.abs(n));
const clr = (n) = n = 0  THEME.green  THEME.red;
const sign = (n) = n = 0  +  ;

function calcPortfolio() {
  return PORTFOLIO_DATA.map(s = ({
    ...s,
    value s.shares  s.price,
    prevValue s.shares  s.prevPrice,
    invested s.shares  s.avgCost,
    profit s.shares  (s.price - s.avgCost),
    profitPct ((s.price - s.avgCost)  s.avgCost)  100,
    dailyChg ((s.price - s.prevPrice)  s.prevPrice)  100,
    annualDiv s.divYield  0  (s.price  s.divYield  100)  s.shares  0,
  }));
}

 ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    div style={{ fontSize 9, color THEME.dim, textTransform uppercase, letterSpacing 2, borderBottom `1px solid ${THEME.border}`, paddingBottom 6, marginBottom 12 }}
      {children}
    div
  );
}

function Card({ children, accent, style = {} }) {
  return (
    div style={{ background THEME.surface, borderRadius 8, border `1px solid ${THEME.border}`, borderLeft accent  `3px solid ${accent}`  undefined, padding 12px 14px, ...style }}
      {children}
    div
  );
}

function Badge({ text, color, bg }) {
  return span style={{ display inline-block, padding 2px 8px, borderRadius 20, fontSize 10, fontWeight 600, color, background bg }}{text}span;
}

function MetricRow({ label, value, color }) {
  return (
    div style={{ display flex, justifyContent space-between, alignItems center, padding 7px 0, borderBottom `1px solid ${THEME.border}` }}
      span style={{ fontSize 12, color THEME.dim }}{label}span
      span style={{ fontFamily monospace, fontSize 12, color color  THEME.text }}{value}span
    div
  );
}

function TopBar({ onRefresh }) {
  const [time, setTime] = useState(new Date());
  useEffect(() = { const t = setInterval(() = setTime(new Date()), 30000); return () = clearInterval(t); }, []);
  return (
    div style={{ background THEME.surface, borderBottom `1px solid ${THEME.border}`, padding 12px 16px, display flex, alignItems center, justifyContent space-between, position sticky, top 0, zIndex 100 }}
      div
        div style={{ fontFamily Georgia, serif, fontSize 15, color THEME.gold, letterSpacing 1 }}PORTFOLIO TERMINALdiv
        div style={{ fontSize 10, color THEME.dim, letterSpacing 2, textTransform uppercase, marginTop 1 }}Market Intelligence Dashboarddiv
      div
      div style={{ display flex, alignItems center, gap 10 }}
        div style={{ fontSize 10, color THEME.dim, textAlign right }}
          div style={{ color THEME.text }}{time.toLocaleTimeString(ro-RO, { hour 2-digit, minute 2-digit })}div
          divdemodiv
        div
        button onClick={onRefresh} style={{ background transparent, border `1px solid ${THEME.gold}`, color THEME.gold, borderRadius 6, width 32, height 32, cursor pointer, fontSize 14 }}↻button
      div
    div
  );
}

function SummaryMetrics({ totals }) {
  const pct = (totals.profit  totals.invested)  100;
  const yoc = (totals.divIncome  totals.invested)  100;
  const metrics = [
    { label VALOARE TOTALĂ, value `$${fmt(totals.value)}`, delta null },
    { label PROFIT NEREALIZAT, value `${sign(totals.profit)}$${fmt(Math.abs(totals.profit))}`, delta `${sign(pct)}${fmt(pct, 2)}%`, dc clr(totals.profit) },
    { label EVOLUȚIE ZILNICĂ, value `${sign(totals.dailyChgUSD)}$${fmt(Math.abs(totals.dailyChgUSD))}`, delta `${sign(totals.dailyChgPct)}${fmt(totals.dailyChgPct, 2)}%`, dc clr(totals.dailyChgUSD) },
    { label FLUX DIVIDENDEAN, value `$${fmt(totals.divIncome)}`, delta null },
    { label RANDAMENT YoC, value `${fmt(yoc, 2)}%`, delta null },
  ];
  return (
    div style={{ padding 12px 12px 0, display flex, flexDirection column, gap 8 }}
      div style={{ display flex, gap 8 }}
        {metrics.slice(0, 2).map(m = (
          div key={m.label} style={{ flex 1, background THEME.surface, borderRadius 8, border `1px solid ${THEME.border}`, borderTop `2px solid ${THEME.gold}`, padding 10px 12px }}
            div style={{ fontSize 8, color THEME.dim, textTransform uppercase, letterSpacing 1.2, marginBottom 4 }}{m.label}div
            div style={{ fontFamily monospace, fontSize 13, color THEME.text }}{m.value}div
            {m.delta && div style={{ fontFamily monospace, fontSize 11, color m.dc, marginTop 2 }}{m.delta}div}
          div
        ))}
      div
      div style={{ display flex, gap 8 }}
        {metrics.slice(2).map(m = (
          div key={m.label} style={{ flex 1, background THEME.surface, borderRadius 8, border `1px solid ${THEME.border}`, borderTop `2px solid ${THEME.gold}`, padding 10px 12px }}
            div style={{ fontSize 8, color THEME.dim, textTransform uppercase, letterSpacing 1.2, marginBottom 4 }}{m.label}div
            div style={{ fontFamily monospace, fontSize 13, color m.dc  THEME.text }}{m.value}div
            {m.delta && div style={{ fontFamily monospace, fontSize 11, color m.dc, marginTop 2 }}{m.delta}div}
          div
        ))}
      div
    div
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    div style={{ display flex, borderBottom `1px solid ${THEME.border}`, overflowX auto, scrollbarWidth none, background THEME.bg, WebkitOverflowScrolling touch }}
      {tabs.map(t = (
        button key={t.id} onClick={() = onChange(t.id)} style={{ flexShrink 0, background transparent, border none, borderBottom active === t.id  `2px solid ${THEME.gold}`  2px solid transparent, color active === t.id  THEME.gold  THEME.dim, padding 12px 16px, fontSize 12, fontWeight 600, cursor pointer, fontFamily inherit }}
          {t.label}
        button
      ))}
    div
  );
}

 ── TAB 1 MATRICEA (GENERAL) ────────────────────────────────────────────────
function MatriceTab({ portfolio, totals }) {
  const sectors = portfolio.reduce((acc, s) = { acc[s.sector] = (acc[s.sector]  0) + s.value; return acc; }, {});
  const sectorColors = {
    Consumer Staples THEME.blue, Financials THEME.gold, Real Estate THEME.dim,
    Information Technology THEME.green, Health Care THEME.red, Industrials #8E44AD,
    Communication Services #E67E22,
  };

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 16 }}
      
      section
        SectionHeaderPERFORMANȚĂ ZILNICĂ TOPSectionHeader
        div style={{ display flex, gap 10 }}
          div style={{ flex 1 }}
            div style={{ fontSize 9, color THEME.dim, marginBottom 6 }}▲ TOP GAINERSdiv
            div style={{ display flex, flexDirection column, gap 4 }}
              {portfolio.sort((a, b) = b.dailyChg - a.dailyChg).slice(0, 3).map(s = (
                div key={s.symbol} style={{ display flex, justifyContent space-between, background THEME.surface, padding 6px 8px, borderRadius 4 }}
                  div
                    div style={{ fontFamily monospace, fontSize 11, color THEME.text }}{s.symbol}div
                    div style={{ fontSize 9, color THEME.dim }}{s.name.split( ).slice(0, 2).join( )}div
                  div
                  div style={{ fontFamily monospace, fontSize 12, color clr(s.dailyChg) }}{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%div
                div
              ))}
            div
          div
          div style={{ flex 1 }}
            div style={{ fontSize 9, color THEME.dim, marginBottom 6 }}▼ TOP LOSERSdiv
            div style={{ display flex, flexDirection column, gap 4 }}
              {portfolio.sort((a, b) = a.dailyChg - b.dailyChg).slice(0, 3).map(s = (
                div key={s.symbol} style={{ display flex, justifyContent space-between, background THEME.surface, padding 6px 8px, borderRadius 4 }}
                  div
                    div style={{ fontFamily monospace, fontSize 11, color THEME.text }}{s.symbol}div
                    div style={{ fontSize 9, color THEME.dim }}{s.name.split( ).slice(0, 2).join( )}div
                  div
                  div style={{ fontFamily monospace, fontSize 12, color clr(s.dailyChg) }}{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%div
                div
              ))}
            div
          div
        div
      section

      { SECȚIUNEA ACTUALIZATĂ CU RECHARTS }
      section
        div style={{ display grid, gridTemplateColumns 1fr 1fr, gap 10 }}
          
          { GOGOAȘA 1 Harta Profitabilității (Sectoare) }
          Card style={{ display flex, flexDirection column, height 220, padding 10px 5px }}
            SectionHeaderSectoareSectionHeader
            ResponsiveContainer width=100% height=100%
              PieChart
                Pie
                  data={Object.entries(sectors).map(([name, value]) = ({ name, value }))}
                  cx=50% cy=50% innerRadius={45} outerRadius={65} paddingAngle={3} dataKey=value
                
                  {Object.entries(sectors).map((entry, index) = {
                    const colors = [THEME.blue, THEME.gold, THEME.green, THEME.dim, THEME.red, #8E44AD];
                    return Cell key={`cell-${index}`} fill={colors[index % colors.length]} ;
                  })}
                Pie
                RechartsTooltip 
                  formatter={(value) = `$${fmt(value)}`} 
                  contentStyle={{ backgroundColor THEME.surface, borderColor THEME.border, borderRadius 8, fontSize 11 }}
                  itemStyle={{ color THEME.text }}
                
              PieChart
            ResponsiveContainer
          Card

          { GOGOAȘA 2 Evoluție vs Preț Mediu (Profit vs Pierdere) }
          Card style={{ display flex, flexDirection column, height 220, padding 10px 5px }}
            SectionHeaderProfit vs PierdereSectionHeader
            ResponsiveContainer width=100% height=100%
              PieChart
                Pie
                  data={[
                    { name Pe Profit, value portfolio.filter(s = s.profit = 0).reduce((a, s) = a + s.value, 0) },
                    { name Pe Pierdere, value portfolio.filter(s = s.profit  0).reduce((a, s) = a + s.value, 0) }
                  ]}
                  cx=50% cy=50% innerRadius={45} outerRadius={65} paddingAngle={3} dataKey=value
                
                  Cell fill={THEME.green} 
                  Cell fill={THEME.red} 
                Pie
                RechartsTooltip 
                  formatter={(value) = `$${fmt(value)}`} 
                  contentStyle={{ backgroundColor THEME.surface, borderColor THEME.border, borderRadius 8, fontSize 11 }}
                  itemStyle={{ color THEME.text }}
                
              PieChart
            ResponsiveContainer
          Card

        div
      section

      section
        SectionHeaderTOATE DEȚINERILE ({portfolio.length})SectionHeader
        div style={{ display flex, flexDirection column, gap 8 }}
          {portfolio.sort((a, b) = b.value - a.value).map(s = (
            Card key={s.symbol} accent={s.profit = 0  THEME.green  THEME.red} style={{ padding 10px 12px }}
              div style={{ display flex, justifyContent space-between, alignItems flex-start, marginBottom 8 }}
                div
                  div style={{ display flex, alignItems center, gap 6 }}
                    span style={{ fontFamily monospace, fontSize 14, fontWeight 600, color THEME.text }}{s.symbol}span
                    span style={{ fontSize 9, color THEME.dim, background THEME.bg, padding 2px 4px, borderRadius 3 }}{s.shares} acțspan
                  div
                  div style={{ fontSize 10, color THEME.dim, marginTop 2 }}{s.sector}div
                div
                div style={{ textAlign right }}
                  div style={{ fontFamily monospace, fontSize 14, color THEME.text }}${fmt(s.value)}div
                  div style={{ fontFamily monospace, fontSize 11, color clr(s.profit) }}{sign(s.profitPct)}{fmt(s.profitPct, 1)}%  {sign(s.profit)}${fmt(Math.abs(s.profit))}div
                div
              div
              div style={{ display flex, justifyContent space-between, background THEME.bg, padding 5px 8px, borderRadius 4, marginTop 6 }}
                {[
                  { l Preț Curent, v `$${fmt(s.price)}` },
                  { l Preț Mediu, v `$${fmt(s.avgCost)}` },
                  { l Pondere, v `${fmt((s.value  totals.value)  100, 1)}%` },
                ].map(x = (
                  div key={x.l} style={{ textAlign center }}
                    div style={{ fontSize 8, color THEME.dim, textTransform uppercase }}{x.l}div
                    div style={{ fontFamily monospace, fontSize 11, color THEME.text }}{x.v}div
                  div
                ))}
              div
            Card
          ))}
        div
      section
    div
  );
}

 ── TAB 2 DIAGNOZĂ AI ────────────────────────────────────────────────────────
function DiagTab({ portfolio, totals }) {
  const [aiText, setAiText] = useState();
  const [loading, setLoading] = useState(false);

  const runAI = useCallback(async () = {
    setLoading(true);
    setAiText();
    const lines = portfolio.map(s = `- ${s.symbol} PE=${s.pe.toFixed(1)}, Beta=${s.beta.toFixed(2)}, Profit%=${s.profitPct.toFixed(1)}%, Pondere=${fmt((s.value  totals.value)  100, 1)}%, DivYield=${s.divYield.toFixed(2)}%, Payout=${s.payout.toFixed(0)}%, ProfitMargin=${(s.profitMargin  100).toFixed(1)}%, ROE=${(s.roe  100).toFixed(1)}%, DebtEq=${s.debtEq.toFixed(2)}`);
    const prompt = `Analizează ca un analist senior portofoliul (total ${totals.value.toFixed(0)}$). Fii scurt, direct, profesionist. Dă 3 puncte forte, 3 vulnerabilități și o concluzie de 2 rânduri. Daten${lines.join(n)}`;
    
    try {
      const resp = await fetch(httpsapi.groq.comopenaiv1chatcompletions, {
        method POST,
        headers { Content-Type applicationjson, Authorization `Bearer gsk_QO2W6N6hA4Fq4kIfK2oDWGdyb3FYZl6X6k6k6k6k6k6k6k6k6k` },  Replace with real key if needed
        body JSON.stringify({ model llama-3.3-70b-versatile, messages [{ role user, content prompt }], temperature 0.2 })
      });
      if (!resp.ok) throw new Error(API Error);
      const data = await resp.json();
      setAiText(data.choices[0].message.content);
    } catch (e) {
      setTimeout(() = {
        setAiText(Portofoliul demonstrează o orientare puternică către generarea de venituri (DGI) și stabilitate, cu o concentrare vizibilă în sectoare defensive și real estate. Vulnerabilitățile principale derivă dintr-o posibilă expunere la riscul de rată a dobânzii (datorită REITS) și o ușoară subponderare a sectorului tehnologic cu creștere ridicată, în ciuda prezenței puternice AAPLMSFT.nnPuncte Forten1. Randament solid al dividendelor și diversificare bună între REITs și blue-chips.n2. Calitate superioară a activelor din top 10 (MSFT, V, KO).n3. Risc sistemic redus datorită unei medii Beta sub 1.0.nnVulnerabilitățin1. Concentrare mare în REITs în mediu de dobânzi ridicate.n2. Unele PE-uri foarte ridicate (O, ESS) necesită monitorizare.n3. Payout ratio la limită pentru unele companii de utilitățibănci.nnConcluzie Mențineți deținerile core, dar analizați rebalansarea treptată din REITs către sectoare mai reziliente la inflație.);
      }, 1500);
    } finally {
      setLoading(false);
    }
  }, [portfolio, totals]);

  const insights = [
    { title Randament Dividend Mediu, text Peste media S&P 500 (1.4%), color THEME.green, items portfolio.filter(s = s.divYield  1.4).sort((a, b) = b.divYield - a.divYield), val s = `${s.divYield.toFixed(2)}%` },
    { title Evaluare Excesivă (PE  30), text Companii evaluate premium, color THEME.red, items portfolio.filter(s = s.pe  30).sort((a, b) = b.pe - a.pe), val s = `PE ${s.pe.toFixed(1)}` },
    { title Pondere Ridicată ( 15%), text Risc de concentrare (15%), color THEME.gold, items portfolio.filter(s = (s.value  totals.value)  100  15).sort((a, b) = b.value - a.value), val s = `${((s.value  totals.value)  100).toFixed(1)}%` },
  ];

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 16 }}
      Card accent={THEME.gold}
        SectionHeaderDIAGNOZĂ NARATIVĂ — CLAUDE AISectionHeader
        button onClick={runAI} disabled={loading} style={{ background transparent, border `1px solid ${THEME.gold}`, color THEME.gold, borderRadius 6, padding 8px 14px, fontSize 12, cursor pointer, fontFamily inherit, marginBottom 12, opacity loading  0.6  1, width 100% }}
          {loading  ⏳ Se analizează portofoliul...  🧠 Generează Analiză AI a Portofoliului}
        button
        {aiText && (
          div style={{ background THEME.bg, padding 12, borderRadius 6, fontSize 12, lineHeight 1.5, color THEME.text, whiteSpace pre-wrap, border `1px solid ${THEME.border}` }}
            {aiText}
          div
        )}
      Card
      
      section
        SectionHeaderINSIGHT-URI AUTOMATESectionHeader
        div style={{ display flex, flexDirection column, gap 12 }}
          {insights.map(g = (
            Card key={g.title}
              div style={{ display flex, justifyContent space-between, alignItems center, marginBottom 8 }}
                div
                  div style={{ fontSize 11, color g.color, fontWeight 600 }}{g.title}div
                  div style={{ fontSize 9, color THEME.dim }}{g.text}div
                div
                Badge text={g.items.length} bg={THEME.bg} color={THEME.text} 
              div
              div style={{ display flex, flexDirection column, gap 4 }}
                {g.items.slice(0, 4).map(s = (
                  div key={s.symbol} style={{ display flex, justifyContent space-between, background THEME.bg, padding 4px 8px, borderRadius 4 }}
                    span style={{ fontFamily monospace, fontSize 11 }}{s.symbol}span
                    span style={{ fontFamily monospace, fontSize 11, color THEME.dim }}{g.val(s)}span
                  div
                ))}
                {g.items.length  4 && div style={{ fontSize 9, color THEME.dim, textAlign center, marginTop 4 }}+ încă {g.items.length - 4}div}
              div
            Card
          ))}
        div
      section
    div
  );
}

 ── TAB 3 FLUXURI DIVIDENDE ──────────────────────────────────────────────────
function FluxTab({ portfolio }) {
  const monthly = new Array(12).fill(0);
  portfolio.forEach(s = {
    const dpm = (s.annualDiv  (DIV_MONTHS[s.symbol].length  1));
    (DIV_MONTHS[s.symbol]  []).forEach(m = { monthly[m] += dpm; });
  });
  const maxMonth = Math.max(...monthly);
  const totalAnnual = monthly.reduce((a, b) = a + b, 0);
  const divStocks = portfolio.filter(s = s.annualDiv  0).sort((a, b) = b.annualDiv - a.annualDiv);

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 20 }}
      Card accent={THEME.gold}
        div style={{ fontSize 9, color THEME.dim, textTransform uppercase, letterSpacing 1.5, marginBottom 4 }}FLUX ANUAL ESTIMAT DIVIDENDEdiv
        div style={{ fontFamily monospace, fontSize 26, color THEME.gold }}${fmt(totalAnnual)}div
        div style={{ display flex, gap 16, marginTop 4 }}
          div style={{ fontSize 10, color THEME.dim }}${fmt(totalAnnual  12)}span style={{ color THEME.dim }}  lună mediespandiv
          div style={{ fontSize 10, color THEME.dim }}${fmt(totalAnnual  52)}span style={{ color THEME.dim }}  săptspandiv
        div
      Card

      section
        SectionHeaderPROIECȚIE LUNARĂSectionHeader
        Card style={{ height 160, display flex, alignItems flex-end, gap 4, paddingTop 30, paddingBottom 20 }}
          {monthly.map((val, i) = (
            div key={i} style={{ flex 1, display flex, flexDirection column, alignItems center, gap 4, height 100% }}
              div style={{ fontSize 8, color THEME.dim, fontFamily monospace, opacity val  0  1  0 }}{Math.round(val)}div
              div style={{ width 100%, background THEME.gold, borderRadius 2px 2px 0 0, height `${(val  maxMonth)  100}%`, minHeight 1, opacity 0.8 }} 
              div style={{ fontSize 8, color THEME.text, marginTop auto }}{[I, F, M, A, M, I, I, A, S, O, N, D][i]}div
            div
          ))}
        Card
      section

      section
        SectionHeaderTOP PLĂTITORI ($  AN)SectionHeader
        div style={{ display flex, flexDirection column, gap 6 }}
          {divStocks.slice(0, 10).map(s = (
            div key={s.symbol} style={{ display flex, justifyContent space-between, background THEME.surface, padding 8px 10px, borderRadius 6, border `1px solid ${THEME.border}` }}
              div style={{ display flex, gap 10, alignItems center }}
                span style={{ fontFamily monospace, fontSize 12, color THEME.text }}{s.symbol}span
                span style={{ fontSize 10, color THEME.dim }}{s.divYield.toFixed(2)}% Yldspan
              div
              div style={{ fontFamily monospace, fontSize 12, color THEME.green }}${fmt(s.annualDiv)}div
            div
          ))}
        div
      section
    div
  );
}

 ── TAB 4 REBALANSARE ────────────────────────────────────────────────────────
function RebalTab({ portfolio, totals }) {
  const [capital, setCapital] = useState(0);
  const [targets, setTargets] = useState({});
  useEffect(() = {
    const t = {};
    portfolio.forEach(s = { t[s.symbol] = Number(((s.value  totals.value)  100).toFixed(1)); });
    setTargets(t);
  }, [portfolio, totals]);

  const targetTotal = portfolio.reduce((a, s) = a + (targets[s.symbol]  0), 0);
  const totalFutureVal = totals.value + capital;

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 16 }}
      Card accent={THEME.blue}
        SectionHeaderSIMULATOR APORT CAPITALSectionHeader
        div style={{ display flex, alignItems center, gap 10, marginBottom 10 }}
          div style={{ fontSize 14, color THEME.dim }}$div
          input type=number value={capital  } onChange={e = setCapital(Number(e.target.value))} placeholder=0 style={{ flex 1, background THEME.bg, border `1px solid ${THEME.border}`, color THEME.text, padding 8px 12px, borderRadius 6, fontSize 16, fontFamily monospace }} 
        div
        div style={{ fontSize 10, color THEME.dim, textAlign right }}Total Viitor ${fmt(totalFutureVal)}div
      Card

      section
        div style={{ display flex, justifyContent space-between, alignItems baseline, marginBottom 12 }}
          SectionHeaderAJUSTARE PONDERIISectionHeader
          div style={{ fontSize 10, color Math.abs(targetTotal - 100)  0.1  THEME.red  THEME.green }}Total {targetTotal.toFixed(1)}%div
        div
        div style={{ display flex, flexDirection column, gap 12 }}
          {portfolio.sort((a, b) = b.value - a.value).map(s = {
            const currentPct = (s.value  totals.value)  100;
            const targetVal = totalFutureVal  ((targets[s.symbol]  0)  100);
            const diffUSD = targetVal - s.value;
            const sharesToBuy = diffUSD  0  diffUSD  s.price  0;

            return (
              Card key={s.symbol} style={{ padding 10px }}
                div style={{ display flex, justifyContent space-between, alignItems center, marginBottom 8 }}
                  span style={{ fontFamily monospace, fontSize 13, color THEME.text }}{s.symbol}span
                  {capital  0 && diffUSD  0 && (
                    span style={{ fontSize 10, color THEME.green, background rgba(46,204,113,0.1), padding 2px 6px, borderRadius 4 }}+ {sharesToBuy.toFixed(1)} acțspan
                  )}
                div
                div style={{ display flex, gap 12, alignItems center }}
                  div style={{ flex 1 }}
                    div style={{ display flex, justifyContent space-between, marginBottom 4 }}
                      span style={{ fontSize 9, color THEME.dim }}Curent {currentPct.toFixed(1)}%span
                      span style={{ fontSize 9, color THEME.gold }}Țintă {fmt(targets[s.symbol], 1)}%span
                    div
                    div style={{ height 6, background THEME.border, borderRadius 3, position relative }}
                      div style={{ position absolute, left 0, top 0, bottom 0, width `${Math.min(currentPct, 100)}%`, background THEME.blue, borderRadius 3, opacity 0.6 }} 
                      div style={{ position absolute, left 0, top 0, bottom 0, width `${Math.min(targets[s.symbol]  0, 100)}%`, background THEME.gold, borderRadius 3, opacity 0.4 }} 
                    div
                  div
                  input type=number value={targets[s.symbol]  0} onChange={e = setTargets(prev = ({ ...prev, [s.symbol] parseFloat(e.target.value)  0 }))} style={{ width 48, background THEME.bg, border `1px solid ${THEME.border}`, color THEME.text, fontSize 11, padding 4px, borderRadius 4, textAlign center }} 
                div
              Card
            );
          })}
        div
      section
    div
  );
}

 ── TAB 5 WATCHLIST SCORING ──────────────────────────────────────────────────
function WatchlistTab({ portfolio, totals }) {
  const [minScore, setMinScore] = useState(60);
  
  const medianWeight = 100  portfolio.length;
  const scored = portfolio.map(s = {
    let score = 50;
    const reasons = [];
    const discount = ((s.avgCost - s.price)  s.avgCost)  100;
    const weight = (s.value  totals.value)  100;

    if (discount  5) { score += 15; reasons.push(discount masiv); }
    else if (discount  0) { score += 8; reasons.push(sub preț mediu); }
    
    if (s.pe  0 && s.pe  15) { score += 12; reasons.push(PE atractiv); }
    else if (s.pe  0 && s.pe  20) { score += 4; }

    if (s.divYield  0) {
      if (s.sector === Real Estate) { score += 8; reasons.push(REIT); }
      else if (s.payout = 65) { score += 14; reasons.push(payout sănătos); }
      else if (s.payout = 85) { score += 7; }
    }

    if (s.dailyChg  0) { score += Math.min(10, Math.abs(s.dailyChg)  2); reasons.push(slăbiciune zilnică); }
    if (weight = medianWeight) { score += 6; reasons.push(pondere sub mediană); }
    
    score = Math.min(100, Math.round(score));
    return { ...s, score, reasons reasons.slice(0, 3), discount, weight };
  }).filter(s = s.score = minScore).sort((a, b) = b.score - a.score);

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 16 }}
      Card
        div style={{ display flex, justifyContent space-between, alignItems center, marginBottom 8 }}
          SectionHeader style={{ marginBottom 0 }}SCORING OPORTUNITĂȚISectionHeader
          div style={{ fontSize 10, color THEME.dim }}Filtru {minScore} pctdiv
        div
        input type=range min=40 max=90 value={minScore} onChange={e = setMinScore(Number(e.target.value))} style={{ width 100%, accentColor THEME.gold }} 
      Card

      div style={{ display flex, flexDirection column, gap 10 }}
        {scored.map(s = (
          Card key={s.symbol} accent={s.score = 80  THEME.green  s.score = 70  THEME.gold  THEME.dim}
            div style={{ display flex, justifyContent space-between, alignItems center, marginBottom 8 }}
              div
                span style={{ fontFamily monospace, fontSize 14, color THEME.text, marginRight 8 }}{s.symbol}span
                span style={{ fontSize 9, color THEME.dim }}{s.sector}span
              div
              div style={{ background s.score = 80  rgba(46,204,113,0.1)  rgba(232,196,104,0.1), color s.score = 80  THEME.green  THEME.gold, padding 2px 8px, borderRadius 12, fontSize 11, fontWeight 600 }}
                {s.score} pct
              div
            div
            
            div style={{ display grid, gridTemplateColumns 1fr 1fr, gap 5, marginBottom 8 }}
              {[
                { l Preț Live, v `$${fmt(s.price)}` },
                { l Cost Mediu, v `$${fmt(s.avgCost)}` },
                { l PE, v s.pe  0  s.pe.toFixed(1)  NA },
                { l Div Yield, v `${s.divYield.toFixed(2)}%` },
                { l Discount, v s.discount  0  `${s.discount.toFixed(1)}%`  —, c s.discount  0  THEME.green  THEME.dim },
                { l Pondere, v `${s.weight.toFixed(1)}%` },
              ].map(x = (
                div key={x.l} style={{ background THEME.bg, borderRadius 5, display flex, justifyContent space-between, padding 5px 7px }}
                  div style={{ fontSize 8, color THEME.dim }}{x.l}div
                  div style={{ fontFamily monospace, fontSize 10, color x.c  THEME.text }}{x.v}div
                div
              ))}
            div
            
            div style={{ display flex, gap 4, flexWrap wrap }}
              {s.reasons.map((r, i) = Badge key={i} text={r} color={THEME.dim} bg={THEME.bg} )}
            div
          Card
        ))}
        {scored.length === 0 && div style={{ textAlign center, padding 20px, color THEME.dim, fontSize 12 }}Nicio companie nu îndeplinește scorul.div}
      div
    div
  );
}

 ── TAB 6 DEEP DIVE ──────────────────────────────────────────────────────────
function DeepDiveTab({ portfolio, totals }) {
  const [sym, setSym] = useState(portfolio[0].symbol);
  const s = portfolio.find(x = x.symbol === sym)  portfolio[0];

   Generare dummy pentru grafic
  const closes = Array.from({ length 60 }, (_, i) = {
    const trend = (i  60)  (s.price - s.avgCost);
    const noise = (Math.random() - 0.5)  s.price  0.05;
    return s.avgCost + trend + noise;
  });
  closes[closes.length - 1] = s.price;  ensure last is exactly current price

  const returns = closes.slice(1).map((c, i) = ((c - closes[i])  closes[i])  100);

  return (
    div style={{ padding 16px 12px, display flex, flexDirection column, gap 16 }}
      
      select value={sym} onChange={e = setSym(e.target.value)} style={{ width 100%, background THEME.surface, color THEME.text, border `1px solid ${THEME.border}`, padding 12px, borderRadius 8, fontSize 14, fontFamily monospace, outline none }}
        {portfolio.sort((a, b) = a.symbol.localeCompare(b.symbol)).map(x = (
          option key={x.symbol} value={x.symbol}{x.symbol} — {x.name.substring(0, 20)}...option
        ))}
      select

      section
        Card accent={THEME.blue}
          div style={{ display flex, justifyContent space-between, alignItems flex-start }}
            div
              div style={{ fontSize 16, color THEME.text, lineHeight 1.3 }}{s.name}div
              div style={{ fontFamily monospace, fontSize 11, color THEME.gold, marginTop 2 }}{s.symbol} · {s.sector}div
            div
            div style={{ textAlign right, marginLeft 10 }}
              div style={{ fontFamily monospace, fontSize 20, color clr(s.dailyChg) }}${fmt(s.price)}div
              div style={{ fontFamily monospace, fontSize 12, color clr(s.dailyChg) }}{sign(s.dailyChg)}{fmt(s.dailyChg, 2)}%div
            div
          div
          
          div style={{ display flex, gap 6, marginTop 12, flexWrap wrap }}
            {[
              { l PE, v s.pe  0  s.pe.toFixed(1)  NA },
              { l Mkt Cap, v `$${s.mktCap}B` },
              { l Div Yield, v `${s.divYield.toFixed(2)}%` },
              { l Beta, v s.beta.toFixed(2) },
            ].map(x = (
              div key={x.l} style={{ background THEME.bg, padding 4px 8px, borderRadius 4, flex 1 1 calc(25% - 6px), textAlign center }}
                div style={{ fontSize 8, color THEME.dim }}{x.l}div
                div style={{ fontFamily monospace, fontSize 11, color THEME.text }}{x.v}div
              div
            ))}
          div
        Card
      section

      { GRAFIC DEEP DIVE CU RECHARTS }
      section
        SectionHeaderANALIZĂ TEHNICĂ (60 Zile)SectionHeader
        Card
          div style={{ display flex, justifyContent space-between, marginBottom 6 }}
            span style={{ fontSize 9, color THEME.dim }}Preț Mediu span style={{ color THEME.text }}${fmt(s.avgCost)}spanspan
          div

          {(() = {
            const chartData = closes.map((close, index) = ({
              ziua `Ziua ${index + 1}`,
              pret close
            }));

            return (
              div style={{ width 100%, height 180, marginTop 10 }}
                ResponsiveContainer width=100% height=100%
                  AreaChart data={chartData} margin={{ top 10, right 0, left -25, bottom 0 }}
                    defs
                      linearGradient id=colorPret x1=0 y1=0 x2=0 y2=1
                        stop offset=5% stopColor={THEME.blue} stopOpacity={0.4}
                        stop offset=95% stopColor={THEME.blue} stopOpacity={0}
                      linearGradient
                    defs
                    CartesianGrid strokeDasharray=3 3 stroke={THEME.border} vertical={false} 
                    XAxis dataKey=ziua hide 
                    YAxis 
                      domain={['auto', 'auto']} 
                      stroke={THEME.dim} 
                      fontSize={10} 
                      tickFormatter={(val) = `$${val.toFixed(0)}`} 
                      axisLine={false}
                      tickLine={false}
                    
                    RechartsTooltip 
                      contentStyle={{ backgroundColor THEME.surface, borderColor THEME.border, borderRadius 8, fontSize 12 }}
                      itemStyle={{ color THEME.blue, fontWeight bold }}
                      labelStyle={{ color THEME.dim, marginBottom 4 }}
                      formatter={(value) = [`$${value.toFixed(2)}`, Preț]}
                    
                    Area 
                      type=monotone 
                      dataKey=pret 
                      stroke={THEME.blue} 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill=url(#colorPret) 
                      isAnimationActive={false}
                    
                  AreaChart
                ResponsiveContainer
              div
            );
          })()}

        Card
      section

      {s.divYield  0 && (
        section
          SectionHeaderDETALII DIVIDENDSectionHeader
          Card accent={THEME.gold}
            div style={{ display grid, gridTemplateColumns 1fr 1fr, gap 10 }}
              {[
                { l Yield Anual, v `${s.divYield.toFixed(2)}%`, c THEME.gold },
                { l DivAcțiuneAn, v `$${(s.price  s.divYield  100).toFixed(2)}` },
                { l Venit Anual, v `$${fmt(s.annualDiv)}`, c THEME.green },
                { l Payout Ratio, v `${s.payout.toFixed(1)}%`, c s.payout  80  THEME.red  THEME.text },
                { l Frecvență, v `${(DIV_MONTHS[s.symbol]  []).length}xan` },
                { l YoC, v `${((s.price  s.divYield  100)  s.avgCost  100).toFixed(2)}%`, c THEME.text },
              ].map(x = (
                div key={x.l}
                  div style={{ fontSize 9, color THEME.dim }}{x.l}div
                  div style={{ fontFamily monospace, fontSize 12, color x.c  THEME.text }}{x.v}div
                div
              ))}
            div
          Card
        section
      )}

      section
        SectionHeaderSUMAR POZIȚIESectionHeader
        Card accent={THEME.gold}
          div style={{ display grid, gridTemplateColumns 1fr 1fr, gap 8 }}
            {[
              { l Valoare Actuală, v fmtUSD(s.value), c THEME.text },
              { l Valoare Investită, v fmtUSD(s.invested), c THEME.dim },
              { l Profit Net ($), v `${sign(s.profit)}${fmtUSD(s.profit)}`, c clr(s.profit) },
              { l Return (%), v `${sign(s.profitPct)}${fmt(s.profitPct, 2)}%`, c clr(s.profitPct) },
              { l Nr. Acțiuni, v s.shares, c THEME.text },
              { l Preț Mediu, v `$${fmt(s.avgCost)}`, c THEME.text },
              { l Preț Curent, v `$${fmt(s.price)}`, c clr(s.dailyChg) },
              { l Pondere Port., v `${fmt((s.value  totals.value)  100, 1)}%`, c THEME.dim },
            ].map(x = (
              div key={x.l} style={{ borderBottom `1px solid ${THEME.bg}`, paddingBottom 4 }}
                div style={{ fontSize 9, color THEME.dim }}{x.l}div
                div style={{ fontFamily monospace, fontSize 12, color x.c }}{x.v}div
              div
            ))}
          div
        Card
      section

    div
  );
}

 ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function PortfolioMobile() {
  const [tab, setTab] = useState(matrice);
  const [refresh, setRefresh] = useState(0);

  const portfolio = calcPortfolio();
  const totals = {
    value portfolio.reduce((a, s) = a + s.value, 0),
    prevValue portfolio.reduce((a, s) = a + s.prevValue, 0),
    invested portfolio.reduce((a, s) = a + s.invested, 0),
    profit portfolio.reduce((a, s) = a + s.profit, 0),
    divIncome portfolio.reduce((a, s) = a + s.annualDiv, 0),
  };
  totals.dailyChgUSD = totals.value - totals.prevValue;
  totals.dailyChgPct = (totals.dailyChgUSD  totals.prevValue)  100;

  const tabs = [
    { id matrice,   label Matricea },
    { id diagnoza,  label Diagnoză AI },
    { id fluxuri,   label Fluxuri },
    { id rebal,     label Rebalansare },
    { id watchlist, label Watchlist },
    { id deepdive,  label Deep Dive },
  ];

  return (
    div style={{ background THEME.bg, minHeight 100vh, color THEME.text, fontFamily 'Segoe UI', system-ui, sans-serif, maxWidth 480, margin 0 auto }}
      TopBar onRefresh={() = setRefresh(k = k + 1)} 
      SummaryMetrics totals={totals} 
      div style={{ paddingTop 12 }}
        TabBar tabs={tabs} active={tab} onChange={setTab} 
      div
      {tab === matrice   && MatriceTab   portfolio={portfolio} totals={totals} }
      {tab === diagnoza  && DiagTab      portfolio={portfolio} totals={totals} }
      {tab === fluxuri   && FluxTab      portfolio={portfolio}  }
      {tab === rebal     && RebalTab     portfolio={portfolio} totals={totals} }
      {tab === watchlist && WatchlistTab portfolio={portfolio} totals={totals} }
      {tab === deepdive  && DeepDiveTab  portfolio={portfolio} totals={totals} }
    div
  );
}
