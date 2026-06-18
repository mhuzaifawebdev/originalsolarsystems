'use client'

import { useEffect, useRef, useState } from 'react'

import { BrowserMultiFormatReader } from '@zxing/browser'

interface QRScannerProps {
  onScan: (result: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true
    const codeReader = new BrowserMultiFormatReader()

    const start = async () => {
      try {
        if (!videoRef.current) return

        controlsRef.current = await codeReader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current,
          (result, err) => {
            if (result && mounted) {
              onScan(result.getText())
            }
          }
        )
        if (mounted) setActive(true)
      } catch (err) {
        if (mounted) {
          setError('Camera access denied or not available.')
          console.error(err)
        }
      }
    }

    start()

    return () => {
      mounted = false
      if (controlsRef.current) {
        controlsRef.current.stop()
      }
    }
  }, [onScan])

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-600 text-sm">
          {error}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full rounded-xl border border-gray-200 shadow object-cover"
            style={{ minHeight: 280, background: '#000' }}
          />
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Starting camera...
            </div>
          )}
          {active && (
            <div className="absolute inset-0 border-4 border-indigo-500/50 rounded-xl pointer-events-none" />
          )}
        </>
      )}
    </div>
  )
}
