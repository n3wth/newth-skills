export interface Skill {
  id: string
  name: string
  description: string
  longDescription?: string
  category: 'development' | 'documents' | 'creative' | 'productivity' | 'business'
  tags: string[]
  featured?: boolean
  icon: string
  color: string
  features?: string[]
  useCases?: string[]
  compatibility?: ('gemini' | 'claude')[]
}

export const skills: Skill[] = [
  {
    id: 'gsap-animations',
    name: 'GSAP Animations',
    description: 'Create beautiful, production-ready GSAP animations with ScrollTrigger, SplitText, and other plugins. Build scroll effects, text animations, hero entrances, and micro-interactions.',
    longDescription: 'A comprehensive skill for creating sophisticated web animations using GSAP (GreenSock Animation Platform). This skill understands GSAP\'s core concepts, timing functions, and plugin ecosystem to help you build smooth, performant animations that work across all browsers.',
    category: 'development',
    tags: ['animation', 'gsap', 'scrolltrigger', 'motion'],
    featured: true,
    icon: '✦',
    color: 'oklch(0.75 0.18 145)',
    features: [
      'ScrollTrigger for scroll-based animations',
      'SplitText for text reveal effects',
      'Timeline-based sequencing',
      'Easing and timing control',
      'Performance-optimized animations'
    ],
    useCases: [
      'Hero section entrances',
      'Scroll-triggered reveals',
      'Page transitions',
      'Micro-interactions',
      'Loading animations'
    ],
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    description: 'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools.',
    longDescription: 'Build custom MCP servers that extend your AI assistant\'s capabilities. This skill guides you through the complete process of designing, implementing, and testing MCP tools that connect to external APIs and services.',
    category: 'development',
    tags: ['mcp', 'servers', 'api', 'integration'],
    featured: true,
    icon: '⚡',
    color: 'oklch(0.78 0.15 65)',
    features: [
      'FastMCP for Python development',
      'TypeScript SDK support',
      'Tool schema design patterns',
      'Error handling best practices',
      'Testing and validation'
    ],
    useCases: [
      'Connecting to databases',
      'API integrations',
      'Custom tool development',
      'Automation workflows',
      'External service access'
    ],
    compatibility: ['claude']
  },
  {
    id: 'skill-creator',
    name: 'Skill Creator',
    description: 'Guide for creating effective Claude Code skills with specialized knowledge, workflows, and tool integrations.',
    longDescription: 'Learn how to create your own skills that extend AI coding assistants. This skill covers the structure, best practices, and patterns for building effective skills that provide specialized knowledge and workflows.',
    category: 'development',
    tags: ['skills', 'claude', 'automation'],
    featured: true,
    icon: '◈',
    color: 'oklch(0.70 0.15 280)',
    features: [
      'Skill structure and conventions',
      'Trigger word design',
      'Context and instruction writing',
      'Tool integration patterns',
      'Testing and iteration'
    ],
    useCases: [
      'Creating domain-specific skills',
      'Workflow automation',
      'Knowledge encapsulation',
      'Team skill sharing',
      'Custom tooling'
    ],
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Create algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Build flow fields, particle systems, and generative visuals.',
    category: 'creative',
    tags: ['p5js', 'generative', 'art', 'creative-coding'],
    featured: true,
    icon: '◉',
    color: 'oklch(0.72 0.20 330)'
  },
  {
    id: 'business-panel',
    name: 'Business Panel',
    description: 'Multi-expert business strategy panel synthesizing Christensen, Porter, Drucker, Godin, and more. Supports sequential, debate, and Socratic modes.',
    category: 'business',
    tags: ['strategy', 'analysis', 'experts'],
    featured: true,
    icon: '◆',
    color: 'oklch(0.65 0.12 220)'
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished UI that avoids generic AI aesthetics.',
    category: 'development',
    tags: ['ui', 'react', 'design', 'components'],
    icon: '□',
    color: 'oklch(0.70 0.14 180)'
  },
  {
    id: 'pdf',
    name: 'PDF Toolkit',
    description: 'Comprehensive PDF manipulation for extracting text/tables, creating new PDFs, merging/splitting documents, and handling forms.',
    category: 'documents',
    tags: ['pdf', 'documents', 'extraction'],
    icon: '▣',
    color: 'oklch(0.60 0.15 25)'
  },
  {
    id: 'docx',
    name: 'Word Documents',
    description: 'Document creation and editing with tracked changes, comments, formatting preservation, and text extraction.',
    category: 'documents',
    tags: ['word', 'documents', 'office'],
    icon: '▤',
    color: 'oklch(0.55 0.18 240)'
  },
  {
    id: 'pptx',
    name: 'Presentations',
    description: 'Presentation creation, editing, and analysis. Work with layouts, speaker notes, and slide design.',
    category: 'documents',
    tags: ['powerpoint', 'slides', 'presentations'],
    icon: '▥',
    color: 'oklch(0.65 0.18 35)'
  },
  {
    id: 'xlsx',
    name: 'Spreadsheets',
    description: 'Spreadsheet creation, editing, and analysis with formulas, formatting, data analysis, and visualization.',
    category: 'documents',
    tags: ['excel', 'spreadsheets', 'data'],
    icon: '▦',
    color: 'oklch(0.60 0.20 145)'
  },
  {
    id: 'webapp-testing',
    name: 'Webapp Testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright. Verify frontend functionality and capture browser screenshots.',
    category: 'development',
    tags: ['testing', 'playwright', 'e2e', 'automation'],
    icon: '◇',
    color: 'oklch(0.68 0.12 200)'
  },
  {
    id: 'canvas-design',
    name: 'Canvas Design',
    description: 'Create beautiful visual art in PNG and PDF using design philosophy. Build posters, art pieces, and static visuals.',
    category: 'creative',
    tags: ['design', 'art', 'visual', 'canvas'],
    icon: '◎',
    color: 'oklch(0.75 0.16 300)'
  },
  {
    id: 'slack-gif-creator',
    name: 'Slack GIF Creator',
    description: 'Create animated GIFs optimized for Slack with constraints, validation tools, and animation concepts.',
    category: 'creative',
    tags: ['gif', 'slack', 'animation'],
    icon: '◌',
    color: 'oklch(0.70 0.18 350)'
  },
  {
    id: 'theme-factory',
    name: 'Theme Factory',
    description: 'Style artifacts with themes. 10 pre-set themes with colors and fonts for slides, docs, reports, and landing pages.',
    category: 'creative',
    tags: ['themes', 'styling', 'design-system'],
    icon: '◐',
    color: 'oklch(0.72 0.14 100)'
  },
  {
    id: 'doc-coauthoring',
    name: 'Doc Co-authoring',
    description: 'Structured workflow for co-authoring documentation, proposals, technical specs, and decision docs.',
    category: 'business',
    tags: ['documentation', 'writing', 'collaboration'],
    icon: '◑',
    color: 'oklch(0.62 0.10 250)'
  },
  {
    id: 'internal-comms',
    name: 'Internal Comms',
    description: 'Write internal communications including status reports, leadership updates, newsletters, FAQs, and incident reports.',
    category: 'business',
    tags: ['communication', 'writing', 'enterprise'],
    icon: '◒',
    color: 'oklch(0.58 0.12 200)'
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    description: 'Write and improve marketing copy for homepages, landing pages, pricing pages, feature pages, and product pages.',
    category: 'business',
    tags: ['marketing', 'copy', 'conversion'],
    icon: '◓',
    color: 'oklch(0.68 0.16 45)'
  },
  {
    id: 'typography-selector',
    name: 'Typography Selector',
    description: 'Browse and select fonts from Google Fonts or curated pairings. Find perfect typography for design projects.',
    category: 'creative',
    tags: ['fonts', 'typography', 'design'],
    icon: 'Aa',
    color: 'oklch(0.64 0.08 280)'
  }
]

export const categories = [
  { id: 'all', name: 'All Skills', count: skills.length },
  { id: 'development', name: 'Development', count: skills.filter(s => s.category === 'development').length },
  { id: 'documents', name: 'Documents', count: skills.filter(s => s.category === 'documents').length },
  { id: 'creative', name: 'Creative', count: skills.filter(s => s.category === 'creative').length },
  { id: 'business', name: 'Business', count: skills.filter(s => s.category === 'business').length },
]
