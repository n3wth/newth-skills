import type { Metadata } from 'next'
import { WorkflowBuilderClient } from './WorkflowBuilderClient'
import { workflowTemplates } from '@/src/data/workflows'

export function generateStaticParams() {
  const templateParams = workflowTemplates.map((workflow) => ({
    workflowId: [workflow.id],
  }))

  return [
    { workflowId: [] },
    { workflowId: ['new'] },
    ...templateParams,
  ]
}

export const metadata: Metadata = {
  title: 'Workflow Builder',
  description: 'Build custom workflows by chaining skills together. Create automated sequences of AI skills for complex tasks.',
  alternates: {
    canonical: '/workflow-builder',
  },
}

interface WorkflowBuilderPageProps {
  params: Promise<{ workflowId?: string[] }>
}

export default async function WorkflowBuilderPage({ params }: WorkflowBuilderPageProps) {
  const { workflowId } = await params
  const workflowIdParam = workflowId?.[0]

  return <WorkflowBuilderClient workflowId={workflowIdParam} />
}
