'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Bell } from 'lucide-react';
// FIX: removed unused BellOff import
import { toast } from 'sonner';
import { removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { formatPrice, formatChangePercent, getChangeColorClass } from '@/lib/utils';
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants';
import AlertDialog from '@/components/dashboard/AlertDialog';

interface WatchlistTableProps {
  items: WatchlistWithQuote[];
}

export default function WatchlistTable({ items }: WatchlistTableProps) {
  const router                        = useRouter();
  const [isPending, start]            = useTransition();
  const [alertTarget, setAlertTarget] = useState<WatchlistWithQuote | null>(null);

  const handleRemove = (symbol: string) => {
    start(async () => {
      const result = await removeFromWatchlist(symbol);
      if (result.success) {
        toast.success(`${symbol} removed from watchlist`);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to remove');
      }
    });
  };

  return (
    <>
      <div className="watchlist-table">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="table-header-row">
              {WATCHLIST_TABLE_HEADER.map((h) => (
                <th
                  key={h}
                  className="table-header px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const changeClass = getChangeColorClass(item.changePercent);
              return (
                <tr key={item.symbol} className="table-row">
                  {/* Company name — links to stock detail page */}
                  <td className="table-cell px-4 py-4">
                    <Link
                      href={`/stocks/${item.symbol}`}
                      className="hover:text-yellow-500 transition-colors font-semibold"
                    >
                      {item.company}
                    </Link>
                  </td>

                  {/* Ticker badge */}
                  <td className="table-cell px-4 py-4">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-gray-300">
                      {item.symbol}
                    </span>
                  </td>

                  {/* Live price */}
                  <td className="table-cell px-4 py-4 text-gray-100">
                    {item.price != null ? formatPrice(item.price) : '—'}
                  </td>

                  {/* % change with colour coding */}
                  <td className={`table-cell px-4 py-4 font-semibold ${changeClass}`}>
                    {item.changePercent != null
                      ? formatChangePercent(item.changePercent)
                      : '—'}
                  </td>

                  {/* Market Cap (populated via profile API — shown as dash for now) */}
                  <td className="table-cell px-4 py-4 text-gray-400">—</td>

                  {/* P/E Ratio */}
                  <td className="table-cell px-4 py-4 text-gray-400">—</td>

                  {/* Open alert dialog */}
                  <td className="table-cell px-4 py-4">
                    <button
                      className="add-alert"
                      onClick={() => setAlertTarget(item)}
                      title={`Set price alert for ${item.symbol}`}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      Alert
                    </button>
                  </td>

                  {/* Remove from watchlist */}
                  <td className="table-cell px-4 py-4">
                    <button
                      onClick={() => handleRemove(item.symbol)}
                      disabled={isPending}
                      title={`Remove ${item.symbol}`}
                      className="watchlist-icon-btn hover:text-red-400 transition-colors p-1 rounded"
                    >
                      <Trash2 className="trash-icon" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {alertTarget && (
        <AlertDialog
          item={alertTarget}
          onClose={() => setAlertTarget(null)}
        />
      )}
    </>
  );
}
