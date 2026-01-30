import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for skills.newth.ai. Learn how we handle your data when using our AI skills directory for Claude Code and Gemini CLI.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy',
    description: 'Privacy policy for skills.newth.ai. Learn how we handle your data when using our AI skills directory for Claude Code and Gemini CLI.',
    url: '/privacy',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
