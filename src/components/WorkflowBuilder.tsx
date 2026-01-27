import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { skills } from '../data/skills'
import { 
  type Workflow, 
  type WorkflowNode, 
  type WorkflowConnection,
  getSkillIOSchema,
  areTypesCompatible,
  generateId,
  validateWorkflow
} from '../data/workflows'
import { WorkflowCanvas } from './WorkflowCanvas'
import { WorkflowSidebar } from './WorkflowSidebar'

interface WorkflowBuilderProps {
  initialWorkflow?: Workflow
  onSave?: (workflow: Workflow) => void
}

export function WorkflowBuilder({ initialWorkflow, onSave }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow ?? {
    id: generateId(),
    name: '',
    description: '',
    nodes: [],
    connections: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    isPublic: false,
    tags: []
  })
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; outputId: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = useCallback((skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    if (!skill) return
    
    const newNode: WorkflowNode = {
      id: generateId(),
      skillId,
      position: {
        x: 100 + (workflow.nodes.length * 50) % 400,
        y: 150 + (workflow.nodes.length * 30) % 200
      }
    }
    
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date().toISOString().split('T')[0]
    }))
    setIsSaved(false)
  }, [workflow.nodes.length])

  const removeNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(
        c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
      ),
      updatedAt: new Date().toISOString().split('T')[0]
    }))
    setSelectedNodeId(null)
    setIsSaved(false)
  }, [])

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId ? { ...n, position } : n
      ),
      updatedAt: new Date().toISOString().split('T')[0]
    }))
  }, [])

  const startConnection = useCallback((nodeId: string, outputId: string) => {
    setConnectingFrom({ nodeId, outputId })
  }, [])

  const completeConnection = useCallback((targetNodeId: string, targetInputId: string) => {
    if (!connectingFrom) return
    if (connectingFrom.nodeId === targetNodeId) {
      setConnectingFrom(null)
      return
    }
    
    const sourceNode = workflow.nodes.find(n => n.id === connectingFrom.nodeId)
    const targetNode = workflow.nodes.find(n => n.id === targetNodeId)
    
    if (!sourceNode || !targetNode) {
      setConnectingFrom(null)
      return
    }
    
    const sourceSchema = getSkillIOSchema(sourceNode.skillId)
    const targetSchema = getSkillIOSchema(targetNode.skillId)
    
    if (!sourceSchema || !targetSchema) {
      setConnectingFrom(null)
      return
    }
    
    const sourceOutput = sourceSchema.outputs.find(o => o.id === connectingFrom.outputId)
    const targetInput = targetSchema.inputs.find(i => i.id === targetInputId)
    
    if (!sourceOutput || !targetInput) {
      setConnectingFrom(null)
      return
    }
    
    if (!areTypesCompatible(sourceOutput.type, targetInput.type)) {
      setValidationErrors([`Cannot connect ${sourceOutput.type} to ${targetInput.type}`])
      setTimeout(() => setValidationErrors([]), 3000)
      setConnectingFrom(null)
      return
    }
    
    const existingConnection = workflow.connections.find(
      c => c.targetNodeId === targetNodeId && c.targetInputId === targetInputId
    )
    
    if (existingConnection) {
      setWorkflow(prev => ({
        ...prev,
        connections: prev.connections.filter(c => c.id !== existingConnection.id)
      }))
    }
    
    const newConnection: WorkflowConnection = {
      id: generateId(),
      sourceNodeId: connectingFrom.nodeId,
      sourceOutputId: connectingFrom.outputId,
      targetNodeId,
      targetInputId
    }
    
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection],
      updatedAt: new Date().toISOString().split('T')[0]
    }))
    
    setConnectingFrom(null)
    setIsSaved(false)
  }, [connectingFrom, workflow.nodes, workflow.connections])

  const removeConnection = useCallback((connectionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== connectionId),
      updatedAt: new Date().toISOString().split('T')[0]
    }))
    setIsSaved(false)
  }, [])

  const handleSave = useCallback(() => {
    const validation = validateWorkflow(workflow)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }
    
    if (!workflow.name.trim()) {
      setShowSaveModal(true)
      return
    }
    
    onSave?.(workflow)
    setIsSaved(true)
    setValidationErrors([])
  }, [workflow, onSave])

  const handleSaveWithName = useCallback((name: string, description: string, isPublic: boolean, tags: string[]) => {
    const updatedWorkflow = {
      ...workflow,
      name,
      description,
      isPublic,
      tags,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    const validation = validateWorkflow(updatedWorkflow)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }
    
    setWorkflow(updatedWorkflow)
    onSave?.(updatedWorkflow)
    setIsSaved(true)
    setShowSaveModal(false)
    setValidationErrors([])
  }, [workflow, onSave])

  const clearCanvas = useCallback(() => {
    setWorkflow(prev => ({
      ...prev,
      nodes: [],
      connections: [],
      updatedAt: new Date().toISOString().split('T')[0]
    }))
    setSelectedNodeId(null)
    setConnectingFrom(null)
    setIsSaved(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null)
        setSelectedNodeId(null)
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && document.activeElement?.tagName !== 'INPUT') {
          removeNode(selectedNodeId)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, removeNode])

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      <WorkflowSidebar 
        onAddSkill={addNode}
        workflow={workflow}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-4">
            <Link 
              to="/workflows" 
              className="text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-white)]">
                {workflow.name || 'Untitled Workflow'}
              </h2>
              <p className="text-sm text-[var(--color-grey-400)]">
                {workflow.nodes.length} skill{workflow.nodes.length !== 1 ? 's' : ''} | {workflow.connections.length} connection{workflow.connections.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {validationErrors.length > 0 && (
              <div className="text-sm text-[var(--color-coral)] max-w-md truncate">
                {validationErrors[0]}
              </div>
            )}
            
            {isSaved && (
              <span className="text-sm text-[var(--color-sage)]">Saved</span>
            )}
            
            <button
              onClick={clearCanvas}
              className="px-4 py-2 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
            >
              Clear
            </button>
            
            <button
              onClick={handleSave}
              disabled={workflow.nodes.length === 0}
              className="px-4 py-2 text-sm bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Workflow
            </button>
          </div>
        </div>
        
        <WorkflowCanvas
          ref={canvasRef}
          nodes={workflow.nodes}
          connections={workflow.connections}
          selectedNodeId={selectedNodeId}
          connectingFrom={connectingFrom}
          onSelectNode={setSelectedNodeId}
          onUpdateNodePosition={updateNodePosition}
          onStartConnection={startConnection}
          onCompleteConnection={completeConnection}
          onRemoveNode={removeNode}
          onRemoveConnection={removeConnection}
          onCancelConnection={() => setConnectingFrom(null)}
        />
      </div>
      
      {showSaveModal && (
        <SaveWorkflowModal
          workflow={workflow}
          onSave={handleSaveWithName}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  )
}

interface SaveWorkflowModalProps {
  workflow: Workflow
  onSave: (name: string, description: string, isPublic: boolean, tags: string[]) => void
  onClose: () => void
}

function SaveWorkflowModal({ workflow, onSave, onClose }: SaveWorkflowModalProps) {
  const [name, setName] = useState(workflow.name)
  const [description, setDescription] = useState(workflow.description)
  const [isPublic, setIsPublic] = useState(workflow.isPublic)
  const [tagsInput, setTagsInput] = useState(workflow.tags.join(', '))
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    onSave(name, description, isPublic, tags)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-[var(--color-white)] mb-4">Save Workflow</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-grey-400)] mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Workflow"
              required
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
            />
          </div>
          
          <div>
            <label className="block text-sm text-[var(--color-grey-400)] mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              rows={3}
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)] resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-[var(--color-grey-400)] mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="automation, research, documents"
              className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--glass-bg)]"
            />
            <label htmlFor="isPublic" className="text-sm text-[var(--color-grey-300)]">
              Make this workflow public
            </label>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] border border-[var(--glass-border)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 text-sm bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
