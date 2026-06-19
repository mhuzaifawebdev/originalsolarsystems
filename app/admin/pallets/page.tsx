'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Brand { id: string; name: string }
interface Pallet { id: string; name: string; brand_id: string; created_at: string; brand: Brand }

export default function PalletsPage() {
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [pallets, setPallets] = useState<Pallet[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', brand_id: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPallets = async () => {
    const { data } = await supabase
      .from('pallets')
      .select('*, brand:brands(id, name)')
      .order('created_at', { ascending: false })
    if (data) setPallets(data as Pallet[])
  }

  useEffect(() => {
    Promise.all([
      supabase.from('brands').select('id, name').order('name'),
    ]).then(([{ data: b }]) => {
      if (b) setBrands(b)
    })
    fetchPallets().then(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.brand_id) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('pallets').insert({
      name: form.name.trim(),
      brand_id: form.brand_id,
    })
    if (err) { setError(err.message); setSaving(false); return }
    setForm({ name: '', brand_id: form.brand_id })
    await fetchPallets()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pallet? Products assigned to it will be unlinked.')) return
    setDeletingId(id)
    await supabase.from('pallets').delete().eq('id', id)
    await fetchPallets()
    setDeletingId(null)
  }

  const grouped = brands.reduce<Record<string, Pallet[]>>((acc, b) => {
    acc[b.id] = pallets.filter(p => p.brand_id === b.id)
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pallets</h1>
        <p className="text-gray-500 text-sm mt-1">Create pallets per brand, then assign products to them</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">New Pallet</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <select
            value={form.brand_id}
            onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}
            required
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select brand…</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Pallet name (e.g. P-2024-001)"
            required
            className="flex-[2] border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shrink-0"
          >
            {saving ? 'Creating…' : 'Create'}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      </div>

      {/* Pallet list grouped by brand */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Loading…</p>
      ) : pallets.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No pallets yet. Create one above.</div>
      ) : (
        <div className="space-y-6">
          {brands.filter(b => (grouped[b.id] ?? []).length > 0).map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{b.name}</span>
                <span className="text-xs text-gray-400">({grouped[b.id].length})</span>
              </div>
              <div className="divide-y divide-gray-50">
                {grouped[b.id].map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Created {new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-xs font-semibold text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                    >
                      {deletingId === p.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
