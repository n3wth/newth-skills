import type { Metadata } from 'next'
import { CuratedBundlesClient } from './CuratedBundlesClient'

export const metadata: Metadata = {
  title: 'Curated Skill Bundles',
  description: 'Pre-built skill bundles for different roles. From frontend developers to founders - get pre-curated collections designed for your profession.',
  alternates: { canonical: '/curated-bundles' },
}

export default function CuratedBundlesPage() {
  return <CuratedBundlesClient />
}
