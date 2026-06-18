'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

interface DayScan { day: string; scans: number }
interface BrandStat { brand: string; products: number }

interface Props {
  scanData: DayScan[]
  brandData: BrandStat[]
}

const BAR_COLORS = [
  ['#6366f1', '#818cf8'],
  ['#8b5cf6', '#a78bfa'],
  ['#ec4899', '#f472b6'],
  ['#f59e0b', '#fbbf24'],
  ['#10b981', '#34d399'],
  ['#3b82f6', '#60a5fa'],
  ['#ef4444', '#f87171'],
  ['#14b8a6', '#2dd4bf'],
]

const CustomTooltipArea = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 8px 24px rgba(99,102,241,0.15)' }} className="rounded-xl px-4 py-2.5">
      <p className="text-indigo-400 text-xs mb-1 font-semibold">{label}</p>
      <p className="text-gray-900 font-black text-sm">{payload[0].value} <span className="text-indigo-400 font-normal text-xs">scans</span></p>
    </div>
  )
}

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 8px 24px rgba(139,92,246,0.15)' }} className="rounded-xl px-4 py-2.5">
      <p className="text-violet-400 text-xs mb-1 font-semibold">{label}</p>
      <p className="text-gray-900 font-black text-sm">{payload[0].value} <span className="text-violet-400 font-normal text-xs">products</span></p>
    </div>
  )
}

export default function DashboardCharts({ scanData, brandData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      {/* Area chart — verification activity */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid #e0e7ff',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6)' }} />

        {/* Soft ambient */}
        <div className="absolute top-4 right-4 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', filter: 'blur(16px)' }} />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <h3 className="font-black text-gray-900 text-sm tracking-tight">Verification Activity</h3>
            <p className="text-gray-400 text-xs mt-0.5">Scans over the last 7 days</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={scanData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltipArea />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="scans"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#scanGrad)"
              dot={{ r: 4, fill: '#ffffff', stroke: '#6366f1', strokeWidth: 2.5 }}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#c7d2fe', strokeWidth: 2 }}
              filter="url(#glow)"
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart — products per brand */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid #ede9fe',
          boxShadow: '0 4px 24px rgba(139,92,246,0.08)',
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#8b5cf6,#ec4899,#f59e0b)' }} />

        {/* Soft ambient */}
        <div className="absolute bottom-4 left-4 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)', filter: 'blur(16px)' }} />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <h3 className="font-black text-gray-900 text-sm tracking-tight">Products by Brand</h3>
            <p className="text-gray-400 text-xs mt-0.5">Registered products per brand</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow: '0 4px 12px rgba(139,92,246,0.35)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        {brandData.length === 0 ? (
          <div className="h-[210px] flex items-center justify-center text-gray-300 text-sm">
            No brand data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={brandData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                {BAR_COLORS.map(([from, to], i) => (
                  <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={from} stopOpacity={1} />
                    <stop offset="100%" stopColor={to} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.07)" vertical={false} />
              <XAxis dataKey="brand" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(139,92,246,0.04)' }} />
              <Bar dataKey="products" radius={[8, 8, 0, 0]} maxBarSize={52} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out">
                {brandData.map((_, i) => (
                  <Cell key={i} fill={`url(#barGrad${i % BAR_COLORS.length})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
