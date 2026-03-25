'use client';

import { useState, useTransition } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { cn } from '@/lib/utils';

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [added, setAdded]       = useState<boolean>(isInWatchlist);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const next = !added;

      const result = next
        ? await addToWatchlist({ symbol, company })
        : await removeFromWatchlist(symbol);

      if (result.success) {
        setAdded(next);
        onWatchlistChange?.(symbol, next);
        toast.success(
          next ? `${symbol} added to watchlist` : `${symbol} removed from watchlist`
        );
      } else {
        toast.error(result.error ?? 'Something went wrong');
      }
    });
  };

  // ─── Icon variant (star button used in tables) ────────────────────────
  if (type === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={cn(
          'watchlist-icon-btn',
          added && 'watchlist-icon-added',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Star
          className="star-icon"
          fill={added ? 'currentColor' : 'none'}
        />
      </button>
    );
  }

  // ─── Full button variant (used on stock detail page) ─────────────────
  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'watchlist-btn',
        added && 'watchlist-remove',
        isPending && 'opacity-60 cursor-not-allowed'
      )}
    >
      {showTrashIcon && added ? (
        <Trash2 className="w-4 h-4 mr-2 inline-block" />
      ) : (
        <Star className="w-4 h-4 mr-2 inline-block" fill={added ? 'currentColor' : 'none'} />
      )}
      {isPending
        ? added ? 'Removing…' : 'Adding…'
        : added ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
}
