'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const BarcodeDisplay = dynamic(() => import('@/components/BarcodeDisplay'), { ssr: false })
const QRCode = dynamic(() => import('react-qr-code').then(m => m.default ?? m), { ssr: false })

const PRINT_LIMIT = 60

interface Brand { id: string; name: string }
interface Product { id: string; serial_number: string; product_name: string }

export default function PrintBarcodesPage() {
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('brands').select('id, name').order('name').then(({ data }) => {
      if (data) setBrands(data)
    })
  }, [])

  useEffect(() => {
    if (!selectedBrand) { setProducts([]); setSelected(new Set()); return }
    setLoading(true)
    supabase
      .from('products')
      .select('id, serial_number, product_name')
      .eq('brand_id', selectedBrand)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = data ?? []
        setProducts(list)
        // auto-select up to the limit
        setSelected(new Set(list.slice(0, PRINT_LIMIT).map(p => p.id)))
        setLoading(false)
      })
  }, [selectedBrand])

  const toggleAll = () => {
    if (selected.size > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(products.slice(0, PRINT_LIMIT).map(p => p.id)))
    }
  }

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= PRINT_LIMIT) return prev
        next.add(id)
      }
      return next
    })
  }

  const selectedProducts = products.filter(p => selected.has(p.id))
  const brandName = brands.find(b => b.id === selectedBrand)?.name ?? ''
  const atLimit = selected.size >= PRINT_LIMIT
  const overLimit = products.length > PRINT_LIMIT

  const handlePrint = () => {
    const grid = document.getElementById('barcode-preview-grid')
    if (!grid) return

    const cells = Array.from(grid.querySelectorAll('.barcode-cell'))
    const cellsHtml = cells.map((cell, i) => {
      const svgs = cell.querySelectorAll('svg')
      const barcodeSvg = svgs[0]
      const qrSvg = svgs[1]
      return `
        <div class="cell">
          <div class="num">${i + 1}</div>
          <div class="pair">
            <div class="barcode-wrap">${barcodeSvg ? barcodeSvg.outerHTML : ''}</div>
            <div class="qr-wrap">${qrSvg ? qrSvg.outerHTML : ''}</div>
          </div>
        </div>`
    }).join('')

    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Barcodes — ${brandName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; padding: 10mm; background: white; }
    h2 { font-size: 14px; font-weight: 900; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #000; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .cell { border: 1px solid #bbb; border-radius: 3px; padding: 5px 4px; page-break-inside: avoid; }
    .num { font-size: 10px; font-weight: 700; margin-bottom: 2px; }
    .pair { display: flex; align-items: center; gap: 4px; }
    .barcode-wrap { flex: 1; min-width: 0; }
    .barcode-wrap svg { max-width: 100%; height: auto; display: block; }
    .qr-wrap { width: 54px; flex-shrink: 0; }
    .qr-wrap svg { width: 54px; height: 54px; display: block; }
    @media print { @page { margin: 5mm; } body { padding: 0; } }
  </style>
</head>
<body>
  <h2>${brandName}</h2>
  <div class="grid">${cellsHtml}</div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  <\/script>
</body>
</html>`)
    win.document.close()
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Print Barcodes</h1>
        <p className="text-gray-500 text-sm mt-1">Select a brand and products to print in bulk</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Brand select */}
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select brand...</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Product list */}
        {selectedBrand && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Products {loading ? '(loading…)' : `(${products.length})`}
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
                  {overLimit && (
                    <span className="text-xs text-gray-400">
                      Max {PRINT_LIMIT} per batch
                    </span>
                  )}
                  <button
                    onClick={toggleAll}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {selected.size > 0
                      ? 'Deselect All'
                      : overLimit
                        ? `Select First ${PRINT_LIMIT}`
                        : 'Select All'}
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
                  This brand has {products.length} products. Print up to {PRINT_LIMIT} at a time for the best experience — run multiple batches for the rest.
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
              {!loading && products.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No products for this brand.</p>
              )}
            </div>
          </div>
        )}

        {selectedProducts.length > 0 && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print {selectedProducts.length} Barcode{selectedProducts.length !== 1 ? 's' : ''} & QR{selectedProducts.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Preview — barcodes render here; handlePrint grabs their SVGs */}
      {selectedProducts.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Preview</p>
          <div id="barcode-preview-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedProducts.map((p, i) => (
              <div key={p.id} className="barcode-cell border border-gray-200 rounded-lg p-2 overflow-hidden">
                <p className="text-xs font-bold text-gray-500 mb-1">{i + 1}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 overflow-x-auto">
                    <BarcodeDisplay value={p.serial_number} width={1} height={45} />
                  </div>
                  <div className="shrink-0">
                    <QRCode value={p.serial_number} size={54} />
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
