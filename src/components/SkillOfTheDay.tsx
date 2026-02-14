'use client'
import Link from 'next/link'
import { skills } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { CompatibilityMatrix } from './CompatibilityMatrix'
import { categoryConfig } from '../config/categories'

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function SkillOfTheDay() {
  const dayOfYear = getDayOfYear()
  const skill = skills[dayOfYear % skills.length]
  if (!skill) return null

  return (
    <section className="mb-16 md:mb-24">
      <Link
        href={`/skill/${skill.id}`}
        className="skill-card glass-card group block w-full p-6 sm:p-8 md:p-10"
        style={{ '--card-accent': categoryConfig[skill.category]?.color || 'var(--glass-highlight)' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2 mb-4">
          <CategoryShape category={skill.category} size={14} />
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--color-grey-400)' }}>
            Skill of the Day
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
          {skill.name}
        </h3>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-5" style={{ color: 'var(--color-grey-200)' }}>
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {skill.tags.slice(0, 5).map(tag => (
            <span key={tag} className="text-[9px] sm:text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-grey-400)' }}>
              {tag}
            </span>
          ))}
        </div>

        {skill.compatibility && skill.compatibility.length > 0 && (
          <div className="pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <CompatibilityMatrix compatibility={skill.compatibility} size="sm" />
          </div>
        )}
      </Link>
    </section>
  )
}
