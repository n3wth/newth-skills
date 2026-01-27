export interface Contributor {
  name: string
  github?: string
  url?: string
}

export interface SamplePrompt {
  prompt: string
  output: string
}

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
  version: string
  lastUpdated: string
  contributor?: Contributor
  samplePrompts?: SamplePrompt[]
  skillFile?: string
}

export const skills: Skill[] = [
  {
    id: 'gsap-animations',
    name: 'GSAP Animations',
    description: 'Create beautiful, production-ready GSAP animations with ScrollTrigger, SplitText, and other plugins.',
    category: 'development',
    tags: ['animation', 'gsap', 'scrolltrigger', 'motion', 'javascript', 'typescript'],
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
    compatibility: ['gemini', 'claude'],
    version: '1.2.0',
    lastUpdated: '2026-01-20'
  },
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    description: 'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services.',
    category: 'development',
    tags: ['mcp', 'servers', 'api', 'integration', 'python', 'typescript'],
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
    compatibility: ['claude'],
    version: '2.0.0',
    lastUpdated: '2026-01-25'
  },
  {
    id: 'skill-creator',
    name: 'Skill Creator',
    description: 'Guide for creating effective Claude Code skills with specialized knowledge, workflows, and tool integrations.',
    category: 'development',
    tags: ['skills', 'claude', 'automation', 'markdown'],
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
    compatibility: ['gemini', 'claude'],
    version: '1.1.0',
    lastUpdated: '2026-01-10'
  },
  {
    id: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Create algorithmic art using p5.js with seeded randomness and interactive parameter exploration.',
    category: 'creative',
    tags: ['p5js', 'generative', 'art', 'creative-coding', 'javascript', 'canvas'],
    featured: true,
    icon: '◉',
    color: 'oklch(0.72 0.20 330)',
    features: [
      'Seeded randomness for reproducible outputs',
      'Interactive parameter exploration',
      'Flow field generation algorithms',
      'Particle system simulations',
      'Export to high-resolution images'
    ],
    useCases: [
      'Generative art collections',
      'Dynamic backgrounds and visuals',
      'Data visualization art',
      'NFT artwork creation',
      'Interactive installations'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.3.0',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'business-panel',
    name: 'Business Panel',
    description: 'Multi-expert business strategy panel synthesizing Christensen, Porter, Drucker, Godin, and more.',
    category: 'business',
    tags: ['strategy', 'analysis', 'experts', 'business'],
    featured: true,
    icon: '◆',
    color: 'oklch(0.65 0.12 220)',
    features: [
      'Multi-expert perspective synthesis',
      'Sequential analysis mode',
      'Debate mode for contrasting views',
      'Socratic questioning approach',
      'Framework-based strategic analysis'
    ],
    useCases: [
      'Strategic planning sessions',
      'Competitive analysis',
      'Business model evaluation',
      'Market entry decisions',
      'Innovation strategy development'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-12-01'
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality.',
    category: 'development',
    tags: ['ui', 'react', 'design', 'components', 'css', 'tailwind', 'typescript'],
    icon: '□',
    color: 'oklch(0.70 0.14 180)',
    features: [
      'Production-ready React components',
      'Thoughtful typography and spacing',
      'Creative visual hierarchy',
      'Responsive design patterns',
      'Modern CSS techniques'
    ],
    useCases: [
      'Landing page design',
      'Dashboard interfaces',
      'Component library creation',
      'Marketing site development',
      'SaaS application UI'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.4.0',
    lastUpdated: '2026-01-22'
  },
  {
    id: 'pdf',
    name: 'PDF Toolkit',
    description: 'Comprehensive PDF manipulation for extracting text/tables, creating new PDFs, merging/splitting documents.',
    category: 'documents',
    tags: ['pdf', 'documents', 'extraction', 'python'],
    icon: '▣',
    color: 'oklch(0.60 0.15 25)',
    features: [
      'Text and table extraction',
      'PDF creation from scratch',
      'Document merging and splitting',
      'Form field processing',
      'Page manipulation and reordering'
    ],
    useCases: [
      'Invoice data extraction',
      'Report generation',
      'Document consolidation',
      'Form automation',
      'Contract processing'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-11-15'
  },
  {
    id: 'docx',
    name: 'Word Documents',
    description: 'Document creation and editing with tracked changes, comments, formatting preservation.',
    category: 'documents',
    tags: ['word', 'documents', 'office', 'python'],
    icon: '▤',
    color: 'oklch(0.55 0.18 240)',
    features: [
      'Document creation and editing',
      'Tracked changes support',
      'Comment management',
      'Formatting preservation',
      'Text extraction with structure'
    ],
    useCases: [
      'Contract generation',
      'Report automation',
      'Document review workflows',
      'Template-based document creation',
      'Bulk document processing'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.1.0',
    lastUpdated: '2025-12-20'
  },
  {
    id: 'pptx',
    name: 'Presentations',
    description: 'Presentation creation, editing, and analysis. Work with layouts, speaker notes, and slide design.',
    category: 'documents',
    tags: ['powerpoint', 'slides', 'presentations', 'python'],
    icon: '▥',
    color: 'oklch(0.65 0.18 35)',
    features: [
      'Slide creation with layouts',
      'Speaker notes management',
      'Design theme application',
      'Content extraction and analysis',
      'Image and chart embedding'
    ],
    useCases: [
      'Automated report presentations',
      'Sales deck generation',
      'Training material creation',
      'Presentation template building',
      'Slide content extraction'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-11-20'
  },
  {
    id: 'xlsx',
    name: 'Spreadsheets',
    description: 'Spreadsheet creation, editing, and analysis with formulas, formatting, data analysis.',
    category: 'documents',
    tags: ['excel', 'spreadsheets', 'data', 'python', 'csv'],
    icon: '▦',
    color: 'oklch(0.60 0.20 145)',
    features: [
      'Formula creation and evaluation',
      'Conditional formatting',
      'Data analysis and pivot tables',
      'Chart and visualization generation',
      'Multi-sheet workbook management'
    ],
    useCases: [
      'Financial report generation',
      'Data transformation pipelines',
      'Automated spreadsheet creation',
      'Budget and forecast modeling',
      'Data import and export'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.2.0',
    lastUpdated: '2026-01-05'
  },
  {
    id: 'webapp-testing',
    name: 'Webapp Testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright.',
    category: 'development',
    tags: ['testing', 'playwright', 'e2e', 'automation', 'javascript', 'typescript'],
    icon: '◇',
    color: 'oklch(0.68 0.12 200)',
    features: [
      'Cross-browser testing support',
      'Screenshot and visual comparison',
      'User flow automation',
      'Network request interception',
      'Mobile viewport testing'
    ],
    useCases: [
      'End-to-end test automation',
      'Visual regression testing',
      'Form submission verification',
      'Authentication flow testing',
      'Performance monitoring'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.5.0',
    lastUpdated: '2026-01-18'
  },
  {
    id: 'canvas-design',
    name: 'Canvas Design',
    description: 'Create beautiful visual art in PNG and PDF using design philosophy.',
    category: 'creative',
    tags: ['design', 'art', 'visual', 'canvas', 'javascript'],
    icon: '◎',
    color: 'oklch(0.75 0.16 300)',
    features: [
      'High-resolution PNG export',
      'PDF generation for print',
      'Design philosophy principles',
      'Composition and layout tools',
      'Color theory application'
    ],
    useCases: [
      'Poster and print design',
      'Social media graphics',
      'Album artwork creation',
      'Event promotional materials',
      'Digital art pieces'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-12-10'
  },
  {
    id: 'slack-gif-creator',
    name: 'Slack GIF Creator',
    description: 'Create animated GIFs optimized for Slack with constraints, validation tools.',
    category: 'creative',
    tags: ['gif', 'slack', 'animation', 'javascript'],
    icon: '◌',
    color: 'oklch(0.70 0.18 350)',
    features: [
      'Slack-optimized file constraints',
      'GIF validation and testing',
      'Frame rate optimization',
      'Color palette management',
      'Loop-friendly animation design'
    ],
    useCases: [
      'Team celebration GIFs',
      'Reaction and emoji animations',
      'Product demo snippets',
      'Onboarding welcome animations',
      'Status update visuals'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-11-25'
  },
  {
    id: 'theme-factory',
    name: 'Theme Factory',
    description: 'Style artifacts with themes. 10 pre-set themes with colors and fonts.',
    category: 'creative',
    tags: ['themes', 'styling', 'design-system', 'css'],
    icon: '◐',
    color: 'oklch(0.72 0.14 100)',
    features: [
      '10 curated theme presets',
      'Color palette definitions',
      'Typography pairings',
      'Cross-artifact consistency',
      'Design token system'
    ],
    useCases: [
      'Brand-consistent presentations',
      'Document styling',
      'Report theming',
      'Landing page design',
      'Marketing material consistency'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.1.0',
    lastUpdated: '2026-01-08'
  },
  {
    id: 'doc-coauthoring',
    name: 'Doc Co-authoring',
    description: 'Structured workflow for co-authoring documentation, proposals, technical specs.',
    category: 'business',
    tags: ['documentation', 'writing', 'collaboration', 'markdown'],
    icon: '◑',
    color: 'oklch(0.62 0.10 250)',
    features: [
      'Structured document workflows',
      'Proposal writing frameworks',
      'Technical spec templates',
      'Decision document formats',
      'Iterative review processes'
    ],
    useCases: [
      'Technical documentation',
      'Project proposals',
      'Architecture decision records',
      'Product requirement documents',
      'Team knowledge bases'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-12-05'
  },
  {
    id: 'internal-comms',
    name: 'Internal Comms',
    description: 'Write internal communications including status reports, leadership updates, newsletters.',
    category: 'business',
    tags: ['communication', 'writing', 'enterprise', 'markdown'],
    icon: '◒',
    color: 'oklch(0.58 0.12 200)',
    features: [
      'Status report templates',
      'Leadership update formats',
      'Newsletter structuring',
      'FAQ document creation',
      'Incident report frameworks'
    ],
    useCases: [
      'Weekly team updates',
      'Executive communications',
      'Company-wide announcements',
      'Crisis communication',
      'Onboarding documentation'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-11-10'
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    description: 'Write and improve marketing copy for homepages, landing pages, pricing pages.',
    category: 'business',
    tags: ['marketing', 'copy', 'conversion', 'writing'],
    icon: '◓',
    color: 'oklch(0.68 0.16 45)',
    features: [
      'Headline and tagline writing',
      'Value proposition crafting',
      'Call-to-action optimization',
      'Benefit-focused messaging',
      'Conversion-oriented structure'
    ],
    useCases: [
      'Homepage copy',
      'Landing page optimization',
      'Pricing page messaging',
      'Feature announcements',
      'Product launch content'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.2.0',
    lastUpdated: '2026-01-12'
  },
  {
    id: 'typography-selector',
    name: 'Typography Selector',
    description: 'Browse and select fonts from Google Fonts or curated pairings.',
    category: 'creative',
    tags: ['fonts', 'typography', 'design', 'css'],
    icon: 'Aa',
    color: 'oklch(0.64 0.08 280)',
    features: [
      'Google Fonts integration',
      'Curated font pairings',
      'Heading and body combinations',
      'Font weight recommendations',
      'Readability optimization'
    ],
    useCases: [
      'Website typography selection',
      'Brand font pairing',
      'Document styling',
      'Presentation design',
      'Marketing material fonts'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2025-12-15'
  },
  {
    id: 'git-workflow',
    name: 'Git Workflow',
    description: 'Streamlined Git workflows for common development tasks. Handles branching strategies, commit conventions.',
    category: 'development',
    tags: ['git', 'version-control', 'workflow', 'collaboration'],
    icon: '⎇',
    color: 'oklch(0.68 0.16 30)',
    features: [
      'GitFlow and trunk-based branching',
      'Conventional commit message formatting',
      'Interactive rebase guidance',
      'Merge conflict resolution strategies',
      'Git hooks and automation'
    ],
    useCases: [
      'Setting up project branching strategy',
      'Writing clear commit messages',
      'Resolving complex merge conflicts',
      'Automating Git workflows',
      'Code review preparation'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  }
]

export const categories = [
  { id: 'all', name: 'All Skills', count: skills.length },
  { id: 'development', name: 'Development', count: skills.filter(s => s.category === 'development').length },
  { id: 'documents', name: 'Documents', count: skills.filter(s => s.category === 'documents').length },
  { id: 'creative', name: 'Creative', count: skills.filter(s => s.category === 'creative').length },
  { id: 'business', name: 'Business', count: skills.filter(s => s.category === 'business').length },
]

export function getSkillById(id: string): Skill | undefined {
  return skills.find(s => s.id === id)
}

export function getSkillsByCategory(category: string): Skill[] {
  if (category === 'all') {
    return skills
  }
  return skills.filter(s => s.category === category)
}

export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase()
  return skills.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.tags.some(t => t.toLowerCase().includes(lowerQuery))
  )
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter(s => s.featured)
}
