import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SEO } from '../components'
import { WorkflowBuilder as WorkflowBuilderComponent } from '../components/WorkflowBuilder'
import { workflowTemplates, type Workflow } from '../data/workflows'

const STORAGE_KEY = 'newth-skills-workflows'

function getStoredWorkflows(): Workflow[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveWorkflow(workflow: Workflow): void {
  const workflows = getStoredWorkflows()
  const existingIndex = workflows.findIndex(w => w.id === workflow.id)
  
  if (existingIndex >= 0) {
    workflows[existingIndex] = workflow
  } else {
    workflows.push(workflow)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows))
}

function getInitialWorkflow(workflowId: string | undefined): Workflow | undefined {
  if (!workflowId || workflowId === 'new') {
    return undefined
  }
  
  const template = workflowTemplates.find(w => w.id === workflowId)
  if (template) {
    return {
      ...template,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      author: undefined,
      isPublic: false
    }
  }
  
  return getStoredWorkflows().find(w => w.id === workflowId)
}

export function WorkflowBuilderPage() {
  const { workflowId } = useParams<{ workflowId: string }>()
  
  const initialWorkflow = useMemo(() => getInitialWorkflow(workflowId), [workflowId])

  const handleSave = useCallback((workflow: Workflow) => {
    saveWorkflow(workflow)
  }, [])

  return (
    <>
      <SEO
        title={initialWorkflow ? `Edit ${initialWorkflow.name}` : 'Create Workflow'}
        description="Build custom workflows by chaining skills together"
      />

      <div className="h-screen relative overflow-hidden">
        <div className="mesh-gradient" />
        <div className="noise-overlay" />

        <main className="h-full">
          <WorkflowBuilderComponent
            key={initialWorkflow?.id ?? 'new'}
            initialWorkflow={initialWorkflow}
            onSave={handleSave}
          />
        </main>
      </div>
    </>
  )
}
