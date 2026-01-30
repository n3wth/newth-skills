import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BundlesClient } from './BundlesClient'

export const metadata: Metadata = {
  title: 'Skill Bundles',
  description: 'Create and share collections of AI coding skills. Bundle your favorite skills together for easy installation.',
  alternates: { canonical: '/bundles' },
}

export default function BundlesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BundlesClient />
    </Suspense>
  )
}
