import { getFingerprint } from './fingerprint'

const USAGE_KEY = 'newth-workflow-usage-count'
const API_KEY_KEY = 'newth-workflow-api-key'
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

export { getFingerprint }
