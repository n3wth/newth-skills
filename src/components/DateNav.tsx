'use client'

import { useCallback } from 'react'

interface DateNavProps {
  dates: string[]
  activeDate: string
  onDateChange: (date: string) => void
}

function labelForDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - target.getTime()) / 86400000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DateNav({ dates, activeDate, onDateChange }: DateNavProps) {
  const handleClick = useCallback((date: string) => {
    onDateChange(date)
  }, [onDateChange])

  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide" aria-label="Date navigation">
      {dates.map(date => {
        const isActive = date === activeDate
        return (
          <button
            key={date}
            onClick={() => handleClick(date)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: isActive ? 'var(--glass-highlight)' : 'transparent',
              color: isActive ? 'white' : 'var(--color-grey-400)',
              border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {labelForDate(date)}
          </button>
        )
      })}
    </nav>
  )
}
