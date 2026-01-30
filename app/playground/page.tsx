import type { Metadata } from 'next'
import { PlaygroundClient } from './PlaygroundClient'

export const metadata: Metadata = {
  title: 'Skill Playground',
  description: 'Try AI skills before installing. See example prompts and outputs to understand what each skill can do.',
  alternates: { canonical: '/playground' },
  keywords: ['AI playground', 'skill demo', 'try before install'],
}

export default function PlaygroundPage() {
  return <PlaygroundClient />
}
