import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Star, Bell } from 'lucide-react';
import { getAuth } from '@/lib/better-auth/auth';
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import { getUserAlerts } from '@/lib/actions/alert.actions';
import { getStockQuote, searchStocks } from '@/lib/actions/finnhub.actions';
import WatchlistTable from '@/components/dashboard/WatchlistTable';
import AlertList from '@/components/dashboard/AlertList';
import SearchCommand from '@/components/SearchCommand';

export const metadata: Metadata = { title: 'Watchlist' };

// ISR: revalidate every 60 s so live prices stay reasonably fresh
export const revalidate = 60;

export default async function WatchlistPage() {
  const auth    = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  // All three fetches in parallel
  const [watchlistResult, alertsResult, initialStocks] = await Promise.all([
    getWatchlist(),
    getUserAlerts(),
    searchStocks(),
  ]);

  const watchlistItems = watchlistResult.data ?? [];
  const alerts         = alertsResult.data ?? [];

  // Enrich watchlist rows with live quotes (parallel — one call per symbol)
  const enriched: WatchlistWithQuote[] = await Promise.all(
    watchlistItems.map(async (item) => {
      const quote = await getStockQuote(item.symbol).catch(() => null);
      return {
        ...item,
        price:         quote?.c,
        change:        quote?.d,
        changePercent: quote?.dp,
      };
    })
  );

  const isEmpty = enriched.length === 0;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="watchlist-title">My Watchlist</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEmpty
              ? 'No stocks added yet.'
              : `${enriched.length} stock${enriched.length !== 1 ? 's' : ''} tracked`}
          </p>
        </div>
        <SearchCommand renderAs="button" label="Add Stock" initialStocks={initialStocks} />
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="watchlist-empty-container flex">
          <div className="watchlist-empty">
            <Star className="watchlist-star" />
            <h2 className="empty-title">Your watchlist is empty</h2>
            <p className="empty-description">
              Search for stocks and add them to track prices, set alerts, and
              receive personalised news.
            </p>
            <SearchCommand
              renderAs="button"
              label="Find your first stock"
              initialStocks={initialStocks}
            />
          </div>
        </div>
      ) : (
        /* Table + alert sidebar */
        <div className="watchlist-container">
          <div className="watchlist">
            <WatchlistTable items={enriched} />
          </div>

          <aside className="watchlist-alerts flex">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-500" />
              <h2 className="watchlist-title text-lg">Price Alerts</h2>
            </div>
            <AlertList alerts={alerts} watchlistItems={enriched} />
          </aside>
        </div>
      )}
    </div>
  );
}
