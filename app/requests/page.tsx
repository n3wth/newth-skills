import type { Metadata } from 'next'
import { RequestsClient } from './RequestsClient'

export const metadata: Metadata = {
  title: 'Feature Requests',
  description: 'Submit and vote on new skill ideas. Help shape the future of AI coding skills.',
  alternates: { canonical: '/requests' },
}

export default function RequestsPage() {
  return <RequestsClient />
}
