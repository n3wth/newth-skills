import { useState } from 'react'
import { generateSkillId, type SkillDraft } from './types'

interface ExportSectionProps {
  draft: SkillDraft
}

export function ExportSection({ draft }: ExportSectionProps) {
  const [copied, setCopied] = useState<'gemini' | 'claude' | 'json' | null>(null)

  const skillId = generateSkillId(draft.name)
  const tags = draft.tags.split(',').map(t => t.trim()).filter(Boolean)
  const features = draft.features.split('\n').map(f => f.trim()).filter(Boolean)
  const useCases = draft.useCases.split('\n').map(u => u.trim()).filter(Boolean)

  const processedContent = draft.skillContent
    .replace(/\{\{name\}\}/g, draft.name)
    .replace(/\{\{description\}\}/g, draft.description)

  const geminiFormat = `# ${draft.name}

${draft.description}

${processedContent}
`

  const claudeFormat = `# ${draft.name}

${draft.description}

${processedContent}
`

  const jsonFormat = JSON.stringify({
    id: skillId,
    name: draft.name,
    description: draft.description,
    longDescription: draft.longDescription || undefined,
    category: draft.category,
    tags,
    icon: draft.icon,
    color: draft.color,
    features: features.length > 0 ? features : undefined,
    useCases: useCases.length > 0 ? useCases : undefined,
    compatibility: draft.compatibility,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0]
  }, null, 2)

  const handleCopy = async (content: string, type: 'gemini' | 'claude' | 'json') => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Export Your Skill</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-grey-300)' }}>
          Choose your preferred format to export the skill. You can use these files directly with your AI assistant.
        </p>
      </div>

      {draft.compatibility.includes('gemini') && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(100, 210, 255, 0.15)',
                  color: '#64d2ff',
                  border: '1px solid rgba(100, 210, 255, 0.3)'
                }}
              >
                Gemini CLI
              </span>
              <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                {skillId}.md
              </span>
            </div>
            <button
              onClick={() => handleCopy(geminiFormat, 'gemini')}
              className={`copy-btn px-3 py-1.5 rounded-lg text-xs ${copied === 'gemini' ? 'copied' : ''}`}
            >
              {copied === 'gemini' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre
            className="text-xs overflow-x-auto p-3 rounded-lg max-h-48"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'var(--color-grey-200)'
            }}
          >
            {geminiFormat.slice(0, 500)}{geminiFormat.length > 500 ? '...' : ''}
          </pre>
        </div>
      )}

      {draft.compatibility.includes('claude') && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 214, 10, 0.15)',
                  color: '#ffd60a',
                  border: '1px solid rgba(255, 214, 10, 0.3)'
                }}
              >
                Claude Code
              </span>
              <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                {skillId}.md
              </span>
            </div>
            <button
              onClick={() => handleCopy(claudeFormat, 'claude')}
              className={`copy-btn px-3 py-1.5 rounded-lg text-xs ${copied === 'claude' ? 'copied' : ''}`}
            >
              {copied === 'claude' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre
            className="text-xs overflow-x-auto p-3 rounded-lg max-h-48"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'var(--color-grey-200)'
            }}
          >
            {claudeFormat.slice(0, 500)}{claudeFormat.length > 500 ? '...' : ''}
          </pre>
        </div>
      )}

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--color-grey-200)',
                border: '1px solid var(--glass-border)'
              }}
            >
              JSON
            </span>
            <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
              Catalog entry format
            </span>
          </div>
          <button
            onClick={() => handleCopy(jsonFormat, 'json')}
            className={`copy-btn px-3 py-1.5 rounded-lg text-xs ${copied === 'json' ? 'copied' : ''}`}
          >
            {copied === 'json' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre
          className="text-xs overflow-x-auto p-3 rounded-lg max-h-48"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'var(--color-grey-200)'
          }}
        >
          {jsonFormat}
        </pre>
      </div>
    </div>
  )
}
