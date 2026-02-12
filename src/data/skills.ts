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
    description: 'Create production-ready GSAP animations with ScrollTrigger, SplitText, and other plugins. Build scroll effects, text animations, hero entrances, and micro-interactions.',
    longDescription: 'Build web animations with GSAP (GreenSock Animation Platform). The skill covers core concepts, timing functions, and the plugin ecosystem—producing smooth, performant animations that work across browsers.',
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
        output: "Here's a GSAP ScrollTrigger animation that fades in your hero section as the user scrolls:\n\n```javascript\ngsap.from('.hero', {\n  scrollTrigger: {\n    trigger: '.hero',\n    start: 'top 80%',\n    end: 'top 20%',\n    scrub: 1\n  },\n  opacity: 0,\n  y: 100,\n  duration: 1,\n  ease: 'power3.out'\n});\n```\n\nThe animation produces a smooth fade-in effect with upward movement as the hero section enters the viewport."
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
    description: 'Build MCP (Model Context Protocol) servers that let LLMs interact with external services.',
    longDescription: 'Build custom MCP servers that connect your AI assistant to external APIs and services. The skill covers design, implementation, and testing.',
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
        output: "I'll create a FastMCP server for weather data:\n\n```python\nfrom fastmcp import FastMCP\nimport httpx\n\nmcp = FastMCP('weather-server')\n\n@mcp.tool()\nasync def get_weather(city: str) -> dict:\n    \"\"\"Get current weather for a city.\"\"\"\n    async with httpx.AsyncClient() as client:\n        response = await client.get(\n            f'https://api.weather.com/v1/current',\n            params={'city': city}\n        )\n        return response.json()\n\nif __name__ == '__main__':\n    mcp.run()\n```\n\nThe tool lets Claude fetch real-time weather data."
      },
      {
        prompt: "How do I handle errors in MCP tools?",
        output: "Use structured error handling with descriptive messages:\n\n```python\nfrom fastmcp import FastMCP\nfrom fastmcp.exceptions import ToolError\n\nmcp = FastMCP('my-server')\n\n@mcp.tool()\nasync def fetch_data(id: str) -> dict:\n    if not id:\n        raise ToolError('ID is required')\n    \n    try:\n        result = await database.get(id)\n        if not result:\n            raise ToolError(f'No data found for ID: {id}')\n        return result\n    except ConnectionError:\n        raise ToolError('Database connection failed')\n```\n\nToolError messages appear to the user, so make them helpful and actionable."
      }
    ]
  },
  {
    id: 'monorepo-manager',
    name: 'Monorepo Manager',
    description: 'Manage monorepo workspaces with Turborepo, Nx, or pnpm workspaces. Covers build caching, dependency management, and package publishing workflows.',
    longDescription: 'Apply best practices for monorepo management with Turborepo, Nx, and pnpm workspaces. Configure build pipelines, optimize caching strategies, manage cross-package dependencies, and streamline your development workflow.',
    category: 'development',
    tags: ['monorepo', 'turborepo', 'nx', 'workspaces', 'build-optimization'],
    icon: '⬡',
    color: 'oklch(0.72 0.16 260)',
    skillFile: `${GITHUB_RAW_BASE}/monorepo-manager.md`,
    features: [
      'Turborepo configuration and pipeline setup',
      'Nx workspace optimization',
      'pnpm workspaces and dependency management',
      'Build caching and remote-cache strategies',
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
        output: "I'll help you set up Turborepo with remote caching:\n\n```json\n// turbo.json\n{\n  \"$schema\": \"https://turbo.build/schema.json\",\n  \"globalDependencies\": [\"**/.env.*local\"],\n  \"pipeline\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],\n      \"outputs\": [\"dist/**\", \".next/**\"]\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"],\n      \"outputs\": [\"coverage/**\"]\n    },\n    \"lint\": {\n      \"outputs\": []\n    },\n    \"dev\": {\n      \"cache\": false,\n      \"persistent\": true\n    }\n  },\n  \"remoteCache\": {\n    \"signature\": true\n  }\n}\n```\n\nEnable remote caching:\n```bash\nnpx turbo login\nnpx turbo link\n```\n\nThe configuration sets up build pipelines with proper dependency ordering and enables remote caching for faster CI/CD builds."
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
    longDescription: 'Create your own skills that extend AI coding assistants. The skill covers structure, best practices, and patterns for building effective skills that provide specialized knowledge and workflows.',
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
    longDescription: 'Automate code generation with Cursor. Trigger AI-powered generation, extract and organize files, validate against project standards, and commit with attribution.',
    category: 'development',
    tags: ['cursor', 'code-generation', 'automation', 'validation', 'scaffolding'],
    featured: true,
    icon: '⬢',
    color: 'oklch(0.73 0.19 155)',
    skillFile: `${GITHUB_RAW_BASE}/code-generation-pipeline.md`,
    features: [
      'Cursor integration for AI code generation',
      'Code extraction and organization by type',
      'Project-standards validation (lint, format, and types)',
      'Auto-commit with attribution',
      'Multi-file generation workflows'
    ],
    useCases: [
      'Scaffolding React components with tests',
      'Generating API endpoints and routes',
      'Creating boilerplate for features',
      'Automating test-suite generation',
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
        output: "Creating a complete user management API:\n\n```typescript\n// src/api/users/users.controller.ts\nimport { Router } from 'express';\nimport { UsersService } from './users.service';\n\nconst router = Router();\nconst usersService = new UsersService();\n\nrouter.get('/', async (req, res) => {\n  const users = await usersService.findAll();\n  res.json(users);\n});\n\nrouter.post('/', async (req, res) => {\n  const user = await usersService.create(req.body);\n  res.status(201).json(user);\n});\n\nexport { router as usersRouter };\n```\n\nGenerated structure:\n- users.controller.ts (HTTP handlers)\n- users.service.ts (business logic)\n- users.repository.ts (data access)\n- users.types.ts (TypeScript types)\n- __tests__/ (unit and integration tests)\n\nValidation: All linting, type checks, and tests passed ✓"
      }
    ]
  },
  {
    id: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Create algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Build flow fields, particle systems, and generative visuals.',
    longDescription: 'Generate algorithmic artwork with p5.js. Produce reproducible generative art through seeded randomness, explore parameter spaces, and build visual systems like flow fields and particle simulations.',
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
        output: "Here's a p5.js flow field with particles:\n\n```javascript\nlet particles = [];\nlet flowField;\nlet cols, rows;\nlet scale = 20;\n\nfunction setup() {\n  createCanvas(800, 600);\n  cols = floor(width / scale);\n  rows = floor(height / scale);\n  flowField = new Array(cols * rows);\n  \n  for (let i = 0; i < 500; i++) {\n    particles.push(new Particle());\n  }\n}\n\nfunction draw() {\n  background(0, 10);\n  \n  let yoff = 0;\n  for (let y = 0; y < rows; y++) {\n    let xoff = 0;\n    for (let x = 0; x < cols; x++) {\n      let angle = noise(xoff, yoff) * TWO_PI * 2;\n      let v = p5.Vector.fromAngle(angle);\n      flowField[x + y * cols] = v;\n      xoff += 0.1;\n    }\n    yoff += 0.1;\n  }\n  \n  particles.forEach(p => {\n    p.follow(flowField);\n    p.update();\n    p.show();\n  });\n}\n```\n\nThe result: particle trails following Perlin noise vectors."
      },
      {
        prompt: "Generate a seeded random color palette",
        output: "Using seeded randomness for reproducible palettes:\n\n```javascript\nfunction setup() {\n  createCanvas(400, 100);\n  randomSeed(42); // Change seed for different palettes\n  noLoop();\n}\n\nfunction draw() {\n  let palette = generatePalette(5);\n  let w = width / palette.length;\n  \n  palette.forEach((c, i) => {\n    fill(c);\n    noStroke();\n    rect(i * w, 0, w, height);\n  });\n}\n\nfunction generatePalette(count) {\n  let baseHue = random(360);\n  return Array.from({length: count}, (_, i) => {\n    let h = (baseHue + i * 30) % 360;\n    let s = random(60, 90);\n    let b = random(70, 100);\n    return color(h, s, b);\n  });\n}\n```\n\nSeed 42 always produces the same palette—ideal for reproducible art."
      }
    ]
  },
  {
    id: 'business-panel',
    name: 'Business Panel',
    description: 'Multi-expert business strategy panel synthesizing Christensen, Porter, Drucker, Godin, and more. Supports sequential, debate, and Socratic modes.',
    longDescription: 'Access a panel of business strategy experts: Clayton Christensen, Michael Porter, Peter Drucker, and Seth Godin. Analyze business challenges from multiple angles through sequential, debate, and Socratic modes.',
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
      'Framework-driven strategic analysis'
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
        output: "**Business Panel Analysis: SaaS Pricing Strategy**\n\n**Clayton Christensen (Disruption Theory):**\nYour pricing should consider where you sit on the disruption curve. Are you targeting overserved customers with a cheaper solution? Or serving underserved markets?\n\n**Michael Porter (Competitive Strategy):**\nExamine your competitive positioning. Premium pricing signals differentiation, while cost leadership requires operational efficiency. Your pricing must align with your strategic choice.\n\n**Peter Drucker (Management):**\nPrice is what customers pay; value is what they receive. Focus on the results your product delivers. What business outcomes justify your price point?\n\n**Seth Godin (Marketing):**\nPricing is a story. A $99/month price tells a different story than $97. Consider what narrative your pricing creates and whether it resonates with your tribe.\n\n**Synthesis:**\nConsider a value-based pricing model with tiers that serve different customer segments, allowing you to capture both price-sensitive and premium customers."
      }
    ]
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality. Generate creative, polished UI that avoids generic AI aesthetics.',
    longDescription: 'Create visually distinctive frontend interfaces. The skill emphasizes design quality, creative UI patterns, and production-ready code with thoughtful typography, spacing, and visual hierarchy.',
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
    description: 'Extract text and tables from PDFs, create documents, merge and split files, and process forms.',
    longDescription: 'Work with PDF documents programmatically. Extract text and tables, create new PDFs, merge documents, split pages, and process fillable forms.',
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
    description: 'Create and edit documents with tracked changes, comments, formatting preservation, and text extraction.',
    longDescription: 'Work with Microsoft Word documents programmatically. Create documents, edit with tracked changes, manage comments, preserve formatting, and extract text.',
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
      'Template-driven document creation',
      'Bulk document processing'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.1.0',
    lastUpdated: '2025-12-20'
  },
  {
    id: 'pptx',
    name: 'Presentations',
    description: 'Create, edit, and analyze presentations. Work with layouts, speaker notes, and slide design.',
    longDescription: 'Create and edit PowerPoint presentations programmatically. Build slides with layouts, add speaker notes, apply design themes, and extract content from existing presentations.',
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
    description: 'Create, edit, and analyze spreadsheets with formulas, formatting, data analysis, and visualization.',
    longDescription: 'Work with Excel spreadsheets and CSV files. Create workbooks with formulas, apply conditional formatting, perform data analysis, and generate charts.',
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
    description: 'Interact with and test local web applications using Playwright. Verify frontend functionality and capture browser screenshots.',
    longDescription: 'Test web applications with Playwright. Interact with pages, verify functionality across browsers, capture screenshots, and automate user flows.',
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
      'Visual-regression testing',
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
    description: 'Create visual art in PNG and PDF using design philosophy. Build posters, art pieces, and static visuals.',
    longDescription: 'Create static artwork using canvas-based rendering. Apply design principles to generate posters, art pieces, and visual compositions. Export as PNG or PDF.',
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
    description: 'Create animated GIFs optimized for Slack with file-size constraints, validation tools, and animation concepts.',
    longDescription: 'Create animated GIFs that work in Slack. The skill accounts for Slack\'s file-size and dimension constraints, provides validation tools to ensure compatibility, and guides you through animation concepts to create engaging, loop-friendly GIFs for team communication.',
    category: 'creative',
    tags: ['gif', 'slack', 'animation'],
    icon: '◌',
    color: 'oklch(0.70 0.18 350)',
    skillFile: `${GITHUB_RAW_BASE}/slack-gif-creator.md`,
    features: [
      'Slack-optimized file-size constraints',
      'GIF validation and testing',
      'Frame-rate optimization',
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
    description: 'Style artifacts with themes. Ten preset themes with colors and fonts for slides, docs, reports, and landing pages.',
    longDescription: 'Apply a curated collection of 10 pre-designed themes for consistent styling across your artifacts. Each theme includes color palettes, typography pairings, and design tokens for slides, documents, reports, and landing pages.',
    category: 'creative',
    tags: ['themes', 'styling', 'design-system'],
    icon: '◐',
    color: 'oklch(0.72 0.14 100)',
    skillFile: `${GITHUB_RAW_BASE}/theme-factory.md`,
    features: [
      'Ten curated theme presets',
      'Color palette definitions',
      'Typography pairings',
      'Cross-artifact consistency',
      'Design-token system'
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
    longDescription: 'Co-author important documents with structured workflows. The skill guides you through creating documentation, proposals, technical specifications, and decision documents with clear processes for drafting, reviewing, and iterating on content.',
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
    longDescription: 'Craft effective internal communications. Write clear, professional status reports, leadership updates, company newsletters, FAQ documents, and incident reports that keep teams informed and aligned.',
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
    longDescription: 'Create compelling copy that converts. Craft persuasive content for homepages, landing pages, pricing pages, feature pages, and product pages with attention to headlines, value propositions, and calls to action.',
    category: 'business',
    tags: ['marketing', 'copy', 'conversion'],
    icon: '◓',
    color: 'oklch(0.68 0.16 45)',
    skillFile: `${GITHUB_RAW_BASE}/copywriting.md`,
    features: [
      'Headline and tagline writing',
      'Value proposition crafting',
      'Call-to-action optimization',
      'Benefit-driven messaging',
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
    description: 'Browse and select fonts from Google Fonts or curated pairings. Find the right typography for design projects.',
    longDescription: 'Discover and select fonts for your projects. The skill provides access to Google Fonts along with curated font pairings, helping you find typography combinations that work well together for headings, body text, and accent elements.',
    category: 'creative',
    tags: ['fonts', 'typography', 'design'],
    icon: 'Aa',
    color: 'oklch(0.64 0.08 280)',
    skillFile: `${GITHUB_RAW_BASE}/typography-selector.md`,
    features: [
      'Google Fonts integration',
      'Curated font pairings',
      'Heading and body-text combinations',
      'Font-weight recommendations',
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
    description: 'Streamlined Git workflows for common development tasks. Handle branching strategies, commit conventions, and merge-conflict resolution.',
    longDescription: 'Follow Git best practices for version control. A community-contributed skill covering branching strategies like GitFlow and trunk-based development, conventional commit messages, interactive rebasing, cherry-picking, and efficient merge-conflict resolution.',
    category: 'development',
    tags: ['git', 'version-control', 'workflow', 'branching'],
    icon: '⎇',
    color: 'oklch(0.68 0.16 30)',
    skillFile: `${GITHUB_RAW_BASE}/git-workflow.md`,
    features: [
      'GitFlow and trunk-based branching',
      'Conventional commit-message formatting',
      'Interactive rebase and cherry-picking',
      'Merge-conflict resolution strategies',
      'Git history cleanup',
      'Git hooks and automation'
    ],
    useCases: [
      'Managing feature branches',
      'Cleaning up commit history',
      'Resolving merge conflicts',
      'Setting up Git workflows',
      'Code-review preparation'
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
    description: 'Optimize SQL queries and database performance through execution-plan analysis, index suggestions, and query rewriting.',
    longDescription: 'Identify and fix performance bottlenecks in your database queries. Analyze execution plans, suggest optimal indexes, rewrite inefficient queries, detect N+1 query problems, and apply database-specific optimizations for PostgreSQL, MySQL, SQL Server, and more.',
    category: 'development',
    tags: ['sql', 'database', 'performance', 'optimization'],
    icon: '⬢',
    color: 'oklch(0.70 0.15 190)',
    features: [
      'Analyze query-execution plans',
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
    description: 'Generate API documentation from code. Create OpenAPI/Swagger specs, markdown docs, and SDK references for REST APIs.',
    longDescription: 'Generate API documentation from your codebase. Automatically create OpenAPI/Swagger specifications, produce markdown API documentation, document REST endpoints, and create client SDK references. Supports TypeScript, Python, and Go.',
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
      'Support for TypeScript, Python, and Go'
    ],
    useCases: [
      'Documenting REST APIs',
      'Creating API reference guides',
      'Generating SDK documentation',
      'Maintaining up-to-date API specs',
      'Generating API documentation from code automatically'
    ],
    compatibility: ['gemini', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'cicd-builder',
    name: 'CI/CD Builder',
    description: 'Create CI/CD pipelines and automation workflows for GitHub Actions, GitLab CI, and more. Build multi-stage pipelines, deployment automation, and code-quality checks.',
    longDescription: 'Create continuous-integration and deployment pipelines. Build GitHub Actions workflows, GitLab CI configurations, and other automation pipelines with best practices for testing, building, and deploying your applications.',
    category: 'development',
    tags: ['cicd', 'github-actions', 'automation', 'devops'],
    icon: '⚙',
    color: 'oklch(0.72 0.16 180)',
    skillFile: `${GITHUB_RAW_BASE}/cicd-builder.md`,
    features: [
      'GitHub Actions workflow templates',
      'GitLab CI/CD configuration',
      'Multi-stage build pipelines',
      'Deployment-automation workflows',
      'Testing and linting integration',
      'Environment and secrets management'
    ],
    useCases: [
      'Setting up automated testing pipelines',
      'Creating deployment workflows',
      'Building release automation',
      'Automating code-quality checks',
      'Configuring multi-environment deployments'
    ],
    compatibility: ['gemini', 'claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Create a GitHub Actions workflow for a Node.js app with testing and deployment",
        output: "Here's a comprehensive GitHub Actions workflow for Node.js:\n\n```yaml\nname: CI/CD Pipeline\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      - run: npm ci\n      - run: npm test\n      - run: npm run lint\n\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Deploy to production\n        env:\n          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}\n        run: npm run deploy\n```\n\nThe workflow runs tests and linting on every push, then deploys to production when code merges to main."
      },
      {
        prompt: "Set up a multi-stage Docker build pipeline with caching",
        output: "Here's a GitHub Actions workflow with optimized Docker builds:\n\n```yaml\nname: Docker Build\n\non:\n  push:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Set up Docker Buildx\n        uses: docker/setup-buildx-action@v3\n      \n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_TOKEN }}\n      \n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: myapp:latest\n          cache-from: type=registry,ref=myapp:buildcache\n          cache-to: type=registry,ref=myapp:buildcache,mode=max\n```\n\nLayer caching speeds up builds."
      }
    ]
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Automated code review with best practices. Identify code smells, suggest refactoring improvements, check for security issues, and enforce coding standards.',
    longDescription: 'Maintain code quality through automated analysis. Identify code smells, suggest refactoring, check for security vulnerabilities, enforce coding standards, and recommend performance optimizations.',
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
      'Pull-request code reviews',
      'Code-quality audits',
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
    description: 'Create charts and data visualizations using D3.js and Chart.js. Build interactive dashboards and analytics displays, and export to SVG/PNG with responsive layouts.',
    longDescription: 'Create interactive charts and graphs with D3.js and Chart.js. Transform data into visual stories with responsive layouts.',
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
    longDescription: 'Craft effective emails for any business context. The skill provides templates for various scenarios, tone-adjustment capabilities (formal to casual), follow-up email sequences, cold-outreach templates, and response-drafting assistance to ensure your email communications are clear, professional, and effective.',
    category: 'business',
    tags: ['email', 'communication', 'professional', 'writing'],
    icon: '✉',
    color: 'oklch(0.66 0.13 85)',
    skillFile: `${GITHUB_RAW_BASE}/email-drafter.md`,
    features: [
      'Professional email templates',
      'Tone adjustment (formal/casual)',
      'Follow-up email sequences',
      'Cold-outreach templates',
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
    longDescription: 'Build, test, and understand regular expressions across multiple programming languages. Construct complex regex patterns, test them against sample data, translate patterns into plain-English explanations, and access a common-pattern library for frequently used validations.',
    category: 'development',
    tags: ['regex', 'patterns', 'validation', 'parsing'],
    icon: '◇',
    color: 'oklch(0.72 0.16 140)',
    skillFile: `${GITHUB_RAW_BASE}/regex-builder.md`,
    features: [
      'Build complex regex patterns',
      'Test against sample data',
      'Explain regex in plain English',
      'Common-pattern library',
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
    longDescription: 'Create, visualize, and manage database structures. Design schemas visually, generate SQL migrations, create entity-relationship diagrams (ERDs), and normalize database structures following best practices. Supports PostgreSQL, MySQL, and SQLite with production-ready migration scripts.',
    category: 'development',
    tags: ['database', 'schema', 'sql', 'erd'],
    icon: '◫',
    color: 'oklch(0.72 0.16 160)',
    skillFile: `${GITHUB_RAW_BASE}/schema-designer.md`,
    features: [
      'Visual database-schema design',
      'SQL migration generation',
      'ERD creation',
      'Database normalization',
      'PostgreSQL, MySQL, and SQLite support'
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
    id: 'cursor-agent-orchestrator',
    name: 'Cursor Agent Orchestrator',
    description: 'Chain multiple Cursor agent operations and batch-process files. Enable complex multi-step agent workflows with dependency management.',
    longDescription: 'Orchestrate multi-step agent workflows in Cursor IDE. Chain operations, batch-process files, manage task dependencies, and implement error recovery with retry logic.',
    category: 'development',
    tags: ['cursor', 'agent', 'orchestration', 'automation', 'workflow'],
    featured: true,
    icon: '◎',
    color: 'oklch(0.72 0.17 150)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-agent-orchestrator.md`,
    features: [
      'Chain multiple agent operations in sequence',
      'Batch-process files through agent mode',
      'Dependency management with execution ordering',
      'Error recovery and automatic retry logic',
      'Operation monitoring and result logging',
      'Parallel execution for independent operations'
    ],
    useCases: [
      'Large-scale codebase migrations',
      'Multi-step refactoring workflows',
      'Batch code-quality improvements',
      'Sequential documentation generation',
      'Automated test-suite creation'
    ],
    compatibility: ['cursor', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Chain operations to refactor code and add tests",
        output: "I'll create a workflow that refactors code first, then adds tests:\n\n```typescript\nconst workflow = {\n  name: 'refactor-and-test',\n  operations: [\n    {\n      id: 'refactor',\n      description: 'Refactor to modern patterns',\n      files: ['src/**/*.ts'],\n      prompt: 'Refactor to use async/await and TypeScript best practices'\n    },\n    {\n      id: 'add-tests',\n      description: 'Add unit tests',\n      files: ['src/**/*.ts'],\n      prompt: 'Add comprehensive unit tests using Jest',\n      dependsOn: ['refactor']\n    }\n  ]\n}\n\nawait orchestrator.run(workflow)\n```\n\nThe test operation waits for refactoring to finish before running."
      },
      {
        prompt: "Batch process multiple files with error handling",
        output: "Here's how to process multiple files with retry logic:\n\n```typescript\nconst batchOperation = {\n  id: 'add-logging',\n  description: 'Add error logging',\n  files: [\n    'src/routes/users.ts',\n    'src/routes/posts.ts',\n    'src/routes/auth.ts'\n  ],\n  prompt: 'Add comprehensive error logging',\n  retries: 2,\n  timeout: 300000 // 5 minutes\n}\n\nawait orchestrator.runOperation(batchOperation)\n```\n\nThe operation processes all files with automatic retry on failure."
      }
    ]
  },
  {
    id: 'imessage',
    name: 'iMessage',
    description: 'Manage iMessage conversations with database queries and AppleScript automation. Find unreplied threads, search contacts, read history, and send messages.',
    longDescription: 'Manage iMessages through direct database access and AppleScript. Find unreplied threads, search contacts, read conversation history, and send messages with confirmation.',
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
      'Handle group-chat participants'
    ],
    useCases: [
      'Catching up on unreplied messages',
      'Finding the right contact to message',
      'Reading conversation context before replying',
      'Sending messages hands-free',
      'Managing group-chat communications'
    ],
    compatibility: ['claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-26'
  },
  {
    id: 'cursor-rules-generator',
    name: 'Smart .cursor/rules Generator',
    description: 'Auto-generate AI rules from coding patterns and project characteristics. Create project-specific AI rules that match your team\'s coding style.',
    longDescription: 'Analyze your codebase to detect coding patterns, naming conventions, and architectural decisions, then generate AI-specific rules that guide code generation to match your project\'s established patterns. Track rule effectiveness and version changes over time.',
    category: 'development',
    tags: ['cursor', 'ai-rules', 'code-analysis', 'automation', 'patterns'],
    featured: true,
    icon: '◉',
    color: 'oklch(0.72 0.16 150)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-rules-generator.md`,
    features: [
      'Analyze coding patterns across a project',
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
        output: "I'll analyze your React project patterns:\n\n1. Scanning components for naming conventions...\n2. Detecting import/export patterns...\n3. Identifying TypeScript usage...\n\nBased on 147 files analyzed:\n- 98 percent functional components with hooks\n- PascalCase for components, camelCase for utilities\n- Absolute imports with @ alias\n- Props interfaces defined before components\n\nGenerated rules saved to .cursor/rules with:\n- Component-structure guidelines\n- Naming conventions\n- Import organization\n- TypeScript patterns\n- Testing co-location requirements"
      },
      {
        prompt: "Compare my current .cursor/rules effectiveness with the previous version",
        output: "Comparing rule versions:\n\n**v1.0 (three months ago)**\n- Code consistency: 75 percent\n- Review time: baseline\n- Pattern compliance: 68 percent\n\n**v2.0 (current)**\n- Code consistency: 92 percent (+17 points)\n- Review time: 35 percent faster\n- Pattern compliance: 87 percent (+19 points)\n\n**Key improvements:**\n- Added specific TypeScript patterns\n- Clarified component-structure rules\n- Included error-handling guidelines\n\n**Recommendations:**\n- Update state-management section (detected new patterns)\n- Add accessibility rules (low compliance detected)\n- Consider splitting into domain-specific rule files"
      }
    ]
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Conduct deep research with citations and sources. Summarize papers, compare sources, and create research reports.',
    longDescription: 'Research any topic in depth. Find credible sources, verify information, summarize academic papers, and synthesize insights into reports with citations.',
    category: 'productivity',
    tags: ['research', 'analysis', 'citations', 'knowledge'],
    icon: '◉',
    color: 'oklch(0.68 0.16 250)',
    features: [
      'In-depth topic research across multiple sources',
      'Source citation and verification',
      'Research-paper and academic-content summaries',
      'Multi-source comparison and synthesis',
      'Structured research-report creation'
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
  },
  {
    id: 'ai-rules-manager',
    name: 'AI Rules Manager',
    description: 'Generate, version, and manage .cursor/rules files with automatic pattern learning. Create scoped AI instructions from codebase patterns.',
    longDescription: 'Learn project conventions automatically and create scoped AI instructions from your codebase patterns. Generate, version-control, and manage .cursor/rules files, track rule effectiveness, and maintain consistent AI assistance across your project.',
    category: 'development',
    tags: ['ai', 'cursor', 'rules', 'automation', 'patterns'],
    featured: false,
    icon: '⚙',
    color: 'oklch(0.68 0.16 210)',
    skillFile: `${GITHUB_RAW_BASE}/ai-rules-manager.md`,
    features: [
      'Auto-generate rules from code patterns',
      'Version control and comparison',
      'Quick-rule templates',
      'Rule-effectiveness tracking',
      'Pattern learning from codebase'
    ],
    useCases: [
      'Creating project-specific AI guidelines',
      'Maintaining consistent code patterns',
      'Tracking rule compliance',
      'Versioning AI instructions',
      'Team-wide AI configuration'
    ],
    compatibility: ['claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Generate cursor rules from my React codebase",
        output: "I'll analyze your codebase patterns and generate appropriate rules:\n\n```markdown\n# React TypeScript Project Rules\n\n## Component Patterns\n- Use functional components with TypeScript\n- Prefer named exports for components\n- Use React.FC or explicit return types\n- Organize components in feature-based folders\n\n## State Management\n- Use hooks (useState, useReducer) for local state\n- Use Context API for app-wide state\n\n## Styling\n- Follow detected styling approach (e.g., CSS modules, styled-components, or utility classes)\n- Maintain consistent spacing patterns\n\n## Testing\n- Write tests using React Testing Library\n- Aim for 80%+ code coverage\n```\n\nThe rules reflect patterns detected in your existing components."
      },
      {
        prompt: "Compare cursor rules between v1.0.0 and v1.1.0",
        output: "Here's the diff between rule versions:\n\n```diff\n# v1.0.0 → v1.1.0 Changes\n\n## Added\n+ - Mandatory test coverage requirements (80%+)\n+ - Performance budget rules for API endpoints\n+ - Security scanning requirements\n\n## Changed\n~ - Updated TypeScript config to strict mode\n~ - Modified component structure guidelines\n\n## Removed\n- - Class component patterns (deprecated)\n```\n\nVersion 1.1.0 adds stricter quality requirements and removes deprecated patterns."
      }
    ]
  },
  {
    id: 'codebase-context-builder',
    name: 'Codebase Context Builder',
    description: 'Analyze project structure and generate AI context for Cursor rules. Improve AI understanding of project architecture and coding patterns.',
    longDescription: 'Analyze codebases and generate AI-friendly documentation. Understand project structure, extract architectural patterns, analyze dependencies, and create effective Cursor rules that improve AI-assistant understanding of your codebase.',
    category: 'development',
    tags: ['analysis', 'architecture', 'documentation', 'cursor', 'ai-context'],
    featured: false,
    icon: '◉',
    color: 'oklch(0.72 0.17 180)',
    skillFile: `${GITHUB_RAW_BASE}/codebase-context-builder.md`,
    features: [
      'Project-structure analysis',
      'Dependency mapping and analysis',
      'Architectural-pattern detection',
      'Cursor rules generation',
      'Architectural-decision extraction',
      'Automated codebase documentation'
    ],
    useCases: [
      'Creating Cursor rules for new projects',
      'Documenting project architecture for AI',
      'Analyzing unfamiliar codebases',
      'Generating project context documentation',
      'Extracting coding conventions'
    ],
    compatibility: ['claude', 'cursor', 'windsurf', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'cursor-code-review',
    name: 'Cursor Code Review Assistant',
    description: 'Review AI-generated code for quality and suggest improvements to your AI rules based on output quality. Ensure code meets team standards and continuously improve AI-assistant configurations.',
    longDescription: 'Validate AI-generated code against team standards before committing. The skill analyzes code quality, identifies patterns in issues, suggests improvements to your Cursor AI rules, and tracks quality metrics over time to drive continuous improvement of AI-generated code.',
    category: 'development',
    tags: ['code-review', 'cursor', 'quality', 'standards', 'ai-rules'],
    featured: true,
    icon: '✓',
    color: 'oklch(0.70 0.16 280)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-code-review.md`,
    features: [
      'Pre-commit quality-review process',
      'Team-standards validation',
      'AI rules improvement suggestions',
      'Quality-metrics tracking',
      'Context-aware code analysis'
    ],
    useCases: [
      'Reviewing generated code before commit',
      'Checking against team coding standards',
      'Improving Cursor AI rules configuration',
      'Tracking code-quality trends',
      'Setting up automated code-review workflows'
    ],
    compatibility: ['cursor', 'claude', 'windsurf'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Review the authentication code I just generated before I commit",
        output: "## Code Review: Authentication Module\n\n### ✅ Strengths\n- Proper TypeScript types used throughout\n- Password hashing implemented correctly\n- JWT token generation follows best practices\n\n### ⚠️ Issues Found\n1. Missing error handling in `login()` function\n   - Line 45: API call not wrapped in try-catch\n   - Recommendation: Add error handling with specific error types\n\n2. Hard-coded JWT secret\n   - Line 23: Secret stored in code\n   - Recommendation: Move to environment variables\n\n### 📋 Before Committing\n- [ ] Fix error handling in login function\n- [ ] Move JWT secret to .env\n- [ ] Add rate limiting (or create follow-up ticket)\n- [ ] Add tests for error cases"
      },
      {
        prompt: "Check if the new API endpoints follow our team standards",
        output: "✅ PASS: TypeScript strict mode\n✅ PASS: Async/await used consistently\n✅ PASS: Proper error handling\n⚠️ WARN: Some files with more than 200 lines (api/users.ts: 245 lines)\n❌ FAIL: Missing input validation on three endpoints\n❌ FAIL: No authentication checks on public routes\n\n## Required Changes:\n1. Add input validation using Zod or Joi\n2. Split large files into smaller modules\n3. Add authentication middleware to protected routes"
      }
    ]
  },
  {
    id: 'cursor-driven-refactoring',
    name: 'Cursor-Driven Refactoring',
    description: 'Batch refactoring operations using Cursor agents with validation and rollback. Run safe, large-scale code transformations with automated testing.',
    longDescription: 'Leverage Cursor\'s agent mode for large-scale code transformations. The skill includes change tracking, automated validation, test running, and rollback capabilities to ensure safe refactoring operations across entire codebases.',
    category: 'development',
    tags: ['refactoring', 'cursor', 'agent', 'testing', 'validation'],
    icon: '⟲',
    color: 'oklch(0.70 0.15 150)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-driven-refactoring.md`,
    features: [
      'Batch refactoring via Cursor agent',
      'Automated change tracking',
      'Test validation after changes',
      'Rollback capability on failure',
      'Summary-report generation'
    ],
    useCases: [
      'Renaming functions across codebase',
      'Restructuring file organization',
      'Extracting components or utilities',
      'Consolidating duplicate code',
      'Safe large-scale code changes'
    ],
    compatibility: ['claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    contributor: {
      name: 'newth.ai'
    }
  },
  {
    id: 'cursor-git-workflow',
    name: 'Cursor ↔ Git Workflow',
    description: 'Integrate Cursor AI editor with Git workflows. Generate branch-specific contexts, create PR-based rules, validate with Git hooks, and auto-stash changes.',
    longDescription: 'Integrate Cursor AI editor with Git-based development workflows. Generate branch-specific .cursorrules automatically, create context from PR changes, validate AI-generated code with pre-commit hooks, and manage experimental changes with auto-stash functionality.',
    category: 'development',
    tags: ['cursor', 'git', 'workflow', 'automation', 'ai-editor'],
    icon: '⟲',
    color: 'oklch(0.72 0.20 260)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-git-workflow.md`,
    features: [
      'Branch-specific context generation',
      'PR-based Cursor-rule creation',
      'Git hooks for AI code validation',
      'Auto-stash experimental changes',
      'Conventional-commit enforcement'
    ],
    useCases: [
      'Generate Cursor rules from Git branch changes',
      'Create context from GitHub PR for code review',
      'Validate AI-generated code before commits',
      'Auto-stash experimental Cursor changes',
      'Maintain branch-focused AI context'
    ],
    compatibility: ['claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    contributor: {
      name: 'newth.ai',
      github: 'n3wth'
    }
  },
  {
    id: 'cursor-linear-bridge',
    name: 'Cursor ↔ Linear Bridge',
    description: 'Create Cursor workspaces from Linear issues with bidirectional sync. Connect issue tracking with development context.',
    longDescription: 'Bridge Linear issue tracking with Cursor development environments. Generate workspaces from Linear issues automatically, create issue-specific .cursor/rules files, and maintain bidirectional sync with smart comments and status updates.',
    category: 'development',
    tags: ['cursor', 'linear', 'workflow', 'automation', 'integration'],
    icon: '↔',
    color: 'oklch(0.72 0.17 200)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-linear-bridge.md`,
    features: [
      'Workspace generation from Linear issues',
      'Auto-generated issue-specific rules',
      'Bidirectional sync between tools',
      'Smart Linear comments with progress updates',
      'Context preservation across platforms'
    ],
    useCases: [
      'Starting work on Linear issues',
      'Automating workspace setup',
      'Syncing development progress to Linear',
      'Maintaining issue context in IDE',
      'Streamlining the issue-to-code workflow'
    ],
    compatibility: ['claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'cursor-project-bootstrapper',
    name: 'Cursor Project Bootstrapper',
    description: 'Create new Cursor workspaces with pre-configured rules, extensions, and settings. Automate workspace initialization for different project types with context-aware configuration.',
    longDescription: 'Set up Cursor IDE workspaces for different project types including React, Python, Monorepo, and more. Configure .cursor/rules with project-specific AI instructions, set up team-synchronized settings, and follow framework conventions.',
    category: 'development',
    tags: ['cursor', 'workspace', 'setup', 'configuration', 'templates'],
    icon: '◉',
    color: 'oklch(0.70 0.20 200)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-project-bootstrapper.md`,
    features: [
      'Template-based setup for React, Python, Monorepo, and more',
      'Auto-populate .cursor/rules with project-specific AI instructions',
      'Sync settings across team members',
      'Support for different framework conventions',
      'Extension recommendations per project type'
    ],
    useCases: [
      'Initialize new Cursor workspace for React project',
      'Set up Python FastAPI project with Cursor configuration',
      'Bootstrap monorepo with team-wide Cursor settings',
      'Configure Cursor for Next.js App Router',
      'Sync workspace settings across development team'
    ],
    compatibility: ['claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'cursor-project-scanner',
    name: 'Cursor Project Scanner',
    description: 'Audit Cursor configuration health and identify configuration gaps across projects. Ensure all projects have optimal Cursor configuration.',
    longDescription: 'Audit Cursor IDE configurations across projects. Scan multiple projects to identify missing or outdated .cursor/rules files, generate compliance reports, and ensure consistent Cursor setup across your development environment with automated health checks.',
    category: 'development',
    tags: ['cursor', 'configuration', 'audit', 'devtools'],
    icon: '⚙',
    color: 'oklch(0.72 0.17 200)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-project-scanner.md`,
    features: [
      'Configuration-health audit across projects',
      'Missing-rules detection',
      'Outdated-configuration identification',
      'Compliance-report generation',
      'Multi-project scanning support'
    ],
    useCases: [
      'Auditing team Cursor configurations',
      'Finding projects with missing setup',
      'Ensuring configuration consistency',
      'Generating compliance reports',
      'Automating configuration checks'
    ],
    compatibility: ['claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Scan all my projects for Cursor configuration",
        output: "I'll create a scanner to audit your projects:\n\n```bash\n#!/bin/bash\nPROJECTS_DIR=\"$HOME/projects\"\n\nfor project in \"$PROJECTS_DIR\"/*; do\n  if [ -d \"$project\" ]; then\n    echo \"Checking: $(basename \"$project\")\"\n    \n    if [ -d \"$project/.cursor\" ]; then\n      echo \"  ✓ .cursor directory found\"\n      \n      if [ -f \"$project/.cursor/rules\" ]; then\n        echo \"  ✓ .cursor/rules file exists\"\n      else\n        echo \"  ✗ Missing .cursor/rules file\"\n      fi\n    else\n      echo \"  ✗ No Cursor configuration found\"\n    fi\n  fi\ndone\n```\n\nThe script checks each project for Cursor configuration and reports any gaps."
      },
      {
        prompt: "Generate a compliance report for Cursor configurations",
        output: "I'll create a Python script to generate a detailed compliance report:\n\n```python\nimport os\nimport json\nfrom pathlib import Path\nfrom datetime import datetime\n\nclass CursorScanner:\n    def scan_project(self, project_path):\n        result = {\n            'name': project_path.name,\n            'has_cursor_dir': (project_path / '.cursor').exists(),\n            'has_rules': (project_path / '.cursor' / 'rules').exists(),\n            'status': 'missing'\n        }\n        \n        if result['has_rules']:\n            result['status'] = 'healthy'\n        elif result['has_cursor_dir']:\n            result['status'] = 'partial'\n        \n        return result\n    \n    def generate_report(self, projects_dir):\n        results = []\n        for item in Path(projects_dir).iterdir():\n            if item.is_dir():\n                results.append(self.scan_project(item))\n        \n        return {\n            'generated': datetime.now().isoformat(),\n            'projects': results,\n            'summary': {\n                'total': len(results),\n                'healthy': sum(1 for r in results if r['status'] == 'healthy')\n            }\n        }\n\nscanner = CursorScanner()\nreport = scanner.generate_report(os.path.expanduser('~/projects'))\nprint(json.dumps(report, indent=2))\n```\n\nThe script creates a JSON report showing configuration health across all projects."
      }
    ]
  },
  {
    id: 'cursor-usage-analytics',
    name: 'Cursor Usage Analytics',
    description: 'Track Cursor usage patterns, model preferences, and code-quality improvements. Optimize your AI-assisted development workflow through data-driven insights.',
    longDescription: 'Understand how you use Cursor\'s AI features to optimize configuration, reduce costs, and improve code quality. Track agent modes, analyze code patterns, and measure the impact of AI assistance on your development workflow.',
    category: 'development',
    tags: ['cursor', 'analytics', 'ai-coding', 'metrics', 'optimization'],
    featured: false,
    icon: '▤',
    color: 'oklch(0.72 0.15 220)',
    skillFile: `${GITHUB_RAW_BASE}/cursor-usage-analytics.md`,
    features: [
      'Track agent modes and usage patterns',
      'Analyze code-generation quality',
      'Measure productivity improvements',
      'Optimize AI model costs',
      'Pattern recognition and templates'
    ],
    useCases: [
      'Monitor Cursor usage across projects',
      'Optimize model selection for cost',
      'Track code-quality improvements',
      'Identify common code patterns',
      'Generate usage reports'
    ],
    compatibility: ['cursor', 'claude'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    samplePrompts: [
      {
        prompt: "Set up basic Cursor usage tracking",
        output: "I'll help you create a simple usage tracker:\n\n```python\nfrom cursor_analytics import CursorAnalytics\n\nanalytics = CursorAnalytics()\nanalytics.log_session(\n    mode='composer',\n    model='claude-3.5-sonnet',\n    tokens_used=2500,\n    code_lines=45,\n    duration_minutes=15\n)\n\n# Get weekly summary\nsummary = analytics.get_usage_summary(days=7)\nprint(f\"Sessions: {summary['total_sessions']}\")\nprint(f\"Lines generated: {summary['total_lines']}\")\n```"
      },
      {
        prompt: "How can I optimize my Cursor costs?",
        output: "Here's how to track and optimize costs:\n\n```python\nfrom cost_optimizer import CostOptimizer\n\noptimizer = CostOptimizer()\nbreakdown = optimizer.get_cost_breakdown(days=30)\nprint(f\"Monthly cost: ${breakdown['total_cost']:.2f}\")\n\n# Get optimization suggestions\nsuggestions = optimizer.suggest_optimizations()\nfor tip in suggestions['suggestions']:\n    print(f\"💡 {tip}\")\n```\n\nTips:\n- Use claude-3.5-sonnet for most tasks\n- Reserve opus for complex refactoring\n- Track which models you use most"
      }
    ]
  },
  {
    id: 'extension-sync',
    name: 'Extension Sync Tool',
    description: 'Export and sync Cursor extensions and settings across machines. Maintain consistent development environments with centralized configuration management.',
    longDescription: 'Manage Cursor extensions and settings across multiple machines. Create backups, sync configurations via Git, and restore development environments with automated scripts for cross-platform support.',
    category: 'development',
    tags: ['cursor', 'extensions', 'sync', 'settings', 'backup'],
    icon: '⟲',
    color: 'oklch(0.72 0.17 180)',
    skillFile: `${GITHUB_RAW_BASE}/extension-sync.md`,
    features: [
      'Export installed extensions with versions',
      'Sync settings.json and keybindings',
      'Automated backup with timestamps',
      'Selective extension restore',
      'Cross-platform support (macOS, Windows, and Linux)'
    ],
    useCases: [
      'Setting up new development machines',
      'Maintaining consistent team environments',
      'Backing up extension configurations',
      'Version-controlling editor settings',
      'Disaster recovery for development setup'
    ],
    compatibility: ['gemini', 'claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    contributor: {
      name: 'newth.ai'
    }
  },
  {
    id: 'settings-distribution-manager',
    name: 'Settings Distribution Manager',
    description: 'Deploy Cursor settings and rules to your entire team with version management. Standardize Cursor configuration across development teams with managed rollouts and automated updates.',
    longDescription: 'Manage and deploy Cursor IDE settings across development teams. The skill provides scripts and workflows for centralized settings management, version control, automated deployment, deprecation tracking, and compliance monitoring to ensure consistent development environments.',
    category: 'development',
    tags: ['cursor', 'settings', 'configuration', 'team', 'deployment'],
    featured: false,
    icon: '⚙',
    color: 'oklch(0.70 0.15 280)',
    skillFile: `${GITHUB_RAW_BASE}/settings-distribution-manager.md`,
    features: [
      'Centralized settings repository with Git version control',
      'Automated deployment scripts for team machines',
      'Version management with rollback capability',
      'Auto-detect and update deprecated rules',
      'Adoption tracking and compliance monitoring',
      'Multi-environment support'
    ],
    useCases: [
      'Standardizing IDE configuration across a team',
      'Deploying consistent Cursor settings',
      'Managing rule versions and updates',
      'Tracking team adoption of standards',
      'Enforcing development-environment compliance',
      'Rolling back problematic settings changes'
    ],
    compatibility: ['claude', 'cursor'],
    version: '1.0.0',
    lastUpdated: '2026-01-27'
  },
  {
    id: 'vscode-cursor-sync',
    name: 'VSCode ↔ Cursor Sync',
    description: 'Mirror VSCode keybindings, extensions, and settings to Cursor to maintain a consistent development environment between editors.',
    longDescription: 'Maintain consistent development environments between VSCode and Cursor editors. The skill provides workflows for syncing keybindings, extensions, settings, themes, and snippets across both editors, with support for manual, automated, and real-time synchronization strategies.',
    category: 'development',
    tags: ['vscode', 'cursor', 'sync', 'settings', 'extensions'],
    featured: false,
    icon: '⇄',
    color: 'oklch(0.72 0.16 200)',
    skillFile: `${GITHUB_RAW_BASE}/vscode-cursor-sync.md`,
    features: [
      'Keybindings synchronization',
      'Extension mirroring across editors',
      'Settings and workspace sync',
      'Theme and color-scheme sharing',
      'Custom-snippet transfer',
      'Automated sync scripts'
    ],
    useCases: [
      'Migrating from VSCode to Cursor',
      'Maintaining consistent editor config',
      'Syncing custom keybindings',
      'Transferring extensions between editors',
      'Setting up team development environments'
    ],
    compatibility: ['claude', 'cursor', 'copilot'],
    version: '1.0.0',
    lastUpdated: '2026-01-27',
    contributor: {
      name: 'newth.ai'
    },
    samplePrompts: [
      {
        prompt: "Help me sync my VSCode settings to Cursor",
        output: "I'll help you sync your VSCode settings to Cursor. Here's the process:\n\n1. First, let's copy your settings file:\n```bash\ncp ~/Library/Application\\ Support/Code/User/settings.json \\\n   ~/Library/Application\\ Support/Cursor/User/settings.json\n```\n\n2. Next, copy your keybindings:\n```bash\ncp ~/Library/Application\\ Support/Code/User/keybindings.json \\\n   ~/Library/Application\\ Support/Cursor/User/keybindings.json\n```\n\n3. Finally, sync your extensions:\n```bash\ncode --list-extensions | xargs -L 1 cursor --install-extension\n```\n\nRestart Cursor to see your VSCode settings applied."
      },
      {
        prompt: "Create a script to automatically sync my editors",
        output: "Here's an automated sync script for macOS/Linux:\n\n```bash\n#!/bin/bash\nVSCODE_DIR=\"$HOME/Library/Application Support/Code/User\"\nCURSOR_DIR=\"$HOME/Library/Application Support/Cursor/User\"\n\necho \"Syncing VSCode → Cursor...\"\n\n# Backup existing settings\ntimestamp=$(date +%Y%m%d_%H%M%S)\nmkdir -p \"$CURSOR_DIR/backups/$timestamp\"\ncp \"$CURSOR_DIR\"/*.json \"$CURSOR_DIR/backups/$timestamp/\" 2>/dev/null || true\n\n# Copy settings and keybindings\ncp \"$VSCODE_DIR/settings.json\" \"$CURSOR_DIR/settings.json\"\ncp \"$VSCODE_DIR/keybindings.json\" \"$CURSOR_DIR/keybindings.json\"\n\n# Sync extensions\ncode --list-extensions | while read ext; do\n  cursor --install-extension \"$ext\" --force\ndone\n\necho \"✓ Sync complete!\"\n```\n\nSave the file as `sync-editors.sh`, make it executable with `chmod +x sync-editors.sh`, and run it whenever you want to sync."
      }
    ]
  },
]

export const categories = [
  { id: 'all', name: 'All Skills', count: skills.length },
  { id: 'development', name: 'Development', count: skills.filter(s => s.category === 'development').length },
  { id: 'documents', name: 'Documents', count: skills.filter(s => s.category === 'documents').length },
  { id: 'creative', name: 'Creative', count: skills.filter(s => s.category === 'creative').length },
  { id: 'productivity', name: 'Productivity', count: skills.filter(s => s.category === 'productivity').length },
  { id: 'business', name: 'Business', count: skills.filter(s => s.category === 'business').length },
]
