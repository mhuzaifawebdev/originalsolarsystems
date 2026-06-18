'use client'

import { Toaster } from 'react-hot-toast'

export default function HotToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: { fontWeight: 600, borderRadius: 12, fontSize: 14 },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  )
}
