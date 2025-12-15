"use client";


export default function ArticleSkeleton() {
  return (
    <main className="min-h-screen bg-white pb-20 animate-pulse">
      {/* ----- Hero Section ----- */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8 space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
            ))}
        </div>

        {/* Title */}
        <div className="h-12 md:h-16 w-3/4 bg-gray-200 rounded"></div>

        {/* Author & Meta */}
        <div className="flex items-center justify-between py-6 border-y border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-3 w-6 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* ----- Thumbnail ----- */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="aspect-[21/9] w-full bg-gray-200 rounded-2xl"></div>
      </div>

      {/* ----- Content ----- */}
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
      </div>

      {/* ----- Comments Section ----- */}
      <section className="max-w-3xl mx-auto px-4 mt-12 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-8 bg-gray-200 rounded"></div>
        </div>

        {/* Comment input */}
        <div className="h-16 w-full bg-gray-200 rounded-2xl"></div>

        {/* Comments list */}
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
      </section>

      {/* ----- Recommended Articles ----- */}
      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-24 w-full bg-gray-200 rounded-2xl"></div>
          ))}
      </div>
    </main>
  );
}
