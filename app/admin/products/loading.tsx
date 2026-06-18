export default function ProductsLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <div className="skeleton h-7 w-28 mb-2" />
          <div className="skeleton h-4 w-40" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="skeleton h-9 w-16 rounded-xl" style={{ animationDelay: '0.05s' }} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-3 w-10" style={{ animationDelay: '0.1s' }} />
          <div className="skeleton h-9 w-36 rounded-xl" style={{ animationDelay: '0.15s' }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-3 w-12" style={{ animationDelay: '0.2s' }} />
          <div className="skeleton h-9 w-28 rounded-xl" style={{ animationDelay: '0.25s' }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>
                {[80, 120, 80, 56, 52, 72, 0].map((w, i) => (
                  <th key={i} className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                    {w > 0 && (
                      <div
                        className="h-2.5 rounded"
                        style={{ width: w, background: 'rgba(255,255,255,0.2)', animationDelay: `${i * 0.05}s` }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Array.from({ length: 9 }).map((_, row) => (
                <tr key={row} className="hover:bg-indigo-50/40">
                  {/* Serial */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="skeleton h-3 w-20" style={{ animationDelay: `${row * 0.04}s` }} />
                  </td>
                  {/* Product name */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div
                      className="skeleton h-3.5"
                      style={{ width: [120, 100, 140, 110, 130, 95, 145, 105, 125][row], animationDelay: `${row * 0.04 + 0.05}s` }}
                    />
                  </td>
                  {/* Brand */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="skeleton h-3 w-20" style={{ animationDelay: `${row * 0.04 + 0.1}s` }} />
                  </td>
                  {/* Wattage */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <div className="skeleton h-3 w-12" style={{ animationDelay: `${row * 0.04 + 0.15}s` }} />
                  </td>
                  {/* Result badge */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div
                      className="skeleton h-5 w-12 rounded-full"
                      style={{
                        background: row % 3 === 0
                          ? 'linear-gradient(90deg,#d1fae5 25%,#a7f3d0 50%,#d1fae5 75%)'
                          : 'linear-gradient(90deg,#fee2e2 25%,#fecaca 50%,#fee2e2 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeletonSweep 1.6s ease-in-out infinite',
                        animationDelay: `${row * 0.04 + 0.2}s`,
                      }}
                    />
                  </td>
                  {/* Date */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <div className="skeleton h-3 w-16" style={{ animationDelay: `${row * 0.04 + 0.25}s` }} />
                  </td>
                  {/* Actions */}
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="skeleton h-7 w-14 rounded-lg" style={{ animationDelay: `${row * 0.04 + 0.3}s` }} />
                      <div className="skeleton h-7 w-14 rounded-lg" style={{ animationDelay: `${row * 0.04 + 0.35}s` }} />
                      <div className="skeleton h-7 w-16 rounded-lg" style={{ animationDelay: `${row * 0.04 + 0.4}s` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination skeleton */}
        <div
          className="border-t border-gray-100 px-4 py-3 space-y-3"
          style={{ background: 'linear-gradient(135deg,#f8f7ff 0%,#f3f0ff 100%)' }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="skeleton h-3 w-10" />
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-7 w-9 rounded-lg" style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
              <div className="skeleton h-3 w-14" />
            </div>
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="skeleton h-8 w-16 rounded-lg" />
            {[0, 1, 2].map(i => (
              <div key={i} className="skeleton h-8 w-8 rounded-lg" style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
            <div className="skeleton h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
