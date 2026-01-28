---
name: Cursor Code Review Assistant
version: 1.0.0
author: newth.ai
category: development
tags:
  - code-review
  - cursor
  - quality
  - standards
  - ai-rules
compatibility:
  - cursor
  - claude
  - windsurf
---

# Cursor Code Review Assistant

Review AI-generated code for quality and suggest improvements to your AI rules based on output quality. Ensures generated code meets team standards and continuously improves AI assistant configurations.

## Triggers

Use this skill when the user:
- Wants to review generated code before committing
- Needs to check code against team standards
- Asks for code quality improvements
- Wants to improve Cursor AI rules
- Needs to track quality of AI-generated code

Keywords: "code review", "review code", "check quality", "improve rules", "cursor rules", "AI rules", "code standards", "quality check"

## Features

- **Pre-Commit Quality Review**: Analyze generated code before it's committed to version control
- **Team Standards Validation**: Check code against configurable coding standards and best practices
- **AI Rules Improvement Suggestions**: Identify patterns in code quality issues and suggest rule improvements
- **Quality Metrics Tracking**: Monitor trends in generated code quality over time
- **Context-Aware Analysis**: Review code in the context of the broader codebase and project conventions

## Core Review Process

### 1. Pre-Commit Review Workflow

When reviewing code before commit:

```bash
# First, check what's been generated
git status
git diff

# Review staged changes
git diff --staged
```

**Review checklist:**
- [ ] Code follows project conventions (naming, structure, patterns)
- [ ] No hardcoded values or magic numbers
- [ ] Proper error handling and edge cases
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Tests included or updated
- [ ] Documentation/comments where needed
- [ ] No unnecessary complexity

### 2. Team Standards Validation

#### Configuration File (.cursor/rules)

Define your team's standards in `.cursor/rules` or `.cursorrules`:

```markdown
# Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use async/await over promises
- Follow React best practices (hooks, composition)

# Architecture
- Keep components under 200 lines
- Extract custom hooks for shared logic
- Use proper separation of concerns
- Avoid prop drilling (use context when needed)

# Quality
- Write unit tests for utilities
- Add integration tests for features
- Maintain 80%+ test coverage
- Use meaningful variable names

# Security
- Never commit API keys or secrets
- Sanitize all user inputs
- Use parameterized queries
- Implement proper authentication checks
```

#### Validation Against Standards

For each generated code file, check:

1. **Naming Conventions**
   ```typescript
   // ✅ Good
   const getUserProfile = async (userId: string) => { ... }
   
   // ❌ Bad
   const getprof = (id) => { ... }
   ```

2. **Type Safety**
   ```typescript
   // ✅ Good
   interface User {
     id: string
     name: string
     email: string
   }
   
   // ❌ Bad
   const user: any = { ... }
   ```

3. **Error Handling**
   ```typescript
   // ✅ Good
   try {
     const data = await fetchUser(id)
     return data
   } catch (error) {
     logger.error('Failed to fetch user', { error, userId: id })
     throw new UserNotFoundError(id)
   }
   
   // ❌ Bad
   const data = await fetchUser(id)
   return data
   ```

### 3. AI Rules Improvement

#### Identifying Patterns

Track common issues in generated code:

```markdown
## Issue: Missing Error Handling

**Frequency**: 8/10 recent generations
**Example**:
\```typescript
const result = await api.call()
return result
\```

**Rule Improvement**:
Add to .cursor/rules:
"Always wrap async operations in try-catch blocks with specific error handling and logging"
```

#### Rule Effectiveness Tracking

Keep a changelog of rule improvements:

```markdown
# AI Rules Changelog

## 2026-01-27
- **Added**: Error handling requirement for all async operations
- **Result**: 0/5 recent generations missing error handling ✅
- **Impact**: Reduced production errors by 40%

## 2026-01-20
- **Added**: Explicit typing requirement for all function parameters
- **Result**: 100% type coverage in new code ✅
- **Impact**: Caught 3 potential runtime errors in review
```

### 4. Quality Metrics

Track these metrics for generated code:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Type Coverage** | >95% | Run `tsc --noEmit` and check for `any` types |
| **Test Coverage** | >80% | Run coverage tool (jest, vitest) |
| **Complexity** | <10 cyclomatic | Use ESLint complexity rule |
| **File Length** | <300 lines | Check file line counts |
| **DRY Violations** | 0 | Code review for duplicated logic |

## Usage Examples

### Example 1: Pre-Commit Review

**User Request**: "Review the authentication code I just generated before I commit"

**Review Process**:
```bash
# Check what was generated
git diff src/auth/

# Run linter
npm run lint

# Run type check
npm run type-check

# Run tests
npm test src/auth/
```

**Review Output**:
```markdown
## Code Review: Authentication Module

### ✅ Strengths
- Proper TypeScript types used throughout
- Password hashing implemented correctly
- JWT token generation follows best practices

### ⚠️ Issues Found
1. Missing error handling in `login()` function
   - Line 45: API call not wrapped in try-catch
   - Recommendation: Add error handling with specific error types

2. Hardcoded JWT secret
   - Line 23: Secret directly in code
   - Recommendation: Move to environment variables

3. No rate limiting
   - Login endpoint has no throttling
   - Recommendation: Add rate limiting middleware

### 📋 Before Committing
- [ ] Fix error handling in login function
- [ ] Move JWT secret to .env
- [ ] Add rate limiting (or create follow-up ticket)
- [ ] Add tests for error cases

### 💡 Suggested Rule Improvements
Add to .cursor/rules:
"When generating authentication code:
- Always use environment variables for secrets
- Implement rate limiting on auth endpoints
- Include comprehensive error handling with specific error types
- Add tests for both success and failure cases"
```

### Example 2: Systematic Standards Check

**User Request**: "Check if the new API endpoints follow our team standards"

**Analysis**:
```typescript
// Check against standards from .cursor/rules

// ✅ PASS: TypeScript strict mode
// ✅ PASS: Async/await used consistently
// ✅ PASS: Proper error handling
// ⚠️ WARN: Some files over 200 lines (api/users.ts: 245 lines)
// ❌ FAIL: Missing input validation on 3 endpoints
// ❌ FAIL: No authentication checks on public routes

## Required Changes:
1. Add input validation using Zod or Joi
2. Split large files into smaller modules
3. Add authentication middleware to protected routes
```

### Example 3: Track Quality Over Time

**User Request**: "How has our AI-generated code quality improved this month?"

**Analysis**:
```markdown
## Code Quality Trends - January 2026

### Metrics Comparison
| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Trend |
|--------|--------|--------|--------|--------|-------|
| Type Coverage | 85% | 92% | 94% | 96% | ↗️ +11% |
| Test Coverage | 65% | 70% | 78% | 82% | ↗️ +17% |
| Linting Issues | 45 | 28 | 15 | 8 | ↗️ -82% |
| Security Issues | 3 | 2 | 1 | 0 | ↗️ -100% |

### Rule Improvements Impact
- Added typing requirements → Type coverage +11%
- Enforced test generation → Test coverage +17%
- Added security checklist → Zero security issues

### Recommendations
- Continue current rules
- Add complexity threshold rule
- Consider adding accessibility checks
```

## Review Checklist Template

Copy this checklist for systematic reviews:

```markdown
## Pre-Commit Code Review

### Code Quality
- [ ] Follows naming conventions
- [ ] Proper TypeScript types (no `any`)
- [ ] Functions are single-purpose and focused
- [ ] No code duplication (DRY principle)
- [ ] Appropriate comments for complex logic

### Error Handling
- [ ] All async operations wrapped in try-catch
- [ ] Specific error types used
- [ ] Errors are logged properly
- [ ] User-friendly error messages

### Security
- [ ] No hardcoded secrets or API keys
- [ ] User inputs are validated/sanitized
- [ ] Authentication/authorization implemented
- [ ] No SQL injection vulnerabilities
- [ ] Sensitive data is encrypted

### Testing
- [ ] Unit tests added/updated
- [ ] Integration tests for new features
- [ ] Edge cases covered
- [ ] Test coverage meets threshold (80%+)

### Performance
- [ ] No unnecessary re-renders (React)
- [ ] Database queries optimized
- [ ] Proper caching where appropriate
- [ ] No memory leaks

### Documentation
- [ ] README updated if needed
- [ ] API documentation current
- [ ] Complex logic explained
- [ ] Type definitions documented
```

## AI Rules Template

Starter template for `.cursor/rules` or `.cursorrules`:

```markdown
# Project: [Your Project Name]

## Code Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Prefer interfaces for object shapes
- Use `unknown` over `any` for uncertain types

### React
- Functional components only
- Custom hooks for reusable logic
- Proper dependency arrays
- Avoid inline function definitions in JSX

### Error Handling
- Wrap all async operations in try-catch
- Use specific error classes
- Log errors with context
- Provide user-friendly messages

### Testing
- Unit tests for all utilities
- Integration tests for features
- Minimum 80% coverage
- Test error cases and edge cases

### Security
- No secrets in code
- Validate all inputs
- Use parameterized queries
- Implement proper auth checks

### Performance
- Lazy load large components
- Memoize expensive calculations
- Optimize database queries
- Use appropriate caching

## AI Generation Guidelines

When generating code:
1. Always include TypeScript types
2. Add error handling to all async functions
3. Write tests alongside implementation
4. Follow existing file structure
5. Use project's established patterns
6. Add JSDoc comments for public APIs
7. Consider edge cases and error states
8. Keep functions under 50 lines

## Review Before Committing

Before committing AI-generated code:
- Run linter and fix all issues
- Run type checker
- Run tests and verify coverage
- Review for security issues
- Check for hardcoded values
- Verify error handling
```

## Integration with Development Workflow

### Pre-Commit Hook

Add automatic review to git hooks:

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Running code review checks..."

# Type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# Linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# Tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Security check
npm audit --audit-level=moderate
if [ $? -ne 0 ]; then
  echo "⚠️  Security vulnerabilities found"
  echo "Run: npm audit fix"
  exit 1
fi

echo "✅ All checks passed"
```

### CI/CD Integration

Include quality gates in your pipeline:

```yaml
# .github/workflows/code-review.yml
name: Code Review

on: [pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Type Check
        run: npm run type-check
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Coverage
        run: npm run coverage
      - name: Security Audit
        run: npm audit
```

## Best Practices

1. **Review Immediately**: Review generated code right after generation while context is fresh

2. **Be Specific**: When code fails review, provide specific examples of what's wrong and how to fix it

3. **Update Rules Incrementally**: Don't add too many rules at once; add them as patterns emerge

4. **Track Metrics**: Keep a log of quality metrics to measure improvement over time

5. **Collaborative Review**: Share AI rules with team and refine together based on collective experience

6. **Balance**: Don't be too restrictive; allow for pragmatic solutions when appropriate

7. **Context Matters**: Rules should fit your project's needs, not generic best practices

8. **Iterate**: Continuously refine rules based on what works and what doesn't

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Too many linting errors | Add linting rules to `.cursor/rules` |
| Inconsistent patterns | Document and share preferred patterns |
| Missing tests | Add "always generate tests" to rules |
| Security vulnerabilities | Add security checklist to rules |
| Type errors | Require explicit types in all generations |
| Over-complexity | Set complexity limits in rules |

## Measuring Success

Your AI code review process is working when:

- ✅ Fewer issues found in manual code review
- ✅ Test coverage trending upward
- ✅ Security vulnerabilities trending downward
- ✅ Code consistency improving
- ✅ Time from generation to commit decreasing
- ✅ Team confidence in AI-generated code increasing

## Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Security Best Practices (OWASP)](https://owasp.org/www-project-top-ten/)
