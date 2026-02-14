'use client'

import Link from 'next/link'
import type { LaunchedSkill } from '../lib/feed'
import { CategoryShape } from './CategoryShape'
import { CompatibilityMatrix } from './CompatibilityMatrix'
import { categoryConfig } from '../config/categories'

interface FeedCardProps {
  skill: LaunchedSkill
  rank: number
}

export function FeedCard({ skill, rank }: FeedCardProps) {
  return (
    <Link
      href={`/skill/${skill.id}`}
      className="skill-card glass-card group flex items-start gap-4 p-4 sm:p-5"
      style={{ '--card-accent': categoryConfig[skill.category]?.color || 'var(--glass-highlight)' } as React.CSSProperties}
    >
      <div
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
        style={{
          color: rank <= 3 ? 'white' : 'var(--color-grey-400)',
          backgroundColor: rank <= 3 ? 'var(--glass-highlight)' : 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {rank}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryShape category={skill.category} size={10} />
          <h3 className="text-sm font-semibold text-white truncate">{skill.name}</h3>
        </div>

        <p
          className="text-xs leading-relaxed mb-2 line-clamp-2"
          style={{ color: 'var(--color-grey-200)' }}
        >
          {skill.description}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[8px] uppercase tracking-wider"
                style={{ color: 'var(--color-grey-400)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {skill.compatibility && skill.compatibility.length > 0 && (
            <CompatibilityMatrix compatibility={skill.compatibility} size="sm" />
          )}
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{
            border: '1px solid var(--glass-border)',
            backgroundColor: 'var(--glass-bg)',
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label={`Upvote ${skill.name}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
        <span className="text-[10px] font-medium" style={{ color: 'var(--color-grey-300)' }}>
          {skill.upvotes}
        </span>
      </div>
    </Link>
  )
}
