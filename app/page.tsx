import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
title: 'n3wth/skills - AI Coding Assistant Skills',
  description: 'Discover and install AI coding skills for Gemini CLI and other assistants. Browse community-built templates, workflows, and best practices to supercharge your development.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'n3wth/skills - AI Coding Assistant Skills',
    description: 'Discover and install AI coding skills for Gemini CLI and other assistants. Browse community-built templates, workflows, and best practices to supercharge your development.',
    url: 'https://skills.newth.ai',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return <HomeClient />
}
