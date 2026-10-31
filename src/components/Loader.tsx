/**
 * Skeleton loader that mirrors the product-card grid layout.
 * Provides a shimmering placeholder while data is being fetched.
 */
export default function Loader({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          {/* Image placeholder */}
          <div className="h-52 bg-gray-200" />

          {/* Text placeholders */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
            <div className="flex items-center gap-3">
              <div className="h-5 bg-gray-200 rounded-full w-20" />
              <div className="h-3 bg-gray-100 rounded-full w-14" />
            </div>
            <div className="h-3 bg-gray-200 rounded-full w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

