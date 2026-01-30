import type { Metadata } from 'next'
import ContributeClient from './ContributeClient'

export const metadata: Metadata = {
  title: 'Contribute a Skill',
  description: 'Share your skills with the community. Submit templates and best practices for AI.',
  alternates: { canonical: '/contribute' },
  openGraph: {
    title: 'Contribute a Skill | newth.ai',
    description: 'Share your skills with the community. Submit templates and best practices for AI.',
    url: 'https://skills.newth.ai/contribute',
    images: ['/og-image.png'],
  },
}

export default function ContributePage() {
  return <ContributeClient />
}
