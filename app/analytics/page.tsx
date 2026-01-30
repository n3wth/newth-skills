import type { Metadata } from 'next'
import { AnalyticsClient } from './AnalyticsClient'

export const metadata: Metadata = {
  title: 'Community Analytics',
  description: 'See which skills are popular across the community. Track skill views and installs to discover trending AI coding skills.',
  alternates: { canonical: '/analytics' },
}

export default function AnalyticsPage() {
  return <AnalyticsClient />
}
