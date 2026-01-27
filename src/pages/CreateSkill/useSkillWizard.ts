import { useState, useMemo, useCallback } from 'react'
import { skillTemplates } from '../../data/templates'
import type { WizardStep, SkillDraft, FormErrors } from './types'

const INITIAL_DRAFT: SkillDraft = {
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
}

const SCRATCH_TEMPLATE: Partial<SkillDraft> = {
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
}

export function useSkillWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [draft, setDraft] = useState<SkillDraft>(INITIAL_DRAFT)

  const handleTemplateSelect = useCallback((templateId: string) => {
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
  }, [])

  const handleStartFromScratch = useCallback(() => {
    setSelectedTemplate('scratch')
    setDraft({ ...INITIAL_DRAFT, ...SCRATCH_TEMPLATE })
  }, [])

  const validateBasics = useCallback((): boolean => {
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
  }, [draft.name, draft.description, draft.category])

  const validateDetails = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!draft.skillContent.trim()) {
      newErrors.skillContent = 'Skill content is required'
    } else if (draft.skillContent.length < 50) {
      newErrors.skillContent = 'Skill content must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [draft.skillContent])

  const handleNext = useCallback(() => {
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
  }, [currentStep, selectedTemplate, validateBasics, validateDetails])

  const handleBack = useCallback(() => {
    if (currentStep === 'basics') {
      setCurrentStep('template')
    } else if (currentStep === 'details') {
      setCurrentStep('basics')
    } else if (currentStep === 'preview') {
      setCurrentStep('details')
    }
  }, [currentStep])

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setDraft(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleCompatibilityChange = useCallback((platform: 'gemini' | 'claude') => {
    setDraft(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(platform)
        ? prev.compatibility.filter(p => p !== platform)
        : [...prev.compatibility, platform]
    }))
  }, [])

  const filteredTemplates = useMemo(() => skillTemplates, [])

  return {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    draft,
    errors,
    filteredTemplates,
    handleTemplateSelect,
    handleStartFromScratch,
    handleNext,
    handleBack,
    handleChange,
    handleCompatibilityChange
  }
}
