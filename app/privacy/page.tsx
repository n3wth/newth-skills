import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for skills.newth.ai. Learn how we handle your data.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | newth.ai',
    description: 'Privacy policy for skills.newth.ai. Learn how we handle your data.',
    url: 'https://skills.newth.ai/privacy',
    images: ['/og-image.png'],
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
