import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditProductForm from '@/components/admin/EditProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: brands }] = await Promise.all([
    supabase.from('products').select('*, brands(name)').eq('id', id).single(),
    supabase.from('brands').select('id, name').order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="p-8 max-w-2xl">
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
        <span className="text-sm text-gray-500">Edit <span className="font-semibold text-gray-800">{product.product_name}</span></span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>
        <EditProductForm product={product} brands={brands ?? []} />
      </div>
    </div>
  )
}
