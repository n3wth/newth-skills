import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SEO } from '../components/SEO'
import { CategoryShape } from '../components/CategoryShape'
import { categories, type Skill } from '../data/skills'
import { skillTemplates, type SkillTemplate } from '../data/templates'
import { categoryConfig } from '../config/categories'

type WizardStep = 'template' | 'basics' | 'details' | 'preview'

interface SkillDraft {
  name: string
  description: string
  longDescription: string
  category: Skill['category'] | ''
  tags: string
  features: string
  useCases: string
  compatibility: ('gemini' | 'claude')[]
  icon: string
  color: string
  skillContent: string
}

interface FormErrors {
  name?: string
  description?: string
  category?: string
  skillContent?: string
}

const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: 'template', label: 'Choose Template' },
  { id: 'basics', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'preview', label: 'Preview & Export' }
]

function generateSkillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function ProgressIndicator({ currentStep, onStepClick }: { 
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void 
}) {
  const currentIndex = WIZARD_STEPS.findIndex(s => s.id === currentStep)
  
  return (
    <div className="flex items-center justify-between mb-12">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step.id === currentStep
        const isClickable = index <= currentIndex
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-white text-black'
                    : isCompleted
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm hidden md:block ${
                  isCurrent ? 'text-white font-medium' : isCompleted ? 'text-white/70' : 'text-white/40'
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 ${
                  index < currentIndex ? 'bg-white/30' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function TemplateCard({ 
  template, 
  isSelected, 
  onClick 
}: { 
  template: SkillTemplate
  isSelected: boolean
  onClick: () => void 
}) {
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

function SkillPreview({ draft }: { draft: SkillDraft }) {
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

function ExportSection({ draft }: { draft: SkillDraft }) {
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

export function CreateSkill() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [draft, setDraft] = useState<SkillDraft>({
    name: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    features: '',
    useCases: '',
    compatibility: ['gemini', 'claude'],
    icon: '',
    color: '',
    skillContent: ''
  })

  const categoryOptions = categories.filter(c => c.id !== 'all')

  const handleTemplateSelect = (templateId: string) => {
    const template = skillTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setDraft(prev => ({
        ...prev,
        category: template.category,
        tags: template.tags.join(', '),
        features: template.features.join('\n'),
        useCases: template.useCases.join('\n'),
        compatibility: [...template.compatibility],
        icon: template.icon,
        color: template.color,
        skillContent: template.skillContent
      }))
    }
  }

  const handleStartFromScratch = () => {
    setSelectedTemplate('scratch')
    setDraft({
      name: '',
      description: '',
      longDescription: '',
      category: '',
      tags: '',
      features: '',
      useCases: '',
      compatibility: ['gemini', 'claude'],
      icon: '',
      color: 'oklch(0.70 0.15 200)',
      skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- Add your trigger words here

## Instructions
Add your instructions here

## Output Format
Describe the expected output format
`
    })
  }

  const validateBasics = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!draft.name.trim()) {
      newErrors.name = 'Skill name is required'
    } else if (draft.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }
    
    if (!draft.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (draft.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    if (!draft.category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDetails = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!draft.skillContent.trim()) {
      newErrors.skillContent = 'Skill content is required'
    } else if (draft.skillContent.length < 50) {
      newErrors.skillContent = 'Skill content must be at least 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 'template') {
      if (selectedTemplate) {
        setCurrentStep('basics')
      }
    } else if (currentStep === 'basics') {
      if (validateBasics()) {
        setCurrentStep('details')
      }
    } else if (currentStep === 'details') {
      if (validateDetails()) {
        setCurrentStep('preview')
      }
    }
  }

  const handleBack = () => {
    if (currentStep === 'basics') {
      setCurrentStep('template')
    } else if (currentStep === 'details') {
      setCurrentStep('basics')
    } else if (currentStep === 'preview') {
      setCurrentStep('details')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setDraft(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCompatibilityChange = (platform: 'gemini' | 'claude') => {
    setDraft(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(platform)
        ? prev.compatibility.filter(p => p !== platform)
        : [...prev.compatibility, platform]
    }))
  }

  const filteredTemplates = useMemo(() => {
    return skillTemplates
  }, [])

  return (
    <div className="min-h-screen relative">
      <SEO
        title="Create a Skill - newth.ai skills"
        description="Create your own AI coding skill with our interactive wizard. Choose from templates or start from scratch."
        canonicalUrl="/create"
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
            Create a Skill
          </h1>
          <p
            className="text-lg mb-12"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Build your own AI coding skill with our guided wizard. Start from a template or create from scratch.
          </p>

          <ProgressIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

          {currentStep === 'template' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Choose a Template</h2>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  Start with a pre-built template or create from scratch
                </p>
              </div>
              
              <button
                onClick={handleStartFromScratch}
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
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'basics' && (
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                        onChange={() => handleCompatibilityChange('gemini')}
                        className="w-4 h-4 rounded"
                      />
                      <span style={{ color: 'var(--color-grey-200)' }}>Gemini CLI</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.compatibility.includes('claude')}
                        onChange={() => handleCompatibilityChange('claude')}
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
          )}

          {currentStep === 'details' && (
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
          )}

          {currentStep === 'preview' && (
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
          )}

          <div className="flex justify-between mt-12 pt-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 'template'}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                currentStep === 'template'
                  ? 'opacity-0 pointer-events-none'
                  : 'glass-pill hover:bg-white/10'
              }`}
            >
              Back
            </button>
            
            {currentStep !== 'preview' ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 'template' && !selectedTemplate}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentStep === 'template' && !selectedTemplate
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                Continue
              </button>
            ) : (
              <Link
                to="/submit"
                className="px-6 py-3 rounded-xl text-sm font-medium bg-white text-black hover:bg-white/90 transition-all"
              >
                Submit to Catalog
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
