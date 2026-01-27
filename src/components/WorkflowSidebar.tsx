import { useState, useMemo } from 'react'
import { skills } from '../data/skills'
import { type Workflow, getSkillIOSchema } from '../data/workflows'
import { categoryConfig } from '../config/categories'

interface WorkflowSidebarProps {
  onAddSkill: (skillId: string) => void
  workflow: Workflow
}

export function WorkflowSidebar({ onAddSkill, workflow }: WorkflowSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const skillsWithIO = useMemo(() => {
    return skills.filter(skill => getSkillIOSchema(skill.id))
  }, [])

  const filteredSkills = useMemo(() => {
    return skillsWithIO.filter(skill => {
      const matchesSearch = !searchQuery || 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = !selectedCategory || skill.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [skillsWithIO, searchQuery, selectedCategory])

  const categories = useMemo(() => {
    const cats = new Set(skillsWithIO.map(s => s.category))
    return Array.from(cats)
  }, [skillsWithIO])

  const usedSkillIds = useMemo(() => {
    return new Set(workflow.nodes.map(n => n.skillId))
  }, [workflow.nodes])

  return (
    <div className="w-72 border-r border-[var(--glass-border)] flex flex-col bg-[var(--color-bg-secondary)]">
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h3 className="text-sm font-medium text-[var(--color-white)] mb-3">Add Skills</h3>
        
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-600)]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              !selectedCategory 
                ? 'bg-[var(--color-white)] text-[var(--color-bg)]' 
                : 'bg-[var(--glass-bg)] text-[var(--color-grey-400)] hover:text-[var(--color-white)]'
            }`}
          >
            All
          </button>
          {categories.map(cat => {
            const config = categoryConfig[cat]
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors capitalize ${
                  selectedCategory === cat 
                    ? 'text-[var(--color-bg)]' 
                    : 'bg-[var(--glass-bg)] text-[var(--color-grey-400)] hover:text-[var(--color-white)]'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? config?.color : undefined
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredSkills.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--color-grey-600)]">No skills found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSkills.map(skill => {
              const config = categoryConfig[skill.category]
              const isUsed = usedSkillIds.has(skill.id)
              const schema = getSkillIOSchema(skill.id)
              
              return (
                <button
                  key={skill.id}
                  onClick={() => onAddSkill(skill.id)}
                  className="w-full p-3 rounded-lg text-left transition-all hover:bg-[var(--glass-bg)] group"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ 
                        backgroundColor: `color-mix(in oklch, ${config?.color || skill.color} 20%, transparent)`,
                        color: config?.color || skill.color
                      }}
                    >
                      {skill.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-[var(--color-white)] truncate">
                          {skill.name}
                        </h4>
                        {isUsed && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--color-grey-400)]">
                            In use
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-grey-600)] line-clamp-2 mt-0.5">
                        {skill.description}
                      </p>
                      {schema && (
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--color-grey-600)]">
                          <span>{schema.inputs.length} input{schema.inputs.length !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{schema.outputs.length} output{schema.outputs.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    <svg 
                      className="w-4 h-4 text-[var(--color-grey-600)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[var(--glass-border)]">
        <div className="text-xs text-[var(--color-grey-600)]">
          <p className="mb-2">Tips:</p>
          <ul className="space-y-1">
            <li>• Drag skills to reposition</li>
            <li>• Click output ports to connect</li>
            <li>• Press Delete to remove selected</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
