import { CategoryShape } from '../../components/CategoryShape'
import { categoryConfig } from '../../config/categories'
import type { SkillTemplate } from '../../data/templates'

interface TemplateCardProps {
  template: SkillTemplate
  isSelected: boolean
  onClick: () => void
}

function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  const config = categoryConfig[template.category]

  return (
    <button
      onClick={onClick}
      className={`glass-card p-5 text-left transition-all ${
        isSelected ? 'ring-2 ring-white/50 bg-white/5' : 'hover:bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CategoryShape category={template.category} size={12} />
          <span className="text-xs uppercase tracking-wider" style={{ color: config.color }}>
            {template.category}
          </span>
        </div>
        <span className="text-lg">{template.icon}</span>
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{template.name}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-grey-300)' }}>
        {template.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {template.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--color-grey-400)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}

interface TemplateStepProps {
  selectedTemplate: string | null
  templates: SkillTemplate[]
  onTemplateSelect: (templateId: string) => void
  onStartFromScratch: () => void
}

export function TemplateStep({
  selectedTemplate,
  templates,
  onTemplateSelect,
  onStartFromScratch
}: TemplateStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Choose a Template</h2>
        <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
          Start with a pre-built template or create from scratch
        </p>
      </div>

      <button
        onClick={onStartFromScratch}
        className={`w-full glass-card p-5 text-left transition-all ${
          selectedTemplate === 'scratch' ? 'ring-2 ring-white/50 bg-white/5' : 'hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          >
            <span className="text-lg">+</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Start from Scratch</h3>
            <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
              Create a completely custom skill with your own structure
            </p>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onClick={() => onTemplateSelect(template.id)}
          />
        ))}
      </div>
    </div>
  )
}
