'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { updateProduct } from '@/app/admin/products/actions'

interface Brand { id: string; name: string }
interface Product {
  id: string
  product_name: string
  serial_number: string
  wattage: string
  result: string
  sales_destination: string
  importer_name: string
  level: string
  brand_id: string
}

interface Props {
  product: Product
  brands: Brand[]
}

export default function EditProductForm({ product, brands }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    product_name: product.product_name ?? '',
    serial_number: product.serial_number ?? '',
    wattage: product.wattage ?? '',
    result: product.result ?? 'PASS',
    sales_destination: product.sales_destination ?? '',
    importer_name: product.importer_name ?? '',
    level: product.level ?? '',
    brand_id: product.brand_id ?? '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const t = toast.loading('Saving changes...')
    try {
      await updateProduct(product.id, form)
      toast.success('Product updated!', { id: t })
      router.push('/admin/products')
    } catch {
      toast.error('Failed to update product', { id: t })
    } finally {
      setSaving(false)
    }
  }

  const field = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Product Name</label>
          <input className={field} value={form.product_name} onChange={set('product_name')} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Serial Number</label>
          <input className={field} value={form.serial_number} onChange={set('serial_number')} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Brand</label>
          <select className={field} value={form.brand_id} onChange={set('brand_id')} required>
            <option value="">Select brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Wattage</label>
          <input className={field} value={form.wattage} onChange={set('wattage')} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Result</label>
          <select className={field} value={form.result} onChange={set('result')}>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Level</label>
          <input className={field} value={form.level} onChange={set('level')} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Sales Destination</label>
          <input className={field} value={form.sales_destination} onChange={set('sales_destination')} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Importer</label>
          <input className={field} value={form.importer_name} onChange={set('importer_name')} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 px-6 rounded-xl transition-all"
        >
          {saving && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 py-2.5 px-6 rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
