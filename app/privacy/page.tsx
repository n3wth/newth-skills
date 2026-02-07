import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data',
  description: 'Privacy policy for skills.newth.ai. Learn how we collect, use, and protect your data. We prioritize transparency and minimal data collection for our AI skills directory.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy - How We Protect Your Data | newth.ai',
    description: 'Privacy policy for skills.newth.ai. Learn how we collect, use, and protect your data. We prioritize transparency and minimal data collection for our AI skills directory.',
    url: 'https://skills.newth.ai/privacy',
    images: ['/og-image.png'],
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
