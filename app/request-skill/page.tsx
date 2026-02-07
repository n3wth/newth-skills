import type { Metadata } from 'next'
import { RequestSkillClient } from './RequestSkillClient'

export const metadata: Metadata = {
  title: 'Request a Skill',
  description: "Request a new skill for the newth.ai marketplace. Let us know what you'd like to see.",
  alternates: { canonical: '/request-skill' },
  openGraph: {
    title: 'Request a New AI Skill for Claude Code | newth.ai',
    description: "Request a new skill for the AI skills directory. Tell us what capability you need and the community can help build it for Claude Code and other assistants.",
    url: 'https://skills.newth.ai/request-skill',
    images: ['/og-image.png'],
  },
}

export default function RequestSkillPage() {
  return <RequestSkillClient />
}
