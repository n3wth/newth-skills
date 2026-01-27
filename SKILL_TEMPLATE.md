# Skill Package Template

Use this template as a reference when implementing skills for newth-skills.

## Directory Structure

```
skill-slug.skill/
├── SKILL.md                    # Metadata + documentation (REQUIRED)
├── scripts/                    # Executable scripts
│   ├── main.py                # Primary implementation (Python)
│   └── helper.sh              # Bash helper scripts
├── templates/                 # Configuration templates
│   ├── config-template.json   # Example configurations
│   └── rules-template.md      # Rules/guidelines templates
├── references/                # API and reference documentation
│   ├── api-guide.md          # API documentation
│   └── integration-guide.md   # Integration instructions
└── assets/                    # Optional visual resources
    └── icon.svg              # Skill icon or visual (optional)
```

## SKILL.md Template

```yaml
---
name: Skill Display Name
slug: skill-slug
description: One-line description of what this skill does
author: Oliver Newth
repo: n3wth/newth-skills
version: 1.0.0
categories: [development, documents, creative, productivity, business]
platforms: [claude-code, gemini-cli, cursor, vscode, copilot]
status: stable
tags: [tag1, tag2, tag3]
---

## Overview

Detailed description of the skill's purpose and capabilities.

## Features

- Feature 1: Description of what it does
- Feature 2: Description of what it does
- Feature 3: Description of what it does

## Installation

```bash
npm install @skill/slug
# or
npx @skill/slug install
```

## Usage

### Basic Usage
```bash
skill-slug [command] [options]
```

### Examples

#### Example 1
Description and code example

#### Example 2
Description and code example

## Configuration

How to configure this skill for different environments.

## Troubleshooting

Common issues and solutions.

## API Reference

Document any APIs or functions the skill exposes.

## Contributing

How others can contribute to this skill.
```

## Python Script Template

```python
#!/usr/bin/env python3
"""
Skill implementation: {Skill Name}

Purpose: {Clear description of what this skill does}

Usage:
    python3 scripts/main.py [command] [options]
"""

import sys
import os
import argparse
from pathlib import Path
from typing import Optional


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Skill: {Skill Name}"
    )

    # Add arguments
    parser.add_argument(
        'command',
        help='Command to execute'
    )
    parser.add_argument(
        '--option',
        help='Optional parameter'
    )

    args = parser.parse_args()

    try:
        # Implement command logic here
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
```

## Bash Script Template

```bash
#!/bin/bash

# Skill: {Skill Name}
# Purpose: {Clear description}

set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Functions
log_info() {
    echo "ℹ️  $*"
}

log_error() {
    echo "❌ $*" >&2
}

main() {
    log_info "Starting skill..."

    # Implement logic here

    log_info "Done!"
    return 0
}

main "$@"
```

## Template Reference

```json
{
  "name": "Example Configuration",
  "version": "1.0.0",
  "description": "Example config for this skill",
  "settings": {
    "enabled": true,
    "option1": "value1"
  }
}
```

## Integration Guide

Steps for integrating this skill:

1. **Validation**: Run `python3 scripts/validate-skill.py <skill_path>`
2. **Testing**: Test scripts independently and with real-world scenarios
3. **Documentation**: Ensure SKILL.md is complete with examples
4. **Registration**: Add to `src/data/skills.ts`
5. **Site Integration**: Add markdown documentation to `skills/` directory
6. **Build Test**: Run `npm run build` to ensure no errors
7. **PR Submission**: Create PR with skill implementation and examples

## Checklist for Implementation

- [ ] Create `skill-slug.skill/` directory structure
- [ ] Write SKILL.md with all required frontmatter fields
- [ ] Implement scripts (Python/Bash) with error handling
- [ ] Create templates in `templates/` directory
- [ ] Write API guides in `references/` directory
- [ ] Test scripts independently
- [ ] Run skill validator: `python3 scripts/validate-skill.py <skill_path>`
- [ ] Test installation instructions
- [ ] Update README/documentation
- [ ] Register in `src/data/skills.ts`
- [ ] Add to `skills/` directory
- [ ] Run `npm run build` and `npm run lint`
- [ ] Create PR with demo/examples
- [ ] Test skill through website

## Common Patterns

### File Reading/Writing
```python
from pathlib import Path

def read_file(path: str) -> str:
    """Read file contents."""
    return Path(path).read_text()

def write_file(path: str, content: str) -> None:
    """Write content to file."""
    Path(path).write_text(content)
```

### Running Commands
```python
import subprocess

def run_command(cmd: list[str], cwd: Optional[str] = None) -> str:
    """Execute command and return output."""
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {result.stderr}")
    return result.stdout
```

### Configuration Loading
```python
import json
import yaml

def load_json_config(path: str) -> dict:
    """Load JSON configuration."""
    return json.loads(Path(path).read_text())

def load_yaml_config(path: str) -> dict:
    """Load YAML configuration."""
    import yaml
    return yaml.safe_load(Path(path).read_text())
```

## Help & Support

- **Issues**: https://github.com/n3wth/newth-skills/issues
- **Discussions**: https://github.com/n3wth/newth-skills/discussions
- **Standards**: See `.cursor/rules` in repository root
