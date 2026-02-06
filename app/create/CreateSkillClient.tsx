'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { CategoryShape } from '@/src/components/CategoryShape'

// Types
type Compatibility = 'gemini' | 'claude'
type Category = 'development' | 'documents' | 'creative' | 'business'

interface SkillDraft {
  name: string
  description: string
  longDescription: string
  category: Category | ''
  tags: string
  icon: string
  color: string
  features: string
  useCases: string
  compatibility: Compatibility[]
  skillContent: string
}

type WizardStep = 'template' | 'basics' | 'details' | 'preview'

const WIZARD_STEPS: WizardStep[] = ['template', 'basics', 'details', 'preview']

const STEP_LABELS: Record<WizardStep, string> = {
  template: 'Template',
  basics: 'Basics',
  details: 'Details',
  preview: 'Preview'
}

function generateSkillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'untitled-skill'
}

const INITIAL_DRAFT: SkillDraft = {
  name: '',
  description: '',
  longDescription: '',
  category: '',
  tags: '',
  icon: '',
  color: '#30d158',
  features: '',
  useCases: '',
  compatibility: ['claude'],
  skillContent: ''
}

// Custom Hook
function useSkillWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template')
  const [draft, setDraft] = useState<SkillDraft>(INITIAL_DRAFT)

  const updateDraft = useCallback((updates: Partial<SkillDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    if (currentIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentIndex + 1])
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentIndex - 1])
    }
  }, [currentStep])

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step)
  }, [])

  const resetWizard = useCallback(() => {
    setCurrentStep('template')
    setDraft(INITIAL_DRAFT)
  }, [])

  const canGoNext = useCallback((): boolean => {
    switch (currentStep) {
      case 'template':
        return draft.skillContent.length > 0
      case 'basics':
        return draft.name.length > 0 && draft.description.length > 0 && draft.category !== ''
      case 'details':
        return true
      case 'preview':
        return false
      default:
        return false
    }
  }, [currentStep, draft])

  const canGoPrev = useCallback((): boolean => {
    return WIZARD_STEPS.indexOf(currentStep) > 0
  }, [currentStep])

  return {
    currentStep,
    draft,
    updateDraft,
    nextStep,
    prevStep,
    goToStep,
    resetWizard,
    canGoNext,
    canGoPrev
  }
}

// Progress Indicator Component
interface ProgressIndicatorProps {
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void
}

function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep)

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {WIZARD_STEPS.map((step, index) => {
        const isActive = index === currentIndex
        const isCompleted = index < currentIndex
        const isClickable = index <= currentIndex

        return (
          <button
            key={step}
            onClick={() => isClickable && onStepClick(step)}
            disabled={!isClickable}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
            style={{
              backgroundColor: isActive
                ? 'var(--glass-highlight)'
                : isCompleted
                ? 'rgba(34, 197, 94, 0.15)'
                : 'var(--glass-bg)',
              border: `1px solid ${
                isActive
                  ? 'var(--color-white)'
                  : isCompleted
                  ? 'rgba(34, 197, 94, 0.3)'
                  : 'var(--glass-border)'
              }`,
              color: isActive
                ? 'var(--color-white)'
                : isCompleted
                ? '#22c55e'
                : 'var(--color-grey-400)',
              opacity: isClickable ? 1 : 0.5
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
              style={{
                backgroundColor: isCompleted ? '#22c55e' : 'transparent',
                border: isCompleted ? 'none' : '1px solid currentColor'
              }}
            >
              {isCompleted ? '✓' : index + 1}
            </span>
            <span className="hidden sm:inline">{STEP_LABELS[step]}</span>
          </button>
        )
      })}
    </div>
  )
}

// Template Step Component
interface TemplateStepProps {
  draft: SkillDraft
  updateDraft: (updates: Partial<SkillDraft>) => void
}

const SKILL_TEMPLATES = [
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Create a completely custom skill with full control',
    icon: '✨',
    content: ''
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Help with coding tasks, debugging, and best practices',
    icon: '💻',
    content: `## Overview
This skill helps with coding tasks and programming challenges.

## Capabilities
- Code review and suggestions
- Debugging assistance
- Best practices guidance
- Code generation

## Usage
Describe your coding task or share code for review.`
  },
  {
    id: 'document-processor',
    name: 'Document Processor',
    description: 'Analyze, summarize, and transform documents',
    icon: '📄',
    content: `## Overview
This skill processes and transforms documents.

## Capabilities
- Document summarization
- Format conversion
- Content extraction
- Text analysis

## Usage
Share your document or describe the processing needed.`
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Generate creative content, stories, and copy',
    icon: '✍️',
    content: `## Overview
This skill generates creative written content.

## Capabilities
- Story writing
- Marketing copy
- Creative brainstorming
- Content editing

## Usage
Describe the type of content you need and any style preferences.`
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyze data, generate insights, and create reports',
    icon: '📊',
    content: `## Overview
This skill analyzes data and generates insights.

## Capabilities
- Data interpretation
- Trend analysis
- Report generation
- Visualization suggestions

## Usage
Share your data or describe the analysis needed.`
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Design and optimize automated workflows',
    icon: '⚙️',
    content: `## Overview
This skill helps design and optimize workflows.

## Capabilities
- Process mapping
- Automation design
- Efficiency optimization
- Integration planning

## Usage
Describe your current workflow or automation goals.`
  }
]

function TemplateStep({ draft, updateDraft }: TemplateStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    draft.skillContent ? 'custom' : null
  )

  const handleTemplateSelect = (template: typeof SKILL_TEMPLATES[0]) => {
    setSelectedTemplate(template.id)
    updateDraft({
      skillContent: template.content,
      icon: template.id !== 'blank' ? template.icon : draft.icon
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Choose a Template</h2>
        <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
          Start with a template or build from scratch. You can customize everything later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`glass-card p-4 text-left transition-all hover:scale-[1.02] ${
              selectedTemplate === template.id ? 'ring-1 ring-white/40' : ''
            }`}
            style={{
              backgroundColor:
                selectedTemplate === template.id
                  ? 'var(--glass-highlight)'
                  : 'var(--glass-bg)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{template.icon}</span>
              {selectedTemplate === template.id && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  Selected
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{template.name}</h3>
            <p className="text-xs" style={{ color: 'var(--color-grey-300)' }}>
              {template.description}
            </p>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="glass-card p-4">
          <label className="block text-sm font-medium text-white mb-2">
            Skill Content (Markdown)
          </label>
          <textarea
            value={draft.skillContent}
            onChange={e => updateDraft({ skillContent: e.target.value })}
            rows={12}
            className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 font-mono resize-none"
            style={{ borderColor: 'var(--glass-border)' }}
            placeholder="Write your skill instructions in Markdown..."
          />
          <p className="text-xs mt-2" style={{ color: 'var(--color-grey-400)' }}>
            Use {'{{name}}'} and {'{{description}}'} as placeholders that will be replaced with your skill details.
          </p>
        </div>
      )}
    </div>
  )
}

// Basics Step Component
interface BasicsStepProps {
  draft: SkillDraft
  updateDraft: (updates: Partial<SkillDraft>) => void
}

const CATEGORY_OPTIONS: { id: Category; name: string; color: string }[] = [
  { id: 'development', name: 'Development', color: '#30d158' },
  { id: 'documents', name: 'Documents', color: '#ff6961' },
  { id: 'creative', name: 'Creative', color: '#64d2ff' },
  { id: 'business', name: 'Business', color: '#ffd60a' }
]

const ICON_SUGGESTIONS = ['🚀', '⚡', '🎯', '💡', '🔧', '📦', '🎨', '📊', '🔍', '✨', '🤖', '📝']

function BasicsStep({ draft, updateDraft }: BasicsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Basic Information</h2>
        <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
          Give your skill a name and description that clearly explains what it does.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skill Name <span style={{ color: 'var(--color-coral)' }}>*</span>
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={e => updateDraft({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
              style={{ borderColor: 'var(--glass-border)' }}
              placeholder="e.g., Code Review Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Short Description <span style={{ color: 'var(--color-coral)' }}>*</span>
            </label>
            <input
              type="text"
              value={draft.description}
              onChange={e => updateDraft({ description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
              style={{ borderColor: 'var(--glass-border)' }}
              placeholder="A brief description of what your skill does"
              maxLength={120}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-grey-400)' }}>
              {draft.description.length}/120 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category <span style={{ color: 'var(--color-coral)' }}>*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => updateDraft({ category: category.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                    draft.category === category.id ? 'ring-1 ring-white/40' : ''
                  }`}
                  style={{
                    backgroundColor:
                      draft.category === category.id
                        ? 'var(--glass-highlight)'
                        : 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-grey-200)'
                  }}
                >
                  <CategoryShape category={category.id} size={10} />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Icon</label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={draft.icon}
                onChange={e => updateDraft({ icon: e.target.value })}
                className="w-20 px-4 py-3 rounded-lg text-lg bg-white/5 border text-white text-center focus:outline-none focus:ring-1 focus:ring-white/20"
                style={{ borderColor: 'var(--glass-border)' }}
                placeholder="🚀"
                maxLength={2}
              />
              <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                Enter an emoji
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ICON_SUGGESTIONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => updateDraft({ icon })}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                    draft.icon === icon ? 'ring-1 ring-white/40' : ''
                  }`}
                  style={{
                    backgroundColor:
                      draft.icon === icon ? 'var(--glass-highlight)' : 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Tags</label>
            <input
              type="text"
              value={draft.tags}
              onChange={e => updateDraft({ tags: e.target.value })}
              className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
              style={{ borderColor: 'var(--glass-border)' }}
              placeholder="code, review, quality (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Compatibility</label>
            <div className="flex gap-2">
              {(['claude', 'gemini'] as Compatibility[]).map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    const newCompat = draft.compatibility.includes(platform)
                      ? draft.compatibility.filter(c => c !== platform)
                      : [...draft.compatibility, platform]
                    if (newCompat.length > 0) {
                      updateDraft({ compatibility: newCompat })
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    draft.compatibility.includes(platform) ? 'ring-1 ring-white/40' : ''
                  }`}
                  style={{
                    backgroundColor: draft.compatibility.includes(platform)
                      ? platform === 'claude'
                        ? 'rgba(255, 214, 10, 0.15)'
                        : 'rgba(100, 210, 255, 0.15)'
                      : 'var(--glass-bg)',
                    border: `1px solid ${
                      draft.compatibility.includes(platform)
                        ? platform === 'claude'
                          ? 'rgba(255, 214, 10, 0.3)'
                          : 'rgba(100, 210, 255, 0.3)'
                        : 'var(--glass-border)'
                    }`,
                    color: draft.compatibility.includes(platform)
                      ? platform === 'claude'
                        ? '#ffd60a'
                        : '#64d2ff'
                      : 'var(--color-grey-300)'
                  }}
                >
                  {platform === 'claude' ? 'Claude Code' : 'Gemini CLI'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Details Step Component
interface DetailsStepProps {
  draft: SkillDraft
  updateDraft: (updates: Partial<SkillDraft>) => void
}

function DetailsStep({ draft, updateDraft }: DetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Additional Details</h2>
        <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
          Add more information to help users understand your skill better.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Long Description
          </label>
          <textarea
            value={draft.longDescription}
            onChange={e => updateDraft({ longDescription: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
            style={{ borderColor: 'var(--glass-border)' }}
            placeholder="A detailed description of your skill, its capabilities, and how it works..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Key Features
          </label>
          <textarea
            value={draft.features}
            onChange={e => updateDraft({ features: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
            style={{ borderColor: 'var(--glass-border)' }}
            placeholder="List key features, one per line:&#10;- Feature one&#10;- Feature two&#10;- Feature three"
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-grey-400)' }}>
            Enter one feature per line
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Use Cases
          </label>
          <textarea
            value={draft.useCases}
            onChange={e => updateDraft({ useCases: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
            style={{ borderColor: 'var(--glass-border)' }}
            placeholder="Describe common use cases, one per line:&#10;- Use case one&#10;- Use case two&#10;- Use case three"
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-grey-400)' }}>
            Enter one use case per line
          </p>
        </div>
      </div>
    </div>
  )
}

// Skill Preview Component
interface SkillPreviewProps {
  draft: SkillDraft
}

function SkillPreview({ draft }: SkillPreviewProps) {
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

// Export Section Component
interface ExportSectionProps {
  draft: SkillDraft
}

function ExportSection({ draft }: ExportSectionProps) {
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

// Preview Step Component
interface PreviewStepProps {
  draft: SkillDraft
  onReset: () => void
}

function PreviewStep({ draft, onReset }: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Preview & Export</h2>
        <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
          Review your skill and export it in your preferred format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-3">Card Preview</h3>
          <SkillPreview draft={draft} />

          <div className="mt-6 space-y-3">
            <button
              onClick={onReset}
              className="w-full px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
              style={{
                color: 'var(--color-grey-400)',
                border: '1px solid var(--glass-border)'
              }}
            >
              Start Over
            </button>
            <Link
              href="/submit"
              className="block w-full px-4 py-2 rounded-full text-sm font-medium text-white text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#22c55e' }}
            >
              Submit to Marketplace
            </Link>
          </div>
        </div>

        <div>
          <ExportSection draft={draft} />
        </div>
      </div>
    </div>
  )
}

// Wizard Navigation Component
interface WizardNavigationProps {
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  isLastStep: boolean
}

function WizardNavigation({
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  isLastStep
}: WizardNavigationProps) {
  if (isLastStep) return null

  return (
    <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
        style={{
          color: 'var(--color-grey-300)',
          border: '1px solid var(--glass-border)'
        }}
      >
        Back
      </button>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-grey-400)' }}
        >
          Cancel
        </Link>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="px-6 py-2 rounded-full text-sm font-medium text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: '#22c55e' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Main Client Component
export function CreateSkillClient() {
  const {
    currentStep,
    draft,
    updateDraft,
    nextStep,
    prevStep,
    goToStep,
    resetWizard,
    canGoNext,
    canGoPrev
  } = useSkillWizard()

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-grey-400)' }}
            >
              <span>&larr;</span> All skills
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              Create a Skill
            </h1>
            <p className="mt-2" style={{ color: 'var(--color-grey-300)' }}>
              Build your own AI skill with our interactive wizard
            </p>
          </div>

          <ProgressIndicator currentStep={currentStep} onStepClick={goToStep} />

          <div className="glass-card p-6 md:p-8">
            {currentStep === 'template' && (
              <TemplateStep draft={draft} updateDraft={updateDraft} />
            )}
            {currentStep === 'basics' && (
              <BasicsStep draft={draft} updateDraft={updateDraft} />
            )}
            {currentStep === 'details' && (
              <DetailsStep draft={draft} updateDraft={updateDraft} />
            )}
            {currentStep === 'preview' && (
              <PreviewStep draft={draft} onReset={resetWizard} />
            )}

            <WizardNavigation
              canGoNext={canGoNext()}
              canGoPrev={canGoPrev()}
              onNext={nextStep}
              onPrev={prevStep}
              isLastStep={currentStep === 'preview'}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
