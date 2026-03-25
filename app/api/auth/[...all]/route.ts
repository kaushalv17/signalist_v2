import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/better-auth/auth';

// FIX: The previous version used a top-level `await getAuth()` which breaks
// in edge runtimes and some serverless environments.
// Solution: wrap in individual GET/POST handlers so the await runs inside
// a function body, never at module evaluation time.

export async function GET(request: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).GET(request);
}

export async function POST(request: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).POST(request);
}
