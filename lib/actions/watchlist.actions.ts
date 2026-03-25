'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { addToWatchlistSchema } from '@/lib/validators';
import { getCurrentUserId } from '@/lib/actions/_helpers';

// ─── Get watchlist ────────────────────────────────────────────────────────
export async function getWatchlist(): Promise<ActionResult<WatchlistEntry[]>> {
  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    const items = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    const data: WatchlistEntry[] = items.map((item) => ({
      _id:     String(item._id),
      userId:  item.userId,
      symbol:  item.symbol,
      company: item.company,
      addedAt: item.addedAt.toISOString(),
    }));

    return { success: true, data };
  } catch (err) {
    console.error('[getWatchlist]', err);
    return { success: false, error: 'Failed to fetch watchlist.' };
  }
}

// ─── Get symbols only (lightweight, used for search enrichment) ───────────
export async function getWatchlistSymbols(): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => i.symbol);
  } catch {
    return [];
  }
}

// ─── Add to watchlist ─────────────────────────────────────────────────────
export async function addToWatchlist(
  payload: { symbol: string; company: string }
): Promise<ActionResult> {
  const parsed = addToWatchlistSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    // upsert: safe against duplicate inserts / race conditions
    await Watchlist.findOneAndUpdate(
      { userId, symbol: parsed.data.symbol },
      { $setOnInsert: { company: parsed.data.company, addedAt: new Date() } },
      { upsert: true, new: true }
    );

    revalidatePath('/watchlist');
    revalidatePath(`/stocks/${parsed.data.symbol}`);

    return { success: true };
  } catch (err) {
    console.error('[addToWatchlist]', err);
    return { success: false, error: 'Failed to add to watchlist.' };
  }
}

// ─── Remove from watchlist ────────────────────────────────────────────────
export async function removeFromWatchlist(
  symbol: string
): Promise<ActionResult> {
  if (!symbol) return { success: false, error: 'Symbol is required.' };

  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    revalidatePath('/watchlist');
    revalidatePath(`/stocks/${symbol}`);

    return { success: true };
  } catch (err) {
    console.error('[removeFromWatchlist]', err);
    return { success: false, error: 'Failed to remove from watchlist.' };
  }
}

// ─── Check if a symbol is in the user's watchlist ─────────────────────────
export async function isInWatchlist(symbol: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();
    const item = await Watchlist.findOne(
      { userId, symbol: symbol.toUpperCase() },
      { _id: 1 }
    ).lean();
    return Boolean(item);
  } catch {
    return false;
  }
}

// ─── Used by Inngest to look up symbols for a given email ─────────────────
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return [];

    const user = await db
      .collection('user')
      .findOne<{ id?: string; _id?: unknown }>({ email });

    if (!user) return [];
    const userId = String(user.id ?? user._id ?? '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => i.symbol);
  } catch (err) {
    console.error('[getWatchlistSymbolsByEmail]', err);
    return [];
  }
}
