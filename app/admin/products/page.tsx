import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductActions from '@/components/admin/ProductActions'
import ProductFilters from '@/components/admin/ProductFilters'

const PER_PAGE_OPTIONS = [10, 20, 50, 100]

interface Props {
  searchParams: Promise<{ page?: string; per?: string; brand?: string; result?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageStr, per: perStr, brand: brandFilter, result: resultFilter } = await searchParams
  const perPage = PER_PAGE_OPTIONS.includes(Number(perStr)) ? Number(perStr) : 20
  const page = Math.max(1, Number(pageStr) || 1)
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const supabase = await createClient()

  const { data: brands } = await supabase.from('brands').select('id, name').order('name')

  let query = supabase
    .from('products')
    .select('id, serial_number, product_name, wattage, result, created_at, brand_id, brands(name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (brandFilter) query = query.eq('brand_id', brandFilter)
  if (resultFilter) query = query.eq('result', resultFilter)

  const { data: products, count } = await query.range(from, to)

  const total = count ?? 0
  const totalPages = Math.ceil(total / perPage)

  const buildUrl = (p: number, overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams()
    params.set('page', String(p))
    params.set('per', String(perPage))
    if (brandFilter) params.set('brand', brandFilter)
    if (resultFilter) params.set('result', resultFilter)
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k)
    })
    return `/admin/products?${params.toString()}`
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{total} products registered</p>
        </div>
        <Link
          href="/admin/products/new"
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-blue-500/25"
        >
          + Add
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters brands={brands ?? []} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Serial No.</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Product</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest hidden sm:table-cell">Brand</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest hidden md:table-cell">Wattage</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Result</th>
                <th className="text-left px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-white/90 uppercase tracking-widest hidden md:table-cell">Date</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products && products.length > 0 ? products.map((p: any) => (
                <tr key={p.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs text-gray-500 max-w-[90px] sm:max-w-none truncate">{p.serial_number}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">{p.product_name}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{p.brands?.name ?? '—'}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{p.wattage}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}>{p.result}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs hidden md:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <ProductActions id={p.id} name={p.product_name} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                    No products found{brandFilter || resultFilter ? ' for the selected filters' : ''}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {total > 0 && (
          <div
            className="border-t border-gray-100 px-4 py-3 space-y-3"
            style={{ background: 'linear-gradient(135deg,#f8f7ff 0%,#f3f0ff 100%)' }}
          >
            {/* Row 1: per page + count */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="font-medium">Show</span>
                <div className="flex items-center gap-1">
                  {PER_PAGE_OPTIONS.map(n => (
                    <Link
                      key={n}
                      href={buildUrl(1, { per: String(n) })}
                      className={`w-9 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        perPage === n
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-500 border border-gray-200'
                      }`}
                    >
                      {n}
                    </Link>
                  ))}
                </div>
                <span className="font-medium">per page</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {from + 1}–{Math.min(to + 1, total)} of {total}
              </p>
            </div>

            {/* Row 2: prev / pages / next */}
            <div className="flex items-center justify-center gap-1.5">
              <Link
                href={buildUrl(page - 1)}
                aria-disabled={page <= 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  page <= 1
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </Link>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p2 = i + 1
                  if (totalPages > 5) {
                    if (page <= 3) p2 = i + 1
                    else if (page >= totalPages - 2) p2 = totalPages - 4 + i
                    else p2 = page - 2 + i
                  }
                  return (
                    <Link key={p2} href={buildUrl(p2)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        page === p2
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {p2}
                    </Link>
                  )
                })}
              </div>

              <Link
                href={buildUrl(page + 1)}
                aria-disabled={page >= totalPages}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  page >= totalPages
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                Next
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
