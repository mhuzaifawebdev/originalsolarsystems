'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(id: string) {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath('/admin')
}

export async function updateProduct(id: string, data: {
  product_name: string
  serial_number: string
  wattage: string
  result: string
  sales_destination: string
  importer_name: string
  level: string
  brand_id: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/admin')
}
