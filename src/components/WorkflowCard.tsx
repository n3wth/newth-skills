import { Link } from 'react-router-dom'
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
      to={`/workflows/${workflow.id}`}
      className="glass-card skill-card block p-5 card-enter"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex -space-x-2">
          {workflowSkills.slice(0, 4).map((skill, i) => {
            if (!skill) return null
            const config = categoryConfig[skill.category]
            return (
              <div
                key={skill.id}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-base border-2 border-[var(--color-bg)]"
                style={{
                  backgroundColor: `color-mix(in oklch, ${config?.color || skill.color} 25%, var(--color-bg))`,
                  color: config?.color || skill.color,
                  zIndex: 4 - i
                }}
                title={skill.name}
              >
                {skill.icon}
              </div>
            )
          })}
          {workflowSkills.length > 4 && (
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium border-2 border-[var(--color-bg)] bg-[var(--glass-bg)] text-[var(--color-grey-400)]"
              style={{ zIndex: 0 }}
            >
              +{workflowSkills.length - 4}
            </div>
          )}
        </div>
        
        {workflow.isPublic && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-400)] border border-[var(--glass-border)]">
            Public
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-[var(--color-white)] mb-2 line-clamp-1">
        {workflow.name}
      </h3>
      
      <p className="text-sm text-[var(--color-grey-400)] mb-4 line-clamp-2">
        {workflow.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[var(--color-grey-600)]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {workflow.nodes.length} skill{workflow.nodes.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {workflow.connections.length} connection{workflow.connections.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {workflow.tags.length > 0 && (
          <div className="flex gap-1">
            {workflow.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-400)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          {workflowSkills.map((skill, i) => {
            if (!skill) return null
            const config = categoryConfig[skill.category]
            const isLast = i === workflowSkills.length - 1
            
            return (
              <div key={`${skill.id}-${i}`} className="flex items-center gap-2">
                <span 
                  className="text-xs"
                  style={{ color: config?.color || skill.color }}
                >
                  {skill.name}
                </span>
                {!isLast && (
                  <svg className="w-3 h-3 text-[var(--color-grey-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
