import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  country: z.string().length(2, 'Select a valid country'),
  investmentGoals: z.enum(['Growth', 'Income', 'Balanced', 'Conservative']),
  riskTolerance: z.enum(['Low', 'Medium', 'High']),
  preferredIndustry: z.enum([
    'Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods',
  ]),
});

// ─── Watchlist ────────────────────────────────────────────────
export const addToWatchlistSchema = z.object({
  symbol:  z.string().min(1).max(10).toUpperCase(),
  company: z.string().min(1).max(200).trim(),
});

// ─── Alerts ──────────────────────────────────────────────────
export const createAlertSchema = z.object({
  symbol:    z.string().min(1).max(10).toUpperCase(),
  company:   z.string().min(1).max(200).trim(),
  alertType: z.enum(['upper', 'lower']),
  condition: z.enum(['greater', 'less']),
  threshold: z.number().positive('Threshold must be a positive number'),
});

export const updateAlertSchema = z.object({
  alertId:   z.string().min(1),
  threshold: z.number().positive('Threshold must be a positive number').optional(),
  isActive:  z.boolean().optional(),
});

export type SignInInput      = z.infer<typeof signInSchema>;
export type SignUpInput      = z.infer<typeof signUpSchema>;
export type AddWatchlistInput = z.infer<typeof addToWatchlistSchema>;
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
