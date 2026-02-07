import type { Metadata } from 'next'
import { SubmitClient } from './SubmitClient'

export const metadata: Metadata = {
  title: 'Submit a Skill',
  description: 'Submit your skill to the newth.ai marketplace. Contribute to the community and help others extend their AI assistants.',
  alternates: { canonical: '/submit' },
  openGraph: {
    title: 'Submit Your AI Skill to the Community Directory | newth.ai',
    description: 'Submit your skill to the AI skills directory. Contribute to the community and help developers worldwide extend their Claude Code and other AI assistants.',
    url: 'https://skills.newth.ai/submit',
    images: ['/og-image.png'],
  },
}

export default function SubmitPage() {
  return <SubmitClient />
}
