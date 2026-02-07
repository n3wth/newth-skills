import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare AI Skills Side by Side - Feature Matrix',
  description: 'Compare AI coding skills side by side with detailed feature matrices. Evaluate compatibility, features, and use cases to find the best skills for your workflow.',
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Compare AI Skills Side by Side - Feature Matrix | newth.ai',
    description: 'Compare AI coding skills side by side with detailed feature matrices. Evaluate compatibility, features, and use cases to find the best skills for your workflow.',
    url: 'https://skills.newth.ai/compare',
    images: ['/og-image.png'],
  },
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CompareClient />
    </Suspense>
  )
}
