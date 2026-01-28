---
name: Cursor-Driven Refactoring
version: 1.0.0
author: newth.ai
category: development
tags:
  - refactoring
  - cursor
  - agent
  - testing
  - validation
compatibility:
  - claude
  - cursor
---

# Cursor-Driven Refactoring

Batch refactoring operations using Cursor's agent mode with validation and rollback capabilities. Safely perform large-scale code transformations with automated testing and change tracking.

## Triggers

Use this skill when the user wants to:
- Perform large-scale refactoring across multiple files
- Safely rename variables, functions, or classes across a codebase
- Restructure code with automated validation
- Track and validate changes during refactoring
- Rollback refactoring if tests fail

Keywords: "refactor", "cursor agent", "batch refactor", "rename", "restructure", "safe refactoring", "rollback"

## Features

- **Batch Refactoring Operations**: Execute large-scale code changes using Cursor's agent mode
- **Change Tracking**: Automatically track all modifications during refactoring
- **Test Validation**: Run tests after refactoring to ensure code still works
- **Rollback Capability**: Revert changes if validation fails
- **Summary Reports**: Generate detailed reports of changes made

## Refactoring Workflow

### 1. Pre-Refactoring Setup

Before starting any refactoring operation, establish a safety net:

```bash
# Create a new branch for refactoring
git checkout -b refactor/describe-change

# Ensure working directory is clean
git status

# Run tests to establish baseline
npm test  # or your test command
```

### 2. Planning Phase

Document the refactoring plan:

```markdown
## Refactoring Plan

**Goal**: [What you want to achieve]

**Scope**: 
- Files affected: [list files or patterns]
- Changes: [describe transformations]

**Success Criteria**:
- All tests pass
- No console errors
- Type checking passes
- Linting passes

**Rollback Plan**: 
- If tests fail, run: git reset --hard HEAD
- If partial changes needed, use: git checkout -- [file]
```

### 3. Execute Refactoring with Cursor Agent

Use Cursor's agent mode to perform the refactoring:

**Example: Rename a function across codebase**

```
@agent Please refactor:
1. Rename function `getUserData` to `fetchUserData` across all files
2. Track all files modified
3. After changes, run tests with `npm test`
4. If tests pass, generate summary of changes
5. If tests fail, rollback all changes
```

**Example: Extract component**

```
@agent Please refactor:
1. Extract the login form from LoginPage.tsx into a new LoginForm component
2. Move to components/auth/LoginForm.tsx
3. Update all imports in affected files
4. Run tests: npm test
5. Verify no TypeScript errors: npm run typecheck
```

**Example: Move files with dependency updates**

```
@agent Please refactor:
1. Move all utility functions from src/utils/ to src/lib/utils/
2. Update all import statements across the codebase
3. Run linter: npm run lint
4. Run tests: npm test
5. Generate list of all modified files
```

### 4. Validation Checklist

After refactoring, verify:

```bash
# Type checking
npm run typecheck || tsc --noEmit

# Linting
npm run lint

# Unit tests
npm test

# Integration tests (if applicable)
npm run test:integration

# Build verification
npm run build

# Manual testing
npm run dev
# Test key workflows in the application
```

### 5. Change Summary

Generate a comprehensive summary:

```bash
# View all changed files
git status

# View detailed diff
git diff

# Generate commit message
git log --oneline --graph

# Create summary file
cat > REFACTORING_SUMMARY.md << EOF
## Refactoring: [Description]

**Date**: $(date)
**Branch**: $(git branch --show-current)

### Files Modified
$(git diff --name-only)

### Changes Made
- [List key changes]

### Tests Status
- Unit tests: ✓ Passed
- Integration tests: ✓ Passed
- Type checking: ✓ Passed
- Linting: ✓ Passed

### Rollback Command
\`git reset --hard $(git rev-parse HEAD~1)\`
EOF
```

## Common Refactoring Patterns

### Pattern 1: Rename Symbol

```
@agent Refactor:
1. Find all instances of [OLD_NAME]
2. Replace with [NEW_NAME] (maintaining context)
3. Update tests that reference [OLD_NAME]
4. Run: npm test
5. If failures, rollback and report issues
```

### Pattern 2: Extract Function/Component

```
@agent Refactor:
1. Identify code block for extraction
2. Create new file: [PATH/TO/NEW_FILE]
3. Move code and handle dependencies
4. Update original file with import/call
5. Run tests
6. Verify no duplicate code remains
```

### Pattern 3: Consolidate Duplicates

```
@agent Refactor:
1. Find duplicate code patterns matching [DESCRIPTION]
2. Create shared utility/component at [PATH]
3. Replace all duplicates with imports
4. Remove old duplicate code
5. Run full test suite
6. Generate diff summary
```

### Pattern 4: Directory Restructure

```
@agent Refactor:
1. Move files from [OLD_PATH] to [NEW_PATH]
2. Update all import statements
3. Update any config files (tsconfig, webpack, etc.)
4. Run build: npm run build
5. Verify no import errors
```

## Validation Strategies

### Automated Validation

```bash
#!/bin/bash
# validate-refactor.sh

echo "Running validation suite..."

# Type checking
echo "1. Type checking..."
npm run typecheck || { echo "Type check failed"; exit 1; }

# Linting
echo "2. Linting..."
npm run lint || { echo "Lint failed"; exit 1; }

# Tests
echo "3. Running tests..."
npm test || { echo "Tests failed"; exit 1; }

# Build
echo "4. Building..."
npm run build || { echo "Build failed"; exit 1; }

echo "✓ All validations passed"
```

### Manual Validation Points

1. **Code Review**:
   - Check git diff for unexpected changes
   - Verify naming conventions are consistent
   - Look for leftover debug code or comments

2. **Runtime Testing**:
   - Start dev server and test key features
   - Check browser console for errors
   - Test edge cases and error paths

3. **Performance Check**:
   - Compare bundle size before/after
   - Check for any performance regressions
   - Verify no unnecessary re-renders (React)

## Rollback Procedures

### Quick Rollback (Uncommitted)

```bash
# Discard all changes
git reset --hard HEAD
git clean -fd

# Discard specific file
git checkout -- path/to/file
```

### Rollback After Commit

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1

# Undo multiple commits
git reset --hard HEAD~3
```

### Selective Rollback

```bash
# Rollback specific file to previous version
git checkout HEAD~1 -- path/to/file

# Cherry-pick good changes after rollback
git cherry-pick <commit-hash>
```

## Best Practices

### Before Refactoring

1. **Create a branch**: Never refactor on main/master
2. **Run tests**: Ensure baseline is green
3. **Document plan**: Write down what you're changing and why
4. **Check dependencies**: Understand what depends on code you're changing
5. **Backup important branches**: `git branch backup-$(date +%Y%m%d)`

### During Refactoring

1. **Make atomic changes**: One logical change per commit
2. **Test frequently**: Run tests after each significant change
3. **Track progress**: Keep notes of completed steps
4. **Use TypeScript**: Type errors will catch many issues early
5. **Leverage Cursor agent**: Let the AI handle repetitive changes

### After Refactoring

1. **Full test suite**: Run all tests, not just unit tests
2. **Code review**: Review your own changes carefully
3. **Update docs**: Reflect changes in README, comments, docs
4. **Check performance**: Ensure no regressions
5. **Clean up**: Remove debug code, console.logs, TODOs

## Safety Guardrails

### Pre-flight Checks

```bash
# Create safety checklist
pre_refactor_check() {
  echo "Pre-refactoring safety check:"
  
  # Check for uncommitted changes
  if [[ -n $(git status -s) ]]; then
    echo "⚠ You have uncommitted changes. Commit or stash them first."
    return 1
  fi
  
  # Verify on feature branch
  branch=$(git branch --show-current)
  if [[ "$branch" == "main" || "$branch" == "master" ]]; then
    echo "⚠ Don't refactor on main/master. Create a feature branch."
    return 1
  fi
  
  # Check if tests pass
  npm test || {
    echo "⚠ Tests are failing before refactoring. Fix them first."
    return 1
  }
  
  echo "✓ Safe to proceed with refactoring"
}
```

### Post-refactor Validation

```bash
post_refactor_check() {
  echo "Post-refactoring validation:"
  
  # Count changed files
  changed=$(git diff --name-only | wc -l)
  echo "Files changed: $changed"
  
  # Run validation
  npm test && npm run lint && npm run build || {
    echo "⚠ Validation failed. Consider rollback:"
    echo "  git reset --hard HEAD"
    return 1
  }
  
  echo "✓ Refactoring validated successfully"
}
```

## Example: Complete Refactoring Session

**Scenario**: Rename `UserService` to `UserRepository` across entire codebase

```bash
# 1. Setup
git checkout -b refactor/rename-user-service
git status  # ensure clean

# 2. Baseline
npm test  # all pass ✓

# 3. Execute refactoring with Cursor agent
```

**Cursor Agent Prompt**:
```
@agent Please perform the following refactoring:

1. Rename class UserService to UserRepository
2. Rename file src/services/UserService.ts to src/repositories/UserRepository.ts
3. Update all imports across the codebase
4. Update all references in tests
5. Update any documentation that mentions UserService

After changes:
- Run: npm test
- Run: npm run lint
- Generate summary of all files modified

If any step fails, rollback all changes and report the error.
```

```bash
# 4. Validate
npm test        # ✓
npm run lint    # ✓
npm run build   # ✓

# 5. Review changes
git diff --stat
git diff

# 6. Commit
git add .
git commit -m "refactor: rename UserService to UserRepository

- Renamed UserService class to UserRepository
- Moved file to repositories directory
- Updated all imports and references
- All tests passing"

# 7. Push and create PR
git push -u origin refactor/rename-user-service
```

## Troubleshooting

### Tests fail after refactoring

```bash
# 1. Check which tests failed
npm test -- --reporter=verbose

# 2. Review changes to test files
git diff -- '*.test.ts' '*.spec.ts'

# 3. If test logic is wrong, fix tests
# If refactoring broke functionality, consider rollback

# 4. Selective rollback of problematic file
git checkout HEAD -- path/to/problematic/file.ts
```

### Import errors after moving files

```bash
# 1. Check for broken imports
npm run typecheck

# 2. Search for old import paths
grep -r "old/path" src/

# 3. Use find-replace in Cursor
# Find: from 'old/path'
# Replace: from 'new/path'

# 4. Verify with TypeScript
npm run typecheck
```

### Merge conflicts during refactoring

```bash
# 1. Stash refactoring changes
git stash

# 2. Pull latest changes
git pull origin main

# 3. Reapply refactoring
git stash pop

# 4. Resolve conflicts
# 5. Re-run tests
npm test
```

## Integration with CI/CD

### GitHub Actions Validation

```yaml
# .github/workflows/validate-refactoring.yml
name: Validate Refactoring

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Check bundle size
        run: npm run analyze
```

## Dependencies

No additional dependencies required. Uses:
- Cursor's built-in agent mode
- Git for version control
- Your existing test framework
- Your existing build tools

## When Not to Use This Skill

- For simple find-replace operations (use IDE built-in tools)
- When refactoring requires deep understanding of business logic
- For performance-critical refactoring (requires profiling)
- When tests don't exist (write tests first)
- On production branches (always use feature branches)

## Further Reading

- [Refactoring: Improving the Design of Existing Code](https://martinfowler.com/books/refactoring.html) by Martin Fowler
- [Working Effectively with Legacy Code](https://www.goodreads.com/book/show/44919.Working_Effectively_with_Legacy_Code) by Michael Feathers
- [Cursor Agent Documentation](https://cursor.sh/docs)
