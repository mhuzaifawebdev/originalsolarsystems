'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { normalizeSerial } from '@/lib/utils'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false })

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}


function VerifyPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'serial' | 'scan'>('serial')
  const [serial, setSerial] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setCaptchaCode(generateCode())
  }, [])

  const refreshCode = () => {
    setCaptchaCode(generateCode())
    setCaptchaInput('')
    setError(null)
  }

  const handleSerialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = normalizeSerial(serial)
    if (!cleaned) { setError('Please enter a serial number.'); return }

    if (captchaInput !== captchaCode) {
      setError('Verification code does not match. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      refreshCode()
      setCaptchaInput('')
      return
    }

    const brand = searchParams.get('brand')
    const qs = brand ? `?brand=${encodeURIComponent(brand)}` : ''
    router.push(`/verify/serial/${encodeURIComponent(cleaned)}${qs}`)
  }

  const handleScan = useCallback((data: string) => {
    try {
      const url = new URL(data)
      const pathParts = url.pathname.split('/')
      const tokenIndex = pathParts.indexOf('verify') + 1
      const token = pathParts[tokenIndex]
      if (token) {
        router.push(`/verify/${token}`)
      } else {
        setError('QR code is not a valid product verification code.')
      }
    } catch {
      setError('Could not read QR code. Please try again or enter the serial number manually.')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4ff' }}>
      {/* Nav */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b border-gray-200"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-black text-gray-900 text-sm sm:text-base tracking-tight">OriginalSolarSystems</span>
          </Link>
          <Link
            href="/"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 transition-all hover:scale-[1.03]"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden flex-1 flex flex-col" style={{ paddingTop: 72 }}>
        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '5%', left: '15%', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px',
              borderRadius: 100, marginBottom: 16,
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Solar Product Verification
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              Verify Your{' '}
              <span style={{
                backgroundImage: 'linear-gradient(120deg,#2563eb,#7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Solar Product</span>
            </h1>
            <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>
              Enter the serial number or scan the QR code on your solar panel to confirm authenticity.
            </p>
          </div>

          {/* Card */}
          <div style={{
            width: '100%', maxWidth: 460,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 28, padding: 28,
            boxShadow: '0 20px 60px rgba(99,102,241,0.1), 0 4px 16px rgba(0,0,0,0.06)',
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex', background: '#f3f4f6', borderRadius: 14,
              padding: 4, marginBottom: 24,
            }}>
              {(['serial', 'scan'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null) }}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 11, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', border: 'none', transition: 'all 0.25s ease',
                    background: tab === t ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'transparent',
                    color: tab === t ? 'white' : '#9ca3af',
                    boxShadow: tab === t ? '0 4px 14px rgba(59,130,246,0.35)' : 'none',
                  }}
                >
                  {t === 'serial' ? '# Enter Serial' : '⬛ Scan QR Code'}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 16, padding: '12px 16px', borderRadius: 12,
                background: '#fef2f2', border: '1px solid #fecaca',
                fontSize: 13, color: '#dc2626', display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {tab === 'serial' ? (
              <form onSubmit={handleSerialSubmit} className="space-y-5">

                {/* Verification code CAPTCHA */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Verification Code
                  </label>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'stretch',
                    animation: shake ? 'shakeX 0.5s ease' : 'none',
                  }}>
                    {/* Code display box */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#eff6ff', border: '1px solid #bfdbfe',
                      borderRadius: 12, padding: '12px 16px', flexShrink: 0,
                    }}>
                      <span style={{
                        fontSize: 26, fontWeight: 900, letterSpacing: '0.15em',
                        color: '#2563eb', fontFamily: 'monospace',
                        userSelect: 'none',
                      }}>
                        {captchaCode}
                      </span>
                      <button
                        type="button"
                        onClick={refreshCode}
                        title="Refresh code"
                        style={{
                          width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: '#dbeafe', color: '#2563eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease', flexShrink: 0,
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    {/* Code input */}
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={e => { setCaptchaInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(null) }}
                      maxLength={4}
                      inputMode="numeric"
                      placeholder="Enter code"
                      style={{
                        flex: 1, background: 'white', border: '1px solid #d1d5db',
                        borderRadius: 12, padding: '12px 16px', fontSize: 20, fontWeight: 700,
                        color: '#111827', letterSpacing: '0.15em', fontFamily: 'monospace',
                        outline: 'none', minWidth: 0,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                    Type the 4-digit code shown above. Click ↻ to refresh.
                  </p>
                </div>

                {/* Serial number */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={serial}
                    onChange={e => { setSerial(e.target.value.trim().toUpperCase()); setError(null) }}
                    style={{
                      width: '100%', background: 'white', border: '1px solid #d1d5db',
                      borderRadius: 12, padding: '14px 16px', fontSize: 15, fontWeight: 700,
                      color: '#111827', letterSpacing: '0.1em', fontFamily: 'monospace',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    placeholder="e.g. SOL-2024-AB01"
                  />
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                    Found on the product label or packaging.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '15px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    color: 'white', fontSize: 15, fontWeight: 800, letterSpacing: '0.02em',
                    boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Verify Authenticity →
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
                  Point your camera at the QR code printed on the product
                </p>
                <QRScanner onScan={handleScan} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '20px 24px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span style={{ color: '#9ca3af', fontSize: 12 }}>© {new Date().getFullYear()} OriginalSolarSystems</span>
        </div>
      </footer>

      <style>{`
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        input::placeholder { color: #d1d5db !important; }
      `}</style>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageInner />
    </Suspense>
  )
}
