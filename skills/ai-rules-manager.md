---
name: AI Rules Manager
version: 1.0.0
author: newth.ai
category: development
tags:
  - ai
  - cursor
  - rules
  - automation
  - patterns
compatibility:
  - claude
  - cursor
  - windsurf
  - copilot
---

# AI Rules Manager

Generate, version, and manage .cursor/rules files with automatic pattern learning. Learn project conventions and create scoped AI instructions automatically from codebase patterns.

## Triggers

Use this skill when the user wants to:
- Create or update .cursor/rules files
- Auto-generate AI instructions from code patterns
- Version control AI rule configurations
- Compare different rule sets
- Track rule effectiveness
- Create rule templates for common patterns

Keywords: "cursor rules", "ai instructions", "code patterns", "auto-generate rules", "rule versioning", "cursor/rules", ".cursorrules"

## Features

- **Automatic Pattern Learning**: Analyze codebase to detect conventions and generate relevant rules
- **Version Control Integration**: Track rule changes with semantic versioning
- **Rule Comparison**: Diff and merge rule sets from different branches or versions
- **Template Library**: Quick-start templates for common project patterns
- **Effectiveness Tracking**: Monitor which rules are being used and their impact

## Auto-Generating Rules from Code Patterns

### Analyzing Codebase Patterns

```python
# Example: Detecting naming conventions
import ast
import os
from collections import Counter

def analyze_naming_patterns(directory):
    """Analyze naming patterns in Python codebase."""
    patterns = {
        'function_case': Counter(),
        'class_case': Counter(),
        'constant_case': Counter()
    }
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                with open(os.path.join(root, file), 'r') as f:
                    try:
                        tree = ast.parse(f.read())
                        for node in ast.walk(tree):
                            if isinstance(node, ast.FunctionDef):
                                if node.name.islower() and '_' in node.name:
                                    patterns['function_case']['snake_case'] += 1
                                elif node.name[0].islower():
                                    patterns['function_case']['camelCase'] += 1
                            elif isinstance(node, ast.ClassDef):
                                if node.name[0].isupper():
                                    patterns['class_case']['PascalCase'] += 1
                    except:
                        pass
    
    return patterns

# Generate rules based on detected patterns
def generate_naming_rules(patterns):
    """Generate cursor rules from detected patterns."""
    rules = []
    
    # Function naming
    func_style = patterns['function_case'].most_common(1)[0][0]
    rules.append(f"- Use {func_style} for function names")
    
    # Class naming
    class_style = patterns['class_case'].most_common(1)[0][0]
    rules.append(f"- Use {class_style} for class names")
    
    return rules
```

### TypeScript/JavaScript Pattern Detection

```typescript
// Detect component patterns in React projects
import * as fs from 'fs';
import * as path from 'path';

interface PatternAnalysis {
  componentStyle: 'functional' | 'class';
  stateManagement: string[];
  importStyle: 'named' | 'default';
  testFramework: string;
}

function analyzeReactPatterns(projectDir: string): PatternAnalysis {
  const patterns: PatternAnalysis = {
    componentStyle: 'functional',
    stateManagement: [],
    importStyle: 'named',
    testFramework: 'unknown'
  };
  
  // Count functional vs class components
  let functionalCount = 0;
  let classCount = 0;
  
  // Walk through component files
  const componentFiles = findFiles(projectDir, /\.(tsx|jsx)$/);
  
  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Detect component style
    if (content.includes('React.FC') || content.includes('const ') && content.includes('=> {')) {
      functionalCount++;
    }
    if (content.includes('extends React.Component')) {
      classCount++;
    }
    
    // Detect state management
    if (content.includes('useState')) patterns.stateManagement.push('hooks');
    if (content.includes('useReducer')) patterns.stateManagement.push('reducer');
    if (content.includes('from \'redux\'')) patterns.stateManagement.push('redux');
    
    // Detect testing framework
    if (content.includes('jest') || content.includes('describe(')) {
      patterns.testFramework = 'jest';
    }
  });
  
  patterns.componentStyle = functionalCount > classCount ? 'functional' : 'class';
  
  return patterns;
}

function findFiles(dir: string, pattern: RegExp): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}
```

## Rule Templates

### React TypeScript Project

```markdown
# React TypeScript Project Rules

## Component Patterns
- Use functional components with TypeScript
- Prefer named exports for components
- Use React.FC or explicit return types
- Organize components in feature-based folders

## State Management
- Use hooks (useState, useReducer) for local state
- Use Context API for app-wide state
- Keep state close to where it's used

## Styling
- Use CSS Modules or Styled Components
- Follow BEM naming convention for class names
- Use Tailwind utility classes for quick styling

## Testing
- Write tests for all components
- Use React Testing Library
- Aim for 80%+ test coverage
- Test user interactions, not implementation details

## Code Style
- Use ESLint and Prettier
- Maximum line length: 100 characters
- Use trailing commas in multi-line structures
- Prefer const over let, avoid var
```

### Python FastAPI Project

```markdown
# Python FastAPI Project Rules

## Code Organization
- Group related routes in separate router files
- Use Pydantic models for request/response validation
- Keep business logic in service layer
- Use dependency injection for database sessions

## Naming Conventions
- Use snake_case for functions, variables, and files
- Use PascalCase for class names
- Use UPPER_CASE for constants
- Prefix async functions with async_ if not obvious

## Type Hints
- Always use type hints for function parameters and return types
- Use Optional[] for nullable values
- Use Union[] for multiple possible types

## Error Handling
- Use HTTPException for API errors
- Provide clear error messages
- Include error codes in responses
- Log all errors for debugging

## Testing
- Use pytest for all tests
- Write unit tests for services
- Write integration tests for API endpoints
- Use fixtures for common test data
```

## Version Control and Comparison

### Semantic Versioning for Rules

```bash
# .cursor/rules-versions/
# - v1.0.0-base.md
# - v1.1.0-typescript-strict.md
# - v1.2.0-testing-requirements.md
```

### Tracking Rule Changes

```markdown
# .cursor/rules-changelog.md

## v1.2.0 - 2026-01-27

### Added
- Mandatory test coverage requirements (80%+)
- Performance budget rules for API endpoints
- Security scanning requirements

### Changed
- Updated TypeScript config to strict mode
- Modified component structure guidelines

### Deprecated
- Class component patterns (use functional instead)

## v1.1.0 - 2026-01-15

### Added
- ESLint rules for import ordering
- Prettier configuration standards
- Git commit message conventions
```

### Comparing Rule Sets

```bash
# Compare rules between branches
git diff main feature/new-arch -- .cursor/rules

# Show rule evolution
git log -p .cursor/rules

# Compare with previous version
diff .cursor/rules .cursor/rules-versions/v1.0.0-base.md
```

## Rule Effectiveness Tracking

### Monitoring Rule Usage

```markdown
# .cursor/rules-metrics.md

## Week of 2026-01-20

### Most Referenced Rules
1. Component naming conventions (45 times)
2. Type safety requirements (32 times)
3. Test coverage standards (28 times)

### Rules Needing Clarification
- API error handling (5 questions)
- State management patterns (3 questions)

### Compliance Rate
- 92% of PRs follow naming conventions
- 85% meet test coverage requirements
- 78% pass type checking without errors
```

### AI-Generated Compliance Reports

```python
def analyze_pr_compliance(pr_files, rules_config):
    """Check PR compliance with cursor rules."""
    compliance_report = {
        'naming_conventions': True,
        'test_coverage': False,
        'type_safety': True,
        'violations': []
    }
    
    for file in pr_files:
        # Check naming conventions
        if not follows_naming_rules(file, rules_config['naming']):
            compliance_report['naming_conventions'] = False
            compliance_report['violations'].append({
                'file': file,
                'rule': 'naming_conventions',
                'severity': 'warning'
            })
        
        # Check test coverage
        if file.endswith(('.py', '.ts', '.tsx')):
            test_file = get_test_file_path(file)
            if not os.path.exists(test_file):
                compliance_report['test_coverage'] = False
                compliance_report['violations'].append({
                    'file': file,
                    'rule': 'missing_tests',
                    'severity': 'error'
                })
    
    return compliance_report
```

## Quick Start Templates

### Initialize Rules for New Project

```bash
# Detect project type and generate appropriate rules
cursor-rules init --auto-detect

# Use specific template
cursor-rules init --template react-typescript

# Interactive mode
cursor-rules init --interactive
```

### Rule Generation CLI

```python
#!/usr/bin/env python3
"""CLI tool for managing cursor rules."""

import click
import os
from pathlib import Path

@click.group()
def cli():
    """Cursor Rules Manager CLI."""
    pass

@cli.command()
@click.option('--auto-detect', is_flag=True, help='Auto-detect project patterns')
@click.option('--template', type=str, help='Use predefined template')
def init(auto_detect, template):
    """Initialize .cursor/rules file."""
    if auto_detect:
        patterns = analyze_codebase('.')
        rules = generate_rules_from_patterns(patterns)
    elif template:
        rules = load_template(template)
    else:
        rules = interactive_rule_creation()
    
    # Create .cursor directory if it doesn't exist
    os.makedirs('.cursor', exist_ok=True)
    
    # Write rules file
    with open('.cursor/rules', 'w') as f:
        f.write(rules)
    
    click.echo("✓ Created .cursor/rules")

@cli.command()
def analyze():
    """Analyze current codebase and suggest rule improvements."""
    patterns = analyze_codebase('.')
    suggestions = generate_rule_suggestions(patterns)
    
    click.echo("\nSuggested Rule Improvements:")
    for suggestion in suggestions:
        click.echo(f"  • {suggestion}")

@cli.command()
@click.argument('version1')
@click.argument('version2')
def compare(version1, version2):
    """Compare two rule versions."""
    diff = compare_rule_versions(version1, version2)
    click.echo(diff)

if __name__ == '__main__':
    cli()
```

## Best Practices

### Rule Organization

1. **Keep Rules Focused**: Each rule should address one specific concern
2. **Be Specific**: Vague rules lead to inconsistent application
3. **Include Examples**: Show what the rule looks like in practice
4. **Explain Why**: Rules with context are easier to follow
5. **Version Your Rules**: Track changes like code

### Rule Maintenance

1. **Review Regularly**: Update rules as project evolves
2. **Gather Feedback**: Ask team which rules are unclear
3. **Measure Impact**: Track compliance and effectiveness
4. **Remove Obsolete Rules**: Don't let rules accumulate
5. **Document Changes**: Maintain a changelog for rules

### Effective Rule Writing

```markdown
# ❌ Bad Rule
- Write good tests

# ✓ Good Rule
- Write tests for all API endpoints
  - Test happy path with valid data
  - Test error cases (400, 401, 403, 404, 500)
  - Test edge cases (empty strings, null values, boundary conditions)
  - Aim for 80%+ code coverage
  - Example: See tests/api/users_test.py
```

## Integration with Development Workflow

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if code follows cursor rules
python scripts/check-rules-compliance.py

if [ $? -ne 0 ]; then
  echo "Code does not comply with .cursor/rules"
  echo "Run 'cursor-rules check' for details"
  exit 1
fi
```

### CI/CD Integration

```yaml
# .github/workflows/rules-compliance.yml
name: Rules Compliance

on: [pull_request]

jobs:
  check-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check Cursor Rules Compliance
        run: |
          python scripts/check-rules-compliance.py
          
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ This PR does not comply with .cursor/rules. Please review the rules and update your code.'
            })
```

## Dependencies

### Python

```bash
pip install ast click pathlib gitpython
```

### TypeScript/JavaScript

```bash
npm install @typescript-eslint/parser glob fs-extra
```

## Example: Complete Workflow

```bash
# 1. Analyze existing codebase
cursor-rules analyze

# 2. Generate initial rules
cursor-rules init --auto-detect

# 3. Review and customize
vim .cursor/rules

# 4. Commit with version
git add .cursor/rules
git commit -m "feat: add cursor rules v1.0.0"
git tag cursor-rules-v1.0.0

# 5. Check compliance in PR
cursor-rules check

# 6. Update rules based on feedback
cursor-rules analyze
# Edit .cursor/rules based on suggestions

# 7. Version the update
git add .cursor/rules
git commit -m "feat: update cursor rules to v1.1.0"
git tag cursor-rules-v1.1.0

# 8. Compare versions
cursor-rules compare v1.0.0 v1.1.0
```

## Advanced Features

### AI-Powered Rule Refinement

Use AI to continuously improve rules based on code review comments and team feedback:

```python
def refine_rules_from_pr_comments(pr_comments, current_rules):
    """Analyze PR comments to suggest rule improvements."""
    common_issues = extract_common_issues(pr_comments)
    
    suggestions = []
    for issue in common_issues:
        if issue['frequency'] > 3:  # Recurring issue
            suggestion = generate_rule_from_issue(issue)
            suggestions.append(suggestion)
    
    return suggestions
```

### Multi-Project Rule Inheritance

```markdown
# .cursor/rules

# Inherit from organization-wide rules
@import https://company.com/cursor-rules/base.md

# Project-specific overrides
## Component Structure
- Override: Use feature-based folders (not component types)
```
