'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Pallet { id: string; name: string }

export default function ProductFilters({ brands }: { brands: { id: string; name: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const brand = searchParams.get('brand') || ''
  const pallet = searchParams.get('pallet') || ''

  const [pallets, setPallets] = useState<Pallet[]>([])

  useEffect(() => {
    if (!brand) { setPallets([]); return }
    supabase
      .from('pallets')
      .select('id, name')
      .eq('brand_id', brand)
      .order('name')
      .then(({ data }) => setPallets(data ?? []))
  }, [brand])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value); else params.delete(key)
    // reset pallet when brand changes
    if (key === 'brand') params.delete('pallet')
    params.set('page', '1')
    router.push(`/admin/products?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('brand')
    params.delete('pallet')
    params.set('page', '1')
    router.push(`/admin/products?${params.toString()}`)
  }

  const selectStyle = {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1em 1em',
    paddingRight: '2.5rem',
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Brand filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">Brand</span>
        <select
          value={brand}
          onChange={e => updateFilter('brand', e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-3 py-2 min-w-[140px] focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer appearance-none"
          style={selectStyle}
        >
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Pallet filter — always visible, options filtered by selected brand */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">Pallet</span>
        <select
          value={pallet}
          onChange={e => updateFilter('pallet', e.target.value)}
          disabled={!brand}
          className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-3 py-2 min-w-[150px] focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={selectStyle}
        >
          <option value="">{brand ? 'All Pallets' : 'Select brand first'}</option>
          {pallets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {(brand || pallet) && (
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
