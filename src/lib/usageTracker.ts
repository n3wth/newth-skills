const USAGE_KEY = 'newth-workflow-usage-count'
const API_KEY_KEY = 'newth-workflow-api-key'
const FINGERPRINT_KEY = 'newth-workflow-fingerprint'
const FREE_RUN_LIMIT = 3

export function getUsageCount(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(USAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return
  const current = getUsageCount()
  localStorage.setItem(USAGE_KEY, String(current + 1))
}

export function getRemainingFreeRuns(): number {
  return Math.max(0, FREE_RUN_LIMIT - getUsageCount())
}

export function getFreeRunLimit(): number {
  return FREE_RUN_LIMIT
}

export function hasReachedLimit(): boolean {
  return getUsageCount() >= FREE_RUN_LIMIT
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_KEY_KEY)
}

export function setApiKey(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(API_KEY_KEY, key)
}

export function clearApiKey(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(API_KEY_KEY)
}

export function hasApiKey(): boolean {
  const key = getApiKey()
  return key !== null && key.trim().length > 0
}

export function getFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr'

  const stored = localStorage.getItem(FINGERPRINT_KEY)
  if (stored) return stored

  // Generate a simple browser fingerprint
  const nav = window.navigator
  const screen = window.screen
  const raw = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || 0,
  ].join('|')

  // Simple hash
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }

  const fingerprint = `fp-${Math.abs(hash).toString(36)}-${Date.now().toString(36)}`
  localStorage.setItem(FINGERPRINT_KEY, fingerprint)
  return fingerprint
}
