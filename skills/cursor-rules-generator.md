---
name: Smart .cursor/rules Generator
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - ai-rules
  - code-analysis
  - automation
compatibility:
  - claude
  - cursor
  - windsurf
---

# Smart .cursor/rules Generator

Auto-generate AI rules from coding patterns and project characteristics. Create project-specific AI rules that match team coding style and best practices.

## Triggers

Use this skill when the user requests:
- Generating .cursor/rules files
- Analyzing coding patterns
- Creating AI rules from existing code
- Setting up project-specific AI guidelines
- Standardizing team coding practices

Keywords: "cursor rules", "AI rules", "generate rules", "coding patterns", "project style", "team guidelines", "code analysis"

## Features

- **Pattern Analysis**: Automatically detect coding patterns across the entire codebase
- **Style Extraction**: Identify naming conventions, formatting preferences, and architectural patterns
- **Rule Generation**: Create AI-specific rules that match discovered patterns
- **Team Alignment**: Generate rules that reflect team-specific practices and preferences
- **Version Control**: Track rule changes and compare effectiveness over time

## Usage Examples

### Analyze and Generate Rules

```bash
# Step 1: Analyze project patterns
find src -name "*.ts" -o -name "*.tsx" | head -50 | xargs cat | grep -E "(function|const|class|interface)" | head -100

# Step 2: Check existing conventions
grep -r "import" src/ | head -50
grep -r "export" src/ | head -50
```

### Generate Basic .cursor/rules

```markdown
# Project AI Rules

## Code Style

1. **Naming Conventions**
   - Use PascalCase for components: `UserProfile`, `NavigationBar`
   - Use camelCase for functions and variables: `getUserData`, `isLoading`
   - Use UPPER_CASE for constants: `API_ENDPOINT`, `MAX_RETRIES`

2. **Imports**
   - Use absolute imports with @ alias: `import { Button } from '@/components/ui'`
   - Group imports: React, third-party, local components, utilities
   - Sort imports alphabetically within groups

3. **TypeScript**
   - Always use explicit types for function parameters and return values
   - Prefer interfaces over types for object shapes
   - Use type inference for variables when type is obvious

## Architecture Patterns

1. **Component Structure**
   - Functional components with TypeScript
   - Props interface before component definition
   - Export at bottom of file
   
2. **State Management**
   - Use React hooks for local state
   - Context API for shared state
   - Avoid prop drilling beyond 2 levels

## File Organization

- Components in `src/components/`
- Utilities in `src/lib/`
- Types in `src/types/`
- One component per file
- Co-locate tests with source files
```

### Advanced Pattern Detection

```javascript
// Detect common patterns
const patterns = {
  componentStyle: /function\s+([A-Z][a-zA-Z]*)|const\s+([A-Z][a-zA-Z]*)\s*=.*=>/, 
  importStyle: /import.*from\s+['"](@\/|\.\.\/|\.\/)/,
  exportStyle: /(export\s+default|export\s+{|export\s+const)/,
  stateManagement: /(useState|useContext|useReducer|useEffect)/,
  errorHandling: /(try\s*{|catch\s*\(|throw\s+new)/
}

// Example: Analyze component patterns
function analyzeComponents(fileContents) {
  const analysis = {
    functionalComponents: 0,
    classComponents: 0,
    hooks: new Set(),
    exportStyle: {}
  }
  
  fileContents.forEach(content => {
    if (content.match(/function\s+[A-Z]/)) analysis.functionalComponents++
    if (content.match(/class\s+[A-Z].*extends.*Component/)) analysis.classComponents++
    
    const hookMatches = content.match(/use[A-Z][a-zA-Z]*/g)
    if (hookMatches) hookMatches.forEach(hook => analysis.hooks.add(hook))
  })
  
  return analysis
}
```

### Versioned Rules with Metadata

```markdown
---
version: 2.1.0
generated: 2026-01-27
project: my-react-app
effectiveness: 8.5/10
last_reviewed: 2026-01-20
---

# Project Rules v2.1.0

## Changelog
- v2.1.0: Added error boundary patterns
- v2.0.0: Switched to absolute imports
- v1.5.0: Added accessibility guidelines

## Performance Metrics
- Code consistency: 92%
- Pattern compliance: 87%
- Review time reduction: 35%

## Rules

[Your generated rules here]
```

## Pattern Categories to Analyze

### 1. Naming Conventions
```bash
# Detect component naming
find src/components -name "*.tsx" -exec basename {} .tsx \;

# Detect function naming  
grep -r "function " src/ | sed 's/.*function \([a-zA-Z_]*\).*/\1/' | sort | uniq -c

# Detect variable naming
grep -r "const \|let \|var " src/ | head -100
```

### 2. Import/Export Patterns
```bash
# Analyze import statements
grep -r "^import" src/ | cut -d':' -f2 | sort | uniq -c | sort -rn

# Check default vs named exports
grep -r "export default" src/ | wc -l
grep -r "export {" src/ | wc -l
grep -r "export const" src/ | wc -l
```

### 3. Architectural Patterns
```bash
# Detect React patterns
grep -r "useState\|useEffect\|useContext" src/

# Find data fetching patterns
grep -r "fetch\|axios\|async.*await" src/

# Identify error handling
grep -r "try\|catch\|throw" src/
```

### 4. Code Organization
```bash
# Directory structure analysis
tree src/ -L 3 -d

# File naming patterns
find src/ -type f | sed 's/.*\///' | sed 's/\..*//' | sort

# Co-location patterns
find src/ -name "*.test.*" -o -name "*.spec.*"
```

## Rule Template Structure

```markdown
# .cursor/rules

## Code Organization

### File Structure
- [Pattern detected]: [Rule to follow]
- Example: "Components use index.ts for exports" → "Always create index.ts barrel files"

### Naming Conventions
- [Category]: [Pattern]
- Components: PascalCase (detected in 95% of files)
- Utilities: camelCase (detected in 89% of files)

## TypeScript Patterns

### Type Definitions
- [Pattern]: [Rule]
- Example: "Interfaces for props" → "Always define Props interface for components"

### Type Safety
- Strict mode enabled (detected in tsconfig.json)
- No implicit any (detected in 100% of analyzed files)

## Framework-Specific

### React Patterns
- Functional components: 98% usage
- Hooks preference: useState, useEffect, useMemo
- Testing: Co-located .test.tsx files

### State Management
- [Detected pattern]: [When to use]
- Local state: useState for component state
- Global state: Context API for app-wide state

## Quality Standards

### Code Reviews
- [Pattern]: [Requirement]
- All functions have JSDoc comments (detected in 75% of files)
- Error handling in async functions (detected in 90% of cases)

### Testing
- Test files co-located with source
- Use React Testing Library
- Minimum 80% coverage for utilities
```

## Effectiveness Tracking

### Metrics to Monitor

```typescript
interface RuleEffectiveness {
  version: string
  generatedDate: string
  metrics: {
    codeConsistency: number // % of code following patterns
    reviewTimeReduction: number // % time saved in reviews
    patternCompliance: number // % new code following rules
    developerSatisfaction: number // Team feedback score
  }
  issues: {
    ambiguousRules: string[]
    conflictingPatterns: string[]
    outdatedRules: string[]
  }
  recommendations: string[]
}
```

### Compare Rule Versions

```bash
# Track rule evolution
git log -p .cursor/rules

# Compare effectiveness
echo "v1.0.0: Consistency 75%, Review time -20%"
echo "v2.0.0: Consistency 87%, Review time -35%"
echo "v2.1.0: Consistency 92%, Review time -40%"
```

## Best Practices

### 1. Regular Updates
- **Review quarterly**: Coding practices evolve, rules should too
- **After major refactors**: Update rules to reflect new patterns
- **Team feedback**: Incorporate developer suggestions

### 2. Balance Specificity
- **Too vague**: "Write good code" (not helpful)
- **Too specific**: "All functions must be exactly 15 lines" (too rigid)
- **Just right**: "Functions should be focused and single-purpose (typically 10-30 lines)"

### 3. Evidence-Based Rules
- **Don't guess**: Analyze actual codebase patterns
- **Show examples**: Include code snippets that demonstrate patterns
- **Quantify**: "95% of components use functional style" is better than "prefer functional"

### 4. Make Rules Actionable
- **Bad**: "Code should be maintainable"
- **Good**: "Extract complex logic into named utility functions with descriptive names"

### 5. Version Control
- Track rule changes in git
- Document why rules changed
- Keep effectiveness metrics
- Archive old rule versions for comparison

### 6. Team Collaboration
- Involve team in rule generation
- Review and discuss proposed rules
- Iterate based on real usage
- Make rules evolving, not static

## Common Patterns to Detect

### TypeScript Projects
- Strict mode settings
- Interface vs type preference
- Enum usage patterns
- Generic type patterns
- Type guard patterns

### React Projects
- Component composition patterns
- Hook usage and custom hooks
- Context patterns
- Error boundary usage
- Prop passing patterns

### Node.js Projects
- Module system (ESM vs CommonJS)
- Error handling patterns
- Async patterns
- Logging conventions
- Environment variable usage

### API Projects
- Route structure
- Error response format
- Validation approach
- Authentication patterns
- Rate limiting strategy

## Integration with AI Assistants

Once generated, place your rules file at:
- **Cursor**: `.cursor/rules`
- **Windsurf**: `.windsurf/rules`
- **General**: `.ai/rules` or `AI_RULES.md`

The AI assistant will automatically read and apply these rules when generating code, ensuring consistency with your project's established patterns.
