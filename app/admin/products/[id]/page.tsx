import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCodesClient from './ProductCodesClient'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, brands(name)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const { count: scanCount } = await supabase
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', id)

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify/${product.verification_token}`

  const details = [
    { label: 'Serial Number', value: product.serial_number, mono: true },
    { label: 'Brand', value: (product as any).brands?.name ?? '—' },
    { label: 'Product Name', value: product.product_name },
    { label: 'Sales Destination', value: product.sales_destination },
    { label: 'Importer', value: product.importer_name },
    { label: 'Level', value: product.level },
    { label: 'Wattage', value: product.wattage },
    { label: 'Result', value: product.result },
    { label: 'Created', value: new Date(product.created_at).toLocaleString() },
    { label: 'Total Scans', value: String(scanCount ?? 0) },
  ]

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/30 transition-all hover:scale-[1.03]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700 font-medium">{product.serial_number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-5">{product.product_name}</h1>
          <dl className="space-y-3">
            {details.map(d => (
              <div key={d.label} className="flex justify-between text-sm">
                <dt className="text-gray-500 font-medium">{d.label}</dt>
                <dd className={`text-gray-900 text-right max-w-[55%] break-all ${d.mono ? 'font-mono text-xs' : ''}`}>
                  {d.label === 'Result' ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      d.value === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{d.value}</span>
                  ) : d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Codes */}
        <ProductCodesClient serialNumber={product.serial_number} verifyUrl={verifyUrl} productName={product.product_name} />
      </div>
    </div>
  )
}
