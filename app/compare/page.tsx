import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Skills',
  description: 'Compare AI coding skills side by side to find the best fit for your needs.',
  alternates: { canonical: '/compare' },
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CompareClient />
    </Suspense>
  )
}
