export interface Bundle {
  id: string
  name: string
  description: string
  longDescription: string
  skillIds: string[]
  persona: 'frontend' | 'backend' | 'devops' | 'creator' | 'analyst' | 'founder'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  tags: string[]
  estimatedSetupTime: string
  whatYouCanBuild: string[]
}

export const bundles: Bundle[] = [
  {
    id: 'frontend-starter',
    name: 'Frontend Powerhouse',
    description: 'Everything you need to build stunning, interactive web experiences',
    longDescription: 'Master modern frontend development with AI assistance. Create animated landing pages, design responsive UIs, and build interactive components. Includes GSAP animations, frontend design, typography selection, and live testing tools.',
    skillIds: [
      'gsap-animations',
      'frontend-design',
      'typescript-expert',
      'code-reviewer',
      'webapp-testing',
      'canvas-design',
      'theme-factory',
    ],
    persona: 'frontend',
    difficulty: 'intermediate',
    icon: 'code',
    tags: ['animation', 'design', 'testing', 'ui', 'css'],
    estimatedSetupTime: '5 minutes',
    whatYouCanBuild: [
      'Production-ready animated websites',
      'Responsive design systems',
      'Interactive component libraries',
      'A/B tested landing pages',
      'Accessible web applications',
    ],
  },
  {
    id: 'backend-builder',
    name: 'Backend Builder',
    description: 'Build robust APIs, microservices, and server infrastructure with confidence',
    longDescription: 'Engineer scalable backend systems with AI-powered assistance. Create MCP servers, optimize SQL queries, design APIs, implement CI/CD pipelines, and manage infrastructure. Perfect for fullstack and backend engineers.',
    skillIds: [
      'mcp-builder',
      'sql-optimizer',
      'api-docs-generator',
      'ci-cd-builder',
      'git-workflow',
      'code-reviewer',
      'schema-designer',
    ],
    persona: 'backend',
    difficulty: 'advanced',
    icon: 'gear',
    tags: ['api', 'database', 'infrastructure', 'devops', 'security'],
    estimatedSetupTime: '10 minutes',
    whatYouCanBuild: [
      'High-performance REST/GraphQL APIs',
      'Custom MCP servers for Claude/Gemini',
      'Optimized database queries',
      'Automated deployment pipelines',
      'Service documentation systems',
    ],
  },
  {
    id: 'devops-toolkit',
    name: 'DevOps Command Center',
    description: 'Automate everything. From CI/CD to monitoring, monitoring to recovery',
    longDescription: 'Take control of your infrastructure and deployments. Build CI/CD pipelines, optimize performance, manage containers, track metrics, and automate recovery. Includes code quality tools, documentation generation, and workflow automation.',
    skillIds: [
      'ci-cd-builder',
      'git-workflow',
      'api-docs-generator',
      'performance-profiler',
      'regex-builder',
      'code-reviewer',
      'email-drafter',
    ],
    persona: 'devops',
    difficulty: 'advanced',
    icon: 'rocket',
    tags: ['automation', 'deployment', 'monitoring', 'infrastructure', 'scale'],
    estimatedSetupTime: '15 minutes',
    whatYouCanBuild: [
      'Automated deployment pipelines',
      'Infrastructure-as-Code generators',
      'Monitoring and alerting systems',
      'Container orchestration helpers',
      'Incident response automation',
    ],
  },
  {
    id: 'content-creator',
    name: 'Content Creator Studio',
    description: 'Write, design, and publish professional content at scale',
    longDescription: 'Create compelling content faster. Generate landing pages, presentations, visual designs, social media content, and GIFs. Includes copywriting assistance, design tools, document creation, and multimedia generation.',
    skillIds: [
      'copywriting',
      'canvas-design',
      'slack-gif-creator',
      'pptx',
      'docx',
      'typography-selector',
      'theme-factory',
      'internal-comms',
    ],
    persona: 'creator',
    difficulty: 'beginner',
    icon: 'star',
    tags: ['design', 'writing', 'marketing', 'social', 'visual'],
    estimatedSetupTime: '5 minutes',
    whatYouCanBuild: [
      'Professional marketing copy',
      'Beautiful presentations',
      'Social media graphics & GIFs',
      'Brand-consistent designs',
      'Email campaigns and newsletters',
      'Visual design systems',
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Intelligence Suite',
    description: 'Extract insights, analyze trends, and visualize data stories',
    longDescription: 'Transform raw data into actionable insights. Optimize SQL queries, analyze spreadsheets, create visualizations, generate reports, and build research workflows. Includes database optimization, data viz tools, and research automation.',
    skillIds: [
      'sql-optimizer',
      'xlsx',
      'research-assistant',
      'business-panel',
      'data-visualization',
      'pdf',
      'doc-coauthoring',
    ],
    persona: 'analyst',
    difficulty: 'intermediate',
    icon: 'chart',
    tags: ['analytics', 'database', 'visualization', 'insights', 'reporting'],
    estimatedSetupTime: '8 minutes',
    whatYouCanBuild: [
      'Optimized analytics queries',
      'Interactive data dashboards',
      'Automated reporting systems',
      'Trend analysis reports',
      'Business intelligence workflows',
      'Research compilations',
    ],
  },
  {
    id: 'founder-toolkit',
    name: 'Founder\'s Toolkit',
    description: 'Run your startup with AI superpowers. Strategy to execution.',
    longDescription: 'Everything a founder needs to move fast. Create business strategies, draft investor-ready presentations, write compelling copy, manage operations, and automate workflows. Includes strategic planning, documentation, and communication tools.',
    skillIds: [
      'business-panel',
      'copywriting',
      'pptx',
      'doc-coauthoring',
      'internal-comms',
      'email-drafter',
      'api-docs-generator',
    ],
    persona: 'founder',
    difficulty: 'beginner',
    icon: 'target',
    tags: ['strategy', 'marketing', 'operations', 'communication', 'growth'],
    estimatedSetupTime: '5 minutes',
    whatYouCanBuild: [
      'Investor pitches and decks',
      'Product positioning docs',
      'Marketing campaigns',
      'Operational playbooks',
      'Board update presentations',
      'Customer communication',
    ],
  },
]

export function getBundleById(id: string): Bundle | undefined {
  return bundles.find(b => b.id === id)
}

export function getBundlesByPersona(persona: Bundle['persona']): Bundle[] {
  return bundles.filter(b => b.persona === persona)
}

export function getSkillBundles(skillId: string): Bundle[] {
  return bundles.filter(b => b.skillIds.includes(skillId))
}
