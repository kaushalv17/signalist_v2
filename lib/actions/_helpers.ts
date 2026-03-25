'use server';

import { headers } from 'next/headers';
import { getAuth } from '@/lib/better-auth/auth';

/**
 * Resolves the authenticated user's ID from the current request session.
 * Throws an Error if no valid session exists — call sites rely on this for
 * early-exit auth guarding.
 *
 * Centralised here to avoid copy-paste across every server action file.
 */
export async function getCurrentUserId(): Promise<string> {
  const auth    = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id;
}
