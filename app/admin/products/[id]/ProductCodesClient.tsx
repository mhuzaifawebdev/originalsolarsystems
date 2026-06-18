'use client'

import dynamic from 'next/dynamic'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import toast from 'react-hot-toast'

const BarcodeDisplay = dynamic(() => import('@/components/BarcodeDisplay'), { ssr: false })

interface Props {
  serialNumber: string
  verifyUrl: string
}

function downloadSVGasPNG(containerId: string, filename: string) {
  const container = document.getElementById(containerId)
  const svg = container?.querySelector('svg')
  if (!svg) { toast.error('Could not find code element'); return }

  const bbox = svg.getBoundingClientRect()
  const w = svg.getAttribute('width') ? parseInt(svg.getAttribute('width')!) : bbox.width || 300
  const h = svg.getAttribute('height') ? parseInt(svg.getAttribute('height')!) : bbox.height || 300

  const clone = svg.cloneNode(true) as SVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(w * 2))
  clone.setAttribute('height', String(h * 2))

  const svgBlob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  const img = new Image()

  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = w * 2
    canvas.height = h * 2
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)
    const a = document.createElement('a')
    a.download = filename
    a.href = canvas.toDataURL('image/png')
    a.click()
    toast.success('Downloaded!')
  }
  img.onerror = () => { toast.error('Download failed'); URL.revokeObjectURL(url) }
  img.src = url
}

function printCode(containerId: string, title: string) {
  const container = document.getElementById(containerId)
  const svg = container?.querySelector('svg')
  if (!svg) { toast.error('Could not find code element'); return }

  const svgHtml = svg.outerHTML
  const w = window.open('', '_blank', 'width=500,height=500')
  if (!w) { toast.error('Popup blocked — allow popups to print'); return }
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; background: #fff; }
    h2 { font-size: 13px; color: #6b7280; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .1em; }
  </style></head><body><h2>${title}</h2>${svgHtml}<script>window.onload=()=>{window.print();window.close()}<\/script></body></html>`)
  w.document.close()
}

function CodeCard({ id, label, children, filename, printTitle }: {
  id: string
  label: string
  children: React.ReactNode
  filename: string
  printTitle: string
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between mb-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => printCode(id, printTitle)}
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-xl shadow-md shadow-slate-700/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={() => downloadSVGasPNG(id, filename)}
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
      <div id={id} className="bg-white flex items-center justify-center p-3">
        {children}
      </div>
    </div>
  )
}

export default function ProductCodesClient({ serialNumber, verifyUrl }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Codes</h2>

      <div className="space-y-5">
        <CodeCard
          id="barcode-container"
          label="Barcode (Serial Number)"
          filename={`barcode-${serialNumber}.png`}
          printTitle="Barcode"
        >
          <BarcodeDisplay value={serialNumber} />
        </CodeCard>

        <CodeCard
          id="qrcode-container"
          label="QR Code (Verification URL)"
          filename={`qrcode-${serialNumber}.png`}
          printTitle="QR Code"
        >
          <QRCodeDisplay value={verifyUrl} size={180} />
        </CodeCard>

        <p className="text-xs text-gray-400 text-center break-all">{verifyUrl}</p>
      </div>
    </div>
  )
}
