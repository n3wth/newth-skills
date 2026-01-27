---
name: Codebase Context Builder
version: 1.0.0
author: newth.ai
category: development
tags:
  - analysis
  - architecture
  - documentation
  - cursor
  - ai-context
compatibility:
  - claude
  - cursor
  - windsurf
  - copilot
---

# Codebase Context Builder

Analyze project structure and generate AI context for Cursor rules. Improve AI assistants' understanding of project architecture, coding patterns, and architectural decisions.

## Triggers

Use this skill when the user wants to:
- Analyze project structure and dependencies
- Generate Cursor rules from codebase
- Create AI context documentation
- Extract architectural patterns and decisions
- Document coding conventions for AI assistants
- Build comprehensive project context

Keywords: "cursor rules", "ai context", "project analysis", "architecture", "codebase analysis", "cursor.ai", ".cursorrules"

## Core Capabilities

### 1. Project Structure Analysis

Analyze directory structure, identify key patterns, and understand project organization.

```bash
# Generate project tree
tree -L 3 -I 'node_modules|dist|build|.git' > structure.txt

# Analyze file distribution
find . -type f -name "*.ts" -o -name "*.tsx" | wc -l
find . -type f -name "*.test.ts" -o -name "*.spec.ts" | wc -l
```

**Analysis Output:**
```
Project Structure:
- Frontend: React + TypeScript (src/components)
- State Management: Context API (src/context)
- Routing: React Router (src/pages)
- Styling: Tailwind CSS
- Testing: Vitest + Testing Library
- Build: Vite
```

### 2. Dependency Analysis

Extract and categorize project dependencies to understand the tech stack.

```bash
# Extract dependencies
cat package.json | jq '.dependencies'
cat package.json | jq '.devDependencies'

# For Python projects
pip list --format=json

# For other ecosystems
# Maven: mvn dependency:tree
# Gradle: ./gradlew dependencies
# Go: go list -m all
```

**Generate Dependency Context:**
```markdown
## Key Dependencies
- React 19.2.0 - UI framework
- TypeScript 5.9 - Type safety
- Tailwind CSS 4.1 - Styling
- Vitest 4.0 - Testing framework
- GSAP 3.14 - Animations
```

### 3. Architecture Pattern Detection

Identify common architectural patterns in the codebase.

```bash
# Detect component patterns
grep -r "export.*function" src/components --include="*.tsx" | head -10

# Find state management patterns
grep -r "useState\|useContext\|useReducer" src --include="*.ts*"

# Identify API patterns
grep -r "fetch\|axios\|api" src --include="*.ts*"
```

**Pattern Documentation:**
```
Architectural Patterns:
1. Component Architecture: Functional components with hooks
2. State Management: React Context + hooks
3. Data Fetching: Fetch API with async/await
4. Styling: Tailwind utility classes
5. File Organization: Feature-based structure
```

### 4. Generate Cursor Rules

Create `.cursorrules` file with comprehensive project context.

**Basic Cursor Rules Template:**
```markdown
# Project: [Project Name]

## Tech Stack
- Framework: [Framework + version]
- Language: [Language + version]
- Build Tool: [Tool]
- Testing: [Framework]

## Project Structure
```
[tree output or structure description]
```

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### Code Style
- Use TypeScript strict mode
- Prefer functional components
- Use named exports over default exports
- Keep components under 200 lines

### State Management
- Use Context API for global state
- useState for local component state
- Avoid prop drilling beyond 2 levels

### Testing
- Unit tests for utilities and hooks
- Component tests for UI
- Aim for 80% coverage

## Architecture Decisions

### Why React?
- Component reusability
- Large ecosystem
- Strong TypeScript support

### Why Tailwind CSS?
- Utility-first approach
- Design consistency
- Fast development

## Common Patterns

### Component Pattern
```typescript
interface Props {
  // Define props
}

export function Component({ prop }: Props) {
  // Component logic
  return <div>...</div>
}
```

### Custom Hook Pattern
```typescript
export function useCustomHook() {
  const [state, setState] = useState()
  // Hook logic
  return { state, actions }
}
```

## Dependencies
[List key dependencies and their purpose]

## External APIs
[Document API integrations]

## Environment Variables
[List required env vars]

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter
```

### 5. Extract Architectural Decisions

Document key architectural decisions and rationale.

```bash
# Search for architecture decision records
find . -name "ADR*.md" -o -name "adr*.md"

# Look for design documentation
find . -name "ARCHITECTURE.md" -o -name "DESIGN.md"

# Extract comments about decisions
grep -r "TODO\|FIXME\|NOTE\|HACK" src --include="*.ts*"
```

**ADR Template:**
```markdown
# ADR: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue we're facing?

## Decision
What did we decide?

## Consequences
What are the impacts (positive and negative)?
```

## Comprehensive Analysis Workflow

### Step 1: Initial Analysis
```bash
# Clone/navigate to project
cd /path/to/project

# Analyze structure
tree -L 3 -I 'node_modules|dist|build'

# Check package manager
ls package.json yarn.lock pnpm-lock.yaml

# Identify language
ls tsconfig.json go.mod requirements.txt pom.xml
```

### Step 2: Dependency Mapping
```bash
# For Node.js
npm list --depth=0

# For Python
pip freeze > requirements.txt

# Analyze imports
grep -r "^import" src --include="*.ts*" | cut -d'"' -f2 | sort | uniq
```

### Step 3: Pattern Extraction
```bash
# Component patterns
find src/components -name "*.tsx" -exec head -20 {} \;

# Hook patterns
grep -A 5 "^export.*use" src --include="*.ts*"

# API patterns
grep -B 2 -A 10 "fetch\|axios" src --include="*.ts*"
```

### Step 4: Generate Cursor Rules
```bash
# Create .cursorrules file
cat > .cursorrules << 'EOF'
[Generated rules based on analysis]
EOF
```

### Step 5: Validate and Refine
- Review generated rules
- Add project-specific conventions
- Include examples from actual code
- Document exceptions and edge cases

## Best Practices

### For Effective Cursor Rules

1. **Be Specific**: Include actual code examples from your codebase
2. **Document Patterns**: Show the "why" not just the "what"
3. **Include Context**: Tech stack, architecture decisions, conventions
4. **Update Regularly**: Keep rules in sync with codebase evolution
5. **Version Control**: Commit `.cursorrules` to git

### For Project Analysis

1. **Start Broad**: Understand overall structure first
2. **Go Deep**: Dive into specific areas as needed
3. **Document Assumptions**: Note what you assume vs. what you know
4. **Verify Patterns**: Confirm patterns with multiple examples
5. **Stay Current**: Re-analyze after major refactors

### For AI Context

1. **Use Clear Language**: Write for AI and humans
2. **Provide Examples**: Show don't just tell
3. **Link Related Concepts**: Connect patterns and practices
4. **Include Anti-Patterns**: Document what to avoid
5. **Add Rationale**: Explain the reasoning behind decisions

## Advanced Techniques

### Automated Analysis Script

```bash
#!/bin/bash
# analyze-project.sh

echo "# Codebase Analysis Report" > analysis.md
echo "" >> analysis.md

echo "## Project Structure" >> analysis.md
tree -L 3 -I 'node_modules|dist|build|.git' >> analysis.md

echo "" >> analysis.md
echo "## File Statistics" >> analysis.md
echo "TypeScript files: $(find . -name '*.ts' -o -name '*.tsx' | wc -l)" >> analysis.md
echo "Test files: $(find . -name '*.test.ts' -o -name '*.spec.ts' | wc -l)" >> analysis.md

echo "" >> analysis.md
echo "## Dependencies" >> analysis.md
if [ -f "package.json" ]; then
  echo "### Runtime" >> analysis.md
  cat package.json | jq '.dependencies' >> analysis.md
  echo "### Dev" >> analysis.md
  cat package.json | jq '.devDependencies' >> analysis.md
fi

echo "Analysis complete! See analysis.md"
```

### Import Graph Generation

```bash
# Generate dependency graph (requires madge)
npm install -g madge
madge --image graph.png src/index.tsx

# Or for circular dependency detection
madge --circular src/
```

### Component Inventory

```bash
# List all components
find src/components -name "*.tsx" | while read file; do
  echo "## $(basename $file .tsx)"
  grep -m 1 "export.*function\|export.*const" "$file"
  echo ""
done > component-inventory.md
```

## Integration with Development Workflow

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Update cursor rules if structure changed
if git diff --cached --name-only | grep -q "src/"; then
  echo "Checking if cursor rules need update..."
  # Run analysis and compare
fi
```

### CI/CD Integration
```yaml
# .github/workflows/docs.yml
name: Update Documentation
on:
  push:
    branches: [main]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Analyze codebase
        run: ./scripts/analyze-project.sh
      - name: Commit updates
        run: |
          git config user.name "Bot"
          git config user.email "bot@example.com"
          git add analysis.md .cursorrules
          git commit -m "Update codebase analysis" || true
          git push
```

## Example Output

### For a React + TypeScript Project

**.cursorrules**
```markdown
# E-commerce Platform

## Stack
- React 19 + TypeScript 5.9
- Vite 7 build tool
- Tailwind CSS 4 for styling
- React Router 7 for navigation
- Zustand for state management
- React Query for data fetching

## Structure
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── api/            # API client and types
├── utils/          # Helper functions
└── types/          # TypeScript types

## Conventions

### Components
- Use functional components with TypeScript
- Props interface named `[Component]Props`
- Export as named export: `export function Component()`
- Keep under 200 lines, split if larger

Example:
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### State Management
- Local state: useState for component-specific
- Global state: Zustand stores in src/store/
- Server state: React Query hooks
- Form state: React Hook Form

### Styling
- Tailwind utility classes only
- No custom CSS unless absolutely necessary
- Use design tokens from tailwind.config.js
- Responsive: mobile-first with sm:, md:, lg: breakpoints

### API Calls
- All API calls in src/api/
- Use React Query for fetching
- Type all API responses
- Handle loading and error states

Example:
```typescript
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products')
      return response.json() as Product[]
    }
  })
}
```

### Testing
- Unit tests: Vitest for utilities
- Component tests: Testing Library
- E2E: Playwright (in e2e/ directory)
- Aim for 80% coverage

### File Naming
- Components: PascalCase.tsx
- Hooks: camelCase.ts (use prefix)
- Utils: camelCase.ts
- Types: camelCase.ts or types.ts
- Tests: *.test.ts(x)

## Architecture Decisions

### Why Zustand over Redux?
- Simpler API, less boilerplate
- Better TypeScript support
- Smaller bundle size
- Easier to test

### Why React Query?
- Handles caching automatically
- Loading/error states built-in
- Optimistic updates support
- Background refetching
```

## Tools and Resources

- **Madge**: Dependency graph visualization
- **Plop**: Component scaffolding
- **jq**: JSON processing for package.json analysis
- **tree**: Directory structure visualization
- **grep/ripgrep**: Pattern searching
- **ast-grep**: AST-based code search

## Related Skills

- **Git Workflow**: For understanding repository structure
- **MCP Builder**: For creating codebase analysis tools
- **Frontend Design**: For understanding UI architecture
