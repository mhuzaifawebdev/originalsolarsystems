'use client'

import QRCode from 'react-qr-code'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export default function QRCodeDisplay({ value, size = 180 }: QRCodeDisplayProps) {
  return (
    <div style={{ background: 'white', padding: 12, display: 'inline-block', borderRadius: 8 }}>
      <QRCode value={value} size={size} />
    </div>
  )
}
