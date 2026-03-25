'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error reporting service here (e.g. Sentry)
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-400 text-sm max-w-md">
          An unexpected error occurred. If this keeps happening, please contact
          support.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-600 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset} className="yellow-btn">
        Try again
      </Button>
    </div>
  );
}
