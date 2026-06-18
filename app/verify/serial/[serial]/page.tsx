import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { normalizeSerial } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function VerifySerialPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ serial: string }>
  searchParams: Promise<{ brand?: string }>
}) {
  const { serial } = await params
  const { brand } = await searchParams
  const supabase = await createClient()

  const cleaned = normalizeSerial(decodeURIComponent(serial))

  let query = supabase
    .from('products')
    .select('verification_token, brands!inner(name)')
    .eq('serial_number', cleaned)

  if (brand) {
    query = query.ilike('brands.name', brand)
  }

  const { data: product } = await query.single()

  if (!product) {
    // Redirect to token page with a sentinel that shows not-found
    notFound()
  }

  // Redirect to the token-based verify page so scan is logged once
  redirect(`/verify/${product.verification_token}`)
}
