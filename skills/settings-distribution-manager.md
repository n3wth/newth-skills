---
name: Settings Distribution Manager
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - settings
  - configuration
  - team
  - deployment
compatibility:
  - claude
  - cursor
---

# Settings Distribution Manager

Deploy Cursor settings and rules to entire team with version management. Standardize Cursor configuration across development teams with managed rollouts and automated updates.

## Triggers

Use this skill when the user wants to:
- Deploy Cursor settings to a team
- Manage Cursor configuration versions
- Update deprecated rules across team
- Track team adoption of settings
- Standardize IDE configuration

Keywords: "cursor settings", "team configuration", "deploy settings", "cursor rules", "team standardization", "settings distribution"

## Features

- **Centralized Settings Repository**: Git-based version control for team settings
- **Automated Deployment**: Push settings to team machines via scripts
- **Version Management**: Track and rollback configuration versions
- **Rule Updates**: Auto-detect and update deprecated rules
- **Adoption Tracking**: Monitor which team members are on which versions
- **Compliance Reporting**: Track adherence to team standards

## Architecture

```
Central Repository (Git)
    ├── .cursor/
    │   ├── settings.json       # Global Cursor settings
    │   └── rules/              # Rule files by category
    │       ├── typescript.cursorrules
    │       ├── react.cursorrules
    │       └── security.cursorrules
    ├── deploy/
    │   ├── deploy.sh           # Deployment script
    │   ├── check-version.sh    # Version checking
    │   └── rollback.sh         # Rollback script
    └── version.json            # Version manifest
```

## Setup: Central Repository

### 1. Initialize Settings Repository

```bash
# Create the repository structure
mkdir cursor-team-settings
cd cursor-team-settings
git init

# Create directory structure
mkdir -p .cursor/rules
mkdir deploy
mkdir versions

# Initialize version manifest
cat > version.json << 'EOF'
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-27",
  "rules": {
    "typescript": "1.0.0",
    "react": "1.0.0",
    "security": "1.0.0"
  },
  "deprecatedRules": []
}
EOF

git add .
git commit -m "Initial settings repository"
```

### 2. Add Team Settings

```json
// .cursor/settings.json
{
  "cursor.ai.model": "gpt-4",
  "cursor.ai.temperature": 0.7,
  "cursor.chat.showChatPanel": true,
  "cursor.autocomplete.enabled": true,
  "cursor.autocomplete.delay": 100,
  "cursor.tabs.useSpaces": true,
  "cursor.tabs.tabSize": 2,
  "cursor.editor.formatOnSave": true,
  "cursor.editor.defaultFormatter": "prettier"
}
```

### 3. Create Rule Files

```bash
# .cursor/rules/typescript.cursorrules
---
version: 1.0.0
category: language
---

# TypeScript Rules

- Use strict TypeScript configuration
- Always define explicit return types for functions
- Prefer interfaces over type aliases for object shapes
- Use const assertions for literal types
- Enable noImplicitAny, strictNullChecks, noUnusedLocals
```

```bash
# .cursor/rules/react.cursorrules
---
version: 1.0.0
category: framework
---

# React Rules

- Use functional components with hooks
- Prefer named exports over default exports
- Always destructure props in function parameters
- Use TypeScript for all components
- Keep components under 200 lines
```

```bash
# .cursor/rules/security.cursorrules
---
version: 1.0.0
category: security
---

# Security Rules

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Sanitize all user inputs
- Implement CSRF protection
- Use prepared statements for database queries
```

## Deployment Scripts

### Main Deployment Script

```bash
#!/bin/bash
# deploy/deploy.sh

set -e

REPO_URL="${CURSOR_SETTINGS_REPO:-https://github.com/yourorg/cursor-team-settings.git}"
INSTALL_DIR="$HOME/.cursor-team"
CURSOR_DIR="$HOME/.cursor"

echo "🚀 Deploying Cursor settings..."

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
  echo "📦 Updating settings repository..."
  cd "$INSTALL_DIR"
  git pull origin main
else
  echo "📦 Cloning settings repository..."
  git clone "$REPO_URL" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# Read current version
REMOTE_VERSION=$(jq -r '.version' version.json)
echo "📌 Remote version: $REMOTE_VERSION"

# Check local version
if [ -f "$CURSOR_DIR/.settings-version" ]; then
  LOCAL_VERSION=$(cat "$CURSOR_DIR/.settings-version")
  echo "📌 Local version: $LOCAL_VERSION"
  
  if [ "$LOCAL_VERSION" = "$REMOTE_VERSION" ]; then
    echo "✅ Already on latest version"
    exit 0
  fi
fi

# Backup existing settings
if [ -d "$CURSOR_DIR" ]; then
  BACKUP_DIR="$HOME/.cursor-backup-$(date +%Y%m%d-%H%M%S)"
  echo "💾 Backing up to $BACKUP_DIR"
  cp -r "$CURSOR_DIR" "$BACKUP_DIR"
fi

# Deploy settings
echo "📋 Deploying settings..."
mkdir -p "$CURSOR_DIR"
cp -r .cursor/* "$CURSOR_DIR/"

# Save version
echo "$REMOTE_VERSION" > "$CURSOR_DIR/.settings-version"

# Log deployment
echo "$(date -Iseconds),$REMOTE_VERSION,$USER,$HOSTNAME" >> "$INSTALL_DIR/deployments.log"

echo "✅ Settings deployed successfully!"
echo "📌 Version: $REMOTE_VERSION"

# Check for deprecated rules
bash "$INSTALL_DIR/deploy/check-deprecated.sh"
```

### Version Check Script

```bash
#!/bin/bash
# deploy/check-version.sh

INSTALL_DIR="$HOME/.cursor-team"
CURSOR_DIR="$HOME/.cursor"

if [ ! -f "$INSTALL_DIR/version.json" ]; then
  echo "❌ Settings repository not found. Run deploy.sh first."
  exit 1
fi

REMOTE_VERSION=$(jq -r '.version' "$INSTALL_DIR/version.json")
LOCAL_VERSION=$(cat "$CURSOR_DIR/.settings-version" 2>/dev/null || echo "none")

echo "Local version:  $LOCAL_VERSION"
echo "Remote version: $REMOTE_VERSION"

if [ "$LOCAL_VERSION" != "$REMOTE_VERSION" ]; then
  echo "⚠️  Update available! Run deploy.sh to update."
  exit 1
else
  echo "✅ Up to date"
  exit 0
fi
```

### Deprecated Rules Checker

```bash
#!/bin/bash
# deploy/check-deprecated.sh

INSTALL_DIR="$HOME/.cursor-team"
CURSOR_DIR="$HOME/.cursor"

DEPRECATED=$(jq -r '.deprecatedRules[]' "$INSTALL_DIR/version.json" 2>/dev/null)

if [ -z "$DEPRECATED" ]; then
  echo "✅ No deprecated rules"
  exit 0
fi

echo "⚠️  Deprecated rules detected:"
echo "$DEPRECATED" | while read -r rule; do
  RULE_FILE="$CURSOR_DIR/rules/$rule.cursorrules"
  if [ -f "$RULE_FILE" ]; then
    echo "  - $rule (found in $RULE_FILE)"
  fi
done

echo ""
echo "Run 'bash $INSTALL_DIR/deploy/update-rules.sh' to auto-update"
```

### Auto-Update Rules Script

```bash
#!/bin/bash
# deploy/update-rules.sh

INSTALL_DIR="$HOME/.cursor-team"
CURSOR_DIR="$HOME/.cursor"

echo "🔄 Updating deprecated rules..."

# Read deprecated rules from manifest
jq -r '.deprecatedRules[] | @json' "$INSTALL_DIR/version.json" | while read -r rule_json; do
  OLD_RULE=$(echo "$rule_json" | jq -r '.old')
  NEW_RULE=$(echo "$rule_json" | jq -r '.new')
  
  OLD_FILE="$CURSOR_DIR/rules/$OLD_RULE.cursorrules"
  NEW_FILE="$INSTALL_DIR/.cursor/rules/$NEW_RULE.cursorrules"
  
  if [ -f "$OLD_FILE" ]; then
    echo "  Replacing $OLD_RULE with $NEW_RULE"
    cp "$NEW_FILE" "$CURSOR_DIR/rules/$NEW_RULE.cursorrules"
    rm "$OLD_FILE"
  fi
done

echo "✅ Rules updated"
```

### Rollback Script

```bash
#!/bin/bash
# deploy/rollback.sh

CURSOR_DIR="$HOME/.cursor"

# Find latest backup
LATEST_BACKUP=$(ls -td $HOME/.cursor-backup-* 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backup found"
  exit 1
fi

echo "⏮️  Rolling back to $LATEST_BACKUP"

# Backup current state before rollback
CURRENT_BACKUP="$HOME/.cursor-pre-rollback-$(date +%Y%m%d-%H%M%S)"
cp -r "$CURSOR_DIR" "$CURRENT_BACKUP"
echo "💾 Current state backed up to $CURRENT_BACKUP"

# Restore backup
rm -rf "$CURSOR_DIR"
cp -r "$LATEST_BACKUP" "$CURSOR_DIR"

echo "✅ Rollback complete"
```

## Usage Examples

### For Team Leads: Setting Up Distribution

```bash
# 1. Create settings repository
cd cursor-team-settings
git init
mkdir -p .cursor/rules deploy

# 2. Add your team's settings
cp ~/.cursor/settings.json .cursor/

# 3. Create rule files
# (Add .cursorrules files as shown above)

# 4. Commit and push
git add .
git commit -m "Initial team settings"
git remote add origin git@github.com:yourorg/cursor-team-settings.git
git push -u origin main

# 5. Share deployment command with team
echo "curl -fsSL https://yourorg.github.io/cursor-settings/deploy.sh | bash"
```

### For Team Members: Installing Settings

```bash
# One-time setup
curl -fsSL https://yourorg.github.io/cursor-settings/deploy.sh | bash

# Or manual installation
git clone git@github.com:yourorg/cursor-team-settings.git ~/.cursor-team
bash ~/.cursor-team/deploy/deploy.sh

# Check version
bash ~/.cursor-team/deploy/check-version.sh

# Update to latest
cd ~/.cursor-team && git pull && cd - && bash ~/.cursor-team/deploy/deploy.sh
```

### Automation: Cron Job for Auto-Updates

```bash
# Add to crontab for daily updates
crontab -e

# Check for updates daily at 9 AM
0 9 * * * bash $HOME/.cursor-team/deploy/check-version.sh || bash $HOME/.cursor-team/deploy/deploy.sh
```

## Adoption Tracking

### Collect Deployment Logs

```bash
# deploy/collect-stats.sh
#!/bin/bash

REPO_DIR="$HOME/.cursor-team"
LOG_FILE="$REPO_DIR/deployments.log"

if [ ! -f "$LOG_FILE" ]; then
  echo "No deployments logged yet"
  exit 0
fi

echo "📊 Deployment Statistics"
echo "======================="
echo ""
echo "Total deployments: $(wc -l < "$LOG_FILE")"
echo ""
echo "Latest deployments:"
tail -10 "$LOG_FILE" | column -t -s ','
```

### Central Tracking Server (Optional)

```javascript
// server/track-deployment.js
import express from 'express'
import { appendFile } from 'fs/promises'

const app = express()
app.use(express.json())

app.post('/track', async (req, res) => {
  const { version, user, hostname, timestamp } = req.body
  
  const logEntry = `${timestamp},${version},${user},${hostname}\n`
  await appendFile('deployments.log', logEntry)
  
  res.json({ success: true })
})

app.get('/stats', async (req, res) => {
  // Return deployment statistics
  const stats = await getDeploymentStats()
  res.json(stats)
})

app.listen(3000)
```

## Version Management

### Updating Settings Version

```bash
# Update version in version.json
jq '.version = "1.1.0" | .lastUpdated = "'$(date -I)'"' version.json > tmp.json
mv tmp.json version.json

git add version.json
git commit -m "Bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags
```

### Managing Deprecated Rules

```json
// version.json - Mark rules as deprecated
{
  "version": "2.0.0",
  "lastUpdated": "2026-01-27",
  "rules": {
    "typescript": "2.0.0",
    "react": "2.0.0",
    "security": "1.1.0"
  },
  "deprecatedRules": [
    {
      "old": "legacy-typescript",
      "new": "typescript",
      "reason": "Migrated to new rule format"
    }
  ]
}
```

## Compliance Monitoring

### Check Team Compliance

```bash
#!/bin/bash
# deploy/compliance-check.sh

EXPECTED_VERSION="1.0.0"
CURSOR_DIR="$HOME/.cursor"

if [ ! -f "$CURSOR_DIR/.settings-version" ]; then
  echo "❌ Settings not deployed"
  exit 1
fi

LOCAL_VERSION=$(cat "$CURSOR_DIR/.settings-version")

if [ "$LOCAL_VERSION" != "$EXPECTED_VERSION" ]; then
  echo "⚠️  Non-compliant version: $LOCAL_VERSION (expected: $EXPECTED_VERSION)"
  exit 1
fi

# Check required rules exist
REQUIRED_RULES=("typescript" "react" "security")
for rule in "${REQUIRED_RULES[@]}"; do
  if [ ! -f "$CURSOR_DIR/rules/$rule.cursorrules" ]; then
    echo "❌ Missing required rule: $rule"
    exit 1
  fi
done

echo "✅ Compliant"
exit 0
```

## Best Practices

### For Team Leads

1. **Version Incrementally**: Make small, focused changes to settings
2. **Test Before Deploy**: Test settings locally before pushing to team
3. **Communicate Changes**: Notify team of breaking changes
4. **Maintain Changelog**: Document all setting changes
5. **Backup Strategy**: Keep versioned backups

### For Team Members

1. **Check Regularly**: Run version checks before starting work
2. **Report Issues**: Alert team lead if settings cause problems
3. **Don't Override**: Avoid manual edits to deployed settings
4. **Stay Updated**: Run updates weekly or daily
5. **Read Changelog**: Review changes before updating

### Security Considerations

1. **Access Control**: Limit write access to settings repository
2. **Review Process**: Require pull requests for setting changes
3. **Audit Trail**: Maintain deployment logs
4. **Sensitive Data**: Never commit API keys in settings
5. **Signed Commits**: Use GPG signing for verified changes

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/validate-settings.yml
name: Validate Settings

on:
  pull_request:
    paths:
      - '.cursor/**'
      - 'version.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate JSON syntax
        run: |
          jq empty .cursor/settings.json
          jq empty version.json
      
      - name: Check version bump
        run: |
          # Ensure version was incremented
          git fetch origin main
          OLD_VERSION=$(git show origin/main:version.json | jq -r '.version')
          NEW_VERSION=$(jq -r '.version' version.json)
          if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
            echo "Error: Version must be bumped"
            exit 1
          fi
      
      - name: Validate rules format
        run: |
          for file in .cursor/rules/*.cursorrules; do
            # Check for YAML frontmatter
            if ! grep -q "^---" "$file"; then
              echo "Error: $file missing frontmatter"
              exit 1
            fi
          done
```

## Troubleshooting

### Settings Not Applying

```bash
# Check Cursor settings directory
ls -la ~/.cursor

# Verify version file
cat ~/.cursor/.settings-version

# Check for conflicts
diff -r ~/.cursor ~/.cursor-team/.cursor
```

### Deployment Failed

```bash
# Check repository connectivity
git ls-remote $CURSOR_SETTINGS_REPO

# Verify permissions
ls -la ~/.cursor-team

# Review logs
tail -50 ~/.cursor-team/deployments.log
```

### Rollback Issues

```bash
# List available backups
ls -la ~/.cursor-backup-*

# Manual rollback
cp -r ~/.cursor-backup-YYYYMMDD-HHMMSS ~/.cursor
```

## Dependencies

```bash
# Required tools
- git (version control)
- jq (JSON processing)
- bash 4.0+ (deployment scripts)
- curl (for remote deployment)
- column (optional, for formatted output)
```

## Advanced Features

### Multi-Environment Support

```bash
# Different settings per environment
.cursor/
  ├── settings.prod.json
  ├── settings.dev.json
  └── settings.staging.json

# Deploy with environment variable
CURSOR_ENV=prod bash deploy/deploy.sh
```

### Custom Rule Categories

```bash
# Organize rules by project or team
.cursor/rules/
  ├── frontend/
  │   ├── react.cursorrules
  │   └── css.cursorrules
  ├── backend/
  │   ├── nodejs.cursorrules
  │   └── database.cursorrules
  └── shared/
      └── security.cursorrules
```

### Interactive Setup Wizard

```bash
#!/bin/bash
# setup-wizard.sh

echo "🧙 Cursor Settings Setup Wizard"
echo "================================"
echo ""

read -p "Repository URL: " REPO_URL
read -p "Update frequency (daily/weekly): " FREQUENCY

# Configure auto-update
case $FREQUENCY in
  daily)
    CRON="0 9 * * *"
    ;;
  weekly)
    CRON="0 9 * * 1"
    ;;
esac

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON bash $HOME/.cursor-team/deploy/deploy.sh") | crontab -

echo "✅ Setup complete!"
```

## Resources

- Cursor Documentation: https://cursor.sh/docs
- Git Best Practices: https://git-scm.com/docs/gitworkflows
- Team Configuration Management: Enterprise patterns for IDE settings distribution
