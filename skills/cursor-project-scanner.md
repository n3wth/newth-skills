---
name: Cursor Project Scanner
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - configuration
  - audit
  - devtools
compatibility:
  - claude
  - cursor
---

# Cursor Project Scanner

Audit Cursor configuration health and identify configuration gaps across projects. Ensure all projects have optimal Cursor configuration with comprehensive compliance reports.

## Triggers

Use this skill when the user wants to:
- Audit Cursor configuration health
- Find projects missing .cursor/rules
- Identify outdated or missing Cursor configurations
- Generate compliance reports for Cursor setups
- Ensure consistent Cursor configuration across multiple projects

Keywords: "cursor config", "cursor audit", "cursor rules", ".cursor", "configuration health", "cursor compliance"

## Features

- **Configuration Health Audit**: Scan projects for Cursor configuration completeness
- **Missing Rules Detection**: Identify projects without .cursor/rules files
- **Outdated Configuration Detection**: Check for outdated Cursor settings
- **Compliance Reporting**: Generate detailed reports on configuration status
- **Multi-Project Scanning**: Audit multiple projects simultaneously

## Usage Examples

### Scan a single project

```bash
# Navigate to project directory
cd /path/to/project

# Check for Cursor configuration
if [ -d ".cursor" ]; then
  echo "✓ .cursor directory exists"
  
  # Check for rules file
  if [ -f ".cursor/rules" ]; then
    echo "✓ .cursor/rules file exists"
    echo "Rules content:"
    cat .cursor/rules
  else
    echo "✗ Missing .cursor/rules file"
  fi
  
  # Check for other Cursor config files
  if [ -f ".cursorrules" ]; then
    echo "✓ .cursorrules file exists"
  fi
else
  echo "✗ No .cursor directory found"
fi
```

### Scan multiple projects

```bash
#!/bin/bash
# cursor-audit.sh - Scan multiple projects for Cursor configuration

PROJECTS_DIR="$HOME/projects"
REPORT_FILE="cursor-audit-$(date +%Y%m%d).txt"

echo "Cursor Configuration Audit Report" > "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Counter variables
total_projects=0
projects_with_cursor=0
projects_with_rules=0
projects_missing_config=0

# Scan all directories
for project in "$PROJECTS_DIR"/*; do
  if [ -d "$project" ]; then
    total_projects=$((total_projects + 1))
    project_name=$(basename "$project")
    
    echo "Checking: $project_name" >> "$REPORT_FILE"
    
    has_cursor_dir=false
    has_rules=false
    
    if [ -d "$project/.cursor" ]; then
      has_cursor_dir=true
      projects_with_cursor=$((projects_with_cursor + 1))
      echo "  ✓ .cursor directory found" >> "$REPORT_FILE"
      
      if [ -f "$project/.cursor/rules" ]; then
        has_rules=true
        projects_with_rules=$((projects_with_rules + 1))
        echo "  ✓ .cursor/rules file found" >> "$REPORT_FILE"
        
        # Check rules file size and last modified
        rules_size=$(wc -c < "$project/.cursor/rules")
        rules_modified=$(stat -f "%Sm" -t "%Y-%m-%d" "$project/.cursor/rules" 2>/dev/null || stat -c "%y" "$project/.cursor/rules" 2>/dev/null | cut -d' ' -f1)
        echo "    Size: $rules_size bytes, Last modified: $rules_modified" >> "$REPORT_FILE"
      else
        echo "  ✗ .cursor/rules file missing" >> "$REPORT_FILE"
      fi
    fi
    
    if [ -f "$project/.cursorrules" ]; then
      echo "  ✓ .cursorrules file found" >> "$REPORT_FILE"
    fi
    
    if [ "$has_cursor_dir" = false ]; then
      projects_missing_config=$((projects_missing_config + 1))
      echo "  ✗ No Cursor configuration found" >> "$REPORT_FILE"
    fi
    
    echo "" >> "$REPORT_FILE"
  fi
done

# Summary
echo "========================================" >> "$REPORT_FILE"
echo "SUMMARY" >> "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "Total projects scanned: $total_projects" >> "$REPORT_FILE"
echo "Projects with .cursor directory: $projects_with_cursor" >> "$REPORT_FILE"
echo "Projects with .cursor/rules: $projects_with_rules" >> "$REPORT_FILE"
echo "Projects missing configuration: $projects_missing_config" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Calculate percentage
if [ $total_projects -gt 0 ]; then
  coverage=$((projects_with_rules * 100 / total_projects))
  echo "Configuration coverage: $coverage%" >> "$REPORT_FILE"
fi

echo "Report saved to: $REPORT_FILE"
cat "$REPORT_FILE"
```

### Python-based scanner

```python
#!/usr/bin/env python3
"""
Cursor Configuration Scanner
Audit Cursor configuration across multiple projects
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class CursorScanner:
    def __init__(self, projects_dir: str):
        self.projects_dir = Path(projects_dir)
        self.results: List[Dict] = []
    
    def scan_project(self, project_path: Path) -> Dict:
        """Scan a single project for Cursor configuration."""
        result = {
            'name': project_path.name,
            'path': str(project_path),
            'has_cursor_dir': False,
            'has_rules_file': False,
            'has_cursorrules': False,
            'rules_size': 0,
            'rules_last_modified': None,
            'status': 'missing',
            'issues': []
        }
        
        # Check .cursor directory
        cursor_dir = project_path / '.cursor'
        if cursor_dir.exists() and cursor_dir.is_dir():
            result['has_cursor_dir'] = True
            
            # Check .cursor/rules file
            rules_file = cursor_dir / 'rules'
            if rules_file.exists() and rules_file.is_file():
                result['has_rules_file'] = True
                result['rules_size'] = rules_file.stat().st_size
                result['rules_last_modified'] = datetime.fromtimestamp(
                    rules_file.stat().st_mtime
                ).isoformat()
                
                # Check if rules file is not empty
                if result['rules_size'] == 0:
                    result['issues'].append('Rules file is empty')
                
                # Check if rules file is recent (within 6 months)
                age_days = (datetime.now() - datetime.fromtimestamp(
                    rules_file.stat().st_mtime
                )).days
                if age_days > 180:
                    result['issues'].append(f'Rules file is {age_days} days old')
            else:
                result['issues'].append('Missing .cursor/rules file')
        else:
            result['issues'].append('No .cursor directory found')
        
        # Check .cursorrules file
        cursorrules = project_path / '.cursorrules'
        if cursorrules.exists():
            result['has_cursorrules'] = True
        
        # Determine overall status
        if result['has_rules_file'] and len(result['issues']) == 0:
            result['status'] = 'healthy'
        elif result['has_cursor_dir'] or result['has_cursorrules']:
            result['status'] = 'partial'
        else:
            result['status'] = 'missing'
        
        return result
    
    def scan_all_projects(self) -> List[Dict]:
        """Scan all projects in the directory."""
        if not self.projects_dir.exists():
            raise ValueError(f"Directory not found: {self.projects_dir}")
        
        self.results = []
        for item in self.projects_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                result = self.scan_project(item)
                self.results.append(result)
        
        return self.results
    
    def generate_report(self) -> str:
        """Generate a human-readable report."""
        lines = []
        lines.append("=" * 60)
        lines.append("Cursor Configuration Audit Report")
        lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lines.append("=" * 60)
        lines.append("")
        
        # Group by status
        by_status = {
            'healthy': [],
            'partial': [],
            'missing': []
        }
        
        for result in self.results:
            by_status[result['status']].append(result)
        
        # Report by status
        for status, projects in by_status.items():
            if not projects:
                continue
            
            status_label = {
                'healthy': '✓ HEALTHY',
                'partial': '⚠ PARTIAL',
                'missing': '✗ MISSING'
            }[status]
            
            lines.append(f"{status_label} ({len(projects)} projects)")
            lines.append("-" * 60)
            
            for proj in projects:
                lines.append(f"  {proj['name']}")
                if proj['issues']:
                    for issue in proj['issues']:
                        lines.append(f"    - {issue}")
            lines.append("")
        
        # Summary statistics
        total = len(self.results)
        healthy = len(by_status['healthy'])
        partial = len(by_status['partial'])
        missing = len(by_status['missing'])
        
        lines.append("=" * 60)
        lines.append("SUMMARY")
        lines.append("=" * 60)
        lines.append(f"Total projects scanned: {total}")
        lines.append(f"Healthy configurations: {healthy} ({healthy*100//total if total else 0}%)")
        lines.append(f"Partial configurations: {partial} ({partial*100//total if total else 0}%)")
        lines.append(f"Missing configurations: {missing} ({missing*100//total if total else 0}%)")
        
        return "\n".join(lines)
    
    def export_json(self, output_file: str):
        """Export results as JSON."""
        report = {
            'generated': datetime.now().isoformat(),
            'projects': self.results,
            'summary': {
                'total': len(self.results),
                'healthy': sum(1 for r in self.results if r['status'] == 'healthy'),
                'partial': sum(1 for r in self.results if r['status'] == 'partial'),
                'missing': sum(1 for r in self.results if r['status'] == 'missing'),
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)


# Usage example
if __name__ == '__main__':
    import sys
    
    projects_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/projects')
    
    scanner = CursorScanner(projects_dir)
    scanner.scan_all_projects()
    
    # Print report
    print(scanner.generate_report())
    
    # Export JSON
    json_file = f'cursor-audit-{datetime.now().strftime("%Y%m%d")}.json'
    scanner.export_json(json_file)
    print(f"\nJSON report saved to: {json_file}")
```

## Configuration Files

### .cursor/rules

The `.cursor/rules` file contains project-specific instructions for Cursor:

```
# Project-specific Cursor rules
# Add guidelines, coding standards, and context

## Code Style
- Use TypeScript for all new code
- Follow ESLint rules strictly
- Use functional components in React

## Architecture
- Follow Clean Architecture principles
- Keep components under 200 lines
- Use composition over inheritance

## Testing
- Write tests for all new features
- Maintain 80%+ code coverage
- Use Vitest for testing
```

### .cursorrules

Alternative configuration file at project root:

```
You are an expert in TypeScript, React, and modern web development.

Key Principles:
- Write concise, maintainable code
- Follow the project's existing patterns
- Prioritize performance and accessibility

Code Style:
- Use TypeScript with strict mode
- Prefer functional programming patterns
- Use descriptive variable names
```

## Best Practices

### Configuration Management

1. **Consistency**: Use the same configuration structure across all projects
2. **Documentation**: Keep rules files well-documented and up-to-date
3. **Version Control**: Always commit `.cursor/rules` and `.cursorrules` to git
4. **Regular Audits**: Run configuration audits monthly or after major changes

### Rules File Content

1. **Project Context**: Include brief project description and tech stack
2. **Coding Standards**: Define code style, naming conventions, patterns
3. **Architecture Guidelines**: Document architectural decisions and patterns
4. **Testing Requirements**: Specify testing expectations and coverage goals
5. **Common Pitfalls**: List known issues and how to avoid them

### Audit Workflow

1. **Initial Scan**: Run scanner to establish baseline
2. **Identify Gaps**: Prioritize projects missing configurations
3. **Create Configurations**: Add rules files to projects
4. **Validate**: Re-run scanner to verify improvements
5. **Monitor**: Set up regular audits to maintain compliance

## Dependencies

### Bash script
```bash
# Standard Unix utilities (stat, date, wc)
# Available on macOS and Linux
```

### Python script
```bash
pip install pathlib  # Usually included in Python 3
```

## Integration

### CI/CD Integration

Add to GitHub Actions workflow:

```yaml
name: Cursor Config Audit

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check Cursor Configuration
        run: |
          if [ ! -f ".cursor/rules" ] && [ ! -f ".cursorrules" ]; then
            echo "::warning::Missing Cursor configuration"
            exit 1
          fi
          
          if [ -f ".cursor/rules" ]; then
            size=$(wc -c < .cursor/rules)
            if [ "$size" -lt 100 ]; then
              echo "::warning::Cursor rules file is too small ($size bytes)"
            fi
          fi
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Verify Cursor configuration exists
if [ ! -f ".cursor/rules" ] && [ ! -f ".cursorrules" ]; then
  echo "Warning: No Cursor configuration found"
  echo "Consider adding .cursor/rules or .cursorrules"
fi
```

## Troubleshooting

### Common Issues

**Issue**: Scanner reports false positives
- **Solution**: Check file permissions and ensure files are readable

**Issue**: Rules file detected but marked as outdated
- **Solution**: Update the rules file content and commit changes

**Issue**: Can't find projects directory
- **Solution**: Verify the path and ensure it exists

**Issue**: Python scanner fails with import errors
- **Solution**: Ensure Python 3.7+ is installed and required modules are available

## Advanced Features

### Custom Validation Rules

```python
def validate_rules_content(rules_file: Path) -> List[str]:
    """Validate the content of a rules file."""
    issues = []
    content = rules_file.read_text()
    
    # Check for minimum content
    if len(content) < 100:
        issues.append("Rules file is too short (< 100 characters)")
    
    # Check for required sections
    required_sections = ['Code Style', 'Architecture', 'Testing']
    for section in required_sections:
        if section not in content:
            issues.append(f"Missing '{section}' section")
    
    return issues
```

### Automated Fixes

```python
def create_default_rules(project_path: Path):
    """Create a default .cursor/rules file."""
    cursor_dir = project_path / '.cursor'
    cursor_dir.mkdir(exist_ok=True)
    
    rules_file = cursor_dir / 'rules'
    default_content = """# Cursor Rules
    
## Project Context
Add project description here.

## Code Style
- Use consistent formatting
- Follow linting rules
- Write self-documenting code

## Architecture
- Keep it simple
- Follow established patterns
- Document major decisions

## Testing
- Test critical paths
- Maintain reasonable coverage
"""
    
    rules_file.write_text(default_content)
    print(f"Created default rules at {rules_file}")
```
