import { SkillPreview } from './SkillPreview'
import type { SkillDraft, FormErrors } from './types'

interface DetailsStepProps {
  draft: SkillDraft
  errors: FormErrors
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export function DetailsStep({ draft, errors, onChange }: DetailsStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Skill Details</h2>
          <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
            Define the content and behavior of your skill
          </p>
        </div>

        <div>
          <label
            htmlFor="longDescription"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Long Description
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={draft.longDescription}
            onChange={onChange}
            placeholder="A detailed description of the skill's capabilities..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="features"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Features
          </label>
          <textarea
            id="features"
            name="features"
            value={draft.features}
            onChange={onChange}
            placeholder="List key features, one per line..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="useCases"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Use Cases
          </label>
          <textarea
            id="useCases"
            name="useCases"
            value={draft.useCases}
            onChange={onChange}
            placeholder="Describe specific scenarios where this skill would be useful..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="skillContent"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Skill Content <span style={{ color: 'var(--color-coral)' }}>*</span>
          </label>
          <p className="text-xs mb-3" style={{ color: 'var(--color-grey-400)' }}>
            The markdown content that defines your skill. Use {'{{name}}'} and {'{{description}}'} as placeholders.
          </p>
          <textarea
            id="skillContent"
            name="skillContent"
            value={draft.skillContent}
            onChange={onChange}
            placeholder="# Skill Name&#10;&#10;## Instructions&#10;..."
            rows={12}
            className="w-full px-4 py-3 rounded-xl text-sm font-mono transition-all duration-200 focus:outline-none resize-none"
            style={{
              background: 'var(--glass-bg)',
              border: `1px solid ${errors.skillContent ? 'var(--color-coral)' : 'var(--glass-border)'}`,
              color: 'var(--color-white)',
            }}
          />
          {errors.skillContent && (
            <p className="mt-2 text-sm" style={{ color: 'var(--color-coral)' }}>
              {errors.skillContent}
            </p>
          )}
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
