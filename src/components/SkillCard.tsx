import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { getCopyCount } from '../lib/analytics'

interface SkillCardProps {
  skill: Skill
  showPopularity?: boolean
}

function isRecentlyUpdated(lastUpdated: string): boolean {
  const updateDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30
}

export function SkillCard({ skill, showPopularity = false }: SkillCardProps) {
  const copyCount = showPopularity ? getCopyCount(skill.id) : 0
  const isNew = isRecentlyUpdated(skill.lastUpdated)

  return (
    <Link to={`/skill/${skill.id}`} className="glass-card group cursor-pointer p-5 md:p-6 block">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <CategoryShape category={skill.category} size={12} />
          {isNew && (
            <span 
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ 
                color: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            >
              New
            </span>
          )}
        </div>
        {showPopularity && copyCount > 0 && (
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ 
              color: 'var(--color-grey-300)',
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {copyCount} {copyCount === 1 ? 'install' : 'installs'}
          </span>
        )}
      </div>

      <h3 className="text-sm md:text-base font-semibold mb-2 text-white group-hover:opacity-70 transition-opacity">
        {skill.name}
      </h3>

      <p
        className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4"
        style={{ color: 'var(--color-grey-200)' }}
      >
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {skill.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-[9px] md:text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--color-grey-400)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
