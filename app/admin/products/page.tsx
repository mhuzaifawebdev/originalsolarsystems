import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductActions from '@/components/admin/ProductActions'

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total} products registered</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shadow-md shadow-blue-500/25"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Brand</span>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={buildUrl(1, { brand: undefined })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !brandFilter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              All
            </Link>
            {(brands ?? []).map(b => (
              <Link
                key={b.id}
                href={buildUrl(1, { brand: b.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  brandFilter === b.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-gray-200" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Result</span>
          <div className="flex gap-1.5">
            {[
              { label: 'All', value: undefined },
              { label: 'PASS', value: 'PASS' },
              { label: 'FAIL', value: 'FAIL' },
            ].map(opt => (
              <Link
                key={opt.label}
                href={buildUrl(1, { result: opt.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resultFilter === opt.value || (!resultFilter && !opt.value)
                    ? opt.value === 'PASS'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : opt.value === 'FAIL'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        {(brandFilter || resultFilter) && (
          <Link
            href="/admin/products"
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 bg-white border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>
              {['Serial No.', 'Product', 'Brand', 'Wattage', 'Result', 'Date', ''].map((h, i) => (
                <th
                  key={i}
                  className={`px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-widest ${i < 6 ? 'text-left' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products && products.length > 0 ? products.map((p: any) => (
              <tr key={p.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.serial_number}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{p.product_name}</td>
                <td className="px-6 py-4 text-gray-600">{p.brands?.name ?? '—'}</td>
                <td className="px-6 py-4 text-gray-600">{p.wattage}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    p.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>{p.result}</span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
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

        {/* Pagination bar */}
        {total > 0 && (
          <div
            className="flex items-center justify-between px-6 py-4 border-t border-gray-100"
            style={{ background: 'linear-gradient(135deg,#f8f7ff 0%,#f3f0ff 100%)' }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Show</span>
              <div className="flex items-center gap-1">
                {PER_PAGE_OPTIONS.map(n => (
                  <Link
                    key={n}
                    href={buildUrl(1, { per: String(n) })}
                    className={`w-10 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      perPage === n
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {n}
                  </Link>
                ))}
              </div>
              <span className="font-medium">per page</span>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{from + 1}–{Math.min(to + 1, total)}</span> of <span className="font-bold text-gray-800">{total}</span> products
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={buildUrl(page - 1)}
                aria-disabled={page <= 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  page <= 1
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30 hover:scale-[1.03]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        page === p2
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
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
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  page >= totalPages
                    ? 'pointer-events-none bg-gray-100 text-gray-400'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30 hover:scale-[1.03]'
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
