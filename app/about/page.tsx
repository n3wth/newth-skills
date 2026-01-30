import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Skills',
  description: 'Learn what skills are, how they work, and when to use them vs MCP servers.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Skills | newth.ai',
    description: 'Learn what skills are, how they work, and when to use them vs MCP servers.',
    url: 'https://skills.newth.ai/about',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return <AboutClient />
}
