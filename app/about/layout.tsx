import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What are AI Skills?',
  description: 'Skills are markdown files that teach your AI assistant how to do specific things. No servers, no infrastructure. Works offline, installs in seconds.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'What are AI Skills?',
    description: 'Skills are markdown files that teach your AI assistant how to do specific things. No servers, no infrastructure. Works offline, installs in seconds.',
    url: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
