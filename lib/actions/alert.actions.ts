'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/database/mongoose';
import { AlertModel } from '@/database/models/alert.model';
import { createAlertSchema, updateAlertSchema } from '@/lib/validators';
import { getCurrentUserId } from '@/lib/actions/_helpers';

// ─── Get all alerts for current user ─────────────────────────────────────
export async function getUserAlerts(): Promise<ActionResult<Alert[]>> {
  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    const alerts = await AlertModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const data: Alert[] = alerts.map((a) => ({
      _id:       String(a._id),
      userId:    a.userId,
      symbol:    a.symbol,
      company:   a.company,
      alertType: a.alertType,
      condition: a.condition,
      threshold: a.threshold,
      triggered: a.triggered,
      isActive:  a.isActive,
      createdAt: a.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch (err) {
    console.error('[getUserAlerts]', err);
    return { success: false, error: 'Failed to fetch alerts.' };
  }
}

// ─── Create alert ─────────────────────────────────────────────────────────
export async function createAlert(
  payload: CreateAlertPayload
): Promise<ActionResult> {
  const parsed = createAlertSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    await AlertModel.create({ ...parsed.data, userId });

    revalidatePath('/watchlist');
    return { success: true };
  } catch (err) {
    console.error('[createAlert]', err);
    return { success: false, error: 'Failed to create alert.' };
  }
}

// ─── Update alert threshold or toggle active ─────────────────────────────
export async function updateAlert(
  alertId: string,
  updates: { threshold?: number; isActive?: boolean }
): Promise<ActionResult> {
  const parsed = updateAlertSchema.safeParse({ alertId, ...updates });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    const { threshold, isActive } = parsed.data;
    const $set: Record<string, unknown> = {};
    if (threshold !== undefined) $set.threshold = threshold;
    if (isActive !== undefined) {
      $set.isActive = isActive;
      // Reset triggered state when re-activating
      if (isActive) $set.triggered = false;
    }

    const result = await AlertModel.updateOne(
      { _id: alertId, userId }, // userId guard prevents tampering
      { $set }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Alert not found.' };
    }

    revalidatePath('/watchlist');
    return { success: true };
  } catch (err) {
    console.error('[updateAlert]', err);
    return { success: false, error: 'Failed to update alert.' };
  }
}

// ─── Delete alert ─────────────────────────────────────────────────────────
export async function deleteAlert(alertId: string): Promise<ActionResult> {
  if (!alertId) return { success: false, error: 'Alert ID is required.' };

  try {
    const userId = await getCurrentUserId();
    await connectToDatabase();

    const result = await AlertModel.deleteOne({ _id: alertId, userId });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Alert not found.' };
    }

    revalidatePath('/watchlist');
    return { success: true };
  } catch (err) {
    console.error('[deleteAlert]', err);
    return { success: false, error: 'Failed to delete alert.' };
  }
}
