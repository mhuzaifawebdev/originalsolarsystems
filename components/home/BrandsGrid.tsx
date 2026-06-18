'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimateOnScroll from './AnimateOnScroll'

interface Brand {
  id: string
  name: string
  logo_url: string | null
  description?: string | null
}

const BRAND_DESCRIPTIONS: Record<string, string> = {
  jinko:    'Trusted Jinko Solar panel authentication platform',
  canadian: 'Canadian Solar genuine product registry',
  longi:    'LONGi certified panel verification network',
  'ja solar': 'JA Solar authorized authenticity check system',
  jasolar:  'JA Solar authorized authenticity check system',
  renesola: 'ReneSola quality-assured panel validation hub',
  risen:    'Risen Energy genuine product certification center',
  trina:    'Trina Solar official panel authentication gateway',
  seraphim: 'Seraphim Solar verified product traceability system',
  suntech:  'Suntech Power certified authenticity assurance portal',
  yingli:   'Yingli Solar official panel legitimacy checker',
}

function getBrandDescription(brand: Brand): string {
  if (brand.description) return brand.description
  const key = brand.name.toLowerCase().trim()
  for (const [pattern, desc] of Object.entries(BRAND_DESCRIPTIONS)) {
    if (key.includes(pattern)) return desc
  }
  return `${brand.name} certified solar panel verification system`
}

function BrandCard({ brand, index }: { brand: Brand; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <AnimateOnScroll delay={index * 80}>
      {/* Border wrapper */}
      <div
        style={{
          padding: 1.5,
          borderRadius: 24,
          background: hovered
            ? 'linear-gradient(135deg,#6366f1,#8b5cf6,#3b82f6)'
            : 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15),rgba(59,130,246,0.2))',
          transition: 'background 0.4s ease',
          boxShadow: hovered
            ? '0 24px 48px -12px rgba(99,102,241,0.3), 0 0 0 0 transparent'
            : '0 2px 12px -2px rgba(99,102,241,0.1)',
        }}
      >
        <Link
          href={`/verify?brand=${encodeURIComponent(brand.name)}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'block',
            borderRadius: 23,
            overflow: 'hidden',
            background: hovered ? '#ffffff' : '#ffffff',
            transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Logo area */}
          <div style={{ height: 190, position: 'relative', overflow: 'hidden', background: '#fafbff' }}>
            {/* Subtle dot grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />

            {/* Ambient glow on hover */}
            <div style={{
              position: 'absolute', inset: 0,
              background: hovered
                ? 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)'
                : 'transparent',
              transition: 'background 0.5s ease',
            }} />

            {brand.logo_url ? (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                filter: hovered
                  ? 'drop-shadow(0 4px 16px rgba(99,102,241,0.25))'
                  : 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
              }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, fontWeight: 900, color: 'white',
                  transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                  transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: hovered ? '0 8px 32px rgba(99,102,241,0.4)' : '0 4px 12px rgba(99,102,241,0.2)',
                }}>
                  {brand.name[0].toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: hovered
              ? 'linear-gradient(90deg,transparent,rgba(99,102,241,0.3),rgba(139,92,246,0.3),transparent)'
              : 'linear-gradient(90deg,transparent,rgba(0,0,0,0.06),transparent)',
            transition: 'background 0.4s ease',
          }} />

          {/* Footer */}
          <div style={{
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: hovered
              ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            transition: 'background 0.4s ease',
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: 18, fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em', lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {brand.name}
              </p>
              {brand.description && (
                <p style={{
                  fontSize: 13, marginTop: 4,
                  color: 'rgba(255,255,255,0.85)',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                  lineHeight: 1.3
                }}>
                  {brand.description}
                </p>
              )}
              <p style={{
                fontSize: 11, fontWeight: 700, marginTop: brand.description ? 6 : 3,
                color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                Verify authenticity →
              </p>
            </div>

            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.35s ease',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </AnimateOnScroll>
  )
}

export default function BrandsGrid({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-24">
        <div style={{
          width: 80, height: 80, borderRadius: 24, margin: '0 auto 20px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
        }}>
          📦
        </div>
        <p style={{ color: '#6b7280', fontWeight: 600 }}>No brands registered yet.</p>
        <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6 }}>Add brands from the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {brands.map((brand, i) => (
        <BrandCard key={brand.id} brand={brand} index={i} />
      ))}
    </div>
  )
}
