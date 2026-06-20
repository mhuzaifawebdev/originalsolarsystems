'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const BarcodeDisplay = dynamic(() => import('@/components/BarcodeDisplay'), { ssr: false })
const QRCode = dynamic(() => import('react-qr-code').then(m => m.default ?? m), { ssr: false })

const PRINT_LIMIT = 60
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.originalsolars.com'

interface Brand { id: string; name: string }
interface Pallet { id: string; name: string }
interface Product { id: string; serial_number: string; product_name: string; verification_token: string }

export default function PrintBarcodesPage() {
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [pallets, setPallets] = useState<Pallet[]>([])
  const [selectedPallet, setSelectedPallet] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loadingPallets, setLoadingPallets] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Load brands once
  useEffect(() => {
    supabase.from('brands').select('id, name').order('name').then(({ data }) => {
      if (data) setBrands(data)
    })
  }, [])

  // Load pallets when brand changes
  useEffect(() => {
    if (!selectedBrand) { setPallets([]); setSelectedPallet(''); setProducts([]); setSelected(new Set()); return }
    setLoadingPallets(true)
    setSelectedPallet('')
    setProducts([])
    setSelected(new Set())
    supabase
      .from('pallets')
      .select('id, name')
      .eq('brand_id', selectedBrand)
      .order('name')
      .then(({ data }) => {
        setPallets(data ?? [])
        setLoadingPallets(false)
      })
  }, [selectedBrand])

  // Load products when pallet changes
  useEffect(() => {
    if (!selectedPallet) { setProducts([]); setSelected(new Set()); return }
    setLoadingProducts(true)
    supabase
      .from('products')
      .select('id, serial_number, product_name, verification_token')
      .eq('pallet_id', selectedPallet)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = data ?? []
        setProducts(list)
        setSelected(new Set(list.slice(0, PRINT_LIMIT).map(p => p.id)))
        setLoadingProducts(false)
      })
  }, [selectedPallet])

  const toggleAll = () => {
    if (selected.size > 0) setSelected(new Set())
    else setSelected(new Set(products.slice(0, PRINT_LIMIT).map(p => p.id)))
  }

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) }
      else { if (next.size >= PRINT_LIMIT) return prev; next.add(id) }
      return next
    })
  }

  const selectedProducts = products.filter(p => selected.has(p.id))
  const brandName = brands.find(b => b.id === selectedBrand)?.name ?? ''
  const palletName = pallets.find(p => p.id === selectedPallet)?.name ?? ''
  const atLimit = selected.size >= PRINT_LIMIT
  const overLimit = products.length > PRINT_LIMIT

  const handleDownload = async () => {
    const grid = document.getElementById('barcode-preview-grid')
    if (!grid) return
    setDownloading(true)
    try {
      const { default: jsPDF } = await import('jspdf')

      const svgToPng = (svg: SVGElement, scale = 3): Promise<string> =>
        new Promise((resolve, reject) => {
          const clone = svg.cloneNode(true) as SVGElement
          clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
          const bw = svg.getAttribute('width') ? parseFloat(svg.getAttribute('width')!) : svg.getBoundingClientRect().width || 200
          const bh = svg.getAttribute('height') ? parseFloat(svg.getAttribute('height')!) : svg.getBoundingClientRect().height || 80
          clone.setAttribute('width', String(bw))
          clone.setAttribute('height', String(bh))
          const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = bw * scale; canvas.height = bh * scale
            const ctx = canvas.getContext('2d')!
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/png'))
          }
          img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')) }
          img.src = url
        })

      const A4_W = 210, A4_H = 297, MARGIN = 10, COLS = 3, GAP = 3, HEADER_H = 14, ROWS_PER_PAGE = 9
      const cellW = (A4_W - MARGIN * 2 - GAP * (COLS - 1)) / COLS
      const cellH = (A4_H - MARGIN * 2 - HEADER_H - GAP * (ROWS_PER_PAGE - 1)) / ROWS_PER_PAGE
      const perPage = COLS * ROWS_PER_PAGE

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const cells = Array.from(grid.querySelectorAll('.barcode-cell')) as HTMLElement[]

      for (let i = 0; i < cells.length; i++) {
        const posInPage = i % perPage
        if (posInPage === 0 && i > 0) pdf.addPage()

        if (posInPage === 0) {
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9)
          pdf.text(`${brandName}`, MARGIN, MARGIN + 5)
          pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(100)
          pdf.text(`Pallet: ${palletName}`, MARGIN, MARGIN + 10)
          pdf.setTextColor(0)
          pdf.setDrawColor(0); pdf.setLineWidth(0.4)
          pdf.line(MARGIN, MARGIN + 12, A4_W - MARGIN, MARGIN + 12)
        }

        const col = posInPage % COLS
        const row = Math.floor(posInPage / COLS)
        const x = MARGIN + col * (cellW + GAP)
        const y = MARGIN + HEADER_H + row * (cellH + GAP)

        const svgs = cells[i].querySelectorAll('svg')
        const barcodeSvg = svgs[0] as SVGElement | undefined
        const qrSvg = svgs[1] as SVGElement | undefined

        pdf.setDrawColor(180); pdf.setLineWidth(0.2)
        pdf.roundedRect(x, y, cellW, cellH, 1, 1)
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6); pdf.setTextColor(150)
        pdf.text(String(i + 1), x + 1.5, y + 3.5)
        pdf.setTextColor(0)

        const QR_W = 14
        const imgY = y + 2

        if (barcodeSvg) {
          const png = await svgToPng(barcodeSvg)
          pdf.addImage(png, 'PNG', x + 1, imgY, cellW - QR_W - 3, cellH - 4)
        }
        if (qrSvg) {
          const png = await svgToPng(qrSvg)
          pdf.addImage(png, 'PNG', x + cellW - QR_W - 1, imgY + (cellH - 4 - QR_W) / 2, QR_W, QR_W)
        }
      }

      pdf.save(`barcodes-${brandName.toLowerCase().replace(/\s+/g, '-')}-${palletName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Print Barcodes</h1>
        <p className="text-gray-500 text-sm mt-1">Select a brand and pallet to download barcodes in bulk</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Step 1 — Brand */}
        <div className="max-w-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Step 1 — Brand
          </label>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select brand…</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Step 2 — Pallet */}
        {selectedBrand && (
          <div className="max-w-sm">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Step 2 — Pallet
            </label>
            {loadingPallets ? (
              <p className="text-sm text-gray-400">Loading pallets…</p>
            ) : pallets.length === 0 ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-700">
                  No pallets for this brand.{' '}
                  <a href="/admin/pallets" className="font-bold underline">Create one →</a>
                </p>
              </div>
            ) : (
              <select
                value={selectedPallet}
                onChange={e => setSelectedPallet(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select pallet…</option>
                {pallets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Step 3 — Products */}
        {selectedPallet && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Step 3 — Products
                </label>
                <span className="text-xs text-gray-400">
                  {loadingProducts ? '(loading…)' : `(${products.length})`}
                </span>
                {atLimit && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Limit reached ({PRINT_LIMIT})
                  </span>
                )}
              </div>
              {products.length > 0 && (
                <div className="flex items-center gap-3">
                  {overLimit && <span className="text-xs text-gray-400">Max {PRINT_LIMIT} per batch</span>}
                  <button onClick={toggleAll} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    {selected.size > 0 ? 'Deselect All' : overLimit ? `Select First ${PRINT_LIMIT}` : 'Select All'}
                  </button>
                </div>
              )}
            </div>

            {overLimit && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-700">
                  This pallet has {products.length} products. Print up to {PRINT_LIMIT} at a time — run multiple batches for the rest.
                </p>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {products.map((p, i) => {
                const isChecked = selected.has(p.id)
                const isDisabled = !isChecked && atLimit
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${i < products.length - 1 ? 'border-b border-gray-100' : ''} ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => toggleOne(p.id)}
                      className="w-4 h-4 accent-indigo-600 shrink-0 disabled:cursor-not-allowed"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.product_name}</p>
                      <p className="text-xs font-mono text-gray-400">{p.serial_number}</p>
                    </div>
                  </label>
                )
              })}
              {!loadingProducts && products.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No products assigned to this pallet.</p>
              )}
            </div>
          </div>
        )}

        {selectedProducts.length > 0 && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/25"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download {selectedProducts.length} Barcode{selectedProducts.length !== 1 ? 's' : ''} & QR{selectedProducts.length !== 1 ? 's' : ''} as PDF
              </>
            )}
          </button>
        )}
      </div>

      {/* Preview */}
      {selectedProducts.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Preview</p>
            <p className="text-xs text-gray-400">{brandName} · {palletName}</p>
          </div>
          <div id="barcode-preview-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedProducts.map((p, i) => (
              <div key={p.id} className="barcode-cell border border-gray-200 rounded-lg p-2 overflow-hidden">
                <p className="text-xs font-bold text-gray-500 mb-1">{i + 1}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 overflow-x-auto">
                    <BarcodeDisplay value={p.serial_number} width={1} height={45} />
                  </div>
                  <div className="shrink-0">
                    <QRCode value={`${SITE_URL}/verify/${p.verification_token}`} size={54} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
