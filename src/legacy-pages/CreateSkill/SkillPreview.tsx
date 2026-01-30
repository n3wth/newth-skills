import { CategoryShape } from '../../components/CategoryShape'
import type { SkillDraft } from './types'

interface SkillPreviewProps {
  draft: SkillDraft
}

export function SkillPreview({ draft }: SkillPreviewProps) {
  const tags = draft.tags.split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          {draft.category && <CategoryShape category={draft.category} size={12} />}
          {draft.category && (
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
        {draft.icon && <span className="text-lg">{draft.icon}</span>}
      </div>

      <h3 className="text-sm md:text-base font-semibold mb-2 text-white">
        {draft.name || 'Skill Name'}
      </h3>

      <p
        className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4"
        style={{ color: 'var(--color-grey-200)' }}
      >
        {draft.description || 'Your skill description will appear here...'}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="text-[9px] md:text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--color-grey-400)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="flex gap-1">
          {draft.compatibility.includes('gemini') && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(100, 210, 255, 0.15)',
                color: '#64d2ff',
                border: '1px solid rgba(100, 210, 255, 0.3)'
              }}
            >
              Gemini
            </span>
          )}
          {draft.compatibility.includes('claude') && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 214, 10, 0.15)',
                color: '#ffd60a',
                border: '1px solid rgba(255, 214, 10, 0.3)'
              }}
            >
              Claude
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
