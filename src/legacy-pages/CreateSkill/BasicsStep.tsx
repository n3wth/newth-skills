import { categories } from '../../data/skills'
import { SkillPreview } from './SkillPreview'
import type { SkillDraft, FormErrors } from './types'

interface BasicsStepProps {
  draft: SkillDraft
  errors: FormErrors
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onCompatibilityChange: (platform: 'gemini' | 'claude') => void
}

export function BasicsStep({ draft, errors, onChange, onCompatibilityChange }: BasicsStepProps) {
  const categoryOptions = categories.filter(c => c.id !== 'all')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Basic Information</h2>
          <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
            Define the core details of your skill
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Skill Name <span style={{ color: 'var(--color-coral)' }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={draft.name}
            onChange={onChange}
            placeholder="e.g., React Testing Helper"
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
            style={{
              background: 'var(--glass-bg)',
              border: `1px solid ${errors.name ? 'var(--color-coral)' : 'var(--glass-border)'}`,
              color: 'var(--color-white)',
            }}
          />
          {errors.name && (
            <p className="mt-2 text-sm" style={{ color: 'var(--color-coral)' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Category <span style={{ color: 'var(--color-coral)' }}>*</span>
          </label>
          <select
            id="category"
            name="category"
            value={draft.category}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'var(--glass-bg)',
              border: `1px solid ${errors.category ? 'var(--color-coral)' : 'var(--glass-border)'}`,
              color: draft.category ? 'var(--color-white)' : 'var(--color-grey-400)',
            }}
          >
            <option value="">Select a category</option>
            {categoryOptions.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm" style={{ color: 'var(--color-coral)' }}>
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Description <span style={{ color: 'var(--color-coral)' }}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={draft.description}
            onChange={onChange}
            placeholder="A brief description of what this skill does..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
            style={{
              background: 'var(--glass-bg)',
              border: `1px solid ${errors.description ? 'var(--color-coral)' : 'var(--glass-border)'}`,
              color: 'var(--color-white)',
            }}
          />
          {errors.description && (
            <p className="mt-2 text-sm" style={{ color: 'var(--color-coral)' }}>
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={draft.tags}
            onChange={onChange}
            placeholder="e.g., testing, react, jest"
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
          />
          <p className="mt-2 text-xs" style={{ color: 'var(--color-grey-400)' }}>
            Comma-separated keywords
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-3"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Compatibility
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.compatibility.includes('gemini')}
                onChange={() => onCompatibilityChange('gemini')}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: 'var(--color-grey-200)' }}>Gemini CLI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.compatibility.includes('claude')}
                onChange={() => onCompatibilityChange('claude')}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: 'var(--color-grey-200)' }}>Claude Code</span>
            </label>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-grey-400)' }}>
          Live Preview
        </h3>
        <SkillPreview draft={draft} />
      </div>
    </div>
  )
}
