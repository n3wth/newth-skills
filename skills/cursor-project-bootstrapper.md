---
name: Cursor Project Bootstrapper
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - workspace
  - setup
  - configuration
  - templates
compatibility:
  - claude
  - cursor
---

# Cursor Project Bootstrapper

Create new Cursor workspaces with pre-configured rules, extensions, and settings. Automate workspace initialization for different project types with context-aware Cursor configuration.

## Triggers

Use this skill when the user wants to:
- Set up a new Cursor workspace
- Initialize a project with Cursor configuration
- Create .cursor/rules for a specific framework
- Bootstrap a project with team settings
- Configure Cursor for React, Python, Monorepo, or other project types
- Sync Cursor settings across team members

Keywords: "cursor", "workspace", "setup", "bootstrap", "initialize", ".cursor", "cursor rules", "project setup", "cursor config"

## Features

- **Template-Based Setup**: Pre-configured templates for React, Python, Node.js, Monorepo, and more
- **Intelligent .cursor/rules**: Auto-populate AI instructions specific to your framework
- **Team Synchronization**: Share consistent settings across all team members
- **Framework Conventions**: Respect best practices for each tech stack
- **Extension Recommendations**: Suggest relevant Cursor extensions per project type

## Project Templates

### React + TypeScript

**Directory Structure:**
```
project-name/
├── .cursor/
│   ├── rules.md
│   └── settings.json
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── App.tsx
├── public/
├── package.json
└── tsconfig.json
```

**.cursor/rules.md:**
```markdown
# Project: [Project Name]
Stack: React 18 + TypeScript + Vite

## Code Style
- Use functional components with TypeScript
- Prefer named exports over default exports
- Use PascalCase for components, camelCase for functions
- Place types in separate `.types.ts` files when complex
- Use `interface` for object shapes, `type` for unions/intersections

## Component Structure
```typescript
interface ComponentProps {
  title: string
  onClick?: () => void
}

export function Component({ title, onClick }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState()
  
  // Event handlers
  const handleClick = () => {}
  
  // Render
  return <div>{title}</div>
}
```

## State Management
- useState for local component state
- useContext for theme/auth/global state
- React Query for server state
- Zustand for complex client state

## File Naming
- Components: PascalCase.tsx
- Hooks: use*.ts
- Utils: camelCase.ts
- Types: *.types.ts

## Testing
- Write tests with Vitest + Testing Library
- Test user behavior, not implementation
- Mock external dependencies
- Aim for 80%+ coverage on critical paths
```

**.cursor/settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "node_modules": true,
    "dist": true,
    ".turbo": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

### Python + FastAPI

**Directory Structure:**
```
project-name/
├── .cursor/
│   ├── rules.md
│   └── settings.json
├── app/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── main.py
├── tests/
├── pyproject.toml
└── README.md
```

**.cursor/rules.md:**
```markdown
# Project: [Project Name]
Stack: Python 3.11+ + FastAPI + SQLAlchemy

## Code Style
- Follow PEP 8 and PEP 257
- Use type hints for all function signatures
- Use Pydantic models for request/response validation
- Keep functions focused (< 50 lines)
- Use async/await for I/O operations

## Project Structure
```python
# app/main.py
from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="API Name", version="1.0.0")
app.include_router(router)
```

## Type Hints
```python
from typing import Optional, List
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    name: Optional[str] = None

async def create_user(user: UserCreate) -> User:
    ...
```

## Error Handling
- Use FastAPI's HTTPException for API errors
- Create custom exception classes for domain logic
- Always return appropriate HTTP status codes
- Include helpful error messages

## Testing
- Use pytest with pytest-asyncio
- Write unit tests for services
- Write integration tests for API endpoints
- Use fixtures for common test data
- Mock external dependencies

## Dependencies
- Use pyproject.toml for dependency management
- Pin major versions, allow minor updates
- Separate dev dependencies from prod
```

**.cursor/settings.json:**
```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "python.testing.pytestEnabled": true,
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    ".venv": true,
    ".pytest_cache": true
  }
}
```

### Monorepo (Turborepo)

**Directory Structure:**
```
monorepo/
├── .cursor/
│   ├── rules.md
│   └── settings.json
├── apps/
│   ├── web/
│   ├── mobile/
│   └── api/
├── packages/
│   ├── ui/
│   ├── utils/
│   └── tsconfig/
├── turbo.json
└── package.json
```

**.cursor/rules.md:**
```markdown
# Project: [Monorepo Name]
Stack: Turborepo + pnpm workspaces

## Workspace Structure
- `apps/*`: Deployable applications
- `packages/*`: Shared packages/libraries
- Each workspace has its own package.json

## Dependency Management
- Use pnpm for package management
- Shared dependencies go in root package.json
- App-specific dependencies in app's package.json
- Use workspace protocol for internal packages: `"@repo/ui": "workspace:*"`

## Code Sharing
```typescript
// In packages/ui/src/Button.tsx
export function Button() { ... }

// In apps/web/src/App.tsx
import { Button } from '@repo/ui'
```

## Building
- Use Turborepo for build orchestration
- Configure pipelines in turbo.json
- Cache builds for speed
- Build dependencies before dependents

## Adding New Packages
```bash
# Create new package
mkdir packages/new-package
cd packages/new-package
pnpm init

# Add to workspace
# Already configured in pnpm-workspace.yaml
```

## Scripts
- `pnpm build`: Build all packages and apps
- `pnpm dev`: Start all dev servers
- `pnpm test`: Run all tests
- `pnpm lint`: Lint all workspaces

## Import Paths
- Use `@repo/package-name` for internal packages
- Configure TypeScript paths in root tsconfig
- Use relative imports within same package
```

**.cursor/settings.json:**
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true,
    "**/dist": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.turbo": true,
    "**/dist": true
  }
}
```

### Next.js + App Router

**.cursor/rules.md:**
```markdown
# Project: [Project Name]
Stack: Next.js 14+ with App Router

## Directory Structure
```
app/
├── (routes)/
│   ├── page.tsx          # Homepage
│   ├── about/
│   │   └── page.tsx      # /about
│   └── blog/
│       ├── page.tsx      # /blog
│       └── [slug]/
│           └── page.tsx  # /blog/[slug]
├── api/
│   └── route.ts          # API routes
├── layout.tsx
└── globals.css
```

## Naming Conventions
- Use reserved file names: page.tsx, layout.tsx, loading.tsx, error.tsx
- Route groups: (marketing), (app), (auth)
- Dynamic routes: [id], [...slug], [[...slug]]

## Server vs Client Components
- Default to Server Components
- Use 'use client' only when needed:
  - useState, useEffect, event handlers
  - Browser-only APIs
  - Interactive components

## Data Fetching
```typescript
// Server Component (default)
async function Page() {
  const data = await fetch('https://api.example.com')
  return <div>{data}</div>
}

// Client Component
'use client'
export function ClientComponent() {
  const [data, setData] = useState()
  // ...
}
```

## Metadata
```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description'
}
```

## Image Optimization
- Always use next/image
- Specify width and height or use fill
- Use priority for above-fold images
```

### Node.js + Express API

**.cursor/rules.md:**
```markdown
# Project: [API Name]
Stack: Node.js + Express + TypeScript

## Structure
```
src/
├── controllers/   # Request handlers
├── middleware/    # Custom middleware
├── models/        # Data models
├── routes/        # Route definitions
├── services/      # Business logic
├── utils/         # Helper functions
└── app.ts         # Express app setup
```

## Code Style
- Use async/await over callbacks
- Use TypeScript strict mode
- Use Express Router for route organization
- Separate concerns: routes → controllers → services

## Error Handling
```typescript
// Custom error class
class ApiError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ error: err.message })
})
```

## Request Validation
- Use Zod or Joi for request validation
- Validate at the route level
- Return 400 for validation errors

## Security
- Use helmet for security headers
- Enable CORS appropriately
- Rate limit endpoints
- Sanitize user input
- Never commit secrets
```

## Bootstrap Commands

### React + Vite
```bash
# Create project
npm create vite@latest my-app -- --template react-ts

# Initialize Cursor workspace
mkdir -p .cursor
cat > .cursor/rules.md << 'EOF'
# React + TypeScript + Vite Project
[Copy template from above]
EOF

# Install dependencies
npm install
npm install -D @types/node

# Initialize git
git init
git add .
git commit -m "feat: initialize React project with Cursor config"
```

### Python + FastAPI
```bash
# Create project directory
mkdir my-api && cd my-api

# Initialize Python environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic-settings

# Create Cursor config
mkdir -p .cursor
cat > .cursor/rules.md << 'EOF'
# FastAPI Project
[Copy template from above]
EOF

# Initialize git
git init
echo ".venv/" > .gitignore
echo "__pycache__/" >> .gitignore
git add .
git commit -m "feat: initialize FastAPI project with Cursor config"
```

### Monorepo (Turborepo)
```bash
# Create from template
npx create-turbo@latest my-monorepo

# Add Cursor config
cd my-monorepo
mkdir -p .cursor
cat > .cursor/rules.md << 'EOF'
# Turborepo Monorepo
[Copy template from above]
EOF

git add .cursor/
git commit -m "feat: add Cursor workspace configuration"
```

## Team Synchronization

### Sharing Configuration

**Option 1: Git (Recommended)**
```bash
# Commit .cursor/ to version control
git add .cursor/
git commit -m "feat: add Cursor workspace config"
git push

# Team members pull the config
git pull
```

**Option 2: Script**
```bash
#!/bin/bash
# sync-cursor.sh
# Sync Cursor settings from a central template

TEMPLATE_REPO="https://github.com/your-org/cursor-templates.git"
PROJECT_TYPE=${1:-react}

# Clone template
git clone --depth 1 $TEMPLATE_REPO /tmp/cursor-template

# Copy configuration
cp -r /tmp/cursor-template/$PROJECT_TYPE/.cursor ./

# Cleanup
rm -rf /tmp/cursor-template

echo "Cursor configuration synced for $PROJECT_TYPE"
```

### Cursor Settings Export

To share Cursor settings across team:

1. Export settings: `Cursor > Settings > Export Settings`
2. Commit to repo as `.cursor/settings.json`
3. Team members import: `Cursor > Settings > Import Settings`

### Extensions Recommendations

**.cursor/extensions.json:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Framework-Specific Best Practices

### React Projects
- Use Vite for fast dev server
- Configure ESLint with react-hooks plugin
- Set up Prettier for consistent formatting
- Use absolute imports with `@/` alias
- Configure vitest for testing

### Python Projects
- Use pyproject.toml over setup.py
- Configure Black and isort
- Set up mypy for type checking
- Use pytest for testing
- Create virtual environment in .venv

### Next.js Projects
- Use App Router (not Pages Router)
- Configure next.config.js for your needs
- Set up environment variables correctly
- Use Server Components by default
- Configure image domains in next.config.js

### Node.js Projects
- Use TypeScript with strict mode
- Configure nodemon for development
- Set up ESLint for Node.js
- Use dotenv for environment variables
- Configure build scripts in package.json

## Common .cursor/rules Patterns

### Code Review Focus
```markdown
## Code Review Guidelines

When reviewing code, focus on:
- Security vulnerabilities
- Performance bottlenecks
- Code duplication
- Missing error handling
- Unclear variable names
- Missing tests for critical paths

Do not comment on:
- Stylistic choices covered by linters
- Trivial formatting issues
- Personal preferences
```

### AI Assistant Instructions
```markdown
## AI Assistant Behavior

When generating code:
- Always add type annotations (TypeScript/Python)
- Include error handling for external calls
- Write self-documenting code with clear names
- Add comments only when logic is complex
- Follow the project's existing patterns
- Suggest tests for new features

When refactoring:
- Make minimal changes to achieve the goal
- Preserve existing behavior unless explicitly asked to change
- Update tests to match refactored code
- Explain breaking changes clearly
```

### Framework Rules
```markdown
## Framework-Specific Rules

React:
- Hooks only at the top level
- useEffect cleanup functions for subscriptions
- Keys for dynamic lists
- Memoization only when measured need

Python:
- Prefer composition over inheritance
- Use context managers for resources
- Type hints for public APIs
- Docstrings for modules, classes, and functions
```

## Dependencies

### For React Projects
```bash
npm install -D eslint prettier @typescript-eslint/parser
npm install -D @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

### For Python Projects
```bash
pip install black flake8 mypy pytest pytest-asyncio
```

### For All Projects
- Git for version control
- EditorConfig for consistent formatting across editors
- Pre-commit hooks (Husky for JS, pre-commit for Python)

## Best Practices

1. **Start Simple**: Begin with basic rules, expand as team needs evolve
2. **Document Decisions**: Capture architectural decisions in .cursor/rules.md
3. **Team Input**: Collaborate on rules, don't dictate them
4. **Keep Updated**: Review and update rules as the project evolves
5. **Version Control**: Always commit .cursor/ to Git
6. **Avoid Over-Specifying**: Focus on what matters, skip trivial rules
7. **Framework Alignment**: Respect framework conventions and best practices
8. **Living Document**: Treat .cursor/rules.md as a living guide, not rigid law

## Troubleshooting

### Cursor Not Picking Up Rules
- Ensure .cursor/rules.md is in the workspace root
- Restart Cursor to reload configuration
- Check file encoding (should be UTF-8)

### Settings Not Syncing
- Verify .cursor/settings.json is valid JSON
- Check if workspace settings override user settings
- Try "Developer: Reload Window" in Cursor

### Extensions Not Installing
- Check internet connection
- Verify extension IDs in extensions.json
- Manually install from Cursor marketplace
