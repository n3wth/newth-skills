---
name: Cursor ↔ Git Workflow
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - git
  - workflow
  - automation
  - ai-editor
compatibility:
  - claude
---

# Cursor ↔ Git Workflow

Seamlessly integrate Cursor AI editor into git-based development workflows. Generate branch-specific contexts, create PR-based rules, validate code with git hooks, and manage experimental changes.

## Triggers

Use this skill when the user wants to:
- Set up Cursor rules for a git branch
- Generate context from PR changes
- Validate Cursor-generated code with git hooks
- Auto-stash experimental Cursor changes
- Create branch-specific AI contexts

Keywords: "cursor", "git workflow", "branch context", "cursor rules", "git hooks", "ai editor", "code validation"

## Features

- **Branch-Specific Contexts**: Generate `.cursorrules` tailored to your current branch
- **PR-Based Rule Generation**: Create Cursor rules from changed files in pull requests
- **Git Hook Validation**: Verify AI-generated code quality before commits
- **Auto-Stash Experimental**: Automatically stash experimental AI changes
- **Context-Aware Development**: Keep Cursor focused on relevant code

## Branch-Specific Contexts

### Generate Rules from Branch

Create `.cursorrules` that focus Cursor on files relevant to your current branch:

```bash
#!/bin/bash
# generate-branch-rules.sh

BRANCH=$(git branch --show-current)
BASE_BRANCH=${1:-main}

echo "Generating Cursor rules for branch: $BRANCH"

# Get changed files
CHANGED_FILES=$(git diff --name-only $BASE_BRANCH...$BRANCH)

# Create .cursorrules
cat > .cursorrules << EOF
# Branch: $BRANCH
# Auto-generated on $(date)

## Context
Working on branch: $BRANCH
Base branch: $BASE_BRANCH

## Changed Files
$(echo "$CHANGED_FILES" | sed 's/^/- /')

## Focus Areas
When working on this branch:
1. Prioritize understanding these changed files
2. Maintain consistency with existing patterns
3. Consider impact on related components
4. Follow project conventions in modified areas

## File Patterns
$(echo "$CHANGED_FILES" | awk -F/ '{print $NF}' | awk -F. '{print $NF}' | sort -u | sed 's/^/- Files ending in: ./')

## Related Tests
$(git ls-files | grep -E "test|spec" | grep -E "$(echo "$CHANGED_FILES" | sed 's/\.[^.]*$//' | tr '\n' '|' | sed 's/|$//')")
EOF

echo "✓ Generated .cursorrules"
cat .cursorrules
```

### Usage

```bash
# Generate rules for current branch (compare to main)
./generate-branch-rules.sh

# Compare to different base branch
./generate-branch-rules.sh develop
```

## PR-Based Rule Generation

### Create Rules from Pull Request Changes

Generate Cursor context from GitHub PR:

```bash
#!/bin/bash
# pr-cursor-rules.sh

PR_NUMBER=$1
if [ -z "$PR_NUMBER" ]; then
  echo "Usage: ./pr-cursor-rules.sh <PR_NUMBER>"
  exit 1
fi

# Fetch PR info using GitHub CLI
PR_DATA=$(gh pr view $PR_NUMBER --json title,body,files,additions,deletions)

PR_TITLE=$(echo "$PR_DATA" | jq -r '.title')
PR_BODY=$(echo "$PR_DATA" | jq -r '.body')
FILES=$(echo "$PR_DATA" | jq -r '.files[].path')

cat > .cursorrules << EOF
# PR #$PR_NUMBER: $PR_TITLE
# Auto-generated from GitHub PR

## PR Context
$PR_BODY

## Modified Files ($(echo "$FILES" | wc -l) files)
$(echo "$FILES" | sed 's/^/- /')

## Instructions for Cursor
1. Focus on files modified in this PR
2. Maintain the coding style from existing changes
3. Complete TODO items mentioned in PR description
4. Run tests for affected areas before committing
5. Follow the PR requirements and acceptance criteria

## Code Patterns to Follow
$(echo "$FILES" | while read file; do
  if [ -f "$file" ]; then
    ext="${file##*.}"
    echo "- .$ext files: Follow patterns in $file"
  fi
done | sort -u)

## Testing Requirements
- Run unit tests: \`npm test\` (or appropriate command)
- Verify changed functionality works as expected
- Add tests for new features or bug fixes
EOF

echo "✓ Generated .cursorrules from PR #$PR_NUMBER"
```

### Usage with GitHub CLI

```bash
# Install GitHub CLI if needed
brew install gh  # macOS
# or: sudo apt install gh  # Linux

# Authenticate
gh auth login

# Generate rules from PR
./pr-cursor-rules.sh 123
```

## Git Hooks for Validation

### Pre-commit: Validate AI-Generated Code

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to validate Cursor-generated code

echo "🔍 Validating changes..."

# Check for common AI code issues
validate_ai_code() {
  # Check for placeholder comments
  if git diff --cached | grep -E "TODO.*AI|FIXME.*Cursor|placeholder"; then
    echo "⚠️  Found AI placeholders in code"
    echo "Please resolve all TODOs and placeholders before committing"
    return 1
  fi

  # Check for incomplete functions
  if git diff --cached | grep -E "function.*\{\s*\}|def.*:\s*pass\s*$"; then
    echo "⚠️  Found empty function stubs"
    return 1
  fi

  # Verify no debug console.log statements
  if git diff --cached | grep -E "console\.(log|debug|dir)\("; then
    echo "⚠️  Found console.log statements"
    echo "Remove debug logging before committing"
    return 1
  fi

  return 0
}

# Run linter if available
if command -v npm &> /dev/null && [ -f "package.json" ]; then
  if grep -q '"lint"' package.json; then
    echo "Running linter..."
    npm run lint
    if [ $? -ne 0 ]; then
      echo "❌ Linting failed"
      exit 1
    fi
  fi
fi

# Validate AI code
validate_ai_code
if [ $? -ne 0 ]; then
  echo "❌ AI code validation failed"
  exit 1
fi

echo "✅ Pre-commit validation passed"
```

### Commit-msg: Enforce Conventional Commits

Create `.git/hooks/commit-msg`:

```bash
#!/bin/bash
# Validate commit message format

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Pattern: type(scope): description
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .{1,80}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format"
  echo ""
  echo "Expected: type(scope): description"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build"
  echo ""
  echo "Example: feat(cursor): add branch-specific context generation"
  exit 1
fi

# Warn if Cursor generated the commit message (common pattern)
if echo "$commit_msg" | grep -qiE "cursor|ai generated|auto-generated"; then
  echo "⚠️  Warning: Commit message appears AI-generated"
  echo "Consider writing a more specific message"
fi

echo "✅ Commit message validated"
```

### Make Hooks Executable

```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
```

## Auto-Stash Experimental Changes

### Pre-commit Hook for Stashing

Use a wrapper script to auto-stash when switching branches:

```bash
#!/bin/bash
# git-checkout-wrapper.sh
# Add to your shell profile: alias gco='./git-checkout-wrapper.sh'

BRANCH=$1

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  current_branch=$(git branch --show-current)
  timestamp=$(date +%Y%m%d_%H%M%S)
  stash_message="[Cursor] Auto-stash from $current_branch - $timestamp"
  
  echo "💾 Auto-stashing changes from $current_branch..."
  git stash push -m "$stash_message"
  
  echo "✓ Changes stashed: $stash_message"
fi

# Perform checkout
git checkout "$BRANCH"
```

### Post-checkout Hook

Remind about stashed changes when switching branches:

```bash
#!/bin/bash
# .git/hooks/post-checkout

current_branch=$(git branch --show-current)

# Check for stashes from this branch
stashes=$(git stash list | grep "$current_branch")

if [ -n "$stashes" ]; then
  echo ""
  echo "📦 You have stashed changes from this branch:"
  echo "$stashes"
  echo ""
  echo "To restore: git stash pop"
  echo ""
fi
```

### Manual Stash Helper

```bash
#!/bin/bash
# cursor-stash.sh - Helper for managing Cursor experiments

ACTION=${1:-save}
DESCRIPTION=${2:-"Cursor experiment"}

case $ACTION in
  save)
    BRANCH=$(git branch --show-current)
    git stash push -m "[Cursor] $DESCRIPTION - $BRANCH - $(date +%Y%m%d_%H%M%S)"
    echo "✓ Stashed: $DESCRIPTION"
    ;;
    
  list)
    git stash list | grep "\[Cursor\]"
    ;;
    
  apply)
    STASH_INDEX=${2:-0}
    git stash apply stash@{$STASH_INDEX}
    ;;
    
  pop)
    git stash pop
    ;;
    
  *)
    echo "Usage: ./cursor-stash.sh <save|list|apply|pop> [description|index]"
    exit 1
    ;;
esac
```

### Usage

```bash
# Stash current experiment
./cursor-stash.sh save "trying new authentication approach"

# List Cursor-related stashes
./cursor-stash.sh list

# Apply a stash
./cursor-stash.sh apply 0

# Pop most recent stash
./cursor-stash.sh pop
```

## Complete Workflow Example

### 1. Start New Feature Branch

```bash
# Create feature branch
git checkout -b feature/user-profile

# Generate Cursor rules for this branch
./generate-branch-rules.sh main

# Cursor now has context about what files you're working on
```

### 2. Work with Cursor

```bash
# Make changes using Cursor AI assistance
# Cursor follows rules in .cursorrules

# Stash experimental idea
./cursor-stash.sh save "trying GraphQL instead of REST"

# Continue with original approach
git checkout .
```

### 3. Prepare for PR

```bash
# Stage changes
git add .

# Pre-commit hook validates:
# - No placeholder comments
# - No empty functions
# - No debug statements
# - Linting passes

git commit -m "feat(profile): add user profile page"

# Commit-msg hook validates format
```

### 4. Create Pull Request

```bash
# Push branch
git push -u origin feature/user-profile

# Create PR
gh pr create --title "Add user profile page" --body "Implements user profile with avatar upload"

# Generate Cursor rules from PR for reviewers
./pr-cursor-rules.sh 456
```

### 5. Review and Iterate

```bash
# Reviewer checks out PR
git checkout feature/user-profile

# Loads PR-specific Cursor context
./pr-cursor-rules.sh 456

# Cursor understands PR context for review comments or fixes
```

## Advanced: Husky Integration

For teams using Node.js projects, integrate with Husky:

```bash
npm install --save-dev husky

# Initialize Husky
npx husky init

# Add pre-commit
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Validating Cursor-generated code..."

# Run linter
npm run lint

# Validate no AI placeholders
if git diff --cached | grep -iE "TODO.*cursor|FIXME.*ai"; then
  echo "❌ Found AI placeholder comments"
  exit 1
fi

echo "✅ Validation passed"
EOF

chmod +x .husky/pre-commit
```

## Best Practices

### Do's

1. **Generate rules per branch**: Keep Cursor focused on relevant context
2. **Validate before commit**: Use pre-commit hooks to catch AI mistakes
3. **Stash experiments**: Save exploratory changes without committing
4. **Use conventional commits**: Make commit history parseable
5. **Update rules from PRs**: Help reviewers understand context

### Don'ts

1. **Don't commit .cursorrules**: Add to `.gitignore` (they're branch-specific)
2. **Don't skip validation**: AI can make mistakes, always validate
3. **Don't blindly commit AI code**: Review every change
4. **Don't ignore test failures**: Even if AI says it's fine
5. **Don't let TODOs slip through**: Enforce completion with hooks

## Configuration

### .gitignore

```
# Cursor rules (auto-generated, branch-specific)
.cursorrules

# Cursor workspace
.cursor/
```

### package.json Scripts

```json
{
  "scripts": {
    "cursor:branch-rules": "bash scripts/generate-branch-rules.sh",
    "cursor:pr-rules": "bash scripts/pr-cursor-rules.sh",
    "cursor:stash": "bash scripts/cursor-stash.sh save",
    "prepare": "husky install"
  }
}
```

## Troubleshooting

### Pre-commit Hook Not Running

```bash
# Make hook executable
chmod +x .git/hooks/pre-commit

# Verify hook exists
ls -la .git/hooks/pre-commit
```

### Stashes Not Auto-Saving

```bash
# Use the wrapper script
chmod +x git-checkout-wrapper.sh

# Add alias to your shell profile (~/.bashrc or ~/.zshrc)
echo "alias gco='./git-checkout-wrapper.sh'" >> ~/.bashrc

# Or use the post-checkout hook for reminders
chmod +x .git/hooks/post-checkout
```

### Rules Not Loading in Cursor

1. Ensure `.cursorrules` is in project root
2. Restart Cursor after generating rules
3. Check Cursor settings → Rules → Auto-load

## Dependencies

```bash
# GitHub CLI (for PR integration)
brew install gh  # macOS
# or: sudo apt install gh  # Linux

# jq (for JSON parsing)
brew install jq  # macOS  
# or: sudo apt install jq  # Linux

# Optional: Husky for Node.js projects
npm install --save-dev husky
```

## Integration with CI/CD

### GitHub Actions: Validate AI Code

```yaml
# .github/workflows/validate-ai-code.yml
name: Validate AI-Generated Code

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for AI placeholders
        run: |
          if git diff origin/main...HEAD | grep -iE "TODO.*cursor|FIXME.*ai"; then
            echo "Found AI placeholder comments"
            exit 1
          fi
          
      - name: Verify no debug statements
        run: |
          if git diff origin/main...HEAD | grep -E "console\.(log|debug)"; then
            echo "Found debug console statements"
            exit 1
          fi
          
      - name: Run linter
        run: npm run lint
```

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI](https://cli.github.com/)

## Version History

- **1.0.0** (2026-01-27): Initial release with branch contexts, PR rules, git hooks, and auto-stash
