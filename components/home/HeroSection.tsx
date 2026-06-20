'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 60); return () => clearTimeout(t) }, [])

  const fade = (delay: number) =>
    `transition-all duration-700 ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#030C1A]">
      {/* Animated dot grid */}
      <div className="absolute inset-0 hero-dot-grid" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[100px] animate-orb-1 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[360px] h-[360px] rounded-full bg-emerald-500/15 blur-[90px] animate-orb-2 pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-[200px] h-[200px] rounded-full bg-violet-600/10 blur-[70px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full px-5 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* ── LEFT COPY ── */}
        <div className="flex-1 text-left w-full">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 mb-7 ${fade(0)}`}
            style={{ transitionDelay: `${m ? 0 : 0}ms` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold tracking-[0.15em] uppercase">
              Solar Product Authentication
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-white leading-[1.04] mb-5 ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 180ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) 180ms' }}
          >
            DON&apos;T BUY
            <br />
            <span
              className="animate-shimmer-text"
              style={{
                backgroundImage: 'linear-gradient(120deg, #60a5fa, #34d399, #818cf8, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FAKE SOLAR
            </span>
          </h1>

          {/* Sub */}
          <p
            className={`text-slate-400 text-base sm:text-lg max-w-[420px] leading-relaxed mb-7 sm:mb-9 ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transition: 'opacity 0.8s ease 340ms, transform 0.8s ease 340ms' }}
          >
            Counterfeit solar panels are flooding the market. Verify your solar panel in seconds — scan the QR code or enter the serial number to confirm it&apos;s genuine.
          </p>


          {/* Micro stats */}
          <div
            className={`flex gap-8 justify-start ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transition: 'opacity 0.8s ease 620ms, transform 0.8s ease 620ms' }}
          >
            {[
              { val: '10K+', label: 'Solar Products Verified' },
              { val: '20+', label: 'Registered Brands' },
              { val: '<1s', label: 'Result Time' },
            ].map(s => (
              <div key={s.label} className="text-left">
                <div className="text-xl font-black text-white tabular-nums">{s.val}</div>
                <div className="text-slate-500 text-[11px] uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        <div
          className={`shrink-0 flex justify-center w-full lg:w-auto ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transition: 'opacity 1s ease 280ms, transform 1s ease 280ms' }}
        >
          <PhoneMockup />
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600 ${m ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 1s ease 1200ms' }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-slate-600 to-transparent" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative animate-float select-none" style={{ width: 260 }}>
      {/* Glow */}
      <div className="absolute inset-10 bg-blue-500/25 blur-3xl rounded-full" />

      {/* Phone shell */}
      <div
        className="relative w-[260px] h-[520px] rounded-[2.8rem] border border-slate-700/70 shadow-2xl shadow-black/60 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1e293b,#0f172a)' }}
      >
        {/* Screen */}
        <div className="absolute inset-[6px] rounded-[2.3rem] overflow-hidden flex flex-col" style={{ background: '#080f1e' }}>
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 pt-5 pb-1">
            <span className="text-white/50 text-[11px] font-medium">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
              <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
            </div>
          </div>

          {/* App header */}
          <div className="px-5 pt-3 pb-3 border-b border-white/5">
            <div className="text-white/35 text-[10px] uppercase tracking-[0.18em] mb-0.5">OriginalSolars</div>
            <div className="text-white font-bold text-[15px]">Verify Solar Product</div>
          </div>

          {/* Camera / QR area */}
          <div className="mx-4 mt-4 flex-1 rounded-2xl relative overflow-hidden border border-white/6" style={{ background: '#040d1a', minHeight: 200 }}>
            {/* QR pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <QRSvg />
            </div>

            {/* Corner brackets */}
            {[
              'top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
              'top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
              'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
              'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
            ].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 border-blue-400/80 ${cls}`} />
            ))}

            {/* Animated scan line */}
            <div className="scan-line" />
          </div>

          {/* Result card */}
          <div className="mx-4 my-4 rounded-2xl border border-emerald-500/25 p-3.5 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.07)' }}>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-emerald-400 text-[11px] font-bold tracking-wide">GENUINE SOLAR PANEL</div>
              <div className="text-white/40 text-[11px] mt-0.5">Verified in 0.3s</div>
            </div>
            <div className="ml-auto text-emerald-400/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-3">
            <div className="w-20 h-1 bg-white/15 rounded-full" />
          </div>
        </div>
      </div>

{/* Floating scan badge */}
      <div className="absolute -left-8 bottom-24 bg-slate-900 border border-slate-700 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 animate-float-slow" style={{ animationDelay: '1.2s' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-blue-300 text-[11px] font-semibold">Reading serial...</span>
      </div>
    </div>
  )
}

function QRSvg() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" opacity={0.35}>
      {/* TL finder */}
      <rect x="4" y="4" width="24" height="24" rx="2" stroke="white" strokeWidth="3" fill="none" />
      <rect x="10" y="10" width="12" height="12" rx="1" fill="white" />
      {/* TR finder */}
      <rect x="62" y="4" width="24" height="24" rx="2" stroke="white" strokeWidth="3" fill="none" />
      <rect x="68" y="10" width="12" height="12" rx="1" fill="white" />
      {/* BL finder */}
      <rect x="4" y="62" width="24" height="24" rx="2" stroke="white" strokeWidth="3" fill="none" />
      <rect x="10" y="68" width="12" height="12" rx="1" fill="white" />
      {/* Data modules */}
      {[
        [34,4],[42,4],[50,4],[34,12],[50,12],[34,20],
        [34,34],[42,34],[58,34],[66,34],[74,34],[82,34],
        [34,42],[58,42],[82,42],
        [34,50],[42,50],[50,50],[66,50],
        [34,58],[50,58],[66,58],[74,58],
        [42,66],[50,66],[82,66],
        [34,74],[58,74],[66,74],[82,74],
        [42,82],[58,82],[74,82],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="6" rx="0.5" fill="white" />
      ))}
    </svg>
  )
}
