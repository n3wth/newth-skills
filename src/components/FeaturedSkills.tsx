'use client'
import Link from 'next/link'
import { skills, type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { CompatibilityMatrix } from './CompatibilityMatrix'

const featuredSkills = skills.filter(s => s.featured)

export function FeaturedSkills() {
  if (featuredSkills.length === 0) return null

  return (
    <section className="mb-16 md:mb-24">
      <div className="mb-6">
        <h2 className="section-title mb-2">
          Featured
        </h2>
        <p className="label">
          The skills people actually use every day
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory py-3 -mx-2 px-2">
        {featuredSkills.map(skill => (
          <FeaturedCard key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ skill }: { skill: Skill }) {
  return (
    <Link
      href={`/skill/${skill.id}`}
      className="skill-card glass-card glass-card--featured group flex-shrink-0 w-[280px] sm:w-[320px] p-5 sm:p-6 snap-start flex flex-col"
      style={{ minHeight: '180px' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CategoryShape category={skill.category} size={14} />
        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-grey-400)' }}>
          Featured
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {skill.name}
      </h3>

      <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--color-grey-200)' }}>
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skill.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: 'var(--color-grey-400)' }}>
            {tag}
          </span>
        ))}
      </div>

      {skill.compatibility && skill.compatibility.length > 0 && (
        <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <CompatibilityMatrix compatibility={skill.compatibility} size="sm" />
        </div>
      )}
    </Link>
  )
}
