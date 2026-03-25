'use client';

import { useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// FIX: The original implementation had a stale-closure bug.
//
// Problem:
//   useCallback([callback, delay]) recreates the debounced function every time
//   `callback` changes.  But `callback` is an inline arrow defined in the
//   component body, so it changes on every render — defeating the debounce.
//
// Solution:
//   Store the latest `callback` in a ref so the debounced wrapper never needs
//   to be recreated.  The wrapper itself is stable (empty dep array) and
//   always calls the up-to-date callback via the ref.
// ---------------------------------------------------------------------------
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  // Always holds the latest version of callback without causing re-renders
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable reference — created once, never recreated
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay] // Only recreate if the delay itself changes
  );
}
