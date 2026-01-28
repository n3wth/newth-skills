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
      { id: 'target', name: 'Target', type: 'text', description: 'CSS selector or element description', required: true },
      { id: 'animation-type', name: 'Type', type: 'text', description: 'Type of animation (scroll, entrance, hover, etc.)' },
      { id: 'design-specs', name: 'Specs', type: 'document', description: 'Design specifications or mockups' }
    ],
    outputs: [
      { id: 'animation-code', name: 'Code', type: 'code', description: 'GSAP animation code' },
      { id: 'implementation-guide', name: 'Guide', type: 'text', description: 'Instructions for implementing the animation' }
    ]
  },
  {
    skillId: 'mcp-builder',
    inputs: [
      { id: 'api-spec', name: 'API Spec', type: 'document', description: 'API documentation or specification', required: true },
      { id: 'use-case', name: 'Use Case', type: 'text', description: 'Description of the intended use case' }
    ],
    outputs: [
      { id: 'mcp-server', name: 'Server', type: 'code', description: 'Complete MCP server implementation' },
      { id: 'tool-schemas', name: 'Schemas', type: 'data', description: 'JSON schemas for MCP tools' }
    ]
  },
  {
    skillId: 'skill-creator',
    inputs: [
      { id: 'domain', name: 'Domain', type: 'text', description: 'The domain or area of expertise', required: true },
      { id: 'requirements', name: 'Reqs', type: 'text', description: 'Specific requirements for the skill' }
    ],
    outputs: [
      { id: 'skill-definition', name: 'Definition', type: 'document', description: 'Complete skill definition file' },
      { id: 'trigger-words', name: 'Triggers', type: 'text', description: 'Suggested trigger words' }
    ]
  },
  {
    skillId: 'algorithmic-art',
    inputs: [
      { id: 'concept', name: 'Concept', type: 'text', description: 'Art concept or theme', required: true },
      { id: 'parameters', name: 'Params', type: 'data', description: 'Generation parameters (colors, seed, etc.)' }
    ],
    outputs: [
      { id: 'p5-code', name: 'Code', type: 'code', description: 'Complete p5.js sketch' },
      { id: 'preview', name: 'Preview', type: 'text', description: 'Description of the generated artwork' }
    ]
  },
  {
    skillId: 'business-panel',
    inputs: [
      { id: 'question', name: 'Question', type: 'text', description: 'Strategic question to analyze', required: true },
      { id: 'context', name: 'Context', type: 'document', description: 'Background information about the business' },
      { id: 'mode', name: 'Mode', type: 'text', description: 'sequential, debate, or socratic' }
    ],
    outputs: [
      { id: 'analysis', name: 'Analysis', type: 'analysis', description: 'Multi-perspective strategic analysis' },
      { id: 'recommendations', name: 'Recs', type: 'text', description: 'Actionable recommendations' }
    ]
  },
  {
    skillId: 'frontend-design',
    inputs: [
      { id: 'requirements', name: 'Reqs', type: 'text', description: 'Description of the UI to create', required: true },
      { id: 'design-system', name: 'Design', type: 'document', description: 'Existing design system or brand guidelines' }
    ],
    outputs: [
      { id: 'component-code', name: 'Component', type: 'code', description: 'React component implementation' },
      { id: 'styles', name: 'Styles', type: 'code', description: 'CSS/Tailwind styles' }
    ]
  },
  {
    skillId: 'pdf',
    inputs: [
      { id: 'pdf-file', name: 'PDF', type: 'document', description: 'PDF document to process', required: true },
      { id: 'operation', name: 'Operation', type: 'text', description: 'Extract, merge, split, or create' }
    ],
    outputs: [
      { id: 'extracted-data', name: 'Data', type: 'data', description: 'Extracted text, tables, or form data' },
      { id: 'processed-pdf', name: 'Output', type: 'document', description: 'Modified or created PDF' }
    ]
  },
  {
    skillId: 'docx',
    inputs: [
      { id: 'document', name: 'Doc', type: 'document', description: 'Word document to process' },
      { id: 'content', name: 'Content', type: 'text', description: 'Content to add or modify' },
      { id: 'template', name: 'Template', type: 'document', description: 'Document template to use' }
    ],
    outputs: [
      { id: 'output-document', name: 'Output', type: 'document', description: 'Created or modified Word document' },
      { id: 'extracted-text', name: 'Text', type: 'text', description: 'Text content from the document' }
    ]
  },
  {
    skillId: 'pptx',
    inputs: [
      { id: 'content', name: 'Content', type: 'text', description: 'Content for the presentation', required: true },
      { id: 'template', name: 'Template', type: 'document', description: 'Presentation template' }
    ],
    outputs: [
      { id: 'presentation', name: 'Slides', type: 'presentation', description: 'PowerPoint presentation' },
      { id: 'speaker-notes', name: 'Notes', type: 'text', description: 'Generated speaker notes' }
    ]
  },
  {
    skillId: 'research-assistant',
    inputs: [
      { id: 'topic', name: 'Topic', type: 'text', description: 'Topic to research', required: true },
      { id: 'depth', name: 'Depth', type: 'text', description: 'Surface, moderate, or deep' }
    ],
    outputs: [
      { id: 'findings', name: 'Findings', type: 'analysis', description: 'Compiled research findings' },
      { id: 'sources', name: 'Sources', type: 'data', description: 'List of sources and references' }
    ]
  },
  {
    skillId: 'doc-coauthoring',
    inputs: [
      { id: 'draft', name: 'Draft', type: 'document', description: 'Initial draft or outline' },
      { id: 'style', name: 'Style', type: 'text', description: 'Desired writing style' },
      { id: 'feedback', name: 'Feedback', type: 'text', description: 'Feedback to incorporate' }
    ],
    outputs: [
      { id: 'revised-document', name: 'Document', type: 'document', description: 'Improved document' },
      { id: 'suggestions', name: 'Suggestions', type: 'text', description: 'Writing suggestions' }
    ]
  },
  {
    skillId: 'xlsx',
    inputs: [
      { id: 'spreadsheet', name: 'Spreadsheet', type: 'document', description: 'Excel file to process' },
      { id: 'data', name: 'Data', type: 'data', description: 'Data to add or analyze' },
      { id: 'operation', name: 'Operation', type: 'text', description: 'Create, edit, or analyze' }
    ],
    outputs: [
      { id: 'output-spreadsheet', name: 'Spreadsheet', type: 'document', description: 'Output Excel file' },
      { id: 'analysis', name: 'Analysis', type: 'analysis', description: 'Data analysis results' }
    ]
  },
  {
    skillId: 'webapp-testing',
    inputs: [
      { id: 'url', name: 'URL', type: 'text', description: 'Web application URL', required: true },
      { id: 'test-cases', name: 'Test Cases', type: 'text', description: 'Test scenarios to run' }
    ],
    outputs: [
      { id: 'test-results', name: 'Results', type: 'analysis', description: 'Test execution results' },
      { id: 'screenshots', name: 'Screenshots', type: 'image', description: 'Captured screenshots' }
    ]
  },
  {
    skillId: 'canvas-design',
    inputs: [
      { id: 'concept', name: 'Concept', type: 'text', description: 'Design concept or brief', required: true },
      { id: 'dimensions', name: 'Dimensions', type: 'text', description: 'Output size (e.g., 1920x1080)' }
    ],
    outputs: [
      { id: 'artwork', name: 'Artwork', type: 'image', description: 'Generated visual design' },
      { id: 'design-code', name: 'Code', type: 'code', description: 'Canvas rendering code' }
    ]
  },
  {
    skillId: 'slack-gif-creator',
    inputs: [
      { id: 'concept', name: 'Concept', type: 'text', description: 'GIF concept or idea', required: true },
      { id: 'duration', name: 'Duration', type: 'text', description: 'Animation length' }
    ],
    outputs: [
      { id: 'gif', name: 'GIF', type: 'image', description: 'Animated GIF file' },
      { id: 'animation-code', name: 'Code', type: 'code', description: 'Animation source code' }
    ]
  },
  {
    skillId: 'theme-factory',
    inputs: [
      { id: 'theme-name', name: 'Theme', type: 'text', description: 'Theme name or custom specs', required: true },
      { id: 'artifact', name: 'Artifact', type: 'document', description: 'Document to style' }
    ],
    outputs: [
      { id: 'styled-artifact', name: 'Styled', type: 'document', description: 'Themed document' },
      { id: 'theme-tokens', name: 'Tokens', type: 'data', description: 'Design tokens JSON' }
    ]
  },
  {
    skillId: 'internal-comms',
    inputs: [
      { id: 'topic', name: 'Topic', type: 'text', description: 'Communication topic', required: true },
      { id: 'audience', name: 'Audience', type: 'text', description: 'Target audience' },
      { id: 'type', name: 'Type', type: 'text', description: 'Status, update, newsletter, etc.' }
    ],
    outputs: [
      { id: 'communication', name: 'Content', type: 'document', description: 'Written communication' },
      { id: 'summary', name: 'Summary', type: 'text', description: 'Executive summary' }
    ]
  },
  {
    skillId: 'copywriting',
    inputs: [
      { id: 'product', name: 'Product', type: 'text', description: 'Product or service details', required: true },
      { id: 'page-type', name: 'Page Type', type: 'text', description: 'Homepage, landing, pricing, etc.' },
      { id: 'tone', name: 'Tone', type: 'text', description: 'Desired voice and tone' }
    ],
    outputs: [
      { id: 'copy', name: 'Copy', type: 'text', description: 'Marketing copy' },
      { id: 'headlines', name: 'Headlines', type: 'text', description: 'Headline variations' }
    ]
  },
  {
    skillId: 'typography-selector',
    inputs: [
      { id: 'style', name: 'Style', type: 'text', description: 'Desired aesthetic', required: true },
      { id: 'use-case', name: 'Use Case', type: 'text', description: 'Web, print, presentation' }
    ],
    outputs: [
      { id: 'font-pairing', name: 'Fonts', type: 'data', description: 'Font pairing recommendation' },
      { id: 'css', name: 'CSS', type: 'code', description: 'Font import CSS' }
    ]
  },
  {
    skillId: 'git-workflow',
    inputs: [
      { id: 'task', name: 'Task', type: 'text', description: 'Git task to perform', required: true },
      { id: 'context', name: 'Context', type: 'text', description: 'Repository context' }
    ],
    outputs: [
      { id: 'commands', name: 'Commands', type: 'code', description: 'Git commands to run' },
      { id: 'explanation', name: 'Guide', type: 'text', description: 'Step-by-step guide' }
    ]
  },
  {
    skillId: 'imessage',
    inputs: [
      { id: 'action', name: 'Action', type: 'text', description: 'Read, send, or search', required: true },
      { id: 'contact', name: 'Contact', type: 'text', description: 'Contact name or number' },
      { id: 'message', name: 'Message', type: 'text', description: 'Message to send' }
    ],
    outputs: [
      { id: 'messages', name: 'Messages', type: 'data', description: 'Retrieved messages' },
      { id: 'status', name: 'Status', type: 'text', description: 'Action result status' }
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
  },
  {
    id: 'email-campaign',
    name: 'Email Campaign Generator',
    description: 'Write compelling email copy, design templates, and prepare for delivery',
    nodes: [
      { id: 'node-1', skillId: 'copywriting', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'theme-factory', position: { x: 350, y: 200 } },
      { id: 'node-3', skillId: 'docx', position: { x: 600, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'copy', targetNodeId: 'node-2', targetInputId: 'artifact' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'styled-artifact', targetNodeId: 'node-3', targetInputId: 'content' }
    ],
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
    author: 'newth-skills',
    isPublic: true,
    tags: ['marketing', 'email', 'copywriting']
  },
  {
    id: 'api-documentation',
    name: 'Complete API Documentation',
    description: 'Generate professional API documentation from code or specifications',
    nodes: [
      { id: 'node-1', skillId: 'api-docs-generator', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'doc-coauthoring', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'pptx', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'documentation', targetNodeId: 'node-2', targetInputId: 'draft' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'revised-document', targetNodeId: 'node-3', targetInputId: 'content' }
    ],
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18',
    author: 'newth-skills',
    isPublic: true,
    tags: ['development', 'documentation', 'api']
  },
  {
    id: 'content-pipeline',
    name: 'Social Content Pipeline',
    description: 'Write, design, and format content for social media platforms',
    nodes: [
      { id: 'node-1', skillId: 'copywriting', position: { x: 100, y: 150 } },
      { id: 'node-2', skillId: 'canvas-design', position: { x: 350, y: 150 } },
      { id: 'node-3', skillId: 'slack-gif-creator', position: { x: 600, y: 150 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'copy', targetNodeId: 'node-2', targetInputId: 'concept' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'artwork', targetNodeId: 'node-3', targetInputId: 'concept' }
    ],
    createdAt: '2026-01-16',
    updatedAt: '2026-01-16',
    author: 'newth-skills',
    isPublic: true,
    tags: ['marketing', 'social', 'creative']
  },
  {
    id: 'invoice-processor',
    name: 'Automated Invoice Processor',
    description: 'Extract data from invoices, validate, and generate reports',
    nodes: [
      { id: 'node-1', skillId: 'pdf', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'xlsx', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'business-panel', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'extracted-data', targetNodeId: 'node-2', targetInputId: 'data' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'analysis', targetNodeId: 'node-3', targetInputId: 'context' }
    ],
    createdAt: '2026-01-14',
    updatedAt: '2026-01-14',
    author: 'newth-skills',
    isPublic: true,
    tags: ['automation', 'finance', 'reporting']
  },
  {
    id: 'book-chapter',
    name: 'Book Chapter Writing Workflow',
    description: 'Research, draft, edit, and format a complete book chapter',
    nodes: [
      { id: 'node-1', skillId: 'research-assistant', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'doc-coauthoring', position: { x: 350, y: 200 } },
      { id: 'node-3', skillId: 'docx', position: { x: 600, y: 200 } },
      { id: 'node-4', skillId: 'pdf', position: { x: 850, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'findings', targetNodeId: 'node-2', targetInputId: 'draft' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'revised-document', targetNodeId: 'node-3', targetInputId: 'content' },
      { id: 'conn-3', sourceNodeId: 'node-3', sourceOutputId: 'output-document', targetNodeId: 'node-4', targetInputId: 'pdf-file' }
    ],
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
    author: 'newth-skills',
    isPublic: true,
    tags: ['writing', 'research', 'publishing']
  },
  {
    id: 'ci-cd-setup',
    name: 'CI/CD Pipeline Generator',
    description: 'Create a complete deployment pipeline with testing, building, and deployment stages',
    nodes: [
      { id: 'node-1', skillId: 'ci-cd-builder', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'git-workflow', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'api-docs-generator', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'pipeline', targetNodeId: 'node-2', targetInputId: 'context' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'commands', targetNodeId: 'node-3', targetInputId: 'api-spec' }
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
    author: 'newth-skills',
    isPublic: true,
    tags: ['devops', 'automation', 'deployment']
  },
  {
    id: 'competitor-analysis',
    name: 'Competitive Intelligence Report',
    description: 'Research competitors and generate actionable competitive analysis',
    nodes: [
      { id: 'node-1', skillId: 'research-assistant', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'business-panel', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'pptx', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'findings', targetNodeId: 'node-2', targetInputId: 'context' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'recommendations', targetNodeId: 'node-3', targetInputId: 'content' }
    ],
    createdAt: '2026-01-08',
    updatedAt: '2026-01-08',
    author: 'newth-skills',
    isPublic: true,
    tags: ['business', 'research', 'strategy']
  },
  {
    id: 'database-optimization',
    name: 'Database Query Optimization',
    description: 'Analyze, optimize, and document database queries for performance',
    nodes: [
      { id: 'node-1', skillId: 'sql-optimizer', position: { x: 100, y: 200 } },
      { id: 'node-2', skillId: 'code-reviewer', position: { x: 400, y: 200 } },
      { id: 'node-3', skillId: 'api-docs-generator', position: { x: 700, y: 200 } }
    ],
    connections: [
      { id: 'conn-1', sourceNodeId: 'node-1', sourceOutputId: 'optimized-query', targetNodeId: 'node-2', targetInputId: 'code' },
      { id: 'conn-2', sourceNodeId: 'node-2', sourceOutputId: 'feedback', targetNodeId: 'node-3', targetInputId: 'api-spec' }
    ],
    createdAt: '2026-01-06',
    updatedAt: '2026-01-06',
    author: 'newth-skills',
    isPublic: true,
    tags: ['database', 'performance', 'optimization']
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
