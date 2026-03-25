import type { Metadata } from 'next';
import TradingViewWidget from '@/components/TradingViewWidget';
import WatchlistButton from '@/components/WatchlistButton';
import { isInWatchlist } from '@/lib/actions/watchlist.actions';
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  TRADINGVIEW_SCRIPT_BASE,
} from '@/lib/constants';

// Dynamic metadata: tab title shows the stock symbol
export async function generateMetadata({
  params,
}: StockDetailsPageProps): Promise<Metadata> {
  const { symbol } = await params;
  return { title: symbol.toUpperCase() };
}

export default async function StockDetailsPage({
  params,
}: StockDetailsPageProps) {
  const { symbol } = await params;
  const upper = symbol.toUpperCase();
  const base  = TRADINGVIEW_SCRIPT_BASE;

  // Fetch real watchlist status from DB so the button renders correctly on
  // first load — no client-side flicker or incorrect initial state.
  const inWatchlist = await isInWatchlist(upper);

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

        {/* ── Left column ───────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Symbol banner: price, change, market cap */}
          <TradingViewWidget
            scriptUrl={`${base}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(upper)}
            height={170}
          />

          {/* Candlestick chart */}
          <TradingViewWidget
            scriptUrl={`${base}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(upper)}
            className="custom-chart"
            height={600}
          />

          {/* Baseline (area) chart */}
          <TradingViewWidget
            scriptUrl={`${base}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(upper)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* ── Right column ──────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Watchlist CTA — wired to real DB via server actions */}
          <WatchlistButton
            symbol={upper}
            company={upper}
            isInWatchlist={inWatchlist}
          />

          {/* Buy/sell signal gauge */}
          <TradingViewWidget
            scriptUrl={`${base}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upper)}
            height={400}
          />

          {/* Company overview */}
          <TradingViewWidget
            scriptUrl={`${base}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(upper)}
            height={440}
          />

          {/* Income statement / balance sheet */}
          <TradingViewWidget
            scriptUrl={`${base}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(upper)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
