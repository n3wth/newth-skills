---
name: Cursor Team Standards Enforcer
version: 1.0.0
author: Community Contributor
category: development
tags:
  - cursor
  - team
  - standards
  - configuration
  - compliance
compatibility:
  - cursor
  - claude
---

# Cursor Team Standards Enforcer

Share and enforce .cursor/rules across team with configuration validation. Ensure consistent AI behavior and code generation across team development environments.

## Triggers

Use this skill when the user wants to:
- Share Cursor rules across a team
- Validate team member configurations
- Generate onboarding rules documentation
- Check compliance with team standards
- Set up consistent AI coding standards

Keywords: "cursor rules", "team standards", "cursor config", "enforce rules", "team compliance", "cursor setup"

## Features

- **Centralized Rules Management**: Share .cursor/rules files across team repositories
- **Configuration Validation**: Verify team members have correct Cursor settings
- **Onboarding Automation**: Generate onboarding rules for new team members
- **Compliance Reporting**: Track and report team configuration consistency
- **Standards Enforcement**: Ensure all team members follow the same AI coding guidelines

## Centralized Rules Setup

### Repository Structure

```
your-repo/
├── .cursor/
│   ├── rules/
│   │   ├── team-standards.md
│   │   ├── code-style.md
│   │   ├── security.md
│   │   └── testing.md
│   └── rules-manifest.json
└── scripts/
    └── validate-cursor-setup.sh
```

### Team Standards File

Create `.cursor/rules/team-standards.md`:

```markdown
# Team Development Standards

## Code Style
- Use TypeScript for all new code
- Follow Airbnb style guide
- Maximum function length: 50 lines
- Use functional components in React

## Testing Requirements
- Minimum 80% code coverage
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows

## Security Guidelines
- Never commit secrets or API keys
- Use environment variables for configuration
- Sanitize all user inputs
- Run security scans before merging

## Documentation
- JSDoc comments for all exported functions
- README.md in each package directory
- Update changelog for user-facing changes
```

### Rules Manifest

Create `.cursor/rules-manifest.json`:

```json
{
  "version": "1.0.0",
  "rules": [
    {
      "file": "team-standards.md",
      "required": true,
      "description": "Core team development standards"
    },
    {
      "file": "code-style.md",
      "required": true,
      "description": "Formatting and style conventions"
    },
    {
      "file": "security.md",
      "required": true,
      "description": "Security best practices"
    },
    {
      "file": "testing.md",
      "required": false,
      "description": "Testing guidelines and examples"
    }
  ],
  "updatedAt": "2026-01-27",
  "maintainer": "team-lead@company.com"
}
```

## Configuration Validation

### Validation Script

Create `scripts/validate-cursor-setup.sh`:

```bash
#!/bin/bash

# Cursor Team Standards Validator
# Checks that team members have correct .cursor/rules setup

set -e

RULES_DIR=".cursor/rules"
MANIFEST=".cursor/rules-manifest.json"

echo "🔍 Validating Cursor configuration..."

# Check if .cursor directory exists
if [ ! -d ".cursor" ]; then
  echo "❌ .cursor directory not found"
  exit 1
fi

# Check if rules directory exists
if [ ! -d "$RULES_DIR" ]; then
  echo "❌ $RULES_DIR directory not found"
  exit 1
fi

# Check if manifest exists
if [ ! -f "$MANIFEST" ]; then
  echo "❌ $MANIFEST not found"
  exit 1
fi

# Validate required rules files
echo "📋 Checking required rules files..."

REQUIRED_FILES=$(jq -r '.rules[] | select(.required == true) | .file' "$MANIFEST")

for file in $REQUIRED_FILES; do
  if [ ! -f "$RULES_DIR/$file" ]; then
    echo "❌ Required rules file missing: $file"
    exit 1
  else
    echo "✅ $file"
  fi
done

# Check for outdated rules
MANIFEST_DATE=$(jq -r '.updatedAt' "$MANIFEST")
echo ""
echo "📅 Rules last updated: $MANIFEST_DATE"

echo ""
echo "✨ Cursor configuration validated successfully!"
```

Make it executable:

```bash
chmod +x scripts/validate-cursor-setup.sh
```

### Node.js Validation Script

Create `scripts/validate-cursor-setup.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const RULES_DIR = '.cursor/rules'
const MANIFEST_PATH = '.cursor/rules-manifest.json'

console.log('🔍 Validating Cursor configuration...\n')

// Check .cursor directory
if (!fs.existsSync('.cursor')) {
  console.error('❌ .cursor directory not found')
  console.log('Run: mkdir -p .cursor/rules')
  process.exit(1)
}

// Check rules directory
if (!fs.existsSync(RULES_DIR)) {
  console.error(`❌ ${RULES_DIR} directory not found`)
  console.log(`Run: mkdir -p ${RULES_DIR}`)
  process.exit(1)
}

// Load and validate manifest
let manifest
try {
  const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8')
  manifest = JSON.parse(manifestContent)
} catch (err) {
  console.error(`❌ Error reading ${MANIFEST_PATH}:`, err.message)
  process.exit(1)
}

// Validate required files
console.log('📋 Checking required rules files...\n')

const requiredRules = manifest.rules.filter(r => r.required)
let allValid = true

for (const rule of requiredRules) {
  const filePath = path.join(RULES_DIR, rule.file)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required rules file missing: ${rule.file}`)
    console.log(`   ${rule.description}`)
    allValid = false
  } else {
    const stats = fs.statSync(filePath)
    const fileSize = (stats.size / 1024).toFixed(2)
    console.log(`✅ ${rule.file} (${fileSize} KB)`)
  }
}

if (!allValid) {
  console.log('\n❌ Validation failed. Please add missing rules files.')
  process.exit(1)
}

// Report summary
console.log(`\n📅 Rules last updated: ${manifest.updatedAt}`)
console.log(`👤 Maintainer: ${manifest.maintainer}`)
console.log('\n✨ Cursor configuration validated successfully!')
```

### Add to package.json

```json
{
  "scripts": {
    "validate:cursor": "node scripts/validate-cursor-setup.js",
    "precommit": "npm run validate:cursor"
  }
}
```

## Onboarding Rules Generation

### Generate Onboarding Guide

Create `scripts/generate-onboarding.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const MANIFEST_PATH = '.cursor/rules-manifest.json'
const OUTPUT_PATH = 'docs/CURSOR_ONBOARDING.md'

console.log('📝 Generating Cursor onboarding guide...\n')

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

// Generate markdown
const markdown = `# Cursor Setup Guide for New Team Members

Welcome! This guide will help you set up Cursor with our team standards.

## Prerequisites

- [Cursor](https://cursor.sh/) installed
- Git repository cloned
- Team access granted

## Setup Steps

### 1. Verify Rules Files

Our team uses standardized Cursor rules. Verify they exist:

\`\`\`bash
ls -la .cursor/rules/
\`\`\`

You should see:
${manifest.rules.map(r => `- \`${r.file}\` - ${r.description}`).join('\n')}

### 2. Validate Configuration

Run the validation script to ensure everything is set up correctly:

\`\`\`bash
npm run validate:cursor
\`\`\`

All checks should pass ✅

### 3. Understand Team Standards

Read through each rules file to understand our standards:

${manifest.rules.map(r => `
#### ${r.file.replace('.md', '').replace(/-/g, ' ').toUpperCase()}
\`\`\`bash
cat .cursor/rules/${r.file}
\`\`\`
`).join('\n')}

### 4. Test Your Setup

Create a test file and ask Cursor to generate code. It should follow our team standards automatically.

Example prompts:
- "Create a new React component for a user profile"
- "Write a function to validate email addresses"
- "Add unit tests for the authentication module"

Cursor should apply our standards (TypeScript, specific formatting, etc.) automatically.

## Updating Rules

Rules are maintained in this repository. When updates occur:

1. Pull the latest changes: \`git pull\`
2. Re-run validation: \`npm run validate:cursor\`
3. Review updated rules in \`.cursor/rules/\`

## Troubleshooting

### Rules not being applied

1. Check that \`.cursor/rules/\` exists in your workspace
2. Restart Cursor
3. Verify files aren't being ignored by \`.gitignore\`

### Validation fails

1. Ensure you're on the latest \`main\` branch
2. Check for missing files indicated in error
3. Contact ${manifest.maintainer} for help

## Questions?

Contact the team lead or file an issue in the repository.

---

*Generated: ${new Date().toISOString()}*
*Rules version: ${manifest.version}*
`

// Ensure docs directory exists
const docsDir = path.dirname(OUTPUT_PATH)
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

// Write file
fs.writeFileSync(OUTPUT_PATH, markdown)

console.log(`✅ Onboarding guide created: ${OUTPUT_PATH}`)
console.log('\nShare this with new team members!')
```

Run it:

```bash
node scripts/generate-onboarding.js
```

## Compliance Reporting

### Compliance Check Script

Create `scripts/check-compliance.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const RULES_DIR = '.cursor/rules'
const MANIFEST_PATH = '.cursor/rules-manifest.json'

console.log('📊 Cursor Team Compliance Report\n')
console.log('='.repeat(50) + '\n')

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

// Check local setup
console.log('1. Local Configuration')
console.log('-'.repeat(50))

let localScore = 0
let maxScore = manifest.rules.length

manifest.rules.forEach(rule => {
  const filePath = path.join(RULES_DIR, rule.file)
  const exists = fs.existsSync(filePath)
  
  console.log(`${exists ? '✅' : '❌'} ${rule.file}`)
  
  if (exists) {
    localScore++
    
    // Check last modified
    const stats = fs.statSync(filePath)
    const daysOld = Math.floor((Date.now() - stats.mtime) / (1000 * 60 * 60 * 24))
    if (daysOld > 30) {
      console.log(`   ⚠️  Warning: File not updated in ${daysOld} days`)
    }
  }
})

const localCompliance = Math.round((localScore / maxScore) * 100)
console.log(`\nLocal Compliance: ${localCompliance}%`)

// Check git status
console.log('\n2. Repository Status')
console.log('-'.repeat(50))

try {
  // Check if rules are committed
  const status = execSync('git status --porcelain .cursor/rules/', { encoding: 'utf8' })
  
  if (status.trim()) {
    console.log('⚠️  Uncommitted changes in .cursor/rules/')
    console.log(status)
  } else {
    console.log('✅ All rules committed')
  }
  
  // Check if rules are up to date with remote
  try {
    execSync('git fetch origin', { stdio: 'ignore' })
    const diff = execSync('git diff origin/main .cursor/rules/', { encoding: 'utf8' })
    
    if (diff.trim()) {
      console.log('⚠️  Local rules differ from origin/main')
      console.log('   Run: git pull origin main')
    } else {
      console.log('✅ Rules synchronized with origin/main')
    }
  } catch (err) {
    console.log('⚠️  Could not compare with origin/main')
  }
} catch (err) {
  console.log('❌ Not a git repository or git not available')
}

// Overall summary
console.log('\n' + '='.repeat(50))
console.log('Summary')
console.log('='.repeat(50))
console.log(`Rules Version: ${manifest.version}`)
console.log(`Last Updated: ${manifest.updatedAt}`)
console.log(`Maintainer: ${manifest.maintainer}`)
console.log(`\nCompliance Score: ${localCompliance}%`)

if (localCompliance === 100) {
  console.log('\n🎉 Perfect compliance!')
} else if (localCompliance >= 75) {
  console.log('\n⚠️  Good, but missing some rules')
} else {
  console.log('\n❌ Action required: Multiple rules missing')
}
```

### CI/CD Integration

Add to `.github/workflows/cursor-compliance.yml`:

```yaml
name: Cursor Compliance Check

on:
  pull_request:
    paths:
      - '.cursor/**'
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Cursor configuration
        run: |
          if [ -f "scripts/validate-cursor-setup.sh" ]; then
            bash scripts/validate-cursor-setup.sh
          else
            echo "Warning: Validation script not found"
            exit 1
          fi
      
      - name: Check rules compliance
        run: |
          if [ -f "scripts/check-compliance.js" ]; then
            node scripts/check-compliance.js
          fi
```

## Team Workflow

### Setting Up Rules for a New Project

1. **Initialize rules structure:**

```bash
mkdir -p .cursor/rules
```

2. **Create core rules files** (see examples above)

3. **Add manifest:**

```bash
cat > .cursor/rules-manifest.json << 'EOF'
{
  "version": "1.0.0",
  "rules": [],
  "updatedAt": "2026-01-27",
  "maintainer": "your-email@company.com"
}
EOF
```

4. **Commit to repository:**

```bash
git add .cursor/
git commit -m "chore: add Cursor team standards"
git push
```

### Updating Rules

1. **Edit rules files** in `.cursor/rules/`
2. **Update manifest version** and `updatedAt`
3. **Test locally** with validation script
4. **Commit and push** changes
5. **Notify team** to pull updates

### New Team Member Onboarding

1. **Clone repository**
2. **Run validation:** `npm run validate:cursor`
3. **Read onboarding guide:** `docs/CURSOR_ONBOARDING.md`
4. **Test with sample prompts**
5. **Report any issues** to maintainer

## Best Practices

### 1. Version Control

- Always commit `.cursor/rules/` directory
- Use semantic versioning in manifest
- Tag major rule updates
- Document breaking changes

### 2. Documentation

- Keep rules concise and clear
- Provide examples for complex standards
- Update onboarding guide regularly
- Document the "why" not just the "what"

### 3. Team Communication

- Announce rule updates in team chat
- Review rule changes in PRs
- Collect feedback from team
- Schedule periodic rules review

### 4. Validation

- Run validation in CI/CD
- Enforce validation in pre-commit hooks
- Regular compliance audits
- Address violations promptly

### 5. Flexibility

- Balance standards with pragmatism
- Allow exceptions when justified
- Update rules based on learnings
- Avoid over-prescription

## Troubleshooting

### Rules not being followed

**Issue**: Cursor doesn't follow team rules

**Solutions**:
1. Verify `.cursor/rules/` exists in workspace root
2. Check file contents aren't corrupted
3. Restart Cursor to reload rules
4. Ensure rules files are plain markdown
5. Check for conflicting rules in global Cursor settings

### Validation fails in CI

**Issue**: CI validation fails but works locally

**Solutions**:
1. Ensure scripts have correct permissions
2. Check Node.js version compatibility
3. Verify all files are committed
4. Check for OS-specific path issues

### Team members have different behavior

**Issue**: AI generates different code for different team members

**Solutions**:
1. Ensure everyone has pulled latest rules
2. Check for personal Cursor settings overrides
3. Verify same Cursor version across team
4. Compare actual `.cursor/rules/` files

### Rules feel too restrictive

**Issue**: Team finds rules limiting creativity

**Solutions**:
1. Review and relax overly strict rules
2. Add "unless" clauses for exceptions
3. Focus on critical standards only
4. Encourage rule discussions

## Dependencies

No external dependencies required. Optional tools:

- **jq**: For JSON parsing in shell scripts
- **Node.js**: For JavaScript validation scripts
- **Git**: For version control and compliance checks

## Integration Examples

### With Pre-commit Hooks

```bash
# .git/hooks/pre-commit

#!/bin/bash
npm run validate:cursor
if [ $? -ne 0 ]; then
  echo "Cursor configuration invalid. Please fix before committing."
  exit 1
fi
```

### With Husky

```bash
npm install -D husky
npx husky init
echo "npm run validate:cursor" > .husky/pre-commit
```

### With Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy rules first to cache layer
COPY .cursor/rules/ .cursor/rules/
COPY .cursor/rules-manifest.json .cursor/rules-manifest.json

# Validate configuration
COPY scripts/validate-cursor-setup.js scripts/
RUN node scripts/validate-cursor-setup.js

# Continue with app setup...
```

## Advanced Configuration

### Multiple Rule Sets

Support different rules for different contexts:

```json
{
  "version": "1.0.0",
  "profiles": {
    "frontend": {
      "rules": ["team-standards.md", "frontend-rules.md"]
    },
    "backend": {
      "rules": ["team-standards.md", "backend-rules.md"]
    }
  }
}
```

### Rule Inheritance

Create base rules and extend them:

```markdown
<!-- .cursor/rules/base-standards.md -->
# Base Standards
Common standards for all projects

<!-- .cursor/rules/project-specific.md -->
# Project Specific Rules
Additional rules for this project
Extends: base-standards.md
```

### Automated Rule Sync

Set up automatic rule synchronization:

```bash
#!/bin/bash
# sync-rules.sh

RULES_REPO="https://github.com/your-org/cursor-rules.git"
RULES_DIR=".cursor/rules"

# Fetch latest rules
git -C /tmp/cursor-rules pull 2>/dev/null || \
  git clone $RULES_REPO /tmp/cursor-rules

# Sync to project
rsync -av --delete /tmp/cursor-rules/rules/ $RULES_DIR/
```

Run periodically or in CI.
