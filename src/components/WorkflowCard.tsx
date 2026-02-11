import Link from 'next/link'
import { skills } from '../data/skills'
import type { Workflow } from '../data/workflows'
import { categoryConfig } from '../config/categories'

interface WorkflowCardProps {
  workflow: Workflow
  index?: number
}

export function WorkflowCard({ workflow, index = 0 }: WorkflowCardProps) {
  const workflowSkills = workflow.nodes
    .map(node => skills.find(s => s.id === node.skillId))
    .filter(Boolean)

  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className="glass-card skill-card block p-5 card-enter"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <h3 className="text-lg font-medium text-[var(--color-white)] mb-2 line-clamp-1">
        {workflow.name}
      </h3>

      <p className="text-sm text-[var(--color-grey-400)] mb-4 line-clamp-2">
        {workflow.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {workflowSkills.map((skill, i) => {
          if (!skill) return null
          const config = categoryConfig[skill.category]
          const isLast = i === workflowSkills.length - 1

          return (
            <span key={`${skill.id}-${i}`} className="flex items-center gap-2">
              <span
                className="text-xs font-medium"
                style={{ color: config?.color || skill.color }}
              >
                {skill.name}
              </span>
              {!isLast && (
                <span className="text-[var(--color-grey-700)]">&rsaquo;</span>
              )}
            </span>
          )
        })}
      </div>
    </Link>
  )
}
