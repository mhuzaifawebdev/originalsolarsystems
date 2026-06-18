'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Brand {
  id: string
  name: string
  logo_url: string | null
  description?: string | null
  created_at: string
  product_count?: number
}

function DeleteModal({ name, onConfirm, onCancel, loading }: {
  name: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-gray-900 mb-1">Delete Brand?</h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-800">&ldquo;{name}&rdquo;</span> and all its data will be permanently deleted.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2">
            {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ brand, onSave, onCancel }: {
  brand: Brand; onSave: (id: string, name: string, description: string, file: File | null) => Promise<void>; onCancel: () => void
}) {
  const [editName, setEditName] = useState(brand.name)
  const [editDescription, setEditDescription] = useState(brand.description || '')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(brand.logo_url)
  const [editDrag, setEditDrag] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const applyFile = (f: File | null) => {
    setEditFile(f)
    setEditPreview(f ? URL.createObjectURL(f) : brand.logo_url)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return
    setSaving(true)
    await onSave(brand.id, editName.trim(), editDescription.trim(), editFile)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Edit Brand</h2>
            <p className="text-xs text-gray-400">Update name or logo</p>
          </div>
          <button onClick={onCancel} className="ml-auto w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Brand Name *</label>
            <input
              type="text" value={editName} onChange={e => setEditName(e.target.value)} required autoFocus
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} placeholder="Optional brand description..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Logo</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); setEditDrag(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) applyFile(f) }}
              onDragOver={e => { e.preventDefault(); setEditDrag(true) }}
              onDragLeave={() => setEditDrag(false)}
              className="cursor-pointer rounded-xl border-2 border-dashed transition-all flex items-center gap-3 px-4 py-3"
              style={{ borderColor: editDrag ? '#6366f1' : editPreview ? '#6366f1' : '#e5e7eb', background: editPreview ? 'rgba(99,102,241,0.03)' : '#fafafa' }}
            >
              {editPreview ? (
                <>
                  <div className="w-14 h-14 rounded-xl border border-gray-100 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    <Image src={editPreview} alt="preview" width={56} height={56} className="object-contain w-full h-full p-1" unoptimized />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-600">{editFile ? editFile.name : 'Current logo'}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Click to replace image</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.08)' }}>
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Drop or click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
                  </div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={e => applyFile(e.target.files?.[0] ?? null)} className="hidden" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
            >
              {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BrandsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editTarget, setEditTarget] = useState<Brand | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('name')
    if (!data) return
    const { data: counts } = await supabase.from('products').select('brand_id')
    const countMap: Record<string, number> = {}
    for (const p of counts ?? []) {
      if (p.brand_id) countMap[p.brand_id] = (countMap[p.brand_id] ?? 0) + 1
    }
    setBrands(data.map(b => ({ ...b, product_count: countMap[b.id] ?? 0 })))
    setInitialLoading(false)
  }

  useEffect(() => { fetchBrands() }, [])

  const applyFile = (file: File | null) => {
    setLogoFile(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const t = toast.loading('Adding brand...')
    let logo_url: string | null = null
    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-logos').upload(`${Date.now()}.${ext}`, logoFile, { upsert: true })
      if (uploadError) { toast.error(uploadError.message, { id: t }); setLoading(false); return }
      logo_url = supabase.storage.from('brand-logos').getPublicUrl(uploadData.path).data.publicUrl
    }
    const { error } = await supabase.from('brands').insert({ name: name.trim(), description: description.trim(), logo_url })
    if (error) { toast.error(error.message, { id: t }) }
    else {
      toast.success(`Brand "${name.trim()}" added!`, { id: t })
      setName(''); setDescription(''); setLogoFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      setFormOpen(false)
      await fetchBrands()
    }
    setLoading(false)
  }

  const handleEdit = async (id: string, newName: string, newDesc: string, file: File | null) => {
    const t = toast.loading('Updating brand...')
    let logo_url: string | undefined = undefined
    if (file) {
      const ext = file.name.split('.').pop()
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-logos').upload(`${Date.now()}.${ext}`, file, { upsert: true })
      if (uploadError) { toast.error(uploadError.message, { id: t }); return }
      logo_url = supabase.storage.from('brand-logos').getPublicUrl(uploadData.path).data.publicUrl
    }
    const update: Record<string, string> = { name: newName, description: newDesc }
    if (logo_url) update.logo_url = logo_url
    const { error } = await supabase.from('brands').update(update).eq('id', id)
    if (error) { toast.error(error.message, { id: t }) }
    else {
      toast.success(`Brand updated!`, { id: t })
      setEditTarget(null)
      await fetchBrands()
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const t = toast.loading('Deleting brand...')
    await supabase.from('brands').delete().eq('id', deleteTarget.id)
    toast.success(`"${deleteTarget.name}" deleted`, { id: t })
    setDeleteTarget(null); setDeleteLoading(false)
    await fetchBrands()
  }

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 sm:p-7 min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#f8f9fe 50%,#f0fdf4 100%)' }}>
      {/* Header */}
      <div className="mb-6 sm:mb-7 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Brands</h1>
          {initialLoading
            ? <div className="skeleton h-4 w-36 mt-1" />
            : <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{brands.length} brand{brands.length !== 1 ? 's' : ''} registered</p>
          }
        </div>
        <button
          onClick={() => setFormOpen(f => !f)}
          className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.03]"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Brand
        </button>
      </div>

      {/* Add Form */}
      {formOpen && (
        <div className="mb-6 bg-white rounded-2xl border border-indigo-100 shadow-lg p-6">
          <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Add New Brand
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Brand Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required autoFocus placeholder="e.g. Jinko Solar"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. A leading solar brand"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Logo</label>
              <div onClick={() => fileRef.current?.click()}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) applyFile(f) }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
                className="cursor-pointer rounded-xl border-2 border-dashed transition-all flex items-center gap-2.5 px-3.5 py-2.5"
                style={{ borderColor: dragOver ? '#6366f1' : preview ? '#6366f1' : '#e5e7eb', background: preview ? 'rgba(99,102,241,0.03)' : '#fafafa' }}
              >
                {preview ? (
                  <><div className="w-9 h-9 rounded-lg border border-gray-100 bg-white overflow-hidden flex items-center justify-center shrink-0">
                    <Image src={preview} alt="preview" width={36} height={36} className="object-contain w-full h-full p-0.5" />
                  </div><div><p className="text-xs font-bold text-indigo-600 max-w-[120px] truncate">{logoFile?.name}</p><p className="text-[10px] text-gray-400">Click to change</p></div></>
                ) : (
                  <><div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.08)' }}>
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div><div><p className="text-xs font-semibold text-gray-500">Drop or click</p><p className="text-[10px] text-gray-400">PNG, JPG, WebP</p></div></>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => applyFile(e.target.files?.[0] ?? null)} className="hidden" />
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
              >
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                {loading ? 'Saving...' : '+ Add Brand'}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)' }}>
              <th className="text-left px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Logo</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Brand Name</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Products</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-widest">Added</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {/* Logo */}
                  <td className="px-6 py-3">
                    <div className="skeleton w-24 h-14 rounded-xl" style={{ animationDelay: `${i * 0.06}s` }} />
                  </td>
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="skeleton h-4" style={{ width: [120, 100, 140, 90, 130, 110][i], animationDelay: `${i * 0.06 + 0.05}s` }} />
                  </td>
                  {/* Products count */}
                  <td className="px-6 py-4">
                    <div className="skeleton h-6 w-24 rounded-full" style={{ animationDelay: `${i * 0.06 + 0.1}s` }} />
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="skeleton h-3 w-20" style={{ animationDelay: `${i * 0.06 + 0.15}s` }} />
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="skeleton h-7 w-20 rounded-lg" style={{ animationDelay: `${i * 0.06 + 0.2}s` }} />
                      <div className="skeleton h-7 w-14 rounded-lg" style={{ animationDelay: `${i * 0.06 + 0.25}s` }} />
                      <div className="skeleton h-7 w-16 rounded-lg" style={{ animationDelay: `${i * 0.06 + 0.3}s` }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                {search ? `No brands matching "${search}"` : 'No brands yet — add your first brand above.'}
              </td></tr>
            ) : filtered.map(brand => (
              <tr key={brand.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-6 py-3">
                  <div className="w-24 h-14 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                    {brand.logo_url ? (
                      <Image src={brand.logo_url} alt={brand.name} width={96} height={56} className="object-contain w-full h-full" unoptimized />
                    ) : (
                      <span className="text-2xl font-black text-indigo-600">{brand.name[0].toUpperCase()}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{brand.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {brand.product_count ?? 0} products
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(brand.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => router.push(`/admin/products?brand=${brand.id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Products
                    </button>
                    <button onClick={() => setEditTarget(brand)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(brand)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal name={deleteTarget.name} onConfirm={confirmDelete}
          onCancel={() => !deleteLoading && setDeleteTarget(null)} loading={deleteLoading} />
      )}

      {editTarget && (
        <EditModal brand={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      )}
    </div>
  )
}
