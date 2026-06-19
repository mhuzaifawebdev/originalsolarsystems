'use client'

import Barcode from 'react-barcode'

interface BarcodeDisplayProps {
  value: string
  width?: number
  height?: number
}

export default function BarcodeDisplay({ value, width = 2, height = 80 }: BarcodeDisplayProps) {
  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Barcode
        value={value}
        format="CODE128"
        width={width}
        height={height}
        displayValue={true}
        fontSize={14}
        margin={10}
      />
    </div>
  )
}
