export function SkeletonBlock({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function ProductGridSkeleton({ count = 4, className = 'grid-cols-2 gap-3 lg:grid-cols-4' }) {
  return (
    <div role="status" aria-label="Loading products" className={`grid ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-gray-100 p-2">
          <SkeletonBlock className="aspect-square w-full rounded-xl" />
          <SkeletonBlock className="mt-3 h-3 w-4/5" />
          <SkeletonBlock className="mt-2 h-3 w-2/5" />
          <SkeletonBlock className="mt-3 h-9 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton({ count = 4, className = '' }) {
  return (
    <div role="status" aria-label="Loading content" className={`space-y-3 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
          <SkeletonBlock className="h-16 w-16 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-1/2" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 4 }) {
  return (
    <div role="status" aria-label="Loading table" className="space-y-4 p-5">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, column) => (
            <SkeletonBlock key={column} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ admin = false }) {
  return (
    <div role="status" aria-label="Loading page" className="min-h-screen bg-white">
      {admin ? (
        <div className="flex min-h-screen bg-gray-50">
          <SkeletonBlock className="hidden w-64 rounded-none md:block" />
          <div className="flex-1">
            <SkeletonBlock className="h-16 rounded-none border-b border-gray-100" />
            <div className="space-y-5 p-5 md:p-8">
              <SkeletonBlock className="h-8 w-48" />
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => <SkeletonBlock key={index} className="h-28 rounded-2xl" />)}
              </div>
              <SkeletonBlock className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl space-y-5 px-4 pt-5 lg:pl-64">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-6 w-6 rounded-full" />
          </div>
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-48 w-full rounded-2xl md:h-80" />
          <SkeletonBlock className="h-6 w-44" />
          <ProductGridSkeleton count={4} />
        </div>
      )}
    </div>
  );
}
