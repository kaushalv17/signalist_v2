import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IAlert extends Document {
  userId: string;
  symbol: string;
  company: string;
  alertType: 'upper' | 'lower';
  condition: 'greater' | 'less';
  threshold: number;
  triggered: boolean;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId:      { type: String, required: true, index: true },
    symbol:      { type: String, required: true, uppercase: true, trim: true },
    company:     { type: String, required: true, trim: true },
    alertType:   { type: String, enum: ['upper', 'lower'], required: true },
    condition:   { type: String, enum: ['greater', 'less'], required: true },
    threshold:   { type: Number, required: true, min: 0 },
    triggered:   { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
    triggeredAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: false },
  }
);

// Fast lookup: find all active alerts for a given symbol across all users
AlertSchema.index({ symbol: 1, isActive: 1, triggered: 1 });
// Fast lookup: all alerts belonging to a user
AlertSchema.index({ userId: 1, createdAt: -1 });

export const AlertModel: Model<IAlert> =
  (models?.Alert as Model<IAlert>) ??
  model<IAlert>('Alert', AlertSchema);
