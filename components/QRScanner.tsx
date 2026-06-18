'use client'

import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScan: (result: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    let scanner: import('qr-scanner').default | null = null

    const start = async () => {
      try {
        const QrScanner = (await import('qr-scanner')).default
        if (!videoRef.current) return

        scanner = new QrScanner(
          videoRef.current,
          (result) => {
            onScan(result.data)
          },
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        )
        await scanner.start()
        setActive(true)
      } catch (err) {
        setError('Camera access denied or not available.')
        console.error(err)
      }
    }

    start()

    return () => {
      scanner?.destroy()
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
            className="w-full rounded-xl border border-gray-200 shadow"
            style={{ minHeight: 280, background: '#000' }}
          />
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Starting camera...
            </div>
          )}
        </>
      )}
    </div>
  )
}
