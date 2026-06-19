'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { normalizeSerial } from '@/lib/utils'

interface Brand { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    serial_number: '',
    brand_id: '',
    product_name: '',
    sales_destination: '',
    importer_name: '',
    level: '',
    wattage: '',
    result: 'PASS',
    grade: '',
  })

  useEffect(() => {
    supabase.from('brands').select('id, name').order('name').then(({ data }) => {
      if (data) setBrands(data)
    })
  }, [])

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error: insertError } = await supabase
      .from('products')
      .insert({
        ...form,
        serial_number: normalizeSerial(form.serial_number),
        created_by: user?.id,
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push(`/admin/products/${data.id}`)
    }
  }

  const fields: { key: string; label: string; placeholder?: string }[] = [
    { key: 'product_name', label: 'Product Name', placeholder: 'e.g. Solar Panel 400W' },
    { key: 'sales_destination', label: 'Sales Destination', placeholder: 'e.g. Pakistan' },
    { key: 'importer_name', label: 'Importer Name', placeholder: 'e.g. ABC Imports Ltd' },
    { key: 'level', label: 'Level', placeholder: 'e.g. Grade A' },
    { key: 'wattage', label: 'Wattage', placeholder: 'e.g. 400W' },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the product details — a barcode and QR code will be generated automatically</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
          <input
            type="text"
            value={form.serial_number}
            onChange={e => set('serial_number', e.target.value.trim().toUpperCase())}
            required
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            placeholder="e.g. SOL-2024-AB01"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <select
            value={form.brand_id}
            onChange={e => set('brand_id', e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select brand...</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Dynamic fields */}
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} *</label>
            <input
              type="text"
              value={(form as any)[f.key]}
              onChange={e => set(f.key, e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={f.placeholder}
            />
          </div>
        ))}

        {/* Result */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Result *</label>
          <select
            value={form.result}
            onChange={e => set('result', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
          <select
            value={form.grade}
            onChange={e => set('grade', e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select grade...</option>
            <option value="A Grade">A Grade</option>
            <option value="B Grade">B Grade</option>
            <option value="C Grade">C Grade</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 px-8 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Saving...' : 'Save & Generate Codes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
