export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-yellow-500" />
        <p className="text-sm text-gray-500 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
