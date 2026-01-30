const STORAGE_KEY = 'newth-skills-analytics'
const MAX_EVENTS = 1000

export interface CopyEvent {
  skillId: string
  timestamp: number
}

export interface ViewEvent {
  skillId: string
  timestamp: number
}

export interface AnalyticsData {
  copyEvents: CopyEvent[]
  skillCopyCounts: Record<string, number>
  viewEvents: ViewEvent[]
  skillViewCounts: Record<string, number>
}

// Cache localStorage reads to avoid repeated parsing (js-cache-storage)
let cachedData: AnalyticsData | null = null
let cacheTimestamp = 0
const CACHE_TTL = 100 // 100ms cache for read-heavy operations

function getStoredData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { copyEvents: [], skillCopyCounts: {}, viewEvents: [], skillViewCounts: {} }
  }

  const now = Date.now()
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      cachedData = {
        copyEvents: data.copyEvents || [],
        skillCopyCounts: data.skillCopyCounts || {},
        viewEvents: data.viewEvents || [],
        skillViewCounts: data.skillViewCounts || {},
      }
      cacheTimestamp = now
      return cachedData
    }
  } catch {
    // localStorage not available or corrupted data
  }

  cachedData = { copyEvents: [], skillCopyCounts: {}, viewEvents: [], skillViewCounts: {} }
  cacheTimestamp = now
  return cachedData
}

function saveData(data: AnalyticsData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // Invalidate cache after write
    cachedData = data
    cacheTimestamp = Date.now()
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

  // Send to API
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId, eventType: 'copy' }),
  }).catch(() => {})

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

// View tracking functions
export function trackViewEvent(skillId: string): void {
  const data = getStoredData()

  const event: ViewEvent = {
    skillId,
    timestamp: Date.now(),
  }

  data.viewEvents.push(event)
  data.skillViewCounts[skillId] = (data.skillViewCounts[skillId] || 0) + 1

  if (data.viewEvents.length > MAX_EVENTS) {
    data.viewEvents = data.viewEvents.slice(-MAX_EVENTS)
  }

  saveData(data)

  // Send to API
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId, eventType: 'view' }),
  }).catch(() => {})

  // Send to Plausible if available
  if (typeof window !== 'undefined' && 'plausible' in window) {
    const plausible = window.plausible as (event: string, options?: { props?: Record<string, string> }) => void
    plausible('View Skill', { props: { skill: skillId } })
  }
}

export function getViewCount(skillId: string): number {
  const data = getStoredData()
  return data.skillViewCounts[skillId] || 0
}

export function getAllViewCounts(): Record<string, number> {
  const data = getStoredData()
  return data.skillViewCounts
}

export function getTotalViewCount(): number {
  const data = getStoredData()
  return Object.values(data.skillViewCounts).reduce((sum, count) => sum + count, 0)
}

export function getRecentViewEvents(limit: number = 10): ViewEvent[] {
  const data = getStoredData()
  return data.viewEvents.slice(-limit).reverse()
}

// Trending algorithms
export type TrendingPeriod = 'daily' | 'weekly' | 'monthly'

function getTimeCutoff(period: TrendingPeriod): number {
  const now = Date.now()
  switch (period) {
    case 'daily':
      return now - 24 * 60 * 60 * 1000 // 24 hours
    case 'weekly':
      return now - 7 * 24 * 60 * 60 * 1000 // 7 days
    case 'monthly':
      return now - 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}

export function getTrendingSkills(
  period: TrendingPeriod,
  limit: number = 5
): Array<{ skillId: string; score: number; viewCount: number }> {
  const data = getStoredData()
  const cutoff = getTimeCutoff(period)
  const now = Date.now()
  const periodMs = now - cutoff
  
  // Count views within the period with time decay (more recent = higher weight)
  const skillScores: Record<string, { score: number; count: number }> = {}
  
  for (const event of data.viewEvents) {
    if (event.timestamp >= cutoff) {
      // Time decay: events closer to now get higher weight (1.0 to 2.0)
      const age = now - event.timestamp
      const recencyWeight = 1 + (1 - age / periodMs)
      
      if (!skillScores[event.skillId]) {
        skillScores[event.skillId] = { score: 0, count: 0 }
      }
      skillScores[event.skillId].score += recencyWeight
      skillScores[event.skillId].count += 1
    }
  }
  
  return Object.entries(skillScores)
    .map(([skillId, { score, count }]) => ({ skillId, score, viewCount: count }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getMostViewedSkills(limit: number = 5): Array<{ skillId: string; count: number }> {
  const data = getStoredData()
  return Object.entries(data.skillViewCounts)
    .map(([skillId, count]) => ({ skillId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// Check if a skill is trending (has significant recent activity)
export function isSkillTrending(skillId: string, period: TrendingPeriod = 'weekly'): boolean {
  const trending = getTrendingSkills(period, 10)
  return trending.some(t => t.skillId === skillId && t.viewCount >= 3)
}

// Check if a skill is popular (high total views)
export function isSkillPopular(skillId: string, threshold: number = 5): boolean {
  const viewCount = getViewCount(skillId)
  return viewCount >= threshold
}

// Get badge status for all skills at once (performance optimization)
// This reads localStorage once and computes all badge statuses
export interface SkillBadgeStatus {
  trendingSkillIds: Set<string>
  popularSkillIds: Set<string>
}

export function getSkillBadgeStatus(
  period: TrendingPeriod = 'weekly',
  trendingThreshold: number = 3,
  popularThreshold: number = 5
): SkillBadgeStatus {
  const data = getStoredData()
  
  // Get trending skills (computed once)
  const trending = getTrendingSkills(period, 10)
  const trendingSkillIds = new Set(
    trending
      .filter(t => t.viewCount >= trendingThreshold)
      .map(t => t.skillId)
  )
  
  // Get popular skills (computed once)
  const popularSkillIds = new Set(
    Object.entries(data.skillViewCounts)
      .filter(([, count]) => count >= popularThreshold)
      .map(([skillId]) => skillId)
  )
  
  return { trendingSkillIds, popularSkillIds }
}

// Get analytics summary for dashboard
export interface AnalyticsSummary {
  totalViews: number
  totalCopies: number
  uniqueSkillsViewed: number
  uniqueSkillsCopied: number
  trendingDaily: Array<{ skillId: string; score: number; viewCount: number }>
  trendingWeekly: Array<{ skillId: string; score: number; viewCount: number }>
  trendingMonthly: Array<{ skillId: string; score: number; viewCount: number }>
  mostViewed: Array<{ skillId: string; count: number }>
  mostCopied: Array<{ skillId: string; count: number }>
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const data = getStoredData()
  
  return {
    totalViews: Object.values(data.skillViewCounts).reduce((sum, count) => sum + count, 0),
    totalCopies: Object.values(data.skillCopyCounts).reduce((sum, count) => sum + count, 0),
    uniqueSkillsViewed: Object.keys(data.skillViewCounts).length,
    uniqueSkillsCopied: Object.keys(data.skillCopyCounts).length,
    trendingDaily: getTrendingSkills('daily', 5),
    trendingWeekly: getTrendingSkills('weekly', 5),
    trendingMonthly: getTrendingSkills('monthly', 5),
    mostViewed: getMostViewedSkills(5),
    mostCopied: getMostPopularSkills(5),
  }
}

export interface ErrorEvent {
  message: string
  timestamp: number
  metadata?: Record<string, string | undefined>
}

const ERROR_STORAGE_KEY = 'newth-skills-errors'
const MAX_ERRORS = 100

function getStoredErrors(): ErrorEvent[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(ERROR_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // localStorage not available or corrupted data
  }
  
  return []
}

function saveErrors(errors: ErrorEvent[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errors))
  } catch {
    // localStorage not available or quota exceeded
  }
}

export function trackError(
  message: string,
  metadata?: Record<string, string | undefined>
): void {
  const errors = getStoredErrors()
  
  const event: ErrorEvent = {
    message,
    timestamp: Date.now(),
    metadata,
  }
  
  errors.push(event)
  
  if (errors.length > MAX_ERRORS) {
    errors.splice(0, errors.length - MAX_ERRORS)
  }
  
  saveErrors(errors)
  
  // Send to Plausible if available
  if (typeof window !== 'undefined' && 'plausible' in window) {
    const plausible = window.plausible as (event: string, options?: { props?: Record<string, string> }) => void
    plausible('Error', { props: { message, ...metadata } as Record<string, string> })
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Analytics Error]', message, metadata)
  }
}

export function getRecentErrors(limit: number = 10): ErrorEvent[] {
  const errors = getStoredErrors()
  return errors.slice(-limit).reverse()
}

export function clearErrors(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ERROR_STORAGE_KEY)
  } catch {
    // localStorage not available
  }
}

export function trackPerformance(metric: string, value: number): void {
  // Send to Plausible if available
  if (typeof window !== 'undefined' && 'plausible' in window) {
    const plausible = window.plausible as (event: string, options?: { props?: Record<string, string> }) => void
    plausible('Performance', { props: { metric, value: String(value) } })
  }
}

export function reportWebVitals(): void {
  if (typeof window === 'undefined') return
  
  // Report Core Web Vitals using Performance Observer
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          trackPerformance('LCP', lastEntry.startTime)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      // LCP not supported
    }
    
    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const firstEntry = entries[0] as PerformanceEventTiming | undefined
        if (firstEntry) {
          trackPerformance('FID', firstEntry.processingStart - firstEntry.startTime)
        }
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch {
      // FID not supported
    }
    
    // Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      
      // Report CLS when page is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          trackPerformance('CLS', clsValue)
        }
      })
    } catch {
      // CLS not supported
    }
  }
}
