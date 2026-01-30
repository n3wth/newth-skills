import type { Metadata } from 'next'
import { workflowTemplates } from '@/src/data/workflows'
import { WorkflowBuilderClient } from './WorkflowBuilderClient'

type Props = {
  params: Promise<{ workflowId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { workflowId } = await params

  // Handle 'new' workflow
  if (workflowId === 'new') {
    return {
      title: 'Create Workflow',
      description: 'Build custom workflows by chaining skills together',
      alternates: { canonical: '/workflows/new' },
    }
  }

  // Check if it's a known template
  const template = workflowTemplates.find(w => w.id === workflowId)

  if (template) {
    return {
      title: `${template.name} - Workflow`,
      description: template.description,
      alternates: { canonical: `/workflows/${workflowId}` },
      keywords: template.tags,
    }
  }

  // For user-generated workflows (stored in localStorage), use generic metadata
  return {
    title: 'Edit Workflow',
    description: 'Build custom workflows by chaining skills together',
    alternates: { canonical: `/workflows/${workflowId}` },
  }
}

export async function generateStaticParams() {
  // Pre-render the 'new' page and all template workflows
  return [
    { workflowId: 'new' },
    ...workflowTemplates.map((workflow) => ({ workflowId: workflow.id })),
  ]
}

export default async function WorkflowBuilderPage({ params }: Props) {
  const { workflowId } = await params
  return <WorkflowBuilderClient workflowId={workflowId} />
}
