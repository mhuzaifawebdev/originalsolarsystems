import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { normalizeSerial } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function VerifySerialPage({ params }: { params: Promise<{ serial: string }> }) {
  const { serial } = await params
  const supabase = await createClient()

  const cleaned = normalizeSerial(decodeURIComponent(serial))

  const { data: product } = await supabase
    .from('products')
    .select('verification_token')
    .eq('serial_number', cleaned)
    .single()

  if (!product) {
    // Redirect to token page with a sentinel that shows not-found
    notFound()
  }

  // Redirect to the token-based verify page so scan is logged once
  redirect(`/verify/${product.verification_token}`)
}
