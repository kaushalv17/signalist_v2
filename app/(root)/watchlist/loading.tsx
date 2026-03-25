export default function WatchlistLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-gray-700" />
          <div className="h-4 w-24 rounded bg-gray-800" />
        </div>
        <div className="h-9 w-28 rounded bg-gray-700" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <div className="h-10 bg-gray-800 border-b border-gray-700" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-gray-800 bg-gray-900 flex items-center px-4 gap-6"
          >
            <div className="h-4 w-32 rounded bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-700" />
            <div className="h-4 w-20 rounded bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
