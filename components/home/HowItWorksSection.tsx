'use client'

import { useState } from 'react'
import AnimateOnScroll from './AnimateOnScroll'
import Link from 'next/link'

interface StepConfig {
  number: string
  title: string
  desc: string
  detail: string
  bg: string
  shadowColor: string
  accentRgb: string
  rotation: string
  tag: string
  icon: React.ReactNode
  extraIcon: React.ReactNode
}

const steps: StepConfig[] = [
  {
    number: '01',
    title: 'Find the Label',
    desc: 'Locate the QR code or serial number on your solar panel label.',
    detail: 'On solar panels, the label is usually on the back frame. Every genuine product has a unique code.',
    bg: 'linear-gradient(145deg, #0c2461 0%, #1e40af 55%, #2563eb 100%)',
    shadowColor: 'rgba(37,99,235,0.55)',
    accentRgb: '147,197,253',
    rotation: '-4deg',
    tag: 'Step 01',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={1.6}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="5.5" y="5.5" width="2" height="2" fill="white" stroke="none" />
        <rect x="16.5" y="5.5" width="2" height="2" fill="white" stroke="none" />
        <rect x="5.5" y="16.5" width="2" height="2" fill="white" stroke="none" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2v2h-2zm4 0h2v2h-2zm-4 4h2v2h-2zm4-2h2v4h-2zm-2 2h-2" />
      </svg>
    ),
    extraIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Scan or Enter',
    desc: 'Use your phone camera to scan the QR code, or type the serial number from the panel label.',
    detail: 'No app download needed — works directly in your browser. Point your camera at the QR code printed on the product frame or packaging.',
    bg: 'linear-gradient(145deg, #2e1065 0%, #6d28d9 55%, #7c3aed 100%)',
    shadowColor: 'rgba(109,40,217,0.55)',
    accentRgb: '196,181,253',
    rotation: '1deg',
    tag: 'Step 02',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    extraIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Verified',
    desc: 'Instant result from our database — brand, wattage, and a clear GENUINE or COUNTERFEIT status.',
    detail: 'See the brand name, panel wattage, importer details, and warranty information. A GENUINE result means your solar investment is protected.',
    bg: 'linear-gradient(145deg, #064e3b 0%, #059669 55%, #10b981 100%)',
    shadowColor: 'rgba(5,150,105,0.55)',
    accentRgb: '110,231,183',
    rotation: '3deg',
    tag: 'Step 03',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    extraIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

function StepCard({ step, index }: { step: StepConfig; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: step.bg,
        transform: hovered
          ? 'translateY(-16px) rotate(0deg) scale(1.04)'
          : `translateY(0px) rotate(${step.rotation}) scale(1)`,
        boxShadow: hovered
          ? `0 40px 70px -12px ${step.shadowColor}, 0 0 0 1px rgba(255,255,255,0.08)`
          : `0 12px 32px -8px ${step.shadowColor.replace('0.55', '0.3')}, 0 0 0 1px rgba(255,255,255,0.05)`,
        transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className="relative rounded-3xl overflow-hidden p-7 cursor-default select-none"
    >
      {/* Big watermark number */}
      <div
        className="absolute -right-4 -top-4 text-[110px] font-black leading-none pointer-events-none"
        style={{ color: `rgba(${step.accentRgb},0.08)`, transition: 'opacity 0.4s ease' }}
      >
        {step.number}
      </div>

      {/* Shine overlay on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 70% 20%, rgba(${step.accentRgb},0.18) 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Dot pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Tag pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
          style={{ background: `rgba(${step.accentRgb},0.15)`, color: `rgb(${step.accentRgb})` }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: `rgb(${step.accentRgb})`, display: 'inline-block' }}
          />
          {step.tag}
        </div>

        {/* Icon bubble */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `rgba(${step.accentRgb},0.15)`,
            border: `1px solid rgba(${step.accentRgb},0.25)`,
            transform: hovered ? 'scale(1.1) rotate(-6deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white mb-2 tracking-tight">{step.title}</h3>

        {/* Desc */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: `rgba(${step.accentRgb},0.75)` }}
        >
          {step.desc}
        </p>

        {/* Expand detail on hover */}
        <div
          style={{
            maxHeight: hovered ? '120px' : '0px',
            opacity: hovered ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
          }}
        >
          <div
            className="mt-4 pt-4 text-[13px] leading-relaxed"
            style={{
              borderTop: `1px solid rgba(${step.accentRgb},0.2)`,
              color: `rgba(${step.accentRgb},0.6)`,
            }}
          >
            {step.detail}
          </div>
        </div>

        {/* Arrow CTA */}
        <div
          className="flex items-center gap-1.5 mt-5 text-xs font-bold"
          style={{
            color: `rgb(${step.accentRgb})`,
            opacity: hovered ? 1 : 0.5,
            transform: hovered ? 'translateX(0px)' : 'translateX(-4px)',
            transition: 'opacity 0.3s ease, transform 0.35s ease',
          }}
        >
          {step.extraIcon}
          <span>Learn more</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function HowItWorksSection() {
  return (
    <section
      className="py-14 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 40%, #e8eeff 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            Simple Process
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            VERIFY IN{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(120deg,#3b82f6 0%,#8b5cf6 50%,#10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              3 STEPS
            </span>
          </h2>
          <p className="text-gray-500 mt-5 max-w-md mx-auto text-base leading-relaxed">
            Know within seconds whether the solar panel you purchased is genuine. Hover each card to learn more.
          </p>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 120}>
              <StepCard step={step} index={i} />
            </AnimateOnScroll>
          ))}
        </div>


      </div>
    </section>
  )
}
