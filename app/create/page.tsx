import type { Metadata } from 'next'
import { CreateSkillClient } from './CreateSkillClient'

export const metadata: Metadata = {
  title: 'Create a Skill',
  description: 'Create your own AI coding skill with our interactive wizard. Choose from templates or start from scratch.',
  alternates: { canonical: '/create' },
}

export default function CreatePage() {
  return <CreateSkillClient />
}
