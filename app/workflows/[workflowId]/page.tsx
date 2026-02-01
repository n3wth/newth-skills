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
      title: 'Create AI Workflow - Visual Skill Builder',
      description: 'Build custom AI workflows by chaining skills together. Create automated sequences combining research, writing, and document creation.',
      alternates: { canonical: '/workflows/new' },
      openGraph: {
        title: 'Create AI Workflow | newth.ai',
        description: 'Build custom AI workflows by chaining skills together. Create automated sequences combining research, writing, and document creation.',
        url: 'https://skills.newth.ai/workflows/new',
        images: ['/og-image.png'],
      },
    }
  }

  // Check if it's a known template
  const template = workflowTemplates.find(w => w.id === workflowId)

  if (template) {
    const desc = template.description.length >= 120
      ? template.description
      : `${template.description} Chain multiple AI skills together in an automated workflow to boost your productivity.`
    // Keep title under 60 chars
    const titleSuffix = ' - AI Workflow'
    const maxNameLength = 60 - titleSuffix.length
    const truncatedName = template.name.length > maxNameLength
      ? template.name.slice(0, maxNameLength - 3) + '...'
      : template.name
    return {
      title: `${truncatedName}${titleSuffix}`,
      description: desc,
      alternates: { canonical: `/workflows/${workflowId}` },
      keywords: template.tags,
      openGraph: {
        title: `${template.name} - AI Workflow | newth.ai`,
        description: desc,
        url: `https://skills.newth.ai/workflows/${workflowId}`,
        images: ['/og-image.png'],
      },
    }
  }

  // For user-generated workflows (stored in localStorage), use generic metadata
  return {
    title: 'Edit AI Skill Workflow - Visual Builder',
    description: 'Edit and customize your AI workflow by chaining skills together. Connect research, writing, and document creation skills into powerful automated sequences.',
    alternates: { canonical: `/workflows/${workflowId}` },
    openGraph: {
      title: 'Edit AI Skill Workflow - Visual Builder | newth.ai',
      description: 'Edit and customize your AI workflow by chaining skills together. Connect research, writing, and document creation skills into powerful automated sequences.',
      url: `https://skills.newth.ai/workflows/${workflowId}`,
      images: ['/og-image.png'],
    },
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
