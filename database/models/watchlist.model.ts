import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IWatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>(
  {
    userId:  { type: String, required: true, index: true },
    symbol:  { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    // Return plain objects without Mongoose prototype overhead
    toJSON: { virtuals: false },
  }
);

// Prevent a user from adding the same symbol twice
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<IWatchlistItem> =
  (models?.Watchlist as Model<IWatchlistItem>) ??
  model<IWatchlistItem>('Watchlist', WatchlistSchema);
