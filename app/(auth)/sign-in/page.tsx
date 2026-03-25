import { Suspense } from 'react';
import SignInForm from './SignInForm';

// Next.js 15 requires components that use `useSearchParams` to be wrapped in
// a Suspense boundary — otherwise the build fails with:
// "useSearchParams() should be wrapped in a suspense boundary"
// Solution: the page itself is a Server Component that provides the boundary;
// the actual form (with hooks) lives in a separate Client Component.

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="space-y-5 animate-pulse">
      <div className="h-10 w-48 rounded bg-gray-700 mb-10" />
      <div className="h-12 w-full rounded-lg bg-gray-800" />
      <div className="h-12 w-full rounded-lg bg-gray-800" />
      <div className="h-12 w-full rounded-lg bg-gray-700" />
    </div>}>
      <SignInForm />
    </Suspense>
  );
}
