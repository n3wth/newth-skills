import type { Metadata } from 'next'
import { RequestSkillClient } from './RequestSkillClient'

export const metadata: Metadata = {
  title: 'Request a Skill',
  description: "Request a new skill for the newth.ai skills marketplace. Let us know what you'd like to see.",
  alternates: { canonical: '/request-skill' },
}

export default function RequestSkillPage() {
  return <RequestSkillClient />
}
