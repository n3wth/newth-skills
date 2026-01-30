import type { Metadata } from 'next'
import { WorkflowsClient } from './WorkflowsClient'

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Create and share skill workflows that chain multiple AI capabilities together',
  alternates: { canonical: '/workflows' },
}

export default function WorkflowsPage() {
  return <WorkflowsClient />
}
