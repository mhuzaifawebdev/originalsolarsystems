export function normalizeSerial(serial: string): string {
  return serial.trim().toUpperCase()
}

export function getVerifyUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${base}/verify/${token}`
}
