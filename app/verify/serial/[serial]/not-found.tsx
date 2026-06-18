import Link from 'next/link'

export default function SerialNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="font-bold text-lg text-slate-900">OriginalSolarSystems</Link>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          The serial number you entered could not be found. Please double-check the serial number and try again.
          If you believe this is an error, the product may be counterfeit.
        </p>
        <div className="flex gap-3">
          <Link href="/verify" className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-blue-700 transition-colors">
            Try Again
          </Link>
          <Link href="/" className="bg-gray-100 text-gray-700 font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-gray-200 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
