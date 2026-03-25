'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { deleteAlert, updateAlert } from '@/lib/actions/alert.actions';
import { formatPrice, getAlertText } from '@/lib/utils';

interface AlertListProps {
  alerts: Alert[];
  watchlistItems: WatchlistWithQuote[];
}

export default function AlertList({ alerts, watchlistItems }: AlertListProps) {
  const router             = useRouter();
  const [isPending, start] = useTransition();

  const handleDelete = (alertId: string, symbol: string) => {
    start(async () => {
      const result = await deleteAlert(alertId);
      if (result.success) {
        toast.success(`Alert for ${symbol} deleted`);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to delete alert');
      }
    });
  };

  const handleToggle = (alertId: string, isActive: boolean) => {
    start(async () => {
      const result = await updateAlert(alertId, { isActive: !isActive });
      if (result.success) {
        toast.success(isActive ? 'Alert paused' : 'Alert reactivated');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to update alert');
      }
    });
  };

  if (alerts.length === 0) {
    return (
      <div className="alert-list">
        <div className="alert-empty">
          <Bell className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm">No alerts yet.</p>
          <p className="text-xs mt-1">
            Click <span className="text-yellow-500">Alert</span> next to any
            stock to set a price notification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => {
        const quote = watchlistItems.find((w) => w.symbol === alert.symbol);
        return (
          <div key={alert._id} className="alert-item">
            {/* Symbol + status badge */}
            <div className="flex items-center justify-between mb-1">
              <span className="alert-name">{alert.symbol}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  alert.triggered
                    ? 'bg-teal-500/20 text-teal-400'
                    : alert.isActive
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-600/40 text-gray-500'
                }`}
              >
                {alert.triggered ? 'Triggered' : alert.isActive ? 'Active' : 'Paused'}
              </span>
            </div>

            {/* Company + current price */}
            <div className="alert-details">
              <span className="alert-company">{alert.company}</span>
              {quote?.price != null && (
                <span className="alert-price">{formatPrice(quote.price)}</span>
              )}
            </div>

            {/* Threshold condition */}
            <p className="text-sm text-gray-400 mb-3">{getAlertText(alert)}</p>

            {/* Actions */}
            <div className="alert-actions">
              <button
                className="alert-update-btn p-1.5"
                title={alert.isActive ? 'Pause alert' : 'Resume alert'}
                onClick={() => handleToggle(alert._id, alert.isActive)}
                disabled={isPending || alert.triggered}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                className="alert-delete-btn p-1.5"
                title="Delete alert"
                onClick={() => handleDelete(alert._id, alert.symbol)}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
