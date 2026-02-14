import type { Skill } from '../data/skills'

export interface LaunchedSkill extends Skill {
  launchedAt: string
  upvotes: number
  commentCount: number
  rank?: number
}

export type FeedPeriod = 'daily' | 'weekly' | 'monthly'

export interface FeedSection {
  label: string
  date: string
  skills: LaunchedSkill[]
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatFeedDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function labelForDate(date: Date, today: Date): string {
  const todayStart = startOfDay(today)
  const dateStart = startOfDay(date)
  const diff = Math.floor((todayStart.getTime() - dateStart.getTime()) / 86400000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function assignLaunchDates(skills: Skill[]): LaunchedSkill[] {
  const now = new Date()
  const today = startOfDay(now)

  return skills.map((skill, i) => {
    const daysAgo = Math.floor(i / 4)
    const launchDate = new Date(today)
    launchDate.setDate(launchDate.getDate() - daysAgo)
    launchDate.setHours(9, 0, 0, 0)

    return {
      ...skill,
      launchedAt: launchDate.toISOString(),
      upvotes: Math.floor(Math.random() * 80) + 5,
      commentCount: Math.floor(Math.random() * 15),
    }
  })
}

export function groupByDate(skills: LaunchedSkill[]): FeedSection[] {
  const today = new Date()
  const groups = new Map<string, LaunchedSkill[]>()

  for (const skill of skills) {
    const date = formatFeedDate(new Date(skill.launchedAt))
    const existing = groups.get(date) || []
    existing.push(skill)
    groups.set(date, existing)
  }

  const sections: FeedSection[] = []
  for (const [date, dateSkills] of groups) {
    const sorted = dateSkills.sort((a, b) => b.upvotes - a.upvotes)
    sorted.forEach((s, i) => { s.rank = i + 1 })
    sections.push({
      label: labelForDate(new Date(date + 'T12:00:00'), today),
      date,
      skills: sorted,
    })
  }

  return sections.sort((a, b) => b.date.localeCompare(a.date))
}

export function getDateRange(days: number): string[] {
  const today = startOfDay(new Date())
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(formatFeedDate(d))
  }
  return dates
}

export function computeScore(
  upvotes: number,
  commentCount: number,
  hoursOld: number
): number {
  const decay = Math.max(0.5, 1 - (hoursOld / 168))
  return Math.round((upvotes + commentCount * 3) * decay)
}
