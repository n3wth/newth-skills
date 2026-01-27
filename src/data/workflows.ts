// Input/Output type definitions for skill composition
export type IOType = 
  | 'text'
  | 'code'
  | 'document'
  | 'data'
  | 'image'
  | 'presentation'
  | 'analysis'
  | 'any'

export interface SkillIO {
  id: string
  name: string
  type: IOType
  description: string
  required?: boolean
}

export interface SkillIOSchema {
  skillId: string
  inputs: SkillIO[]
  outputs: SkillIO[]
}

// Workflow node represents a skill in the workflow chain
export interface WorkflowNode {
  id: string
  skillId: string
  position: { x: number; y: number }
}

// Connection between workflow nodes
export interface WorkflowConnection {
  id: string
  sourceNodeId: string
  sourceOutputId: string
  targetNodeId: string
  targetInputId: string
}

// Complete workflow definition
export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: string
  updatedAt: string
  author?: string
  isPublic: boolean
  tags: string[]
}

// Skill I/O schemas for all skills
export const skillIOSchemas: SkillIOSchema[] = [
  {
    skillId: 'gsap-animations',
    inputs: [
      { id: 'target', name: 'Target Element', type: 'text', description: 'CSS selector or element description', required: true },
      { id: 'animation-type', name: 'Animation Type', type: 'text', description: 'Type of animation (scroll, entrance, hover, etc.)' },
      { id: 'design-specs', name: 'Design Specs', type: 'document', description: 'Design specifications or mockups' }
    ],
    outputs: [
      { id: 'animation-code', name: 'Animation Code', type: 'code', description: 'GSAP animation code' },
      { id: 'implementation-guide', name: 'Implementation Guide', type: 'text', description: 'Instructions for implementing the animation' }
    ]
  },
  {
    skillId: 'mcp-builder',
    inputs: [
      { id: 'api-spec', name: 'API Specification', type: 'document', description: 'API documentation or specification', required: true },
      { id: 'use-case', name: 'Use Case', type: 'text', description: 'Description of the intended use case' }
    ],
    outputs: [
      { id: 'mcp-server', name: 'MCP Server Code', type: 'code', description: 'Complete MCP server implementation' },
      { id: 'tool-schemas', name: 'Tool Schemas', type: 'data', description: 'JSON schemas for MCP tools' }
    ]
  },
  {
    skillId: 'skill-creator',
    inputs: [
      { id: 'domain', name: 'Domain', type: 'text', description: 'The domain or area of expertise', required: true },
      { id: 'requirements', name: 'Requirements', type: 'text', description: 'Specific requirements for the skill' }
    ],
    outputs: [
      { id: 'skill-definition', name: 'Skill Definition', type: 'document', description: 'Complete skill definition file' },
      { id: 'trigger-words', name: 'Trigger Words', type: 'text', description: 'Suggested trigger words for the skill' }
    ]
  },
  {
    skillId: 'algorithmic-art',
    inputs: [
      { id: 'concept', name: 'Concept', type: 'text', description: 'Art concept or theme', required: true },
      { id: 'parameters', name: 'Parameters', type: 'data', description: 'Generation parameters (colors, seed, etc.)' }
    ],
    outputs: [
      { id: 'p5-code', name: 'p5.js Code', type: 'code', description: 'Complete p5.js sketch' },
      { id: 'preview', name: 'Preview Description', type: 'text', description: 'Description of the generated artwork' }
    ]
  },
  {
    skillId: 'business-panel',
    inputs: [
      { id: 'question', name: 'Business Question', type: 'text', description: 'Strategic question to analyze', required: true },
      { id: 'context', name: 'Business Context', type: 'document', description: 'Background information about the business' },
      { id: 'mode', name: 'Analysis Mode', type: 'text', description: 'sequential, debate, or socratic' }
    ],
    outputs: [
      { id: 'analysis', name: 'Expert Analysis', type: 'analysis', description: 'Multi-perspective strategic analysis' },
      { id: 'recommendations', name: 'Recommendations', type: 'text', description: 'Actionable recommendations' }
    ]
  },
  {
    skillId: 'frontend-design',
    inputs: [
      { id: 'requirements', name: 'UI Requirements', type: 'text', description: 'Description of the UI to create', required: true },
      { id: 'design-system', name: 'Design System', type: 'document', description: 'Existing design system or brand guidelines' }
    ],
    outputs: [
      { id: 'component-code', name: 'Component Code', type: 'code', description: 'React component implementation' },
      { id: 'styles', name: 'Styles', type: 'code', description: 'CSS/Tailwind styles' }
    ]
  },
  {
    skillId: 'pdf',
    inputs: [
      { id: 'pdf-file', name: 'PDF File', type: 'document', description: 'PDF document to process', required: true },
      { id: 'operation', name: 'Operation', type: 'text', description: 'Extract, merge, split, or create' }
    ],
    outputs: [
      { id: 'extracted-data', name: 'Extracted Data', type: 'data', description: 'Extracted text, tables, or form data' },
      { id: 'processed-pdf', name: 'Processed PDF', type: 'document', description: 'Modified or created PDF' }
    ]
  },
  {
    skillId: 'docx',
    inputs: [
      { id: 'document', name: 'Word Document', type: 'document', description: 'Word document to process' },
      { id: 'content', name: 'Content', type: 'text', description: 'Content to add or modify' },
      { id: 'template', name: 'Template', type: 'document', description: 'Document template to use' }
    ],
    outputs: [
      { id: 'output-document', name: 'Output Document', type: 'document', description: 'Created or modified Word document' },
      { id: 'extracted-text', name: 'Extracted Text', type: 'text', description: 'Text content from the document' }
    ]
  },
  {
    skillId: 'pptx',
    inputs: [
      { id: 'content', name: 'Presentation Content', type: 'text', description: 'Content for the presentation', required: true },
      { id: 'template', name: 'Template', type: 'document', description: 'Presentation template' }
    ],
    outputs: [
      { id: 'presentation', name: 'Presentation', type: 'presentation', description: 'PowerPoint presentation' },
      { id: 'speaker-notes', name: 'Speaker Notes', type: 'text', description: 'Generated speaker notes' }
    ]
  },
  {
    skillId: 'research-assistant',
    inputs: [
      { id: 'topic', name: 'Research Topic', type: 'text', description: 'Topic to research', required: true },
      { id: 'depth', name: 'Research Depth', type: 'text', description: 'Surface, moderate, or deep' }
    ],
    outputs: [
      { id: 'findings', name: 'Research Findings', type: 'analysis', description: 'Compiled research findings' },
      { id: 'sources', name: 'Sources', type: 'data', description: 'List of sources and references' }
    ]
  },
  {
    skillId: 'doc-coauthoring',
    inputs: [
      { id: 'draft', name: 'Document Draft', type: 'document', description: 'Initial draft or outline' },
      { id: 'style', name: 'Writing Style', type: 'text', description: 'Desired writing style' },
      { id: 'feedback', name: 'Feedback', type: 'text', description: 'Feedback to incorporate' }
    ],
    outputs: [
      { id: 'revised-document', name: 'Revised Document', type: 'document', description: 'Improved document' },
      { id: 'suggestions', name: 'Suggestions', type: 'text', description: 'Writing suggestions and improvements' }
    ]
  }
]

// Sample workflow templates
export const workflowTemplates: Workflow[] = [
  {
    id: 'research-report',
    name: 'Research Report Generator',
    description: 'Automatically research a topic and generate a comprehensive report document',
    nodes: [
      { id: 'node-1', skillId: 'research-assistant', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'doc-coauthoring', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'docx', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'findings', targetNodeId: 'node-2', targetInputId: 'draft' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'revised-document', targetNodeId: 'node-3', targetInputId: 'content' }
    ],
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    author: 'newth-skills',
    isPublic: true,
    tags: ['research', 'documents', 'automation']
  },
  {
    id: 'business-presentation',
    name: 'Business Strategy Presentation',
    description: 'Analyze a business question and create a professional presentation with the findings',
    nodes: [
      { id: 'node-1', skillId: 'business-panel', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'pptx', position: { x: 400, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'analysis', targetNodeId: 'node-2', targetInputId: 'content' }
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
    author: 'newth-skills',
    isPublic: true,
    tags: ['business', 'presentations', 'strategy']
  },
  {
    id: 'animated-landing',
    name: 'Animated Landing Page',
    description: 'Design a landing page with beautiful GSAP animations',
    nodes: [
      { id: 'node-1', skillId: 'frontend-design', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'gsap-animations', position: { x: 400, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'component-code', targetNodeId: 'node-2', targetInputId: 'target' }
    ],
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
    author: 'newth-skills',
    isPublic: true,
    tags: ['development', 'animation', 'ui']
  },
  {
    id: 'generative-art-skill',
    name: 'Custom Art Skill Creator',
    description: 'Create a new skill for generating algorithmic art in a specific style',
    nodes: [
      { id: 'node-1', skillId: 'algorithmic-art', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'skill-creator', position: { x: 400, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'p5-code', targetNodeId: 'node-2', targetInputId: 'requirements' }
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    author: 'newth-skills',
    isPublic: true,
    tags: ['creative', 'skills', 'art']
  }
]

// Helper function to get I/O schema for a skill
export function getSkillIOSchema(skillId: string): SkillIOSchema | undefined {
  return skillIOSchemas.find(schema => schema.skillId === skillId)
}

// Helper function to check if two I/O types are compatible
export function areTypesCompatible(outputType: IOType, inputType: IOType): boolean {
  if (outputType === 'any' || inputType === 'any') return true
  if (outputType === inputType) return true
  
  // Define compatible type mappings
  const compatibilityMap: Record<IOType, IOType[]> = {
    text: ['text', 'document', 'any'],
    code: ['code', 'text', 'any'],
    document: ['document', 'text', 'any'],
    data: ['data', 'text', 'any'],
    image: ['image', 'any'],
    presentation: ['presentation', 'document', 'any'],
    analysis: ['analysis', 'text', 'document', 'any'],
    any: ['text', 'code', 'document', 'data', 'image', 'presentation', 'analysis', 'any']
  }
  
  return compatibilityMap[outputType]?.includes(inputType) ?? false
}

// Helper function to validate a workflow
export function validateWorkflow(workflow: Workflow): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!workflow.name.trim()) {
    errors.push('Workflow name is required')
  }
  
  if (workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one skill')
  }
  
  // Check for valid connections
  for (const connection of workflow.connections) {
    const sourceNode = workflow.nodes.find(n => n.id === connection.sourceNodeId)
    const targetNode = workflow.nodes.find(n => n.id === connection.targetNodeId)
    
    if (!sourceNode) {
      errors.push(`Connection references non-existent source node: ${connection.sourceNodeId}`)
    }
    if (!targetNode) {
      errors.push(`Connection references non-existent target node: ${connection.targetNodeId}`)
    }
    
    if (sourceNode && targetNode) {
      const sourceSchema = getSkillIOSchema(sourceNode.skillId)
      const targetSchema = getSkillIOSchema(targetNode.skillId)
      
      if (sourceSchema && targetSchema) {
        const sourceOutput = sourceSchema.outputs.find(o => o.id === connection.sourceOutputId)
        const targetInput = targetSchema.inputs.find(i => i.id === connection.targetInputId)
        
        if (!sourceOutput) {
          errors.push(`Invalid output "${connection.sourceOutputId}" for skill "${sourceNode.skillId}"`)
        }
        if (!targetInput) {
          errors.push(`Invalid input "${connection.targetInputId}" for skill "${targetNode.skillId}"`)
        }
        
        if (sourceOutput && targetInput && !areTypesCompatible(sourceOutput.type, targetInput.type)) {
          errors.push(`Incompatible types: ${sourceOutput.type} cannot connect to ${targetInput.type}`)
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors }
}

// Generate a unique ID for workflow elements
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
