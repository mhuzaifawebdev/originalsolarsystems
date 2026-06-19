'use client'

import dynamic from 'next/dynamic'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import toast from 'react-hot-toast'

const BarcodeDisplay = dynamic(() => import('@/components/BarcodeDisplay'), { ssr: false })

interface Props {
  serialNumber: string
  verifyUrl: string
  productName: string
}

function downloadSVGasPNG(containerId: string, filename: string, productName: string) {
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
    const textHeight = 40
    canvas.width = w * 2
    canvas.height = (h * 2) + textHeight
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(productName, canvas.width / 2, 28)
    
    ctx.drawImage(img, 0, textHeight, w * 2, h * 2)
    URL.revokeObjectURL(url)
    const a = document.createElement('a')
    a.download = filename
    a.href = canvas.toDataURL('image/png')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Downloaded!')
  }
  img.onerror = () => { toast.error('Download failed'); URL.revokeObjectURL(url) }
  img.src = url
}

function printCode(containerId: string, title: string, productName: string) {
  const container = document.getElementById(containerId)
  const svg = container?.querySelector('svg')
  if (!svg) { toast.error('Could not find code element'); return }

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) {
    toast.error('Could not create print frame')
    document.body.removeChild(iframe)
    return
  }

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: 60mm 40mm; margin: 0mm; }
          body { 
            margin: 0; 
            padding: 2mm;
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            font-family: sans-serif; 
            background: #fff; 
            box-sizing: border-box;
          }
          h1 {
            font-size: 11px;
            color: #000;
            margin: 0 0 6px 0;
            text-align: center;
            font-weight: bold;
            line-height: 1.2;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          svg { max-width: 100%; max-height: 25mm; height: auto; }
        </style>
      </head>
      <body>
        <h1>${productName}</h1>
        ${svg.outerHTML}
      </body>
    </html>
  `)
  doc.close()

  iframe.contentWindow?.focus()
  
  // Delay slightly to ensure SVG renders in the iframe before printing
  setTimeout(() => {
    iframe.contentWindow?.print()
    // Cleanup the iframe after printing (delay allows print dialog to initialize)
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }, 1000)
  }, 250)
}

function CodeCard({ id, label, children, filename, printTitle, productName }: {
  id: string
  label: string
  children: React.ReactNode
  filename: string
  printTitle: string
  productName: string
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3">
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 sm:mb-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            onClick={() => printCode(id, printTitle, productName)}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 sm:gap-2 text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-slate-700/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={() => downloadSVGasPNG(id, filename, productName)}
            className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 sm:gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-indigo-500/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
      <div id={id} className="bg-white w-full overflow-x-auto flex items-center justify-center p-3">
        <div className="max-w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductCodesClient({ serialNumber, verifyUrl, productName }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Codes</h2>

      <div className="space-y-5">
        <CodeCard
          id="barcode-container"
          label="Barcode (Serial Number)"
          filename={`barcode-${serialNumber}.png`}
          printTitle="Barcode"
          productName={productName}
        >
          <BarcodeDisplay value={serialNumber} />
        </CodeCard>

        <CodeCard
          id="qrcode-container"
          label="QR Code (Verification URL)"
          filename={`qrcode-${serialNumber}.png`}
          printTitle="QR Code"
          productName={productName}
        >
          <QRCodeDisplay value={verifyUrl} size={180} />
        </CodeCard>

        <p className="text-xs text-gray-400 text-center break-all">{verifyUrl}</p>
      </div>
    </div>
  )
}
