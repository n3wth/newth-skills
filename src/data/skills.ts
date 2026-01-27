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
    longDescription: 'A creative coding skill that leverages p5.js to generate stunning algorithmic artwork. This skill enables you to create reproducible generative art through seeded randomness, explore parameter spaces interactively, and build complex visual systems like flow fields and particle simulations.',
    category: 'creative',
    tags: ['p5js', 'generative', 'art', 'creative-coding'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'business-panel',
    name: 'Business Panel',
    description: 'Multi-expert business strategy panel synthesizing Christensen, Porter, Drucker, Godin, and more. Supports sequential, debate, and Socratic modes.',
    longDescription: 'Access a virtual panel of business strategy experts including Clayton Christensen, Michael Porter, Peter Drucker, and Seth Godin. This skill synthesizes diverse strategic perspectives through multiple interaction modes, helping you analyze business challenges from multiple angles and develop well-rounded strategies.',
    category: 'business',
    tags: ['strategy', 'analysis', 'experts'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished UI that avoids generic AI aesthetics.',
    longDescription: 'A design-focused development skill that helps you create visually distinctive frontend interfaces. This skill emphasizes high design quality, creative UI patterns, and production-ready code that stands out from generic AI-generated aesthetics with thoughtful typography, spacing, and visual hierarchy.',
    category: 'development',
    tags: ['ui', 'react', 'design', 'components'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'pdf',
    name: 'PDF Toolkit',
    description: 'Comprehensive PDF manipulation for extracting text/tables, creating new PDFs, merging/splitting documents, and handling forms.',
    longDescription: 'A complete toolkit for working with PDF documents programmatically. This skill handles everything from text and table extraction to creating new PDFs, merging multiple documents, splitting pages, and processing fillable forms with full support for complex document structures.',
    category: 'documents',
    tags: ['pdf', 'documents', 'extraction'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'docx',
    name: 'Word Documents',
    description: 'Document creation and editing with tracked changes, comments, formatting preservation, and text extraction.',
    longDescription: 'A comprehensive skill for working with Microsoft Word documents programmatically. This skill supports creating new documents, editing existing ones with tracked changes, adding and managing comments, preserving complex formatting, and extracting text content while maintaining document structure.',
    category: 'documents',
    tags: ['word', 'documents', 'office'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'pptx',
    name: 'Presentations',
    description: 'Presentation creation, editing, and analysis. Work with layouts, speaker notes, and slide design.',
    longDescription: 'A powerful skill for creating and manipulating PowerPoint presentations programmatically. This skill enables you to build slides with various layouts, add and edit speaker notes, apply consistent design themes, and analyze existing presentations for content extraction or modification.',
    category: 'documents',
    tags: ['powerpoint', 'slides', 'presentations'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'xlsx',
    name: 'Spreadsheets',
    description: 'Spreadsheet creation, editing, and analysis with formulas, formatting, data analysis, and visualization.',
    longDescription: 'A full-featured skill for working with Excel spreadsheets and CSV files. This skill supports creating workbooks with complex formulas, applying conditional formatting, performing data analysis operations, and generating charts and visualizations from your data.',
    category: 'documents',
    tags: ['excel', 'spreadsheets', 'data'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'webapp-testing',
    name: 'Webapp Testing',
    description: 'Toolkit for interacting with and testing local web applications using Playwright. Verify frontend functionality and capture browser screenshots.',
    longDescription: 'An end-to-end testing skill powered by Playwright for comprehensive web application testing. This skill enables you to interact with web applications programmatically, verify frontend functionality across browsers, capture screenshots for visual regression testing, and automate complex user flows.',
    category: 'development',
    tags: ['testing', 'playwright', 'e2e', 'automation'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'canvas-design',
    name: 'Canvas Design',
    description: 'Create beautiful visual art in PNG and PDF using design philosophy. Build posters, art pieces, and static visuals.',
    longDescription: 'A visual design skill for creating stunning static artwork using canvas-based rendering. This skill applies design philosophy principles to generate posters, art pieces, and visual compositions that can be exported as high-quality PNG or PDF files for print or digital use.',
    category: 'creative',
    tags: ['design', 'art', 'visual', 'canvas'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'slack-gif-creator',
    name: 'Slack GIF Creator',
    description: 'Create animated GIFs optimized for Slack with constraints, validation tools, and animation concepts.',
    longDescription: 'A specialized skill for creating animated GIFs that work perfectly in Slack. This skill understands Slack\'s file size and dimension constraints, provides validation tools to ensure compatibility, and guides you through animation concepts to create engaging, loop-friendly GIFs for team communication.',
    category: 'creative',
    tags: ['gif', 'slack', 'animation'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'theme-factory',
    name: 'Theme Factory',
    description: 'Style artifacts with themes. 10 pre-set themes with colors and fonts for slides, docs, reports, and landing pages.',
    longDescription: 'A theming skill that provides a curated collection of 10 pre-designed themes for consistent styling across your artifacts. Each theme includes carefully selected color palettes, typography pairings, and design tokens that can be applied to slides, documents, reports, and landing pages.',
    category: 'creative',
    tags: ['themes', 'styling', 'design-system'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'doc-coauthoring',
    name: 'Doc Co-authoring',
    description: 'Structured workflow for co-authoring documentation, proposals, technical specs, and decision docs.',
    longDescription: 'A collaborative writing skill that provides structured workflows for co-authoring important documents. This skill guides you through creating documentation, proposals, technical specifications, and decision documents with clear processes for drafting, reviewing, and iterating on content.',
    category: 'business',
    tags: ['documentation', 'writing', 'collaboration'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'internal-comms',
    name: 'Internal Comms',
    description: 'Write internal communications including status reports, leadership updates, newsletters, FAQs, and incident reports.',
    longDescription: 'A business communication skill specialized in crafting effective internal communications. This skill helps you write clear, professional status reports, leadership updates, company newsletters, FAQ documents, and incident reports that keep teams informed and aligned.',
    category: 'business',
    tags: ['communication', 'writing', 'enterprise'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    description: 'Write and improve marketing copy for homepages, landing pages, pricing pages, feature pages, and product pages.',
    longDescription: 'A marketing-focused writing skill for creating compelling copy that converts. This skill helps you craft persuasive content for homepages, landing pages, pricing pages, feature pages, and product pages with attention to headlines, value propositions, and calls to action.',
    category: 'business',
    tags: ['marketing', 'copy', 'conversion'],
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
    compatibility: ['gemini', 'claude']
  },
  {
    id: 'typography-selector',
    name: 'Typography Selector',
    description: 'Browse and select fonts from Google Fonts or curated pairings. Find perfect typography for design projects.',
    longDescription: 'A typography-focused skill for discovering and selecting the perfect fonts for your projects. This skill provides access to Google Fonts along with curated font pairings, helping you find typography combinations that work well together for headings, body text, and accent elements.',
    category: 'creative',
    tags: ['fonts', 'typography', 'design'],
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
    compatibility: ['gemini', 'claude']
  }
]

export const categories = [
  { id: 'all', name: 'All Skills', count: skills.length },
  { id: 'development', name: 'Development', count: skills.filter(s => s.category === 'development').length },
  { id: 'documents', name: 'Documents', count: skills.filter(s => s.category === 'documents').length },
  { id: 'creative', name: 'Creative', count: skills.filter(s => s.category === 'creative').length },
  { id: 'business', name: 'Business', count: skills.filter(s => s.category === 'business').length },
]
