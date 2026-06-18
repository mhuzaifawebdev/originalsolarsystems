'use client'

import Barcode from 'react-barcode'

interface BarcodeDisplayProps {
  value: string
  width?: number
  height?: number
}

export default function BarcodeDisplay({ value, width = 2, height = 80 }: BarcodeDisplayProps) {
  return (
    <Barcode
      value={value}
      format="CODE128"
      width={width}
      height={height}
      displayValue={true}
      fontSize={14}
      margin={10}
    />
  )
}
