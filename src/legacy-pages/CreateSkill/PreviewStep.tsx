import { Link } from 'react-router-dom'
import { SkillPreview } from './SkillPreview'
import { ExportSection } from './ExportSection'
import type { SkillDraft } from './types'

interface PreviewStepProps {
  draft: SkillDraft
}

export function PreviewStep({ draft }: PreviewStepProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Preview & Export</h2>
          <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
            Review your skill and export it in your preferred format
          </p>
        </div>

        <ExportSection draft={draft} />
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-grey-400)' }}>
            Skill Card Preview
          </h3>
          <SkillPreview draft={draft} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-white mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--color-grey-300)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--color-sage)' }}>1.</span>
              Copy the skill content in your preferred format
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--color-sage)' }}>2.</span>
              Save it to your skills directory
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--color-sage)' }}>3.</span>
              Test it with your AI assistant
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--color-sage)' }}>4.</span>
              <Link to="/submit" className="link-hover text-white">
                Submit it to the catalog
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
