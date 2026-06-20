import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import BrandsGrid from '@/components/home/BrandsGrid'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data: brands } = await supabase.from('brands').select('id, name, logo_url, description').order('name')

  return (
    <div className="min-h-screen" style={{ background: '#f8faff' }}>
      {/* ── Sticky Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b border-gray-100"
        style={{ background: 'rgba(248,250,255,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-black text-gray-900 tracking-tight text-sm sm:text-base">OriginalSolars</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="#how-it-works" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors hidden md:block">
              How It Works
            </Link>
            <Link href="#brands" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors hidden md:block">
              Brands
            </Link>
            <Link
              href="#brands"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-2 px-3 sm:px-5 rounded-xl transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              Verify Product
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── How It Works ── */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* ── Features ── */}
      <FeaturesSection />

      {/* ── Brand Showcase ── */}
      <section id="brands" className="relative overflow-hidden" style={{ background: '#f0f4ff' }}>
        {/* Background ambient orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-28">
          {/* Section header */}
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              Official Brands
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-gray-900">VERIFY BY </span>
              <span style={{ backgroundImage: 'linear-gradient(120deg,#6366f1 0%,#8b5cf6 50%,#3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                BRAND
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
              Select the solar brand on your solar panel to instantly check its authenticity.
            </p>
          </div>

          <BrandsGrid brands={brands ?? []} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#030C1A' }} className="border-t border-white/6 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-white/50 text-sm font-medium">OriginalSolars</span>
          </div>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} OriginalSolars. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
