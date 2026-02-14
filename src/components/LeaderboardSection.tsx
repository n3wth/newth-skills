'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { skills } from '../data/skills'
import { assignLaunchDates, type FeedPeriod, type LaunchedSkill } from '../lib/feed'
import { CategoryShape } from './CategoryShape'

function getTopSkills(launched: LaunchedSkill[], period: FeedPeriod): LaunchedSkill[] {
  const now = new Date()
  const cutoff = new Date(now)

  if (period === 'daily') {
    cutoff.setDate(cutoff.getDate() - 1)
  } else if (period === 'weekly') {
    cutoff.setDate(cutoff.getDate() - 7)
  } else {
    cutoff.setMonth(cutoff.getMonth() - 1)
  }

  return launched
    .filter(s => new Date(s.launchedAt) >= cutoff)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5)
}

const periods: { value: FeedPeriod; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
]

export function LeaderboardSection() {
  const [period, setPeriod] = useState<FeedPeriod>('daily')
  const launched = useMemo(() => assignLaunchDates(skills), [])
  const topSkills = useMemo(() => getTopSkills(launched, period), [launched, period])

  return (
    <section className="mb-16 md:mb-24">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
            Leaderboard
          </h2>
          <p className="label">
            Top skills by community votes
          </p>
        </div>
        <div className="flex gap-1">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: period === p.value ? 'var(--glass-highlight)' : 'transparent',
                color: period === p.value ? 'white' : 'var(--color-grey-400)',
                border: period === p.value ? '1px solid var(--glass-border)' : '1px solid transparent',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6">
        {topSkills.length > 0 ? (
          <ol className="flex flex-col gap-3">
            {topSkills.map((skill, i) => (
              <li key={skill.id}>
                <Link
                  href={`/skill/${skill.id}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      color: i < 3 ? 'white' : 'var(--color-grey-400)',
                      backgroundColor: i < 3 ? 'var(--glass-highlight)' : 'transparent',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <CategoryShape category={skill.category} size={10} />
                  <span className="text-sm text-white group-hover:opacity-80 transition-opacity truncate">
                    {skill.name}
                  </span>
                  <span className="ml-auto shrink-0 text-xs font-medium" style={{ color: 'var(--color-grey-400)' }}>
                    {skill.upvotes}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-center py-4" style={{ color: 'var(--color-grey-400)' }}>
            No skills for this period
          </p>
        )}
      </div>
    </section>
  )
}
