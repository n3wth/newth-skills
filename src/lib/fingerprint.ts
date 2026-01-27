// Simple browser fingerprint for anonymous voting
const FINGERPRINT_KEY = 'newth-skills-fp'

export function getFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr'

  let fp = localStorage.getItem(FINGERPRINT_KEY)
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem(FINGERPRINT_KEY, fp)
  }
  return fp
}
