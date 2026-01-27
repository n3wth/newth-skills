const STORAGE_KEY = 'newth-skills-analytics'
const MAX_EVENTS = 1000

export interface CopyEvent {
  skillId: string
  timestamp: number
}

export interface AnalyticsData {
  copyEvents: CopyEvent[]
  skillCopyCounts: Record<string, number>
}

function getStoredData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { copyEvents: [], skillCopyCounts: {} }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // localStorage not available or corrupted data
  }
  
  return { copyEvents: [], skillCopyCounts: {} }
}

function saveData(data: AnalyticsData): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage not available or quota exceeded
  }
}

export function trackCopyEvent(skillId: string): void {
  const data = getStoredData()
  
  const event: CopyEvent = {
    skillId,
    timestamp: Date.now(),
  }
  
  data.copyEvents.push(event)
  data.skillCopyCounts[skillId] = (data.skillCopyCounts[skillId] || 0) + 1
  
  if (data.copyEvents.length > MAX_EVENTS) {
    data.copyEvents = data.copyEvents.slice(-MAX_EVENTS)
  }
  
  saveData(data)
  
  // Send to Plausible if available (privacy-respecting analytics)
  if (typeof window !== 'undefined' && 'plausible' in window) {
    const plausible = window.plausible as (event: string, options?: { props?: Record<string, string> }) => void
    plausible('Copy Install Command', { props: { skill: skillId } })
  }
}

export function getCopyCount(skillId: string): number {
  const data = getStoredData()
  return data.skillCopyCounts[skillId] || 0
}

export function getAllCopyCounts(): Record<string, number> {
  const data = getStoredData()
  return data.skillCopyCounts
}

export function getTotalCopyCount(): number {
  const data = getStoredData()
  return Object.values(data.skillCopyCounts).reduce((sum, count) => sum + count, 0)
}

export function getRecentCopyEvents(limit: number = 10): CopyEvent[] {
  const data = getStoredData()
  return data.copyEvents.slice(-limit).reverse()
}

export function getMostPopularSkills(limit: number = 5): Array<{ skillId: string; count: number }> {
  const data = getStoredData()
  return Object.entries(data.skillCopyCounts)
    .map(([skillId, count]) => ({ skillId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function clearAnalytics(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage not available
  }
}
