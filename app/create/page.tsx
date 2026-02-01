import type { Metadata } from 'next'
import { CreateSkillClient } from './CreateSkillClient'

export const metadata: Metadata = {
  title: 'Create Your Own AI Skill - Interactive Wizard',
  description: 'Create your own AI coding skill with our interactive wizard. Choose from templates or start from scratch.',
  alternates: { canonical: '/create' },
  openGraph: {
    title: 'Create Your Own AI Skill | newth.ai',
    description: 'Create your own AI coding skill with our interactive wizard. Choose from templates or start from scratch.',
    url: 'https://skills.newth.ai/create',
    images: ['/og-image.png'],
  },
}

export default function CreatePage() {
  return <CreateSkillClient />
}
