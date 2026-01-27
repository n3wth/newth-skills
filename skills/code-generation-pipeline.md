---
name: Code Generation Pipeline
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - code-generation
  - automation
  - validation
  - scaffolding
compatibility:
  - claude
  - cursor
  - windsurf
  - copilot
---

# Code Generation Pipeline

Streamline boilerplate and scaffold generation with automatic validation. Trigger Cursor code generation, extract and organize generated code, validate against project standards, and auto-commit with proper attribution.

## Triggers

Use this skill when the user requests:
- Generating new files or components with Cursor
- Scaffolding boilerplate code
- Automating code generation workflows
- Validating and committing generated code
- Creating multiple related files at once

Keywords: "cursor", "generate", "scaffold", "boilerplate", "code generation", "auto-commit", "template", "component generation"

## Features

- **Cursor Integration**: Trigger and coordinate Cursor's AI code generation
- **Code Extraction**: Parse and organize generated code by type (components, utilities, tests, etc.)
- **Project Standards Validation**: Ensure generated code follows linting, formatting, and architectural rules
- **Auto-Commit Workflow**: Automatically stage, commit, and attribute generated code
- **Multi-file Generation**: Generate related files together (component + test + styles)

## Code Generation Workflow

### 1. Trigger Generation

Initiate Cursor code generation for specific patterns:

```bash
# Generate a React component with tests
cursor generate component UserProfile --with-tests

# Scaffold a complete feature module
cursor generate module authentication --include-routes --include-tests

# Create boilerplate for API endpoint
cursor generate api-endpoint /api/users --method POST
```

### 2. Extract and Organize

Parse generated code and organize by type:

```bash
# Extract generated files
/src/components/UserProfile.tsx
/src/components/__tests__/UserProfile.test.tsx
/src/styles/UserProfile.module.css

# Organize by convention
components/
  UserProfile/
    index.tsx
    UserProfile.test.tsx
    UserProfile.styles.css
```

### 3. Validate Against Standards

Run project-specific validations:

```bash
# Run linter
npm run lint -- src/components/UserProfile.tsx

# Check formatting
npm run format:check -- src/components/UserProfile.tsx

# Verify TypeScript types
tsc --noEmit src/components/UserProfile.tsx

# Run architectural checks
npm run arch:lint
```

### 4. Auto-Commit with Attribution

Commit generated code with proper context:

```bash
git add src/components/UserProfile/
git commit -m "feat(components): add UserProfile component

Generated using Cursor AI
- React component with TypeScript
- Unit tests with Vitest
- Scoped CSS modules
- Accessible ARIA attributes

Co-authored-by: Cursor AI <cursor@cursor.sh>"
```

## Usage Examples

### Example 1: Generate React Component

**Prompt**: "Generate a Card component with TypeScript and tests"

**Workflow**:
1. Trigger Cursor generation for Card component
2. Extract files: `Card.tsx`, `Card.test.tsx`, `Card.module.css`
3. Validate with ESLint and TypeScript
4. Auto-commit with attribution

**Generated Structure**:
```
src/components/Card/
├── index.ts              # Barrel export
├── Card.tsx             # Component implementation
├── Card.test.tsx        # Unit tests
├── Card.stories.tsx     # Storybook stories (optional)
└── Card.module.css      # Scoped styles
```

### Example 2: Scaffold API Route

**Prompt**: "Create a REST API for user management with CRUD operations"

**Workflow**:
1. Generate controller, service, and repository files
2. Extract and organize into feature folder
3. Validate against API design patterns
4. Run integration tests
5. Commit with detailed message

**Generated Structure**:
```
src/api/users/
├── users.controller.ts   # HTTP handlers
├── users.service.ts      # Business logic
├── users.repository.ts   # Data access
├── users.types.ts        # TypeScript types
├── users.validation.ts   # Request validation
└── __tests__/
    ├── users.controller.test.ts
    └── users.service.test.ts
```

### Example 3: Generate Test Suite

**Prompt**: "Generate comprehensive tests for the authentication module"

**Workflow**:
1. Analyze existing auth code structure
2. Generate unit, integration, and e2e tests
3. Validate test coverage thresholds
4. Commit with test coverage report

## Validation Checklist

Before committing generated code, validate:

- [ ] **Linting**: No ESLint errors or warnings
- [ ] **Formatting**: Prettier/formatted correctly
- [ ] **Type Safety**: No TypeScript errors
- [ ] **Tests**: All tests pass
- [ ] **Coverage**: Meets minimum coverage threshold (e.g., 80%)
- [ ] **Architecture**: Follows project structure conventions
- [ ] **Dependencies**: No unapproved packages added
- [ ] **Security**: No vulnerabilities in new code
- [ ] **Accessibility**: ARIA attributes where needed (for UI components)
- [ ] **Documentation**: JSDoc comments for public APIs

## Best Practices

### Generation Prompts

Be specific and include context:

**Good**:
```
Generate a UserProfile React component with:
- TypeScript props interface
- Avatar, name, and bio fields
- Loading and error states
- Unit tests with Vitest
- Accessible ARIA labels
```

**Bad**:
```
Make a user profile component
```

### Code Organization

Follow consistent patterns:

```
# Feature-based organization
src/features/
  auth/
    components/
    hooks/
    services/
    types/
    __tests__/

# Layer-based organization
src/
  components/
  services/
  utils/
  types/
  __tests__/
```

### Commit Messages

Use conventional commits with attribution:

```bash
feat(feature): add new capability

Generated using Cursor AI
- Implementation details
- Key decisions
- Related files

Co-authored-by: Cursor AI <cursor@cursor.sh>
```

### Validation Automation

Use git hooks to validate before commit:

```bash
# .husky/pre-commit
npm run lint-staged
npm run type-check
npm run test:changed
```

## Dependencies

### Required Tools

- **Cursor IDE**: For AI code generation
- **Git**: Version control
- **Node.js**: For JavaScript/TypeScript projects
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Optional Tools

- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files
- **Vitest/Jest**: Testing framework
- **Storybook**: Component documentation

## Configuration

### ESLint Setup

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Git Hooks

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
npm run type-check
npm run test -- --run
```

## Advanced Patterns

### Multi-Step Generation

Chain multiple generations together:

```bash
# 1. Generate data models
cursor generate models User Post Comment

# 2. Generate services based on models
cursor generate services --based-on models/

# 3. Generate API routes
cursor generate api --based-on services/

# 4. Generate tests for everything
cursor generate tests --for src/
```

### Template Customization

Create custom generation templates:

```javascript
// .cursor/templates/react-component.js
module.exports = {
  files: [
    {
      path: 'components/{{name}}/{{name}}.tsx',
      template: 'react-component.tsx.hbs'
    },
    {
      path: 'components/{{name}}/{{name}}.test.tsx',
      template: 'react-test.tsx.hbs'
    },
    {
      path: 'components/{{name}}/{{name}}.module.css',
      template: 'component-styles.css.hbs'
    }
  ]
}
```

### Validation Pipeline

Automate comprehensive validation:

```bash
#!/bin/bash
# validate-generated-code.sh

echo "Running validation pipeline..."

# 1. Lint
npm run lint || exit 1

# 2. Format check
npm run format:check || exit 1

# 3. Type check
npm run type-check || exit 1

# 4. Tests
npm run test -- --coverage || exit 1

# 5. Build check
npm run build || exit 1

# 6. Security audit
npm audit --audit-level=moderate || exit 1

echo "✅ All validations passed!"
```

## Troubleshooting

### Generation Fails

- Verify Cursor is installed and authenticated
- Check project dependencies are installed
- Ensure templates are properly configured
- Review Cursor logs for errors

### Validation Errors

- Run linter/formatter to auto-fix issues
- Check TypeScript configuration
- Verify test setup and dependencies
- Review architectural rules

### Commit Attribution

- Configure Git user details
- Use `Co-authored-by` trailer in commit messages
- Include generation context in commit body
- Tag commits with generation metadata

## Related Skills

- **Git Workflow**: Advanced Git operations and strategies
- **MCP Builder**: Build tools that integrate with Cursor
- **Webapp Testing**: Comprehensive testing patterns
- **TypeScript Patterns**: Advanced TypeScript usage
