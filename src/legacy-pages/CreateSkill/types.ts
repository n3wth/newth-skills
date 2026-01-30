import type { Skill } from '../../data/skills'

export type WizardStep = 'template' | 'basics' | 'details' | 'preview'

export interface SkillDraft {
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

export interface FormErrors {
  name?: string
  description?: string
  category?: string
  skillContent?: string
}

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: 'template', label: 'Choose Template' },
  { id: 'basics', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'preview', label: 'Preview & Export' }
]

export function generateSkillId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
