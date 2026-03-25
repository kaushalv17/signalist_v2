import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { connectToDatabase } from '@/database/mongoose';

// ---------------------------------------------------------------------------
// FIX: The original code used `export const auth = await getAuth()` which is
// a top-level await. This crashes in edge runtimes and causes build failures
// without the "experimental.topLevelAwait" Next.js flag.
//
// Solution: Build the auth instance lazily on first use via a singleton
// initialised inside a regular async function, then cache it.
// ---------------------------------------------------------------------------

let _auth: ReturnType<typeof betterAuth> | null = null;

async function createAuth() {
  if (_auth) return _auth;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) throw new Error('[Auth] MongoDB connection not available');

  _auth = betterAuth({
    // Pass the raw MongoDB driver `Db` instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    database: mongodbAdapter(db as any),

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,

    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      // Auto sign-in the user after successful registration
      autoSignIn: true,
    },

    session: {
      // 30-day rolling session
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24, // Refresh cookie if older than 1 day
    },

    // Sets the session cookie automatically in Next.js server actions
    plugins: [nextCookies()],
  });

  return _auth;
}

// ─── Public export ────────────────────────────────────────────────────────
// Server actions and route handlers call getAuth() once; subsequent calls
// return the cached instance with zero async overhead.
export async function getAuth() {
  return createAuth();
}

// Convenience re-export so callers can do:
//   const auth = await getAuth();
//   await auth.api.getSession(...)
// or import getAuth and call it directly.
export type Auth = ReturnType<typeof betterAuth>;
