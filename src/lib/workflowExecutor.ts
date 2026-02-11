import { type Workflow, type WorkflowNode, type WorkflowConnection, getSkillIOSchema } from '../data/workflows'
import { skills as allSkills } from '../data/skills'
import { executeAI, FreeLimitReachedError } from './aiProvider'
import { incrementUsage, getApiKey, hasReachedLimit } from './usageTracker'

export type NodeExecutionState = 'pending' | 'running' | 'completed' | 'error'

export interface NodeExecutionResult {
  nodeId: string
  skillId: string
  skillName: string
  state: NodeExecutionState
  inputs: Record<string, string>
  outputs: Record<string, string>
  prompt: string
  error?: string
}

export interface WorkflowExecutionState {
  workflowId: string
  workflowName: string
  isRunning: boolean
  isComplete: boolean
  currentNodeId: string | null
  nodeStates: Record<string, NodeExecutionState>
  results: NodeExecutionResult[]
  compiledPrompt: string
  error?: string
}

// Topologically sort nodes based on connections
function topologicalSort(nodes: WorkflowNode[], connections: WorkflowConnection[]): WorkflowNode[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0)
    adjacency.set(node.id, [])
  }

  // Build graph
  for (const conn of connections) {
    const current = inDegree.get(conn.targetNodeId) ?? 0
    inDegree.set(conn.targetNodeId, current + 1)
    adjacency.get(conn.sourceNodeId)?.push(conn.targetNodeId)
  }

  // Find nodes with no dependencies
  const queue: string[] = []
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId)
    }
  }

  // Process queue
  const sorted: WorkflowNode[] = []
  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = nodeMap.get(nodeId)
    if (node) {
      sorted.push(node)
    }

    for (const targetId of adjacency.get(nodeId) ?? []) {
      const newDegree = (inDegree.get(targetId) ?? 1) - 1
      inDegree.set(targetId, newDegree)
      if (newDegree === 0) {
        queue.push(targetId)
      }
    }
  }

  return sorted
}

// Get skill info from skills list
function getSkillInfo(skillId: string) {
  return allSkills.find(s => s.id === skillId)
}

// Build prompt for a single skill node
function buildNodePrompt(
  node: WorkflowNode,
  inputs: Record<string, string>
): string {
  const skill = getSkillInfo(node.skillId)
  const schema = getSkillIOSchema(node.skillId)

  if (!skill || !schema) {
    return `[Unknown skill: ${node.skillId}]`
  }

  const lines: string[] = [
    `## ${skill.name}`,
    '',
    skill.description,
    ''
  ]

  // Add inputs section
  if (schema.inputs.length > 0) {
    lines.push('### Inputs')
    for (const input of schema.inputs) {
      const value = inputs[input.id]
      if (value) {
        lines.push(`- **${input.name}**: ${value}`)
      } else if (input.required) {
        lines.push(`- **${input.name}**: [Required - not connected]`)
      } else {
        lines.push(`- **${input.name}**: [Optional - not provided]`)
      }
    }
    lines.push('')
  }

  // Add expected outputs section
  if (schema.outputs.length > 0) {
    lines.push('### Expected Outputs')
    for (const output of schema.outputs) {
      lines.push(`- **${output.name}** (${output.type}): ${output.description}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// Generate placeholder output values for simulation
function generateSimulatedOutputs(skillId: string): Record<string, string> {
  const schema = getSkillIOSchema(skillId)
  if (!schema) return {}

  const outputs: Record<string, string> = {}
  for (const output of schema.outputs) {
    outputs[output.id] = `[${output.name} from ${skillId}]`
  }
  return outputs
}

// Get entry nodes (nodes with no incoming connections)
export function getEntryNodes(workflow: Workflow): WorkflowNode[] {
  const nodesWithIncoming = new Set(workflow.connections.map(c => c.targetNodeId))
  return workflow.nodes.filter(n => !nodesWithIncoming.has(n.id))
}

// Get required inputs for entry nodes
export function getRequiredInputs(workflow: Workflow): Array<{
  nodeId: string
  nodeName: string
  inputId: string
  inputName: string
  inputType: string
  description: string
}> {
  const entryNodes = getEntryNodes(workflow)
  const requiredInputs: Array<{
    nodeId: string
    nodeName: string
    inputId: string
    inputName: string
    inputType: string
    description: string
  }> = []

  for (const node of entryNodes) {
    const schema = getSkillIOSchema(node.skillId)
    const skill = allSkills.find(s => s.id === node.skillId)
    if (!schema) continue

    for (const input of schema.inputs) {
      if (input.required) {
        requiredInputs.push({
          nodeId: node.id,
          nodeName: skill?.name || node.skillId,
          inputId: input.id,
          inputName: input.name,
          inputType: input.type,
          description: input.description
        })
      }
    }
  }

  return requiredInputs
}

export type ExecutionMode = 'simulate' | 'ai'

// Main execution function
export async function executeWorkflow(
  workflow: Workflow,
  onProgress?: (state: WorkflowExecutionState) => void,
  initialInputs?: Record<string, Record<string, string>>, // nodeId -> inputId -> value
  mode: ExecutionMode = 'simulate'
): Promise<WorkflowExecutionState> {
  const state: WorkflowExecutionState = {
    workflowId: workflow.id,
    workflowName: workflow.name,
    isRunning: true,
    isComplete: false,
    currentNodeId: null,
    nodeStates: {},
    results: [],
    compiledPrompt: ''
  }

  // Initialize all nodes as pending
  for (const node of workflow.nodes) {
    state.nodeStates[node.id] = 'pending'
  }

  onProgress?.(state)

  // Sort nodes topologically
  const sortedNodes = topologicalSort(workflow.nodes, workflow.connections)

  // Track outputs from each node for passing to downstream nodes
  const nodeOutputs = new Map<string, Record<string, string>>()

  // Build compiled prompt header
  const promptLines: string[] = [
    `# Workflow: ${workflow.name || 'Untitled'}`,
    '',
    workflow.description || 'No description provided.',
    '',
    '---',
    ''
  ]

  // Execute nodes in order
  for (const node of sortedNodes) {
    const skill = getSkillInfo(node.skillId)

    // Set current node as running
    state.currentNodeId = node.id
    state.nodeStates[node.id] = 'running'
    onProgress?.({ ...state })

    // Simulate execution delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500))

    // Gather inputs from connected nodes or initial inputs
    const inputs: Record<string, string> = {}
    const incomingConnections = workflow.connections.filter(c => c.targetNodeId === node.id)

    // First, apply any initial inputs for this node
    if (initialInputs?.[node.id]) {
      Object.assign(inputs, initialInputs[node.id])
    }

    // Then, apply inputs from connected nodes (these override initial inputs if both exist)
    for (const conn of incomingConnections) {
      const sourceOutputs = nodeOutputs.get(conn.sourceNodeId)
      if (sourceOutputs && sourceOutputs[conn.sourceOutputId]) {
        inputs[conn.targetInputId] = sourceOutputs[conn.sourceOutputId]
      }
    }

    // Build prompt for this node
    const nodePrompt = buildNodePrompt(node, inputs)
    promptLines.push(nodePrompt)

    let outputs: Record<string, string>

    if (mode === 'ai') {
      // Real AI execution
      try {
        const apiKey = getApiKey() || undefined
        const aiResult = await executeAI(nodePrompt, { apiKey })

        // Parse AI response into outputs
        const schema = getSkillIOSchema(node.skillId)
        outputs = {}
        if (schema) {
          // Distribute the AI result text across outputs
          const resultText = aiResult.result
          if (schema.outputs.length === 1) {
            outputs[schema.outputs[0].id] = resultText
          } else {
            // Try to split by output names, fallback to full text for each
            for (const output of schema.outputs) {
              const regex = new RegExp(`(?:^|\\n)##?\\s*${output.name}[:\\s]*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i')
              const match = resultText.match(regex)
              outputs[output.id] = match ? match[1].trim() : resultText
            }
          }
        }

        if (!getApiKey()) {
          incrementUsage()
        }
      } catch (err) {
        if (err instanceof FreeLimitReachedError) {
          throw err
        }
        // On AI failure, fall back to simulated outputs
        outputs = generateSimulatedOutputs(node.skillId)
      }
    } else {
      // Simulated execution
      outputs = generateSimulatedOutputs(node.skillId)
    }

    nodeOutputs.set(node.id, outputs)

    // Record result
    const result: NodeExecutionResult = {
      nodeId: node.id,
      skillId: node.skillId,
      skillName: skill?.name ?? node.skillId,
      state: 'completed',
      inputs,
      outputs,
      prompt: nodePrompt
    }

    state.results.push(result)
    state.nodeStates[node.id] = 'completed'
    onProgress?.({ ...state })
  }

  // Finalize
  state.isRunning = false
  state.isComplete = true
  state.currentNodeId = null
  state.compiledPrompt = promptLines.join('\n')

  onProgress?.(state)

  return state
}

// Compile a workflow into a prompt without executing
export function compileWorkflowPrompt(
  workflow: Workflow,
  initialInputs?: Record<string, Record<string, string>>
): string {
  const sortedNodes = topologicalSort(workflow.nodes, workflow.connections)
  const nodeOutputs = new Map<string, Record<string, string>>()

  const lines: string[] = [
    `# Workflow: ${workflow.name || 'Untitled'}`,
    '',
    workflow.description || 'No description provided.',
    '',
    '---',
    ''
  ]

  for (const node of sortedNodes) {
    const inputs: Record<string, string> = {}
    const incomingConnections = workflow.connections.filter(c => c.targetNodeId === node.id)

    if (initialInputs?.[node.id]) {
      Object.assign(inputs, initialInputs[node.id])
    }

    for (const conn of incomingConnections) {
      const sourceOutputs = nodeOutputs.get(conn.sourceNodeId)
      if (sourceOutputs && sourceOutputs[conn.sourceOutputId]) {
        inputs[conn.targetInputId] = sourceOutputs[conn.sourceOutputId]
      }
    }

    const nodePrompt = buildNodePrompt(node, inputs)
    lines.push(nodePrompt)

    const outputs = generateSimulatedOutputs(node.skillId)
    nodeOutputs.set(node.id, outputs)
  }

  return lines.join('\n')
}

// Check if user can run AI (has key or has free runs remaining)
export function canRunAI(): { canRun: boolean; reason?: string } {
  if (getApiKey()) return { canRun: true }
  if (!hasReachedLimit()) return { canRun: true }
  return {
    canRun: false,
    reason: 'Free run limit reached. Add your Gemini API key to continue.'
  }
}

// Export workflow as JSON
export function exportWorkflow(workflow: Workflow): string {
  return JSON.stringify(workflow, null, 2)
}

// Import workflow from JSON
export function importWorkflow(json: string): Workflow | null {
  try {
    const workflow = JSON.parse(json) as Workflow

    // Validate required fields
    if (!workflow.id || !workflow.nodes || !workflow.connections) {
      return null
    }

    // Generate new ID to avoid conflicts
    return {
      ...workflow,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: workflow.name ? `${workflow.name} (Imported)` : 'Imported Workflow',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
  } catch {
    return null
  }
}

// Generate shareable URL (for small workflows)
export function generateShareableUrl(workflow: Workflow): string | null {
  const json = JSON.stringify(workflow)

  // Limit to ~2KB for URL safety
  if (json.length > 2000) {
    return null
  }

  const encoded = btoa(encodeURIComponent(json))
  return `${window.location.origin}/workflows/new?data=${encoded}`
}

// Parse workflow from URL
export function parseWorkflowFromUrl(): Workflow | null {
  const params = new URLSearchParams(window.location.search)
  const data = params.get('data')

  if (!data) return null

  try {
    const json = decodeURIComponent(atob(data))
    return importWorkflow(json)
  } catch {
    return null
  }
}
