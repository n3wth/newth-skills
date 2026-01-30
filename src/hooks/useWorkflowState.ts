'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
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
import {
  executeWorkflow,
  exportWorkflow,
  importWorkflow,
  getRequiredInputs,
  type WorkflowExecutionState
} from '../lib/workflowExecutor'

export interface ConnectionPoint {
  nodeId: string
  outputId: string
}

export interface UseWorkflowStateOptions {
  initialWorkflow?: Workflow
  onSave?: (workflow: Workflow) => void
}

export interface UseWorkflowStateReturn {
  // State
  workflow: Workflow
  selectedNodeId: string | null
  connectingFrom: ConnectionPoint | null
  validationErrors: string[]
  isSaved: boolean
  executionState: WorkflowExecutionState | null
  showExecutionPanel: boolean
  showSaveModal: boolean
  showInputModal: boolean
  pendingInputs: ReturnType<typeof getRequiredInputs>

  // Refs
  canvasRef: React.RefObject<HTMLDivElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>

  // Node operations
  addNode: (skillId: string) => void
  removeNode: (nodeId: string) => void
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void

  // Connection operations
  startConnection: (nodeId: string, outputId: string) => void
  completeConnection: (targetNodeId: string, targetInputId: string) => void
  removeConnection: (connectionId: string) => void
  cancelConnection: () => void

  // Selection
  setSelectedNodeId: (id: string | null) => void

  // Save operations
  handleSave: () => void
  handleSaveWithName: (name: string, description: string, isPublic: boolean, tags: string[]) => void

  // Canvas operations
  clearCanvas: () => void

  // Execution operations
  handleRunWorkflow: () => void
  runWorkflowWithInputs: (initialInputs: Record<string, Record<string, string>>) => void

  // Import/Export
  handleExport: () => void
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void

  // Modal controls
  setShowSaveModal: (show: boolean) => void
  setShowExecutionPanel: (show: boolean) => void
  setShowInputModal: (show: boolean) => void
  setValidationErrors: (errors: string[]) => void
}

function createEmptyWorkflow(): Workflow {
  return {
    id: generateId(),
    name: '',
    description: '',
    nodes: [],
    connections: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    isPublic: false,
    tags: []
  }
}

export function useWorkflowState({
  initialWorkflow,
  onSave
}: UseWorkflowStateOptions = {}): UseWorkflowStateReturn {
  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow ?? createEmptyWorkflow()
  )

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<ConnectionPoint | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [executionState, setExecutionState] = useState<WorkflowExecutionState | null>(null)
  const [showExecutionPanel, setShowExecutionPanel] = useState(false)
  const [showInputModal, setShowInputModal] = useState(false)
  const [pendingInputs, setPendingInputs] = useState<ReturnType<typeof getRequiredInputs>>([])

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const cancelConnection = useCallback(() => {
    setConnectingFrom(null)
  }, [])

  const handleSave = useCallback(() => {
    if (!workflow.name.trim()) {
      setShowSaveModal(true)
      return
    }

    const validation = validateWorkflow(workflow)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    onSave?.(workflow)
    setIsSaved(true)
    setValidationErrors([])
  }, [workflow, onSave])

  const handleSaveWithName = useCallback((
    name: string,
    description: string,
    isPublic: boolean,
    tags: string[]
  ) => {
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

  const runWorkflowWithInputs = useCallback(async (
    initialInputs: Record<string, Record<string, string>>
  ) => {
    setShowInputModal(false)
    setShowExecutionPanel(true)
    setExecutionState(null)

    try {
      await executeWorkflow(workflow, (state) => {
        setExecutionState({ ...state })
      }, initialInputs)
    } catch (error) {
      setValidationErrors([error instanceof Error ? error.message : 'Execution failed'])
    }
  }, [workflow])

  const handleRunWorkflow = useCallback(() => {
    const validation = validateWorkflow(workflow)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    const requiredInputs = getRequiredInputs(workflow)
    if (requiredInputs.length > 0) {
      setPendingInputs(requiredInputs)
      setShowInputModal(true)
      return
    }

    runWorkflowWithInputs({})
  }, [workflow, runWorkflowWithInputs])

  const handleExport = useCallback(() => {
    const json = exportWorkflow(workflow)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflow.name || 'workflow'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [workflow])

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const json = event.target?.result as string
      const imported = importWorkflow(json)
      if (imported) {
        setWorkflow(imported)
        setIsSaved(false)
        setValidationErrors([])
      } else {
        setValidationErrors(['Invalid workflow file'])
        setTimeout(() => setValidationErrors([]), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null)
        setSelectedNodeId(null)
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (
          selectedNodeId &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          removeNode(selectedNodeId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, removeNode])

  return {
    // State
    workflow,
    selectedNodeId,
    connectingFrom,
    validationErrors,
    isSaved,
    executionState,
    showExecutionPanel,
    showSaveModal,
    showInputModal,
    pendingInputs,

    // Refs
    canvasRef,
    fileInputRef,

    // Node operations
    addNode,
    removeNode,
    updateNodePosition,

    // Connection operations
    startConnection,
    completeConnection,
    removeConnection,
    cancelConnection,

    // Selection
    setSelectedNodeId,

    // Save operations
    handleSave,
    handleSaveWithName,

    // Canvas operations
    clearCanvas,

    // Execution operations
    handleRunWorkflow,
    runWorkflowWithInputs,

    // Import/Export
    handleExport,
    handleImport,

    // Modal controls
    setShowSaveModal,
    setShowExecutionPanel,
    setShowInputModal,
    setValidationErrors
  }
}
