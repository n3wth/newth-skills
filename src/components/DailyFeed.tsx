'use client'

import { useState, useMemo } from 'react'
import { skills } from '../data/skills'
import { assignLaunchDates, groupByDate, getDateRange } from '../lib/feed'
import { DateNav } from './DateNav'
import { FeedCard } from './FeedCard'

const DAYS_TO_SHOW = 14

export function DailyFeed() {
  const launchedSkills = useMemo(() => assignLaunchDates(skills), [])
  const sections = useMemo(() => groupByDate(launchedSkills), [launchedSkills])
  const dates = useMemo(() => getDateRange(DAYS_TO_SHOW), [])
  const [activeDate, setActiveDate] = useState(dates[0])

  const activeSection = sections.find(s => s.date === activeDate)
  const upcomingSection = sections.length > 0 ? sections[0] : null

  return (
    <section className="mb-16 md:mb-24">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
          Daily Feed
        </h2>
        <p className="label">
          Skills launched today, ranked by community votes
        </p>
      </div>

      <DateNav dates={dates} activeDate={activeDate} onDateChange={setActiveDate} />

      {activeSection && activeSection.skills.length > 0 ? (
        <div className="flex flex-col gap-3">
          {activeSection.skills.map(skill => (
            <FeedCard key={skill.id} skill={skill} rank={skill.rank ?? 0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
            No skills launched on this day
          </p>
        </div>
      )}

      {activeDate === dates[0] && upcomingSection && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full"
              style={{
                color: 'var(--color-grey-300)',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'var(--glass-bg)',
              }}
            >
              Launching Tomorrow
            </span>
          </div>
          <div className="flex flex-col gap-3 opacity-60">
            {sections[1]?.skills.slice(0, 3).map(skill => (
              <FeedCard key={skill.id} skill={skill} rank={skill.rank ?? 0} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
