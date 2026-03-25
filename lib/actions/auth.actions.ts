'use server';

import { headers } from 'next/headers';
import { getAuth } from '@/lib/better-auth/auth';
import { inngest } from '@/lib/inngest/client';
import { signInSchema, signUpSchema } from '@/lib/validators';

// ---------------------------------------------------------------------------
// SIGN UP
// ---------------------------------------------------------------------------
export async function signUpWithEmail(
  raw: SignUpFormData
): Promise<ActionResult> {
  // 1. Validate on the server — never trust client data
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return { success: false, error: message };
  }

  const { email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry } =
    parsed.data;

  try {
    const auth = await getAuth();

    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (!response) {
      return { success: false, error: 'Sign up failed. Please try again.' };
    }

    // Fire-and-forget: trigger the welcome email via Inngest.
    // Using void to acknowledge we intentionally don't await this.
    void inngest
      .send({
        name: 'app/user.created',
        data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry },
      })
      .catch((err: unknown) => {
        // Log but don't fail the registration if the event fails
        console.error('[Inngest] Failed to send app/user.created:', err);
      });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('[Auth] signUpWithEmail error:', message);
    // Map common Better-Auth error messages to user-friendly strings
    if (message.includes('already exists') || message.includes('UNIQUE')) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: 'Sign up failed. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// SIGN IN
// ---------------------------------------------------------------------------
export async function signInWithEmail(
  raw: SignInFormData
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Invalid input';
    return { success: false, error: message };
  }

  const { email, password } = parsed.data;

  try {
    const auth = await getAuth();

    // The nextCookies() plugin automatically sets the session cookie on the
    // response when called from a Server Action or Route Handler.
    const response = await auth.api.signInEmail({
      body: { email, password },
    });

    if (!response) {
      return { success: false, error: 'Invalid email or password.' };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    console.error('[Auth] signInWithEmail error:', message);
    // Better-Auth throws on wrong credentials
    return { success: false, error: 'Invalid email or password.' };
  }
}

// ---------------------------------------------------------------------------
// SIGN OUT
// ---------------------------------------------------------------------------
export async function signOut(): Promise<ActionResult> {
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (err: unknown) {
    console.error('[Auth] signOut error:', err);
    return { success: false, error: 'Sign out failed.' };
  }
}

// ---------------------------------------------------------------------------
// GET SESSION (for use in Server Components)
// ---------------------------------------------------------------------------
export async function getSession() {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
  } catch {
    return null;
  }
}
