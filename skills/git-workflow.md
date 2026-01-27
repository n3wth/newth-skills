---
name: Git Workflow
version: 1.0.0
author: Community Contributor
category: development
tags:
  - git
  - version-control
  - workflow
  - collaboration
compatibility:
  - gemini
  - claude
---

# Git Workflow

Streamlined Git workflows for common development tasks. Handles branching strategies, commit conventions, and merge conflict resolution for effective version control.

## Triggers

Use this skill when the user requests:
- Setting up Git branching strategies
- Writing commit messages
- Resolving merge conflicts
- Understanding Git workflows
- Automating Git processes

Keywords: "git", "branch", "commit", "merge", "rebase", "conflict", "gitflow", "trunk-based", "version control"

## Features

- **GitFlow and Trunk-Based Branching**: Choose the right strategy for your team
- **Conventional Commit Formatting**: Standardized, parseable commit messages
- **Interactive Rebase Guidance**: Clean up commit history safely
- **Merge Conflict Resolution**: Strategies for resolving conflicts
- **Git Hooks and Automation**: Automate quality checks

## Branching Strategies

### GitFlow

Best for: Teams with scheduled releases, multiple versions in production

```
main (production)
  └── develop (integration)
        ├── feature/user-auth
        ├── feature/payment-system
        └── release/v1.2.0
              └── hotfix/critical-bug
```

**Branch Types:**
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features (branch from develop)
- `release/*`: Release preparation (branch from develop)
- `hotfix/*`: Emergency fixes (branch from main)

**Workflow:**
```bash
# Start a feature
git checkout develop
git checkout -b feature/user-auth

# Complete feature
git checkout develop
git merge --no-ff feature/user-auth
git branch -d feature/user-auth

# Create release
git checkout develop
git checkout -b release/v1.2.0

# Finish release
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git checkout develop
git merge --no-ff release/v1.2.0
```

### Trunk-Based Development

Best for: Teams practicing continuous deployment, small frequent changes

```
main (trunk)
  ├── feature/short-lived-1 (1-2 days max)
  └── feature/short-lived-2
```

**Principles:**
- Single long-lived branch (main/trunk)
- Short-lived feature branches (< 2 days)
- Feature flags for incomplete work
- Frequent integration (multiple times per day)

**Workflow:**
```bash
# Start work
git checkout main
git pull
git checkout -b feature/quick-fix

# Make small, focused changes
git add .
git commit -m "feat: add validation"

# Integrate quickly
git checkout main
git pull
git merge feature/quick-fix
git push
git branch -d feature/quick-fix
```

## Conventional Commits

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no new feature or fix |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `build` | Build system changes |

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth2 login support"

# Bug fix
git commit -m "fix(api): handle null response from payment gateway"

# Breaking change
git commit -m "feat(api)!: change response format for /users endpoint

BREAKING CHANGE: Response now returns array instead of object"

# With body
git commit -m "fix(database): resolve connection pool exhaustion

The pool was not releasing connections after timeout.
Added explicit connection cleanup in finally block."
```

## Merge Conflict Resolution

### Understanding Conflicts

```
<<<<<<< HEAD
Your changes (current branch)
=======
Their changes (incoming branch)
>>>>>>> feature-branch
```

### Resolution Strategies

**1. Accept Current (Ours)**
```bash
git checkout --ours path/to/file
git add path/to/file
```

**2. Accept Incoming (Theirs)**
```bash
git checkout --theirs path/to/file
git add path/to/file
```

**3. Manual Resolution**
```bash
# Edit the file to combine changes
# Remove conflict markers
git add path/to/file
git commit
```

**4. Using a Merge Tool**
```bash
git mergetool
# Opens configured merge tool (VS Code, vimdiff, etc.)
```

### Prevention Tips

1. Pull frequently from the target branch
2. Keep branches short-lived
3. Communicate with team about overlapping work
4. Use feature flags instead of long-running branches

## Interactive Rebase

### Clean Up Before Merging

```bash
# Rebase last 5 commits
git rebase -i HEAD~5
```

### Rebase Commands

| Command | Action |
|---------|--------|
| `pick` | Keep commit as-is |
| `reword` | Change commit message |
| `edit` | Stop to amend commit |
| `squash` | Combine with previous commit |
| `fixup` | Combine, discard message |
| `drop` | Remove commit |

### Example: Squash Commits

```bash
# Before: 3 commits
# abc123 fix: typo
# def456 fix: another typo  
# ghi789 feat: add feature

git rebase -i HEAD~3

# Change to:
# pick ghi789 feat: add feature
# squash def456 fix: another typo
# squash abc123 fix: typo

# Result: 1 clean commit
```

## Git Hooks

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix before committing."
  exit 1
fi
```

### Commit-msg Hook

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Validate conventional commit format
commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
  echo "Invalid commit message format."
  echo "Use: type(scope): description"
  exit 1
fi
```

### Using Husky (Node.js)

```bash
npm install husky --save-dev
npx husky init

# Add pre-commit hook
echo "npm run lint" > .husky/pre-commit
```

## Common Commands Reference

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout -- .

# Stash changes
git stash
git stash pop

# View commit history
git log --oneline --graph

# Find who changed a line
git blame path/to/file

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Create and push tag
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

## Best Practices

1. **Commit often**: Small, focused commits are easier to review and revert
2. **Write meaningful messages**: Future you will thank present you
3. **Pull before push**: Avoid unnecessary merge commits
4. **Never force push shared branches**: Unless you really know what you're doing
5. **Use .gitignore**: Keep generated files out of version control
