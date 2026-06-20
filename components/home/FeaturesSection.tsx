'use client'

import Image from 'next/image'
import AnimateOnScroll from './AnimateOnScroll'
import Link from 'next/link'

const bullets = [
  {
    gradient: 'from-blue-600 to-blue-400',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Real vs Fake — Know Instantly',
    desc: 'Scan the QR code or enter the serial number to get an immediate GENUINE or COUNTERFEIT result from our live registry.',
  },
  {
    gradient: 'from-emerald-500 to-teal-400',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Every Product Registered & Traceable',
    desc: 'Brand, wattage, importer, and quality grade — every genuine panel is recorded and verifiable in under a second.',
  },
  {
    gradient: 'from-violet-500 to-purple-400',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Counterfeit Can\'t Be Cloned',
    desc: 'Each QR token is a unique UUID tied to one product — fakes cannot replicate it, giving you foolproof protection.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── LEFT: Image ── */}
          <AnimateOnScroll>
            <div className="relative">
              {/* Decorative blobs behind image */}
              <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', filter: 'blur(32px)' }} />
              <div className="absolute -bottom-8 -right-8 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)', filter: 'blur(28px)' }} />

              {/* Image frame */}
              <div className="relative rounded-3xl overflow-hidden" style={{ background: '#0d1f3c', boxShadow: '0 32px 64px -16px rgba(99,102,241,0.2), 0 8px 32px -8px rgba(0,0,0,0.12)' }}>
                <Image
                  src="/real.jpg"
                  alt="Real vs Fake Solar Panel Verification"
                  width={900}
                  height={900}
                  className="w-full object-contain"
                  style={{ display: 'block' }}
                  unoptimized
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* ── RIGHT: Details ── */}
          <AnimateOnScroll delay={120}>
            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              Why OriginalSolars
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Protect Your{' '}
              <span style={{ backgroundImage: 'linear-gradient(120deg,#6366f1,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Solar Investment
              </span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
              Counterfeit solar panels underperform, void warranties, and can be a fire hazard. Our verification platform gives every buyer instant confidence at the point of purchase.
            </p>

            {/* Bullet list */}
            <div className="space-y-4">
              {bullets.map((b, i) => (
                <AnimateOnScroll key={b.title} delay={i * 80}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group" style={{ background: '#fafbff' }}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{b.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>


          </AnimateOnScroll>

        </div>
      </div>
    </section>
  )
}
