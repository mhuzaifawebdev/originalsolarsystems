import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

async function logScan(productId: string, userAgent: string | null) {
  const supabase = await createClient()
  await supabase.from('verification_logs').insert({ product_id: productId, user_agent: userAgent })
}

export default async function VerifyTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  const { data: product } = await supabase
    .from('products')
    .select('*, brands(name, logo_url)')
    .eq('verification_token', token)
    .single()

  const Nav = () => (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b border-white/6"
      style={{ background: 'rgba(3,12,26,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-black text-white text-base tracking-tight">OriginalSolarSystems</span>
        </Link>
        <Link
          href="/verify"
          className="text-sm font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Verify another
        </Link>
      </div>
    </nav>
  )

  const Footer = () => (
    <footer style={{ background: '#030C1A' }} className="border-t border-white/6 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-white/50 text-sm font-medium">OriginalSolarSystems</span>
        </div>
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} OriginalSolarSystems. All rights reserved.</p>
        <Link href="/admin" className="text-white/25 hover:text-white/50 text-xs transition-colors">Admin →</Link>
      </div>
    </footer>
  )

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#030C1A' }}>
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-20">
          {/* Red glow orb */}
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{
            width: 100, height: 100, borderRadius: '50%', marginBottom: 28,
            background: 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.08))',
            border: '1.5px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(239,68,68,0.2)',
          }}>
            <svg className="w-12 h-12" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Product Not Found</h1>
          <p className="text-white/40 text-base mb-8 max-w-sm leading-relaxed">
            This product could not be verified. The QR code may be counterfeit or tampered with.
          </p>
          <Link
            href="/"
            className="font-bold text-sm text-white py-3 px-8 rounded-2xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 8px 24px rgba(239,68,68,0.35)' }}
          >
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  await logScan(product.id, userAgent)

  const { count: scanCount } = await supabase
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', product.id)

  const highScanWarning = (scanCount ?? 0) > 50
  const brand = (product as any).brands

  const details = [
    { label: 'Serial Number', value: product.serial_number, mono: true },
    { label: 'Brand', value: brand?.name ?? '—' },
    { label: 'Product', value: product.product_name },
    { label: 'Sales Destination', value: product.sales_destination },
    { label: 'Importer', value: product.importer_name },
    { label: 'Level', value: product.level },
    { label: 'Wattage', value: product.wattage },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030C1A' }}>
      <Nav />

      {/* ── Brand Hero ── */}
      <div className="relative overflow-hidden" style={{ paddingTop: 72 }}>
        {/* Deep background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg,#060e1f 0%,#0a1428 60%,#060e1f 100%)',
        }} />

        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '20%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '10%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Brand logo large display */}
          {brand?.logo_url ? (
            <div style={{
              position: 'relative', width: 220, height: 220, marginBottom: 32,
              borderRadius: 32,
              background: 'linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))',
              border: '1.5px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}>
              <Image
                src={brand.logo_url}
                alt={brand.name}
                fill
                className="object-contain p-5"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5)) brightness(1.05)' }}
              />
            </div>
          ) : (
            <div style={{
              width: 120, height: 120, borderRadius: 32, marginBottom: 32,
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56, fontWeight: 900, color: 'white',
              boxShadow: '0 0 60px rgba(99,102,241,0.4)',
            }}>
              {brand?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}

          {/* Brand name */}
          {brand?.name && (
            <p style={{
              fontSize: 13, fontWeight: 700, letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10,
            }}>
              {brand.name}
            </p>
          )}

          {/* Verified badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px', borderRadius: 100, marginBottom: 20,
            background: 'rgba(16,185,129,0.12)',
            border: '1.5px solid rgba(16,185,129,0.3)',
            boxShadow: '0 0 24px rgba(16,185,129,0.12)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(16,185,129,0.5)',
            }}>
              <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
              Genuine Product Verified
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            This product is{' '}
            <span style={{
              backgroundImage: 'linear-gradient(120deg,#34d399,#10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Authentic
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 420, lineHeight: 1.6 }}>
            Verified against the OriginalSolarSystems registry. This product is genuine and registered by an authorised importer.
          </p>
        </div>
      </div>

      {/* ── Details Section ── */}
      <div style={{ background: '#f1f5f9', flex: 1 }}>
        <div className="max-w-2xl mx-auto px-6 py-14">

          {/* High scan warning */}
          {highScanWarning && (
            <div style={{
              marginBottom: 24, padding: '14px 18px', borderRadius: 16,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
                <strong>High Scan Count:</strong> This product has been scanned {scanCount} times. Ensure the packaging was sealed upon purchase.
              </span>
            </div>
          )}

          {/* Quality badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
            padding: '6px 14px', borderRadius: 100,
            background: product.result === 'PASS' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${product.result === 'PASS' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: product.result === 'PASS' ? '#10b981' : '#ef4444',
            }} />
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
              color: product.result === 'PASS' ? '#065f46' : '#7f1d1d',
              textTransform: 'uppercase',
            }}>
              Quality Check: {product.result}
            </span>
          </div>

          {/* Details card */}
          <div style={{
            background: 'white', borderRadius: 24,
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            {details.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < details.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', flexShrink: 0, width: 160 }}>
                  {d.label}
                </span>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: '#0f172a', textAlign: 'right',
                  fontFamily: d.mono ? 'monospace' : 'inherit',
                  letterSpacing: d.mono ? '0.05em' : 'normal',
                }}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>

          {/* Brand crafted message */}
          <div style={{
            margin: '20px 0 4px',
            padding: '14px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(99,102,241,0.06))',
            border: '1px solid rgba(16,185,129,0.2)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#065f46', lineHeight: 1.6 }}>
              This product is meticulously crafted by{' '}
              <span style={{ fontWeight: 900, color: '#047857' }}>
                {brand?.name ?? 'the manufacturer'}
              </span>
              . Thank you for your trust and choice.
            </p>
          </div>

          {/* Verified timestamp */}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 12, fontWeight: 500 }}>
            Verified on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
            <Link
              href="/"
              style={{
                padding: '12px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: 'white',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/verify"
              style={{
                padding: '12px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700,
                background: 'white', color: '#475569',
                border: '1px solid #e2e8f0', textDecoration: 'none',
              }}
            >
              Verify Another
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
