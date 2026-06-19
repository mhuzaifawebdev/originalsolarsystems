'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'

interface QRScannerProps {
  onScan: (result: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const scannedRef = useRef(false)
  const [status, setStatus] = useState<'starting' | 'active' | 'scanned' | 'error'>('starting')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let mounted = true
    scannedRef.current = false

    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.DATA_MATRIX,
    ])
    hints.set(DecodeHintType.TRY_HARDER, true)

    const reader = new BrowserMultiFormatReader(hints)

    const start = async () => {
      try {
        if (!videoRef.current) return

        controlsRef.current = await reader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          videoRef.current,
          (result, err) => {
            if (!result || !mounted || scannedRef.current) return
            scannedRef.current = true
            controlsRef.current?.stop()
            if (mounted) {
              setStatus('scanned')
              onScan(result.getText())
            }
          }
        )
        if (mounted) setStatus('active')
      } catch (err: any) {
        if (!mounted) return
        const msg = err?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : err?.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : 'Camera could not be started. Make sure you\'re on HTTPS.'
        setErrorMsg(msg)
        setStatus('error')
      }
    }

    start()

    return () => {
      mounted = false
      try { controlsRef.current?.stop() } catch {}
      // forcefully kill all tracks to release the camera indicator light
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(t => t.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [onScan])

  if (status === 'error') {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center space-y-2">
        <svg className="w-8 h-8 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        <p className="text-red-600 text-sm font-semibold">{errorMsg}</p>
        <p className="text-red-400 text-xs">Or use the serial number tab instead.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Corner bracket overlay */}
        {status === 'active' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Scan line animation */}
            <div style={{
              position: 'absolute', left: '10%', right: '10%', height: 2,
              background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
              animation: 'scanLine 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(99,102,241,0.8)',
            }} />
            {/* Corners */}
            {[
              { top: 12, left: 12, rotate: '0deg' },
              { top: 12, right: 12, rotate: '90deg' },
              { bottom: 12, left: 12, rotate: '270deg' },
              { bottom: 12, right: 12, rotate: '180deg' },
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', width: 28, height: 28, ...pos,
                borderTop: '3px solid #6366f1',
                borderLeft: '3px solid #6366f1',
                borderRadius: '4px 0 0 0',
                transform: `rotate(${pos.rotate})`,
                transformOrigin: 'center',
              }} />
            ))}
            <p style={{
              position: 'absolute', bottom: 12, left: 0, right: 0,
              textAlign: 'center', fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em',
            }}>
              ALIGN CODE WITHIN FRAME
            </p>
          </div>
        )}

        {/* Starting state */}
        {status === 'starting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-white text-xs font-medium">Starting camera…</p>
          </div>
        )}

        {/* Scanned state */}
        {status === 'scanned' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-sm font-bold">Code detected!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
      `}</style>
    </div>
  )
}
