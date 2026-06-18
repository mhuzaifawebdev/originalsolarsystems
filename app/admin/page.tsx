import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DashboardCharts from '@/components/admin/DashboardCharts'

function buildLast7Days() {
  const days: { label: string; iso: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      iso: d.toISOString().split('T')[0],
    })
  }
  return days
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    { count: productCount },
    { count: brandCount },
    { count: totalScans },
    { count: todayScans },
    { data: recentProducts },
    { data: scanLogs },
    { data: brandProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('verification_logs').select('*', { count: 'exact', head: true }),
    supabase.from('verification_logs').select('*', { count: 'exact', head: true }).gte('scanned_at', today.toISOString()),
    Promise.resolve({ data: null }),
    supabase.from('verification_logs').select('scanned_at').gte('scanned_at', sevenDaysAgo.toISOString()),
    supabase.from('products').select('brand_id, brands(name)'),
  ])

  // Build area chart data (scans per day, last 7 days)
  const days = buildLast7Days()
  const scanCountMap: Record<string, number> = {}
  for (const log of scanLogs ?? []) {
    const day = new Date(log.scanned_at).toISOString().split('T')[0]
    scanCountMap[day] = (scanCountMap[day] ?? 0) + 1
  }
  const scanData = days.map(d => ({ day: d.label, scans: scanCountMap[d.iso] ?? 0 }))

  // Build bar chart data (products per brand)
  const brandMap: Record<string, number> = {}
  for (const p of brandProducts ?? []) {
    const name = (p as any).brands?.name ?? 'Unknown'
    brandMap[name] = (brandMap[name] ?? 0) + 1
  }
  const brandData = Object.entries(brandMap)
    .map(([brand, products]) => ({ brand, products }))
    .sort((a, b) => b.products - a.products)
    .slice(0, 8)

  const statCards = [
    {
      label: 'Total Products',
      value: productCount ?? 0,
      sub: 'Registered',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      shadow: 'shadow-blue-500/30',
      link: '/admin/products/new',
      linkLabel: '+ Add product',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Total Brands',
      value: brandCount ?? 0,
      sub: 'Active',
      gradient: 'from-violet-500 via-purple-600 to-purple-700',
      shadow: 'shadow-violet-500/30',
      link: '/admin/brands',
      linkLabel: 'Manage brands',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: 'Total Scans',
      value: totalScans ?? 0,
      sub: 'All time',
      gradient: 'from-emerald-400 via-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30',
      link: null,
      linkLabel: null,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: "Today's Scans",
      value: todayScans ?? 0,
      sub: 'Today',
      gradient: 'from-orange-400 via-orange-500 to-rose-500',
      shadow: 'shadow-orange-500/30',
      link: null,
      linkLabel: null,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="p-4 sm:p-7 min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#f8f9fe 50%,#f0fdf4 100%)' }}>
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Welcome back — here&apos;s what&apos;s happening today.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl transition-all hover:scale-[1.03] shadow-lg shadow-blue-500/30"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-xl ${card.shadow} p-5 flex flex-col gap-4 relative overflow-hidden hover:scale-[1.02] transition-transform`}
          >
            {/* Decorative orbs */}
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/5" />

            <div className="flex items-center justify-between relative z-10">
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{card.label}</p>
              <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
                {card.icon}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-2xl sm:text-4xl font-black text-white tabular-nums leading-none">{card.value.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1 font-medium">{card.sub}</p>
            </div>
            {card.link && (
              <Link href={card.link} className="text-xs font-bold text-white/80 hover:text-white transition-colors mt-auto relative z-10">
                {card.linkLabel} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts scanData={scanData} brandData={brandData} />

    </div>
  )
}
