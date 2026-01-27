import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link to={`/skill/${skill.id}`} className="glass-card group cursor-pointer p-5 md:p-6 block">
      <div className="mb-3 md:mb-4">
        <CategoryShape category={skill.category} size={12} />
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
