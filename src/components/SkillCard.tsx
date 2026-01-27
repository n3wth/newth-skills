import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { getCopyCount } from '../lib/analytics'

interface SkillCardProps {
  skill: Skill
  showPopularity?: boolean
  isFavorite?: boolean
  onToggleFavorite?: (skillId: string) => void
}

export function SkillCard({ skill, showPopularity = false, isFavorite = false, onToggleFavorite }: SkillCardProps) {
  const copyCount = showPopularity ? getCopyCount(skill.id) : 0

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(skill.id)
  }

  return (
    <Link to={`/skill/${skill.id}`} className="skill-card glass-card group cursor-pointer p-5 md:p-6 block">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <CategoryShape category={skill.category} size={12} />
        <div className="flex items-center gap-2">
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
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="p-1 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                color: isFavorite ? 'var(--color-coral)' : 'var(--color-grey-400)',
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
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
