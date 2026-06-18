'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductFilters({ brands }: { brands: { id: string, name: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const brand = searchParams.get('brand') || ''
  const result = searchParams.get('result') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // reset page on filter change
    router.push(`/admin/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('brand')
    params.delete('result')
    params.set('page', '1')
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">Brand</span>
        <select 
          value={brand} 
          onChange={(e) => updateFilter('brand', e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-3 py-2 min-w-[140px] focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em', paddingRight: '2.5rem' }}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">Result</span>
        <select 
          value={result} 
          onChange={(e) => updateFilter('result', e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-3 py-2 min-w-[120px] focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em', paddingRight: '2.5rem' }}
        >
          <option value="">All Results</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
      </div>

      {(brand || result) && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:border-red-200 px-3 py-2 rounded-xl transition-all shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  )
}
