import type { Skill } from './skills'

export interface SkillTemplate {
  id: string
  name: string
  description: string
  category: Skill['category']
  icon: string
  color: string
  tags: string[]
  features: string[]
  useCases: string[]
  compatibility: ('gemini' | 'claude')[]
  skillContent: string
}

export const skillTemplates: SkillTemplate[] = [
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Generate code snippets, functions, or entire modules based on specifications.',
    category: 'development',
    icon: '{ }',
    color: 'oklch(0.75 0.18 145)',
    tags: ['code', 'generation', 'automation'],
    features: [
      'Generate boilerplate code',
      'Create functions from descriptions',
      'Support multiple languages',
      'Follow best practices',
      'Include documentation'
    ],
    useCases: [
      'Scaffolding new projects',
      'Creating utility functions',
      'Generating API endpoints',
      'Building component templates',
      'Writing database queries'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "generate code"
- "create function"
- "scaffold"

## Instructions
When generating code:
1. Ask for the target language if not specified
2. Follow language-specific conventions and best practices
3. Include type annotations where applicable
4. Add inline documentation for complex logic
5. Consider edge cases and error handling

## Output Format
- Provide clean, well-formatted code
- Include usage examples
- Explain key design decisions
- Suggest potential improvements

## Example
\`\`\`
User: Generate a function to validate email addresses
Output: [TypeScript function with regex validation, type safety, and error handling]
\`\`\`
`
  },
  {
    id: 'refactoring',
    name: 'Code Refactoring',
    description: 'Improve existing code structure, readability, and performance without changing behavior.',
    category: 'development',
    icon: '~>',
    color: 'oklch(0.70 0.15 200)',
    tags: ['refactoring', 'optimization', 'clean-code'],
    features: [
      'Identify code smells',
      'Apply design patterns',
      'Improve naming conventions',
      'Reduce complexity',
      'Enhance testability'
    ],
    useCases: [
      'Legacy code modernization',
      'Performance optimization',
      'Reducing technical debt',
      'Improving maintainability',
      'Preparing for testing'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "refactor"
- "clean up"
- "improve code"
- "optimize"

## Instructions
When refactoring code:
1. First understand the existing behavior
2. Identify specific issues (complexity, duplication, naming)
3. Apply appropriate refactoring patterns
4. Preserve all existing functionality
5. Suggest tests to verify behavior

## Refactoring Patterns
- Extract Method: Break down large functions
- Rename: Use descriptive, meaningful names
- Simplify Conditionals: Reduce nested if/else
- Remove Duplication: DRY principle
- Introduce Parameter Object: Group related parameters

## Output Format
- Show before/after comparison
- Explain each change made
- Highlight potential risks
- Suggest follow-up improvements
`
  },
  {
    id: 'documentation',
    name: 'Documentation Generator',
    description: 'Create comprehensive documentation for code, APIs, and projects.',
    category: 'documents',
    icon: 'Aa',
    color: 'oklch(0.60 0.15 25)',
    tags: ['documentation', 'readme', 'api-docs'],
    features: [
      'Generate README files',
      'Create API documentation',
      'Write inline code comments',
      'Produce user guides',
      'Build changelog entries'
    ],
    useCases: [
      'Open source projects',
      'Internal documentation',
      'API reference guides',
      'Onboarding materials',
      'Release notes'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "document"
- "write readme"
- "create docs"
- "explain code"

## Instructions
When creating documentation:
1. Identify the target audience (developers, users, stakeholders)
2. Use clear, concise language
3. Include practical examples
4. Structure content logically
5. Keep documentation up-to-date with code

## Documentation Types
- **README**: Project overview, setup, usage
- **API Docs**: Endpoints, parameters, responses
- **Code Comments**: Inline explanations for complex logic
- **Guides**: Step-by-step tutorials
- **Changelog**: Version history and changes

## Output Format
- Use appropriate markdown formatting
- Include code examples with syntax highlighting
- Add diagrams where helpful
- Provide links to related resources
`
  },
  {
    id: 'testing',
    name: 'Test Generator',
    description: 'Create comprehensive test suites including unit, integration, and end-to-end tests.',
    category: 'development',
    icon: '[]',
    color: 'oklch(0.72 0.16 160)',
    tags: ['testing', 'unit-tests', 'tdd'],
    features: [
      'Generate unit tests',
      'Create integration tests',
      'Build E2E test scenarios',
      'Mock dependencies',
      'Achieve code coverage'
    ],
    useCases: [
      'Test-driven development',
      'Regression testing',
      'API testing',
      'UI component testing',
      'Performance testing'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "write tests"
- "create test"
- "test this"
- "add coverage"

## Instructions
When generating tests:
1. Identify the testing framework in use
2. Cover happy paths and edge cases
3. Test error handling
4. Mock external dependencies
5. Keep tests focused and independent

## Testing Patterns
- **Arrange-Act-Assert**: Structure each test clearly
- **Given-When-Then**: For BDD-style tests
- **Test Isolation**: Each test should be independent
- **Meaningful Names**: Describe what is being tested

## Output Format
\`\`\`typescript
describe('ComponentName', () => {
  it('should handle expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
\`\`\`
`
  },
  {
    id: 'api-design',
    name: 'API Designer',
    description: 'Design RESTful APIs with proper endpoints, schemas, and documentation.',
    category: 'development',
    icon: '</>',
    color: 'oklch(0.68 0.14 280)',
    tags: ['api', 'rest', 'openapi'],
    features: [
      'Design RESTful endpoints',
      'Create OpenAPI schemas',
      'Define request/response types',
      'Plan authentication',
      'Version API properly'
    ],
    useCases: [
      'New API development',
      'API modernization',
      'Microservices design',
      'Third-party integrations',
      'Mobile backend APIs'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "design api"
- "create endpoint"
- "rest api"
- "api schema"

## Instructions
When designing APIs:
1. Follow REST conventions
2. Use appropriate HTTP methods
3. Design clear resource hierarchies
4. Plan for versioning
5. Consider pagination and filtering

## REST Conventions
- GET: Retrieve resources
- POST: Create new resources
- PUT/PATCH: Update resources
- DELETE: Remove resources

## Output Format
- Endpoint definitions with methods
- Request/response schemas
- Authentication requirements
- Error response formats
- Usage examples
`
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing Assistant',
    description: 'Help with creative writing including stories, scripts, and content creation.',
    category: 'creative',
    icon: '~',
    color: 'oklch(0.72 0.20 330)',
    tags: ['writing', 'creative', 'content'],
    features: [
      'Story development',
      'Character creation',
      'Dialogue writing',
      'Content ideation',
      'Editing assistance'
    ],
    useCases: [
      'Blog post writing',
      'Marketing copy',
      'Story development',
      'Script writing',
      'Social media content'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "write story"
- "create content"
- "help me write"
- "creative writing"

## Instructions
When assisting with creative writing:
1. Understand the tone and style desired
2. Consider the target audience
3. Maintain consistent voice
4. Provide constructive feedback
5. Suggest improvements while preserving intent

## Writing Elements
- **Voice**: Consistent narrative perspective
- **Tone**: Emotional quality of the writing
- **Pacing**: Flow and rhythm of content
- **Structure**: Organization of ideas

## Output Format
- Provide drafts with clear sections
- Offer alternative phrasings
- Highlight areas for improvement
- Suggest next steps
`
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Helper',
    description: 'Assist with data analysis, visualization, and insights extraction.',
    category: 'business',
    icon: '%',
    color: 'oklch(0.65 0.12 220)',
    tags: ['data', 'analysis', 'visualization'],
    features: [
      'Data exploration',
      'Statistical analysis',
      'Visualization recommendations',
      'Insight extraction',
      'Report generation'
    ],
    useCases: [
      'Business intelligence',
      'Market research',
      'Performance metrics',
      'Trend analysis',
      'Decision support'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "analyze data"
- "create chart"
- "find insights"
- "data visualization"

## Instructions
When analyzing data:
1. Understand the business question
2. Identify relevant data points
3. Choose appropriate analysis methods
4. Visualize findings effectively
5. Provide actionable insights

## Analysis Types
- **Descriptive**: What happened?
- **Diagnostic**: Why did it happen?
- **Predictive**: What might happen?
- **Prescriptive**: What should we do?

## Output Format
- Summary of findings
- Key metrics and trends
- Visualization recommendations
- Actionable recommendations
- Limitations and caveats
`
  },
  {
    id: 'productivity',
    name: 'Productivity Workflow',
    description: 'Automate repetitive tasks and create efficient workflows.',
    category: 'productivity',
    icon: '>_',
    color: 'oklch(0.70 0.15 60)',
    tags: ['automation', 'workflow', 'productivity'],
    features: [
      'Task automation',
      'Workflow optimization',
      'Template creation',
      'Process documentation',
      'Time-saving scripts'
    ],
    useCases: [
      'Daily task automation',
      'File organization',
      'Email templates',
      'Meeting preparation',
      'Report generation'
    ],
    compatibility: ['gemini', 'claude'],
    skillContent: `# {{name}}

## Description
{{description}}

## Trigger Words
- "automate"
- "create workflow"
- "save time"
- "productivity"

## Instructions
When creating productivity workflows:
1. Identify repetitive tasks
2. Map out current process
3. Find automation opportunities
4. Create reusable templates
5. Document the workflow

## Automation Principles
- **Simplify**: Remove unnecessary steps
- **Standardize**: Create consistent processes
- **Automate**: Use tools and scripts
- **Measure**: Track time saved

## Output Format
- Step-by-step workflow
- Automation scripts or commands
- Templates for common tasks
- Tips for optimization
`
  }
]

export function getTemplateById(id: string): SkillTemplate | undefined {
  return skillTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: Skill['category']): SkillTemplate[] {
  return skillTemplates.filter(t => t.category === category)
}
