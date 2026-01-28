---
name: Cursor ↔ Linear Bridge
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - linear
  - workflow
  - automation
  - integration
compatibility:
  - claude
  - cursor
---

# Cursor ↔ Linear Bridge

Create Cursor workspaces from Linear issues with bidirectional sync. Connect issue tracking with development context for seamless workflow automation.

## Triggers

Use this skill when the user wants to:
- Create a Cursor workspace from a Linear issue
- Set up automated workflow between Linear and Cursor
- Generate issue-specific development rules
- Sync development progress back to Linear
- Automate issue-to-workspace workflows

Keywords: "cursor", "linear", "workspace", "issue tracking", "sync", "integration", "workflow automation"

## Features

- **Workspace Generation**: Automatically create Cursor workspaces from Linear issues
- **Auto-Generated Rules**: Create issue-specific `.cursor/rules` files
- **Bidirectional Sync**: Link projects back to Linear with status updates
- **Smart Comments**: Auto-comment with generation summaries and progress
- **Context Preservation**: Transfer issue context to development environment

## Architecture Overview

```
Linear Issue -> Parse & Extract -> Cursor Workspace
     |                                    |
     |<-------- Auto-Comment <------------|
     |                                    |
     |<-------- Status Update <-----------|
```

The bridge:
1. Fetches Linear issue details via API
2. Generates workspace structure with relevant context
3. Creates `.cursor/rules` with issue-specific guidelines
4. Comments on Linear issue with workspace details
5. Tracks development progress and updates Linear

## Setup

### Prerequisites

```bash
# Install Linear SDK
npm install @linear/sdk

# Or for Python
pip install linear-sdk
```

### Environment Variables

```bash
# Linear API key (get from: linear.app/settings/api)
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx

# Optional: Cursor workspace root
CURSOR_WORKSPACE_ROOT=~/cursor-workspaces
```

## Usage Examples

### Fetch Linear Issue and Create Workspace (TypeScript)

```typescript
import { LinearClient } from '@linear/sdk';
import { promises as fs } from 'fs';
import path from 'path';

interface WorkspaceConfig {
  issueId: string;
  title: string;
  description: string;
  labels: string[];
  priority: number;
  teamKey: string;
}

async function createWorkspaceFromIssue(issueIdentifier: string) {
  const linearClient = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY!
  });

  // Fetch issue details
  const issue = await linearClient.issue(issueIdentifier);
  
  if (!issue) {
    throw new Error(`Issue ${issueIdentifier} not found`);
  }

  const team = await issue.team;
  const labels = await issue.labels();
  
  const config: WorkspaceConfig = {
    issueId: issue.identifier,
    title: issue.title,
    description: issue.description || '',
    labels: labels.nodes.map(l => l.name),
    priority: issue.priority,
    teamKey: team?.key || 'TEAM'
  };

  // Create workspace directory
  const workspaceRoot = process.env.CURSOR_WORKSPACE_ROOT || 
                        path.join(process.env.HOME!, 'cursor-workspaces');
  const workspacePath = path.join(
    workspaceRoot,
    `${config.issueId}-${slugify(config.title)}`
  );

  await fs.mkdir(workspacePath, { recursive: true });
  
  // Generate .cursor directory
  const cursorDir = path.join(workspacePath, '.cursor');
  await fs.mkdir(cursorDir, { recursive: true });

  // Create rules file
  await generateCursorRules(cursorDir, config);
  
  // Create context file
  await createContextFile(workspacePath, config);
  
  // Comment on Linear issue
  await commentOnIssue(linearClient, issue, workspacePath);

  console.log(`✓ Workspace created: ${workspacePath}`);
  return workspacePath;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### Generate Issue-Specific Rules

```typescript
async function generateCursorRules(
  cursorDir: string,
  config: WorkspaceConfig
) {
  const rules = `# ${config.issueId}: ${config.title}

## Context
${config.description}

## Labels
${config.labels.map(l => `- ${l}`).join('\n')}

## Priority
${getPriorityText(config.priority)}

## Development Guidelines

### Code Style
- Follow team ${config.teamKey} conventions
- Write tests for all new functionality
- Update documentation as needed

### Issue-Specific Rules
${generateIssueSpecificRules(config)}

### Testing Requirements
- Unit tests for core functionality
- Integration tests for API changes
- E2E tests for user-facing features

### Commit Convention
- Prefix commits with "${config.issueId}: "
- Example: "${config.issueId}: implement authentication flow"

### Before Completing
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Linear issue updated with progress
`;

  await fs.writeFile(
    path.join(cursorDir, 'rules'),
    rules,
    'utf-8'
  );
}

function getPriorityText(priority: number): string {
  const priorities = {
    0: '🔴 Urgent',
    1: '🟠 High',
    2: '🟡 Medium',
    3: '⚪ Low'
  };
  return priorities[priority as keyof typeof priorities] || 'Normal';
}

function generateIssueSpecificRules(config: WorkspaceConfig): string {
  const rules: string[] = [];
  
  // Add label-specific rules
  if (config.labels.includes('bug')) {
    rules.push('- Add regression tests to prevent recurrence');
    rules.push('- Document root cause in commit message');
  }
  
  if (config.labels.includes('feature')) {
    rules.push('- Create feature flag for gradual rollout');
    rules.push('- Update user documentation');
  }
  
  if (config.labels.includes('performance')) {
    rules.push('- Include benchmark results in PR');
    rules.push('- Profile before and after changes');
  }
  
  if (config.labels.includes('security')) {
    rules.push('- Request security review before merge');
    rules.push('- Follow OWASP guidelines');
  }
  
  return rules.length > 0 
    ? rules.join('\n') 
    : '- Follow standard development practices';
}
```

### Create Context File

```typescript
async function createContextFile(
  workspacePath: string,
  config: WorkspaceConfig
) {
  const context = `# ${config.issueId}: ${config.title}

## Issue Description
${config.description}

## Acceptance Criteria
<!-- Add acceptance criteria from Linear issue comments -->

## Related Issues
<!-- Link to related Linear issues -->

## Implementation Notes
<!-- Add your implementation notes here -->

## Progress
- [ ] Initial setup
- [ ] Implementation
- [ ] Testing
- [ ] Documentation
- [ ] Review

## Resources
- Linear Issue: https://linear.app/issue/${config.issueId}
`;

  await fs.writeFile(
    path.join(workspacePath, 'CONTEXT.md'),
    context,
    'utf-8'
  );
}
```

### Comment on Linear Issue

```typescript
async function commentOnIssue(
  client: LinearClient,
  issue: any,
  workspacePath: string
) {
  const comment = `🚀 **Cursor Workspace Created**

A development workspace has been generated for this issue.

**Location:** \`${workspacePath}\`

**Generated Files:**
- \`.cursor/rules\` - Issue-specific development guidelines
- \`CONTEXT.md\` - Issue context and progress tracker

**Next Steps:**
1. Open workspace in Cursor
2. Review the generated rules
3. Start development
4. Update this issue with progress

_Auto-generated by Cursor ↔ Linear Bridge_`;

  await issue.createComment({
    body: comment
  });
}
```

### Python Implementation

```python
from linear_sdk import LinearClient
import os
from pathlib import Path
from typing import List, Dict

class CursorLinearBridge:
    def __init__(self, api_key: str):
        self.client = LinearClient(api_key)
        self.workspace_root = Path(
            os.getenv('CURSOR_WORKSPACE_ROOT', 
                     Path.home() / 'cursor-workspaces')
        )
    
    async def create_workspace(self, issue_id: str) -> Path:
        """Create a Cursor workspace from a Linear issue."""
        # Fetch issue
        issue = await self.client.issue(issue_id)
        
        if not issue:
            raise ValueError(f"Issue {issue_id} not found")
        
        # Create workspace directory
        workspace_name = f"{issue.identifier}-{self._slugify(issue.title)}"
        workspace_path = self.workspace_root / workspace_name
        workspace_path.mkdir(parents=True, exist_ok=True)
        
        # Generate files
        await self._generate_cursor_rules(workspace_path, issue)
        await self._create_context_file(workspace_path, issue)
        
        # Comment on Linear
        await self._comment_on_issue(issue, workspace_path)
        
        return workspace_path
    
    async def _generate_cursor_rules(self, workspace: Path, issue):
        """Generate .cursor/rules file."""
        cursor_dir = workspace / '.cursor'
        cursor_dir.mkdir(exist_ok=True)
        
        labels = await issue.labels()
        label_names = [label.name for label in labels.nodes]
        
        rules = f"""# {issue.identifier}: {issue.title}

## Context
{issue.description or 'No description provided'}

## Labels
{chr(10).join(f'- {label}' for label in label_names)}

## Priority
{self._get_priority_text(issue.priority)}

## Development Guidelines

### Code Style
- Follow project conventions
- Write comprehensive tests
- Update documentation

### Commit Convention
- Prefix: "{issue.identifier}: "
- Be descriptive and concise

### Before Completing
- [ ] All tests pass
- [ ] Code reviewed
- [ ] Docs updated
- [ ] Linear issue updated
"""
        
        (cursor_dir / 'rules').write_text(rules)
    
    async def _create_context_file(self, workspace: Path, issue):
        """Create CONTEXT.md file."""
        context = f"""# {issue.identifier}: {issue.title}

## Description
{issue.description or 'No description'}

## Progress
- [ ] Setup
- [ ] Implementation
- [ ] Testing
- [ ] Review
- [ ] Deploy

## Resources
- Linear: https://linear.app/issue/{issue.identifier}
"""
        
        (workspace / 'CONTEXT.md').write_text(context)
    
    async def _comment_on_issue(self, issue, workspace_path: Path):
        """Add comment to Linear issue."""
        comment = f"""🚀 **Cursor Workspace Created**

Workspace: `{workspace_path}`

**Generated:**
- `.cursor/rules` - Development guidelines
- `CONTEXT.md` - Issue tracker

_Auto-generated by Cursor ↔ Linear Bridge_"""
        
        await issue.create_comment(body=comment)
    
    @staticmethod
    def _slugify(text: str) -> str:
        """Convert text to URL-friendly slug."""
        import re
        text = text.lower()
        text = re.sub(r'[^a-z0-9]+', '-', text)
        return text.strip('-')
    
    @staticmethod
    def _get_priority_text(priority: int) -> str:
        """Get priority emoji and text."""
        priorities = {
            0: '🔴 Urgent',
            1: '🟠 High', 
            2: '🟡 Medium',
            3: '⚪ Low'
        }
        return priorities.get(priority, 'Normal')

# Usage
bridge = CursorLinearBridge(os.getenv('LINEAR_API_KEY'))
workspace = await bridge.create_workspace('PROJ-123')
print(f"Created workspace: {workspace}")
```

## Advanced Features

### Auto-Update Linear on Git Commits

```typescript
import { execSync } from 'child_process';
import { LinearClient } from '@linear/sdk';

async function syncCommitsToLinear(issueId: string) {
  const client = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY!
  });

  // Get recent commits mentioning this issue
  const commits = execSync(
    `git log --grep="${issueId}" --format="%H|%s|%an|%ad" --date=short`,
    { encoding: 'utf-8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, subject, author, date] = line.split('|');
      return { hash: hash.slice(0, 7), subject, author, date };
    });

  if (commits.length === 0) return;

  // Create summary comment
  const comment = `📝 **Development Progress**

**Recent Commits:**
${commits.map(c => `- \`${c.hash}\` ${c.subject} (${c.author})`).join('\n')}

_Last updated: ${new Date().toISOString()}_`;

  const issue = await client.issue(issueId);
  await issue.createComment({ body: comment });
}
```

### Workspace Templates

```typescript
interface WorkspaceTemplate {
  name: string;
  structure: Record<string, string>;
  rules: string;
}

const templates: Record<string, WorkspaceTemplate> = {
  'bug-fix': {
    name: 'Bug Fix',
    structure: {
      'tests/regression.test.ts': '// Add regression tests here',
      'docs/bugfix.md': '// Document the fix',
      'src/fix.ts': '// Implementation'
    },
    rules: `
### Bug Fix Workflow
1. Reproduce the bug
2. Write failing test
3. Fix the bug
4. Verify test passes
5. Document root cause
`
  },
  'feature': {
    name: 'Feature Development',
    structure: {
      'src/feature/index.ts': '// Feature implementation',
      'src/feature/types.ts': '// Type definitions',
      'tests/feature.test.ts': '// Feature tests',
      'docs/feature.md': '// Feature documentation'
    },
    rules: `
### Feature Development
1. Design the feature
2. Implement core functionality
3. Add comprehensive tests
4. Write documentation
5. Create feature flag
`
  }
};

async function createFromTemplate(
  templateName: string,
  workspacePath: string
) {
  const template = templates[templateName];
  
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  // Create directory structure
  for (const [filePath, content] of Object.entries(template.structure)) {
    const fullPath = path.join(workspacePath, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }
}
```

## Best Practices

1. **API Rate Limiting**: Cache Linear data locally to avoid hitting rate limits
2. **Workspace Organization**: Use consistent naming (`ISSUE-ID-title-slug`)
3. **Rule Specificity**: Tailor rules to issue type (bug vs feature vs refactor)
4. **Sync Frequency**: Update Linear on meaningful milestones, not every commit
5. **Security**: Never commit API keys; use environment variables
6. **Cleanup**: Archive completed workspaces to keep directory clean

## Configuration

### Claude Desktop Integration

Add to MCP server config:

```json
{
  "mcpServers": {
    "cursor-linear-bridge": {
      "command": "node",
      "args": ["/path/to/cursor-linear-bridge.js"],
      "env": {
        "LINEAR_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor Settings

Add to `.vscode/settings.json` in workspace:

```json
{
  "cursor.aiRules": [
    ".cursor/rules"
  ],
  "cursor.general.contextFiles": [
    "CONTEXT.md"
  ]
}
```

## Common Workflows

### 1. Start Work on Linear Issue

```bash
# Create workspace
cursor-linear create PROJ-123

# Opens in Cursor with rules loaded
cd ~/cursor-workspaces/PROJ-123-feature-name
cursor .
```

### 2. Update Progress

```bash
# Commit work with issue prefix
git commit -m "PROJ-123: implement authentication"

# Sync to Linear (can be automated via git hook)
cursor-linear sync PROJ-123
```

### 3. Complete Issue

```bash
# Final sync
cursor-linear complete PROJ-123

# Moves Linear issue to Done
# Archives workspace
# Adds completion comment
```

## Troubleshooting

### Linear API Authentication Issues

```typescript
// Test connection
async function testLinearConnection() {
  try {
    const client = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY!
    });
    const viewer = await client.viewer;
    console.log(`✓ Connected as ${viewer.name}`);
  } catch (error) {
    console.error('✗ Authentication failed:', error);
  }
}
```

### Workspace Already Exists

```typescript
async function createWorkspaceFromIssue(
  issueId: string,
  options: { force?: boolean } = {}
) {
  const workspacePath = getWorkspacePath(issueId);
  
  if (await fs.stat(workspacePath).catch(() => false)) {
    if (!options.force) {
      throw new Error(
        `Workspace already exists: ${workspacePath}\n` +
        `Use --force to recreate`
      );
    }
    await fs.rm(workspacePath, { recursive: true });
  }
  
  // Continue with creation...
}
```

## Dependencies

### Node.js
```bash
npm install @linear/sdk
```

### Python
```bash
pip install linear-sdk
```

## Resources

- [Linear API Documentation](https://developers.linear.app/)
- [Linear SDK (TypeScript)](https://github.com/linear/linear/tree/master/packages/sdk)
- [Cursor Documentation](https://cursor.sh/docs)
- [MCP Protocol](https://modelcontextprotocol.io/)
