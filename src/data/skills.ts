export interface Contributor {
  name: string
  github?: string
  url?: string
}

import type { AssistantId } from '../config/assistants'
import type { CategoryId } from '../config/categories'

export interface SamplePrompt {
  prompt: string
  output: string
}

// Re-export CategoryId as SkillCategory for backwards compatibility
export type SkillCategory = CategoryId

export interface Skill {
  id: string
  name: string
  description: string
  longDescription?: string
  category: SkillCategory
  tags: string[]
  featured?: boolean
  icon: string
  color: string
  features?: string[]
  useCases?: string[]
  compatibility?: AssistantId[]
  version: string
  lastUpdated: string
  contributor?: Contributor
  samplePrompts?: SamplePrompt[]
  skillFile?: string
}

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/n3wth/newth-skills/main/skills'

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
    skillFile: `${GITHUB_RAW_BASE}/gsap-animations.md`,
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
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.2.0',
    lastUpdated: '2026-01-20',
    samplePrompts: [
      {
        prompt: "Create a scroll-triggered fade-in animation for a hero section",
        output: "Here's a GSAP ScrollTrigger animation that fades in your hero section as the user scrolls:\n\n```javascript\ngsap.from('.hero', {\n  scrollTrigger: {\n    trigger: '.hero',\n    start: 'top 80%',\n    end: 'top 20%',\n    scrub: 1\n  },\n  opacity: 0,\n  y: 100,\n  duration: 1,\n  ease: 'power3.out'\n});\n```\n\nThis creates a smooth fade-in effect with upward movement as the hero section enters the viewport."
      },
      {
        prompt: "Animate text splitting each word with a stagger effect",
        output: "Using SplitText with staggered animations:\n\n```javascript\nconst split = new SplitText('.headline', { type: 'words' });\n\ngsap.from(split.words, {\n  opacity: 0,\n  y: 50,\n  rotationX: -40,\n  stagger: 0.1,\n  duration: 0.8,\n  ease: 'back.out(1.7)'\n});\n```\n\nEach word will animate in sequence with a slight rotation for a dynamic reveal effect."
      }
    ]
  },
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    description: 'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools.',
    longDescription: 'Build custom MCP servers that extend your AI assistant\'s capabilities. This skill guides you through the complete process of designing, implementing, and testing MCP tools that connect to external APIs and services.',
    category: 'development',
    tags: ['mcp', 'servers', 'api', 'integration'],
    featured: true,
    icon: '◆',
    color: 'oklch(0.78 0.15 65)',
    skillFile: `${GITHUB_RAW_BASE}/mcp-builder.md`,
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
    lastUpdated: '2026-01-25',
    samplePrompts: [
      {
        prompt: "Build an MCP server that connects to a weather API",
        output: "I'll create a FastMCP server for weather data:\n\n```python\nfrom fastmcp import FastMCP\nimport httpx\n\nmcp = FastMCP('weather-server')\n\n@mcp.tool()\nasync def get_weather(city: str) -> dict:\n    \"\"\"Get current weather for a city.\"\"\"\n    async with httpx.AsyncClient() as client:\n        response = await client.get(\n            f'https://api.weather.com/v1/current',\n            params={'city': city}\n        )\n        return response.json()\n\nif __name__ == '__main__':\n    mcp.run()\n```\n\nThis creates a tool that Claude can use to fetch real-time weather data."
      },
      {
        prompt: "How do I handle errors in MCP tools?",
        output: "Use structured error handling with descriptive messages:\n\n```python\nfrom fastmcp import FastMCP\nfrom fastmcp.exceptions import ToolError\n\nmcp = FastMCP('my-server')\n\n@mcp.tool()\nasync def fetch_data(id: str) -> dict:\n    if not id:\n        raise ToolError('ID is required')\n    \n    try:\n        result = await database.get(id)\n        if not result:\n            raise ToolError(f'No data found for ID: {id}')\n        return result\n    except ConnectionError:\n        raise ToolError('Database connection failed')\n```\n\nToolError messages are shown to the user, so make them helpful and actionable."
      }
    ]
  },
  {
    id: 'monorepo-manager',
    name: 'Monorepo Manager',
    description: 'Comprehensive guide for managing monorepo workspaces with Turborepo, Nx, or pnpm workspaces. Build caching, dependency management, and package publishing workflows.',
    longDescription: 'Master the art of monorepo management with best practices for Turborepo, Nx, and pnpm workspaces. This skill helps you configure build pipelines, optimize caching strategies, manage cross-package dependencies, and streamline your monorepo development workflow.',
    category: 'development',
    tags: ['monorepo', 'turborepo', 'nx', 'workspaces', 'build-optimization'],
    icon: '⬡',
    color: 'oklch(0.72 0.16 260)',
    skillFile: `${GITHUB_RAW_BASE}/monorepo-manager.md`,
    features: [
      'Turborepo configuration and pipeline setup',
      'Nx workspace optimization',
      'pnpm workspaces and dependency management',
      'Build caching and remote cache strategies',
      'Package publishing and versioning workflows'
    ],
    useCases: [
      'Setting up new monorepos',
      'Managing shared packages and libraries',
      'Optimizing CI/CD build times',
      'Handling cross-package dependencies',
      'Coordinated package publishing'
    ],
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Set up a Turborepo monorepo with remote caching",
        output: "I'll help you set up Turborepo with remote caching:\n\n```json\n// turbo.json\n{\n  \"$schema\": \"https://turbo.build/schema.json\",\n  \"globalDependencies\": [\"**/.env.*local\"],\n  \"pipeline\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],\n      \"outputs\": [\"dist/**\", \".next/**\"]\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"],\n      \"outputs\": [\"coverage/**\"]\n    },\n    \"lint\": {\n      \"outputs\": []\n    },\n    \"dev\": {\n      \"cache\": false,\n      \"persistent\": true\n    }\n  },\n  \"remoteCache\": {\n    \"signature\": true\n  }\n}\n```\n\nEnable remote caching:\n```bash\nnpx turbo login\nnpx turbo link\n```\n\nThis configures build pipelines with proper dependency ordering and enables remote caching for faster CI/CD builds."
      },
      {
        prompt: "How do I manage shared dependencies in a pnpm workspace?",
        output: "Use pnpm workspace protocol for local dependencies:\n\n```yaml\n# pnpm-workspace.yaml\npackages:\n  - 'apps/*'\n  - 'packages/*'\n```\n\n```json\n// apps/web/package.json\n{\n  \"name\": \"@myorg/web\",\n  \"dependencies\": {\n    \"@myorg/ui\": \"workspace:*\",\n    \"@myorg/utils\": \"workspace:^1.0.0\"\n  }\n}\n```\n\n```json\n// package.json (root)\n{\n  \"scripts\": {\n    \"build\": \"turbo run build\",\n    \"dev\": \"turbo run dev --parallel\",\n    \"test\": \"turbo run test\"\n  },\n  \"devDependencies\": {\n    \"turbo\": \"latest\"\n  }\n}\n```\n\nThe `workspace:*` protocol ensures you always use the local version, while `workspace:^1.0.0` allows for version constraints."
      }
    ]
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
    skillFile: `${GITHUB_RAW_BASE}/skill-creator.md`,
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
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.1.0',
    lastUpdated: '2026-01-10',
    samplePrompts: [
      {
        prompt: "Create a skill for React component development",
        output: "Here's a skill structure for React development:\n\n```markdown\n# React Component Skill\n\n## Trigger Words\n- \"create component\"\n- \"react component\"\n- \"build ui\"\n\n## Instructions\nWhen creating React components:\n1. Use functional components with hooks\n2. Apply TypeScript for type safety\n3. Follow naming conventions (PascalCase)\n4. Include prop types and defaults\n5. Add JSDoc comments for documentation\n\n## Example Output\n```tsx\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n}\n\nexport function Button({ label, onClick, variant = 'primary' }: ButtonProps) {\n  return (\n    <button className={`btn btn-${variant}`} onClick={onClick}>\n      {label}\n    </button>\n  );\n}\n```\n```"
      }
    ]
  },
  {
    id: 'code-generation-pipeline',
    name: 'Code Generation Pipeline',
    description: 'Streamline boilerplate and scaffold generation with automatic validation. Trigger Cursor code generation, extract and organize generated code, validate against project standards, and auto-commit with proper attribution.',
    longDescription: 'A comprehensive workflow for automating code generation with Cursor. This skill guides you through triggering AI-powered code generation, extracting and organizing generated files, validating against project standards, and automatically committing with proper attribution.',
    category: 'development',
    tags: ['cursor', 'code-generation', 'automation', 'validation', 'scaffolding'],
    featured: true,
    icon: '⚡',
    color: 'oklch(0.73 0.19 155)',
    skillFile: `${GITHUB_RAW_BASE}/code-generation-pipeline.md`,
    features: [
      'Cursor integration for AI code generation',
      'Code extraction and organization by type',
      'Project standards validation (lint, format, types)',
      'Auto-commit with attribution',
      'Multi-file generation workflows'
    ],
    useCases: [
      'Scaffolding React components with tests',
      'Generating API endpoints and routes',
      'Creating boilerplate for features',
      'Automating test suite generation',
      'Batch file creation with validation'
    ],
    compatibility: ['claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Generate a Card component with TypeScript and tests",
        output: "I'll create a complete Card component with proper structure:\n\n1. Generate files:\n```typescript\n// src/components/Card/Card.tsx\ninterface CardProps {\n  title: string;\n  description: string;\n  imageUrl?: string;\n  onClick?: () => void;\n}\n\nexport function Card({ title, description, imageUrl, onClick }: CardProps) {\n  return (\n    <div className=\"card\" onClick={onClick}>\n      {imageUrl && <img src={imageUrl} alt={title} />}\n      <h3>{title}</h3>\n      <p>{description}</p>\n    </div>\n  );\n}\n```\n\n2. Validate:\n- ✓ ESLint passed\n- ✓ TypeScript check passed\n- ✓ Tests written and passing\n\n3. Auto-commit:\n```bash\ngit commit -m \"feat(components): add Card component\n\nGenerated using Cursor AI\n- TypeScript props interface\n- Accessible markup\n- Unit tests included\n\nCo-authored-by: Cursor AI <cursor@cursor.sh>\"\n```"
      },
      {
        prompt: "Scaffold a REST API for user management",
        output: "Creating a complete user management API:\n\n```typescript\n// src/api/users/users.controller.ts\nimport { Router } from 'express';\nimport { UsersService } from './users.service';\n\nconst router = Router();\nconst usersService = new UsersService();\n\nrouter.get('/', async (req, res) => {\n  const users = await usersService.findAll();\n  res.json(users);\n});\n\nrouter.post('/', async (req, res) => {\n  const user = await usersService.create(req.body);\n  res.status(201).json(user);\n});\n\nexport { router as usersRouter };\n```\n\nGenerated structure:\n- users.controller.ts (HTTP handlers)\n- users.service.ts (business logic)\n- users.repository.ts (data access)\n- users.types.ts (TypeScript types)\n- __tests__/ (unit & integration tests)\n\nValidation: All linting, type checks, and tests passed ✓"
      }
    ]
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
    skillFile: `${GITHUB_RAW_BASE}/algorithmic-art.md`,
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
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.3.0',
    lastUpdated: '2026-01-15',
    samplePrompts: [
      {
        prompt: "Create a flow field visualization with particles",
        output: "Here's a p5.js flow field with particles:\n\n```javascript\nlet particles = [];\nlet flowField;\nlet cols, rows;\nlet scale = 20;\n\nfunction setup() {\n  createCanvas(800, 600);\n  cols = floor(width / scale);\n  rows = floor(height / scale);\n  flowField = new Array(cols * rows);\n  \n  for (let i = 0; i < 500; i++) {\n    particles.push(new Particle());\n  }\n}\n\nfunction draw() {\n  background(0, 10);\n  \n  let yoff = 0;\n  for (let y = 0; y < rows; y++) {\n    let xoff = 0;\n    for (let x = 0; x < cols; x++) {\n      let angle = noise(xoff, yoff) * TWO_PI * 2;\n      let v = p5.Vector.fromAngle(angle);\n      flowField[x + y * cols] = v;\n      xoff += 0.1;\n    }\n    yoff += 0.1;\n  }\n  \n  particles.forEach(p => {\n    p.follow(flowField);\n    p.update();\n    p.show();\n  });\n}\n```\n\nThis creates mesmerizing particle trails following Perlin noise vectors."
      },
      {
        prompt: "Generate a seeded random color palette",
        output: "Using seeded randomness for reproducible palettes:\n\n```javascript\nfunction setup() {\n  createCanvas(400, 100);\n  randomSeed(42); // Change seed for different palettes\n  noLoop();\n}\n\nfunction draw() {\n  let palette = generatePalette(5);\n  let w = width / palette.length;\n  \n  palette.forEach((c, i) => {\n    fill(c);\n    noStroke();\n    rect(i * w, 0, w, height);\n  });\n}\n\nfunction generatePalette(count) {\n  let baseHue = random(360);\n  return Array.from({length: count}, (_, i) => {\n    let h = (baseHue + i * 30) % 360;\n    let s = random(60, 90);\n    let b = random(70, 100);\n    return color(h, s, b);\n  });\n}\n```\n\nSeed 42 always produces the same palette - perfect for reproducible art."
      }
    ]
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
    skillFile: `${GITHUB_RAW_BASE}/business-panel.md`,
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
    lastUpdated: '2025-12-01',
    samplePrompts: [
      {
        prompt: "Analyze my SaaS pricing strategy from multiple expert perspectives",
        output: "**Business Panel Analysis: SaaS Pricing Strategy**\n\n**Clayton Christensen (Disruption Theory):**\nYour pricing should consider where you sit on the disruption curve. Are you targeting overserved customers with a simpler, cheaper solution? Or serving underserved markets?\n\n**Michael Porter (Competitive Strategy):**\nExamine your competitive positioning. Premium pricing signals differentiation, while cost leadership requires operational efficiency. Your pricing must align with your strategic choice.\n\n**Peter Drucker (Management):**\nPrice is what customers pay, value is what they receive. Focus on the results your product delivers. What business outcomes justify your price point?\n\n**Seth Godin (Marketing):**\nPricing is a story. A $99/month price tells a different story than $97. Consider what narrative your pricing creates and whether it resonates with your tribe.\n\n**Synthesis:**\nConsider a value-based pricing model with tiers that serve different customer segments, allowing you to capture both price-sensitive and premium customers."
      }
    ]
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
    skillFile: `${GITHUB_RAW_BASE}/frontend-design.md`,
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
    description: 'Comprehensive PDF manipulation for extracting text/tables, creating new PDFs, merging/splitting documents, and handling forms.',
    longDescription: 'A complete toolkit for working with PDF documents programmatically. This skill handles everything from text and table extraction to creating new PDFs, merging multiple documents, splitting pages, and processing fillable forms with full support for complex document structures.',
    category: 'documents',
    tags: ['pdf', 'documents', 'extraction'],
    icon: '▣',
    color: 'oklch(0.60 0.15 25)',
    skillFile: `${GITHUB_RAW_BASE}/pdf.md`,
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
    description: 'Document creation and editing with tracked changes, comments, formatting preservation, and text extraction.',
    longDescription: 'A comprehensive skill for working with Microsoft Word documents programmatically. This skill supports creating new documents, editing existing ones with tracked changes, adding and managing comments, preserving complex formatting, and extracting text content while maintaining document structure.',
    category: 'documents',
    tags: ['word', 'documents', 'office'],
    icon: '▤',
    color: 'oklch(0.55 0.18 240)',
    skillFile: `${GITHUB_RAW_BASE}/docx.md`,
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
    longDescription: 'A powerful skill for creating and manipulating PowerPoint presentations programmatically. This skill enables you to build slides with various layouts, add and edit speaker notes, apply consistent design themes, and analyze existing presentations for content extraction or modification.',
    category: 'documents',
    tags: ['powerpoint', 'slides', 'presentations'],
    icon: '▥',
    color: 'oklch(0.65 0.18 35)',
    skillFile: `${GITHUB_RAW_BASE}/pptx.md`,
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
    description: 'Spreadsheet creation, editing, and analysis with formulas, formatting, data analysis, and visualization.',
    longDescription: 'A full-featured skill for working with Excel spreadsheets and CSV files. This skill supports creating workbooks with complex formulas, applying conditional formatting, performing data analysis operations, and generating charts and visualizations from your data.',
    category: 'documents',
    tags: ['excel', 'spreadsheets', 'data'],
    icon: '▦',
    color: 'oklch(0.60 0.20 145)',
    skillFile: `${GITHUB_RAW_BASE}/xlsx.md`,
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
    description: 'Toolkit for interacting with and testing local web applications using Playwright. Verify frontend functionality and capture browser screenshots.',
    longDescription: 'An end-to-end testing skill powered by Playwright for comprehensive web application testing. This skill enables you to interact with web applications programmatically, verify frontend functionality across browsers, capture screenshots for visual regression testing, and automate complex user flows.',
    category: 'development',
    tags: ['testing', 'playwright', 'e2e', 'automation'],
    icon: '◇',
    color: 'oklch(0.68 0.12 200)',
    skillFile: `${GITHUB_RAW_BASE}/webapp-testing.md`,
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
    description: 'Create beautiful visual art in PNG and PDF using design philosophy. Build posters, art pieces, and static visuals.',
    longDescription: 'A visual design skill for creating stunning static artwork using canvas-based rendering. This skill applies design philosophy principles to generate posters, art pieces, and visual compositions that can be exported as high-quality PNG or PDF files for print or digital use.',
    category: 'creative',
    tags: ['design', 'art', 'visual', 'canvas'],
    icon: '◎',
    color: 'oklch(0.75 0.16 300)',
    skillFile: `${GITHUB_RAW_BASE}/canvas-design.md`,
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
    description: 'Create animated GIFs optimized for Slack with constraints, validation tools, and animation concepts.',
    longDescription: 'A specialized skill for creating animated GIFs that work perfectly in Slack. This skill understands Slack\'s file size and dimension constraints, provides validation tools to ensure compatibility, and guides you through animation concepts to create engaging, loop-friendly GIFs for team communication.',
    category: 'creative',
    tags: ['gif', 'slack', 'animation'],
    icon: '◌',
    color: 'oklch(0.70 0.18 350)',
    skillFile: `${GITHUB_RAW_BASE}/slack-gif-creator.md`,
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
    description: 'Style artifacts with themes. 10 pre-set themes with colors and fonts for slides, docs, reports, and landing pages.',
    longDescription: 'A theming skill that provides a curated collection of 10 pre-designed themes for consistent styling across your artifacts. Each theme includes carefully selected color palettes, typography pairings, and design tokens that can be applied to slides, documents, reports, and landing pages.',
    category: 'creative',
    tags: ['themes', 'styling', 'design-system'],
    icon: '◐',
    color: 'oklch(0.72 0.14 100)',
    skillFile: `${GITHUB_RAW_BASE}/theme-factory.md`,
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
    description: 'Structured workflow for co-authoring documentation, proposals, technical specs, and decision docs.',
    longDescription: 'A collaborative writing skill that provides structured workflows for co-authoring important documents. This skill guides you through creating documentation, proposals, technical specifications, and decision documents with clear processes for drafting, reviewing, and iterating on content.',
    category: 'business',
    tags: ['documentation', 'writing', 'collaboration'],
    icon: '◑',
    color: 'oklch(0.62 0.10 250)',
    skillFile: `${GITHUB_RAW_BASE}/doc-coauthoring.md`,
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
    description: 'Write internal communications including status reports, leadership updates, newsletters, FAQs, and incident reports.',
    longDescription: 'A business communication skill specialized in crafting effective internal communications. This skill helps you write clear, professional status reports, leadership updates, company newsletters, FAQ documents, and incident reports that keep teams informed and aligned.',
    category: 'business',
    tags: ['communication', 'writing', 'enterprise'],
    icon: '◒',
    color: 'oklch(0.58 0.12 200)',
    skillFile: `${GITHUB_RAW_BASE}/internal-comms.md`,
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
    description: 'Write and improve marketing copy for homepages, landing pages, pricing pages, feature pages, and product pages.',
    longDescription: 'A marketing-focused writing skill for creating compelling copy that converts. This skill helps you craft persuasive content for homepages, landing pages, pricing pages, feature pages, and product pages with attention to headlines, value propositions, and calls to action.',
    category: 'business',
    tags: ['marketing', 'copy', 'conversion'],
    icon: '◓',
    color: 'oklch(0.68 0.16 45)',
    skillFile: `${GITHUB_RAW_BASE}/copywriting.md`,
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
    description: 'Browse and select fonts from Google Fonts or curated pairings. Find perfect typography for design projects.',
    longDescription: 'A typography-focused skill for discovering and selecting the perfect fonts for your projects. This skill provides access to Google Fonts along with curated font pairings, helping you find typography combinations that work well together for headings, body text, and accent elements.',
    category: 'creative',
    tags: ['fonts', 'typography', 'design'],
    icon: 'Aa',
    color: 'oklch(0.64 0.08 280)',
    skillFile: `${GITHUB_RAW_BASE}/typography-selector.md`,
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
    description: 'Streamlined Git workflows for common development tasks. Handles branching strategies, commit conventions, and merge conflict resolution.',
    longDescription: 'A comprehensive Git workflow skill that helps you follow best practices for version control. This community-contributed skill covers branching strategies like GitFlow and trunk-based development, conventional commit messages, interactive rebasing, cherry-picking, and efficient merge conflict resolution.',
    category: 'development',
    tags: ['git', 'version-control', 'workflow', 'branching'],
    icon: '⎇',
    color: 'oklch(0.68 0.16 30)',
    skillFile: `${GITHUB_RAW_BASE}/git-workflow.md`,
    features: [
      'GitFlow and trunk-based branching',
      'Conventional commit message formatting',
      'Interactive rebase and cherry-picking',
      'Merge conflict resolution strategies',
      'Git history cleanup',
      'Git hooks and automation'
    ],
    useCases: [
      'Managing feature branches',
      'Cleaning up commit history',
      'Resolving merge conflicts',
      'Setting up git workflows',
      'Code review preparation'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    contributor: {
      name: 'Community Contributor',
      github: 'example-contributor'
    }
  },
  {
    id: 'sql-optimizer',
    name: 'SQL Optimizer',
    description: 'Optimize SQL queries and database performance through execution plan analysis, index suggestions, and query rewriting for maximum efficiency.',
    longDescription: 'A comprehensive SQL query optimization skill that helps you identify and fix performance bottlenecks in your database queries. Analyze execution plans, suggest optimal indexes, rewrite inefficient queries, detect N+1 query problems, and apply database-specific optimizations for PostgreSQL, MySQL, SQL Server, and more.',
    category: 'development',
    tags: ['sql', 'database', 'performance', 'optimization'],
    icon: '⬢',
    color: 'oklch(0.70 0.15 190)',
    features: [
      'Analyze query execution plans',
      'Suggest index improvements',
      'Rewrite inefficient queries',
      'Identify N+1 query problems',
      'Database-specific optimizations'
    ],
    useCases: [
      'Improving query performance',
      'Database tuning',
      'Identifying bottlenecks',
      'Migration optimization'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'api-docs-generator',
    name: 'API Docs Generator',
    description: 'Generate comprehensive API documentation from code. Create OpenAPI/Swagger specs, markdown docs, and SDK references for REST APIs.',
    longDescription: 'A comprehensive skill for generating API documentation from your codebase. Automatically create OpenAPI/Swagger specifications, generate markdown API documentation, document REST endpoints, and create client SDK references. Supports multiple programming languages including TypeScript, Python, and Go.',
    category: 'development',
    tags: ['api', 'documentation', 'openapi', 'swagger'],
    featured: false,
    icon: '◇',
    color: 'oklch(0.73 0.16 160)',
    skillFile: `${GITHUB_RAW_BASE}/api-docs-generator.md`,
    features: [
      'Generate OpenAPI/Swagger specs from code',
      'Create markdown API documentation',
      'Document REST endpoints automatically',
      'Generate client SDK documentation',
      'Support for multiple languages (TypeScript, Python, Go)'
    ],
    useCases: [
      'Documenting REST APIs',
      'Creating API reference guides',
      'Generating SDK documentation',
      'Maintaining up-to-date API specs',
      'Auto-generating API documentation from code'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'cicd-builder',
    name: 'CI/CD Builder',
    description: 'Create CI/CD pipelines and automation workflows for GitHub Actions, GitLab CI, and more. Build multi-stage pipelines, deployment automation, and code quality checks.',
    longDescription: 'A comprehensive skill for creating continuous integration and deployment pipelines. This skill guides you through building GitHub Actions workflows, GitLab CI configurations, and other automation pipelines with best practices for testing, building, and deploying your applications.',
    category: 'development',
    tags: ['cicd', 'github-actions', 'automation', 'devops'],
    icon: '⚙',
    color: 'oklch(0.72 0.16 180)',
    skillFile: `${GITHUB_RAW_BASE}/cicd-builder.md`,
    features: [
      'GitHub Actions workflow templates',
      'GitLab CI/CD configuration',
      'Multi-stage build pipelines',
      'Deployment automation workflows',
      'Testing and linting integration',
      'Environment and secrets management'
    ],
    useCases: [
      'Setting up automated testing pipelines',
      'Creating deployment workflows',
      'Building release automation',
      'Automating code quality checks',
      'Configuring multi-environment deployments'
    ],
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Create a GitHub Actions workflow for a Node.js app with testing and deployment",
        output: "Here's a comprehensive GitHub Actions workflow for Node.js:\n\n```yaml\nname: CI/CD Pipeline\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      - run: npm ci\n      - run: npm test\n      - run: npm run lint\n\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Deploy to production\n        env:\n          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}\n        run: npm run deploy\n```\n\nThis workflow runs tests and linting on every push, then deploys to production when merged to main."
      },
      {
        prompt: "Set up a multi-stage Docker build pipeline with caching",
        output: "Here's a GitHub Actions workflow with optimized Docker builds:\n\n```yaml\nname: Docker Build\n\non:\n  push:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Set up Docker Buildx\n        uses: docker/setup-buildx-action@v3\n      \n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_TOKEN }}\n      \n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: myapp:latest\n          cache-from: type=registry,ref=myapp:buildcache\n          cache-to: type=registry,ref=myapp:buildcache,mode=max\n```\n\nThis uses layer caching to speed up builds significantly."
      }
    ]
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Automated code review with best practices. Identify code smells, suggest refactoring improvements, check for security issues, and enforce coding standards.',
    longDescription: 'A comprehensive code review skill that helps you maintain high code quality through automated analysis. This skill identifies code smells, suggests refactoring improvements, checks for security vulnerabilities, enforces coding standards, and provides performance optimization recommendations.',
    category: 'development',
    tags: ['code-review', 'quality', 'best-practices', 'refactoring'],
    icon: '◇',
    color: 'oklch(0.72 0.17 160)',
    skillFile: `${GITHUB_RAW_BASE}/code-reviewer.md`,
    features: [
      'Identify code smells and anti-patterns',
      'Suggest refactoring improvements',
      'Check for security vulnerabilities',
      'Enforce coding standards and conventions',
      'Performance optimization recommendations'
    ],
    useCases: [
      'Pull request code reviews',
      'Code quality audits',
      'Refactoring guidance',
      'Learning best practices',
      'Pre-commit quality checks'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Review this React component for best practices",
        output: "I'll analyze your React component for best practices:\n\n**Code Smells Identified:**\n1. [x] Missing prop validation\n2. [x] Inline function creation in render (performance)\n3. [x] Direct state mutation\n\n**Recommendations:**\n```tsx\n// Before\nfunction UserCard({ user }) {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Click</button>;\n}\n\n// After\ninterface UserCardProps {\n  user: User;\n}\n\nfunction UserCard({ user }: UserCardProps) {\n  const [count, setCount] = useState(0);\n  const handleClick = useCallback(() => {\n    setCount(prev => prev + 1);\n  }, []);\n  \n  return <button onClick={handleClick}>Click {count}</button>;\n}\n```\n\n**Improvements:**\n[+] Added TypeScript interface for props\n[+] Used useCallback to prevent function recreation\n[+] Used functional setState to avoid stale closures"
      },
      {
        prompt: "Check this API endpoint for security issues",
        output: "Security review of your API endpoint:\n\n**Security Issues Found:**\n\n1. [CRITICAL] **SQL Injection Risk**\n```javascript\n// Vulnerable\nconst query = `SELECT * FROM users WHERE id = ${req.params.id}`;\n\n// Secure\nconst query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [req.params.id]);\n```\n\n2. [HIGH] **Missing Input Validation**\n```javascript\n// Add validation\nconst { error, value } = schema.validate(req.body);\nif (error) return res.status(400).json({ error: error.message });\n```\n\n3. [MEDIUM] **No Rate Limiting**\n```javascript\n// Add rate limiting middleware\nconst rateLimit = require('express-rate-limit');\napp.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));\n```\n\n**Best Practices:**\n[+] Use parameterized queries\n[+] Validate all user input\n[+] Implement rate limiting\n[+] Add authentication checks\n[+] Log security events"
      }
    ]
  },
  {
    id: 'data-viz',
    name: 'Data Viz',
    description: 'Create charts and data visualizations using D3.js and Chart.js. Build interactive dashboards, analytics displays, and export to SVG/PNG with responsive layouts.',
    longDescription: 'A comprehensive data visualization skill that enables you to create stunning, interactive charts and graphs using industry-standard libraries like D3.js and Chart.js. Transform raw data into compelling visual stories with responsive layouts that work across all devices.',
    category: 'creative',
    tags: ['charts', 'd3js', 'visualization', 'data'],
    icon: '◬',
    color: 'oklch(0.70 0.22 200)',
    features: [
      'Create charts with D3.js and Chart.js',
      'Interactive data visualizations',
      'Dashboard components',
      'Export to SVG/PNG formats',
      'Responsive chart layouts'
    ],
    useCases: [
      'Building analytics dashboards',
      'Creating reports with charts',
      'Visualizing datasets',
      'Presenting metrics'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'email-drafter',
    name: 'Email Drafter',
    description: 'Draft professional emails for business correspondence, sales outreach, customer support, and internal communications with tone adjustment and templates.',
    longDescription: 'A professional email writing skill that helps you craft effective emails for any business context. This skill provides templates for various scenarios, tone adjustment capabilities (formal to casual), follow-up email sequences, cold outreach templates, and response drafting assistance to ensure your email communications are clear, professional, and effective.',
    category: 'business',
    tags: ['email', 'communication', 'professional', 'writing'],
    icon: '✉',
    color: 'oklch(0.66 0.13 85)',
    skillFile: `${GITHUB_RAW_BASE}/email-drafter.md`,
    features: [
      'Professional email templates',
      'Tone adjustment (formal/casual)',
      'Follow-up email sequences',
      'Cold outreach templates',
      'Response drafting'
    ],
    useCases: [
      'Business correspondence',
      'Sales outreach',
      'Customer support replies',
      'Internal communications'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'regex-builder',
    name: 'Regex Builder',
    description: 'Build and test regular expressions with multi-language syntax support. Create complex patterns, validate against sample data, and explain regex in plain English.',
    longDescription: 'A comprehensive skill for building, testing, and understanding regular expressions across multiple programming languages. This skill helps you construct complex regex patterns, test them against sample data, translate patterns into plain English explanations, and provides a common pattern library for frequently used validations.',
    category: 'development',
    tags: ['regex', 'patterns', 'validation', 'parsing'],
    icon: '◇',
    color: 'oklch(0.72 0.16 140)',
    skillFile: `${GITHUB_RAW_BASE}/regex-builder.md`,
    features: [
      'Build complex regex patterns',
      'Test against sample data',
      'Explain regex in plain English',
      'Common pattern library',
      'Multi-language syntax support'
    ],
    useCases: [
      'Data validation',
      'Text parsing and extraction',
      'Search and replace operations',
      'Input sanitization',
      'Log file analysis'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Create a regex pattern to validate email addresses",
        output: "Here's a regex pattern for email validation:\n\n```regex\n^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n```\n\n**Explanation:**\n- `^` - Start of string\n- `[a-zA-Z0-9._%+-]+` - One or more letters, numbers, or special chars (., _, %, +, -)\n- `@` - Literal @ symbol\n- `[a-zA-Z0-9.-]+` - Domain name with letters, numbers, dots, hyphens\n- `\\.` - Literal dot\n- `[a-zA-Z]{2,}` - Top-level domain (2+ letters)\n- `$` - End of string\n\n**Test cases:**\n✓ user@example.com\n✓ john.doe+filter@company.co.uk\n✗ invalid@\n✗ @example.com"
      },
      {
        prompt: "Extract all URLs from text using regex",
        output: "Pattern to extract URLs:\n\n```regex\nhttps?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)\n```\n\n**Usage in JavaScript:**\n```javascript\nconst text = \"Visit https://example.com or http://test.org\";\nconst urlRegex = /https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)/g;\nconst urls = text.match(urlRegex);\nconsole.log(urls); // ['https://example.com', 'http://test.org']\n```\n\n**Python:**\n```python\nimport re\ntext = \"Visit https://example.com or http://test.org\"\npattern = r'https?://(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'\nurls = re.findall(pattern, text)\nprint(urls)\n```"
      }
    ]
  },
  {
    id: 'schema-designer',
    name: 'Schema Designer',
    description: 'Design and visualize database schemas with SQL migration generation, ERD diagrams, and normalization support for PostgreSQL, MySQL, and SQLite.',
    longDescription: 'A comprehensive database schema design skill that helps you create, visualize, and manage database structures. Design schemas visually, generate SQL migrations, create Entity-Relationship Diagrams (ERD), and normalize database structures following best practices. Supports PostgreSQL, MySQL, and SQLite with production-ready migration scripts.',
    category: 'development',
    tags: ['database', 'schema', 'sql', 'erd'],
    icon: '◫',
    color: 'oklch(0.72 0.16 160)',
    skillFile: `${GITHUB_RAW_BASE}/schema-designer.md`,
    features: [
      'Visual database schema design',
      'SQL migration generation',
      'ERD diagram creation',
      'Database normalization',
      'PostgreSQL, MySQL, SQLite support'
    ],
    useCases: [
      'Designing new databases',
      'Refactoring existing schemas',
      'Creating migration scripts',
      'Documenting data models',
      'Schema optimization'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'imessage',
    name: 'iMessage',
    description: 'Manage iMessage conversations with database queries and AppleScript automation. Find unreplied threads, search contacts, read history, and send messages.',
    longDescription: 'A comprehensive iMessage management skill that provides direct access to the Messages database and AppleScript automation. Find unreplied threads, search contacts with disambiguation, read conversation history from both individual and group chats, and send messages with proper confirmation workflows.',
    category: 'productivity',
    tags: ['imessage', 'messaging', 'automation', 'macos'],
    featured: true,
    icon: '◈',
    color: 'oklch(0.65 0.18 220)',
    skillFile: `${GITHUB_RAW_BASE}/imessage.md`,
    features: [
      'Find unreplied message threads',
      'Search contacts with disambiguation',
      'Read individual and group chat history',
      'Send messages via AppleScript',
      'Filter reactions and tapbacks',
      'Handle group chat participants'
    ],
    useCases: [
      'Catching up on unreplied messages',
      'Finding the right contact to message',
      'Reading conversation context before replying',
      'Sending messages hands-free',
      'Managing group chat communications'
    ],
    compatibility: ['claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-26'
  },
  {
    id: 'cursor-rules-generator',
    name: 'Smart .cursor/rules Generator',
    description: 'Auto-generate AI rules from coding patterns and project characteristics. Create project-specific AI rules that match team coding style.',
    longDescription: 'Automatically analyze your codebase to detect coding patterns, naming conventions, and architectural decisions, then generate AI-specific rules that guide code generation to match your project\'s established patterns. Track rule effectiveness and version changes over time.',
    category: 'development',
    tags: ['cursor', 'ai-rules', 'code-analysis', 'automation', 'patterns'],
    featured: true,
    icon: '◉',
    color: 'oklch(0.72 0.16 150)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-rules-generator.md`,
    features: [
      'Analyze coding patterns across project',
      'Generate AI rules matching style',
      'Create team-specific rules from code',
      'Version and compare rule effectiveness',
      'Extract naming conventions automatically'
    ],
    useCases: [
      'Setting up new project AI rules',
      'Standardizing team coding practices',
      'Onboarding new developers with AI assistance',
      'Maintaining consistent code style',
      'Evolving rules as project matures'
    ],
    compatibility: ['claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Analyze my React project and generate .cursor/rules",
        output: "I'll analyze your React project patterns:\n\n1. Scanning components for naming conventions...\n2. Detecting import/export patterns...\n3. Identifying TypeScript usage...\n\nBased on 147 files analyzed:\n- 98% functional components with hooks\n- PascalCase for components, camelCase for utilities\n- Absolute imports with @ alias\n- Props interfaces defined before components\n\nGenerated rules saved to .cursor/rules with:\n- Component structure guidelines\n- Naming conventions\n- Import organization\n- TypeScript patterns\n- Testing co-location requirements"
      },
      {
        prompt: "Compare my current .cursor/rules effectiveness with the previous version",
        output: "Comparing rule versions:\n\n**v1.0 (3 months ago)**\n- Code consistency: 75%\n- Review time: baseline\n- Pattern compliance: 68%\n\n**v2.0 (current)**\n- Code consistency: 92% (+17%)\n- Review time: -35% faster\n- Pattern compliance: 87% (+19%)\n\n**Key improvements:**\n- Added specific TypeScript patterns\n- Clarified component structure rules\n- Included error handling guidelines\n\n**Recommendations:**\n- Update state management section (detected new patterns)\n- Add accessibility rules (low compliance detected)\n- Consider splitting into domain-specific rule files"
      }
    ]
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Deep research with citations and sources. Summarize research papers, compare multiple sources, and create comprehensive research reports.',
    longDescription: 'A comprehensive research skill that helps you conduct thorough investigations on any topic. This skill excels at finding credible sources, verifying information, summarizing academic papers, and synthesizing insights from multiple sources into well-structured research reports with proper citations.',
    category: 'productivity',
    tags: ['research', 'analysis', 'citations', 'knowledge'],
    icon: '◉',
    color: 'oklch(0.68 0.16 250)',
    features: [
      'Deep topic research across multiple sources',
      'Source citation and verification',
      'Summarize research papers and academic content',
      'Compare and synthesize multiple sources',
      'Create structured research reports'
    ],
    useCases: [
      'Academic research and literature reviews',
      'Market research and competitive analysis',
      'Technical deep dives and documentation',
      'Fact-checking and source verification'
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
  { id: 'productivity', name: 'Productivity', count: skills.filter(s => s.category === 'productivity').length },
  { id: 'business', name: 'Business', count: skills.filter(s => s.category === 'business').length },
]
