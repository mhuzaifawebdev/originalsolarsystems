export function normalizeSerial(serial: string): string {
  return serial.trim().toUpperCase()
}

export function getVerifyUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.originalsolars.com'
  return `${base}/verify/${token}`
}
