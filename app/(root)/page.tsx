import type { Metadata } from 'next';
import TradingViewWidget from '@/components/TradingViewWidget';
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  TRADINGVIEW_SCRIPT_BASE,
} from '@/lib/constants';

export const metadata: Metadata = { title: 'Dashboard' };

// This page is a Server Component — no 'use client' needed.
// TradingViewWidget itself is 'use client' and handles script injection.
export default function DashboardPage() {
  const base = TRADINGVIEW_SCRIPT_BASE;

  return (
    <div className="flex min-h-screen home-wrapper">
      {/* Row 1: Market Overview + Heatmap */}
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${base}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={`${base}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>

      {/* Row 2: Top Stories + Market Quotes */}
      <section className="grid w-full gap-8 home-section">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Top Stories"
            scriptUrl={`${base}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            height={600}
          />
        </div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Market Data"
            scriptUrl={`${base}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>
    </div>
  );
}
