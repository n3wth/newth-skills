import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contribute a Skill',
  description: 'Built something useful? Share it. Submit your skill and get it listed in the catalog with full attribution.',
  alternates: { canonical: '/contribute' },
  openGraph: {
    title: 'Contribute a Skill',
    description: 'Built something useful? Share it. Submit your skill and get it listed in the catalog with full attribution.',
    url: '/contribute',
  },
}

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
