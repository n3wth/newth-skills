---
name: Skill Creator
version: 1.1.0
author: newth.ai
category: development
tags:
  - skills
  - claude
  - automation
compatibility:
  - gemini
  - claude
---

# Skill Creator

Guide for creating effective Claude Code skills with specialized knowledge, workflows, and tool integrations. Build skills that extend AI coding assistants with domain expertise.

## Triggers

Use this skill when the user wants to:
- Create a new skill for Claude or Gemini
- Design a skill structure
- Write skill instructions
- Package domain knowledge as a skill
- Share workflows as reusable skills

Keywords: "create skill", "new skill", "skill template", "skill structure"

## Skill File Structure

Skills are markdown files with YAML frontmatter:

```markdown
---
name: My Skill Name
version: 1.0.0
author: your-name
category: development | documents | creative | productivity | business
tags:
  - tag1
  - tag2
compatibility:
  - claude
  - gemini
---

# Skill Name

Brief description of what the skill does.

## Triggers

When should this skill be activated? List keywords and phrases.

## Features

What capabilities does this skill provide?

## Usage Examples

Code examples and sample prompts.

## Dependencies

Required tools, libraries, or configurations.

## Best Practices

Guidelines for using this skill effectively.
```

## Skill Categories

| Category | Use For |
|----------|---------|
| `development` | Coding, APIs, testing, DevOps |
| `documents` | PDF, Word, Excel, presentations |
| `creative` | Design, art, animation, media |
| `productivity` | Automation, workflows, organization |
| `business` | Strategy, communication, analysis |

## Writing Effective Skills

### 1. Clear Triggers

Define when your skill should activate:

```markdown
## Triggers

Use this skill when the user:
- Asks to create React components
- Mentions "component", "ui", or "interface"
- Needs help with state management

Keywords: "react", "component", "hooks", "state"
```

### 2. Actionable Instructions

Write instructions the AI can follow:

```markdown
## Instructions

When creating React components:
1. Use functional components with hooks
2. Apply TypeScript for type safety
3. Follow naming conventions (PascalCase)
4. Include prop types and defaults
5. Add JSDoc comments for documentation
```

### 3. Concrete Examples

Show input/output pairs:

```markdown
## Example

**User prompt**: Create a button component

**Expected output**:
\```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  )
}
\```
```

### 4. Context and Constraints

Specify what the skill should and shouldn't do:

```markdown
## Constraints

- Always use TypeScript, never plain JavaScript
- Prefer Tailwind CSS over inline styles
- Do not use class components
- Maximum component file size: 200 lines
```

## Skill Installation

Skills are installed via CLI:

```bash
curl -fsSL https://skills.newth.ai/install.sh | bash -s -- skill-id
```

This downloads the skill to `~/.claude/skills/` or the equivalent for your AI assistant.

## Testing Your Skill

1. Create a test conversation with specific prompts
2. Verify the AI follows your instructions
3. Check edge cases and error handling
4. Iterate on instructions based on results

## Example: Complete Skill

```markdown
---
name: React Testing
version: 1.0.0
author: newth.ai
category: development
tags:
  - react
  - testing
  - vitest
compatibility:
  - claude
  - gemini
---

# React Testing

Write comprehensive tests for React components using Vitest and Testing Library.

## Triggers

Use when the user asks to:
- Write tests for React components
- Add test coverage
- Debug failing tests

Keywords: "test", "vitest", "testing library", "coverage"

## Instructions

1. Use Vitest with @testing-library/react
2. Test user interactions, not implementation
3. Use screen queries (getByRole, getByText)
4. Mock external dependencies
5. Test error states and loading states

## Example

**Input**: Write tests for a Counter component

**Output**:
\```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from './Counter'

describe('Counter', () => {
  it('displays initial count', () => {
    render(<Counter initialCount={5} />)
    expect(screen.getByText('Count: 5')).toBeInTheDocument()
  })

  it('increments when clicked', () => {
    render(<Counter initialCount={0} />)
    fireEvent.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
\```

## Dependencies

\```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
\```
```
