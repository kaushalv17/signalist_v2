import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Tailwind class merge ─────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Dates ────────────────────────────────────────────────────────────────
export function getDateRange(days: number): { from: string; to: string } {
  const to   = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return {
    to:   to.toISOString().split('T')[0],
    from: from.toISOString().split('T')[0],
  };
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getFormattedTodayDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    timeZone: 'UTC',
  });
}

// ─── Formatters ───────────────────────────────────────────────────────────
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatChangePercent(changePercent?: number): string {
  if (changePercent == null) return '';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}

export function formatMarketCapValue(marketCapUsd: number): string {
  if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return 'N/A';
  if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`;
  if (marketCapUsd >= 1e9)  return `$${(marketCapUsd / 1e9).toFixed(2)}B`;
  if (marketCapUsd >= 1e6)  return `$${(marketCapUsd / 1e6).toFixed(2)}M`;
  return `$${marketCapUsd.toFixed(2)}`;
}

export function formatTimeAgo(timestamp: number): string {
  const diffMs      = Date.now() - timestamp * 1000;
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours   = Math.floor(diffMs / 3_600_000);
  const diffDays    = Math.floor(diffMs / 86_400_000);

  if (diffDays >= 1)    return `${diffDays}d ago`;
  if (diffHours >= 1)   return `${diffHours}h ago`;
  if (diffMinutes >= 1) return `${diffMinutes}m ago`;
  return 'just now';
}

// ─── Colour helpers ───────────────────────────────────────────────────────
export function getChangeColorClass(changePercent?: number): string {
  if (changePercent == null) return 'text-gray-400';
  return changePercent >= 0 ? 'text-teal-400' : 'text-red-500';
}

// ─── Alerts ───────────────────────────────────────────────────────────────
export function getAlertText(alert: Alert): string {
  const condition = alert.alertType === 'upper' ? '>' : '<';
  return `Price ${condition} ${formatPrice(alert.threshold)}`;
}

// ─── News helpers ─────────────────────────────────────────────────────────
export function validateArticle(article: RawNewsArticle): boolean {
  return Boolean(
    article.headline &&
    article.summary &&
    article.url &&
    article.datetime
  );
}

export function formatArticle(
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index: number = 0
): MarketNewsArticle {
  // Use the article's own numeric ID when available (Finnhub guarantees it for
  // general news). For company-news endpoints the ID is also present but can
  // occasionally be 0 — fall back to datetime + index, which is stable and
  // deterministic (no floats, no Date.now() calls).
  const stableId =
    article.id > 0
      ? article.id
      : (article.datetime ?? 0) * 100 + index;

  return {
    id:       stableId,
    headline: article.headline!.trim(),
    summary:
      article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + '…',
    source:   article.source ?? (isCompanyNews ? 'Company News' : 'Market News'),
    url:      article.url!,
    datetime: article.datetime!,
    image:    article.image ?? '',
    category: isCompanyNews ? 'company' : (article.category ?? 'general'),
    related:  isCompanyNews ? (symbol ?? '') : (article.related ?? ''),
  };
}

// ─── Misc ─────────────────────────────────────────────────────────────────
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
