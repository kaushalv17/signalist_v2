'use server';

import { cache } from 'react';
import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// CRITICAL FIX: The original used process.env.NEXT_PUBLIC_FINNHUB_API_KEY
// as a fallback which exposes the secret in the client-side JS bundle.
// API keys must ONLY live in server-side env vars (no NEXT_PUBLIC_ prefix).
// ---------------------------------------------------------------------------
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error('[Finnhub] FINNHUB_API_KEY is not set.');
  return key;
}

// ─── Generic typed fetch with ISR support ────────────────────────────────
async function fetchFinnhub<T>(
  path: string,
  revalidateSeconds?: number
): Promise<T> {
  const token = getApiKey();
  const url = `${FINNHUB_BASE}${path}${path.includes('?') ? '&' : '?'}token=${token}`;

  const options: RequestInit = revalidateSeconds
    ? { next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, options);

  if (res.status === 429) {
    throw new Error('[Finnhub] Rate limit exceeded. Please try again shortly.');
  }
  if (!res.ok) {
    throw new Error(`[Finnhub] HTTP ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}

// ─── Stock search ─────────────────────────────────────────────────────────
// React.cache() deduplicates identical calls within a single render pass.
export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const trimmed = (query ?? '').trim();

      if (!trimmed) {
        // Show top 10 popular stocks when no query provided
        const top10 = POPULAR_STOCK_SYMBOLS.slice(0, 10);

        const profiles = await Promise.allSettled(
          top10.map((sym) =>
            fetchFinnhub<Record<string, unknown>>(
              `/stock/profile2?symbol=${encodeURIComponent(sym)}`,
              3600 // Cache for 1 hour
            ).then((profile) => ({ sym, profile }))
          )
        );

        return profiles
          .filter(
            (r): r is PromiseFulfilledResult<{ sym: string; profile: Record<string, unknown> }> =>
              r.status === 'fulfilled' && Boolean(r.value.profile?.name)
          )
          .map(({ value: { sym, profile } }) => ({
            symbol:          sym.toUpperCase(),
            name:            String(profile.name ?? sym),
            exchange:        String(profile.exchange ?? 'US'),
            type:            'Common Stock',
            isInWatchlist:   false,
          }));
      }

      // Full-text search
      const data = await fetchFinnhub<FinnhubSearchResponse>(
        `/search?q=${encodeURIComponent(trimmed)}`,
        1800 // Cache for 30 min
      );

      return (data.result ?? []).slice(0, 15).map((r) => ({
        symbol:        r.symbol.toUpperCase(),
        name:          r.description || r.symbol,
        exchange:      r.displaySymbol || 'US',
        type:          r.type || 'Stock',
        isInWatchlist: false,
      }));
    } catch (err) {
      console.error('[searchStocks]', err);
      return [];
    }
  }
);

// ─── Real-time quote ──────────────────────────────────────────────────────
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    return await fetchFinnhub<StockQuote>(
      `/quote?symbol=${encodeURIComponent(symbol.toUpperCase())}`,
      60 // 1-minute ISR
    );
  } catch (err) {
    console.error(`[getStockQuote] ${symbol}:`, err);
    return null;
  }
}

// ─── Company profile ─────────────────────────────────────────────────────
export async function getStockProfile(symbol: string): Promise<StockProfile | null> {
  try {
    return await fetchFinnhub<StockProfile>(
      `/stock/profile2?symbol=${encodeURIComponent(symbol.toUpperCase())}`,
      3600
    );
  } catch (err) {
    console.error(`[getStockProfile] ${symbol}:`, err);
    return null;
  }
}

// ─── News ─────────────────────────────────────────────────────────────────
export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  const MAX = 6;

  try {
    const range = getDateRange(5);
    const clean = (symbols ?? [])
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    if (clean.length > 0) {
      // Fetch news per symbol in parallel, collect best results round-robin
      const perSymbol = await Promise.allSettled(
        clean.map(async (sym) => {
          const articles = await fetchFinnhub<RawNewsArticle[]>(
            `/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}`,
            300 // 5-min ISR
          );
          return { sym, articles: (articles ?? []).filter(validateArticle) };
        })
      );

      const buckets: Record<string, RawNewsArticle[]> = {};
      for (const r of perSymbol) {
        if (r.status === 'fulfilled') {
          buckets[r.value.sym] = r.value.articles;
        }
      }

      const collected: MarketNewsArticle[] = [];
      outer: for (let round = 0; round < MAX; round++) {
        for (const sym of clean) {
          const list = buckets[sym];
          if (!list?.length) continue;
          const article = list.shift()!;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= MAX) break outer;
        }
      }

      if (collected.length > 0) {
        return collected
          .sort((a, b) => b.datetime - a.datetime)
          .slice(0, MAX);
      }
    }

    // Fallback: general market news
    const general = await fetchFinnhub<RawNewsArticle[]>(
      '/news?category=general',
      300
    );

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general ?? []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= MAX) break;
    }

    return unique.map((a, i) => formatArticle(a, false, undefined, i));
  } catch (err) {
    console.error('[getNews]', err);
    return [];
  }
}
