---
name: Extension Sync Tool
version: 1.0.0
author: newth.ai
category: development
tags:
  - cursor
  - extensions
  - sync
  - settings
  - backup
compatibility:
  - gemini
  - claude
  - cursor
---

# Extension Sync Tool

Export and sync Cursor extensions and settings across machines. Maintain consistent development environments with centralized configuration management, backup, and restore capabilities.

## Triggers

Use this skill when the user requests:
- Exporting installed Cursor extensions
- Syncing extensions across multiple machines
- Backing up extension configurations
- Restoring extension states
- Managing development environment consistency

Keywords: "cursor", "extensions", "sync", "settings", "backup", "restore", "vscode", "development environment"

## Features

- **Extension Export**: Extract list of all installed extensions with versions
- **Configuration Sync**: Sync settings.json and keybindings across machines
- **Automated Backup**: Create timestamped backups of extension states
- **Selective Restore**: Restore specific extensions or full environment
- **Cross-Platform Support**: Works on macOS, Windows, and Linux

## Core Concepts

### Extension Data Location

Cursor stores extensions and settings in platform-specific directories:

**macOS**:
```
~/Library/Application Support/Cursor/User/
  ├── settings.json
  ├── keybindings.json
  └── extensions/
```

**Windows**:
```
%APPDATA%\Cursor\User\
  ├── settings.json
  ├── keybindings.json
  └── extensions\
```

**Linux**:
```
~/.config/Cursor/User/
  ├── settings.json
  ├── keybindings.json
  └── extensions/
```

## Usage Examples

### Export Installed Extensions

Create a list of all installed extensions:

```bash
#!/bin/bash
# export-extensions.sh

# Get platform-specific paths
if [[ "$OSTYPE" == "darwin"* ]]; then
    CURSOR_PATH="$HOME/Library/Application Support/Cursor"
elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ -n "$WINDIR" ]]; then
    CURSOR_PATH="$APPDATA/Cursor"
else
    CURSOR_PATH="$HOME/.config/Cursor"
fi

# Export extension list
cursor --list-extensions > extensions.txt

# Export with versions
cursor --list-extensions --show-versions > extensions-with-versions.txt

# Create backup directory with timestamp
BACKUP_DIR="cursor-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copy configuration files
cp "$CURSOR_PATH/User/settings.json" "$BACKUP_DIR/"
cp "$CURSOR_PATH/User/keybindings.json" "$BACKUP_DIR/" 2>/dev/null || true

# Copy extensions list
cp extensions-with-versions.txt "$BACKUP_DIR/"

echo "Backup created in $BACKUP_DIR"
```

### Install Extensions from List

Restore extensions on a new machine:

```bash
#!/bin/bash
# install-extensions.sh

# Read extensions file (one per line)
EXTENSIONS_FILE="${1:-extensions.txt}"

if [ ! -f "$EXTENSIONS_FILE" ]; then
    echo "Error: Extensions file not found: $EXTENSIONS_FILE"
    exit 1
fi

# Install each extension
while IFS= read -r extension; do
    if [ -n "$extension" ]; then
        echo "Installing: $extension"
        cursor --install-extension "$extension" --force
    fi
done < "$EXTENSIONS_FILE"

echo "All extensions installed"
```

### Full Sync Script

Complete backup and restore solution:

```bash
#!/bin/bash
# cursor-sync.sh

SYNC_DIR="$HOME/.cursor-sync"
REMOTE_REPO="git@github.com:yourusername/cursor-config.git"

# Platform-specific path
get_cursor_path() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "$HOME/Library/Application Support/Cursor"
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ -n "$WINDIR" ]]; then
        echo "$APPDATA/Cursor"
    else
        echo "$HOME/.config/Cursor"
    fi
}

CURSOR_PATH=$(get_cursor_path)

# Export function
export_config() {
    echo "Exporting Cursor configuration..."
    
    mkdir -p "$SYNC_DIR"
    
    # Export extensions
    cursor --list-extensions --show-versions > "$SYNC_DIR/extensions.txt"
    
    # Copy settings
    cp "$CURSOR_PATH/User/settings.json" "$SYNC_DIR/"
    cp "$CURSOR_PATH/User/keybindings.json" "$SYNC_DIR/" 2>/dev/null || true
    
    # Copy snippets if they exist
    if [ -d "$CURSOR_PATH/User/snippets" ]; then
        cp -r "$CURSOR_PATH/User/snippets" "$SYNC_DIR/"
    fi
    
    # Add metadata
    cat > "$SYNC_DIR/metadata.json" <<EOF
{
  "exported_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform": "$OSTYPE",
  "cursor_version": "$(cursor --version | head -n1)"
}
EOF
    
    echo "Export complete: $SYNC_DIR"
}

# Import function
import_config() {
    echo "Importing Cursor configuration..."
    
    if [ ! -d "$SYNC_DIR" ]; then
        echo "Error: Sync directory not found. Run 'export' first or clone from remote."
        exit 1
    fi
    
    # Install extensions
    if [ -f "$SYNC_DIR/extensions.txt" ]; then
        while IFS= read -r ext; do
            if [ -n "$ext" ]; then
                echo "Installing: $ext"
                cursor --install-extension "$ext" --force
            fi
        done < "$SYNC_DIR/extensions.txt"
    fi
    
    # Copy settings
    cp "$SYNC_DIR/settings.json" "$CURSOR_PATH/User/"
    
    if [ -f "$SYNC_DIR/keybindings.json" ]; then
        cp "$SYNC_DIR/keybindings.json" "$CURSOR_PATH/User/"
    fi
    
    # Copy snippets
    if [ -d "$SYNC_DIR/snippets" ]; then
        cp -r "$SYNC_DIR/snippets" "$CURSOR_PATH/User/"
    fi
    
    echo "Import complete. Restart Cursor to apply changes."
}

# Push to remote repository
push_config() {
    echo "Pushing configuration to remote..."
    
    cd "$SYNC_DIR" || exit 1
    
    if [ ! -d ".git" ]; then
        git init
        git remote add origin "$REMOTE_REPO"
    fi
    
    git add -A
    git commit -m "Update Cursor config - $(date +%Y-%m-%d)"
    git push -u origin main
    
    echo "Configuration pushed to $REMOTE_REPO"
}

# Pull from remote repository
pull_config() {
    echo "Pulling configuration from remote..."
    
    if [ ! -d "$SYNC_DIR" ]; then
        git clone "$REMOTE_REPO" "$SYNC_DIR"
    else
        cd "$SYNC_DIR" || exit 1
        git pull
    fi
    
    echo "Configuration pulled from $REMOTE_REPO"
}

# Main command handler
case "${1:-help}" in
    export)
        export_config
        ;;
    import)
        import_config
        ;;
    push)
        export_config
        push_config
        ;;
    pull)
        pull_config
        import_config
        ;;
    help)
        cat <<EOF
Cursor Sync Tool
Usage: $0 {export|import|push|pull}

Commands:
  export  - Export extensions and settings to local sync directory
  import  - Import extensions and settings from local sync directory
  push    - Export and push to remote Git repository
  pull    - Pull from remote repository and import

Configuration:
  SYNC_DIR: $SYNC_DIR
  REMOTE_REPO: $REMOTE_REPO
EOF
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
```

### Python Alternative

For cross-platform Python implementation:

```python
#!/usr/bin/env python3
"""Cursor Extension Sync Tool"""

import json
import os
import platform
import subprocess
from datetime import datetime
from pathlib import Path

class CursorSync:
    def __init__(self):
        self.cursor_path = self._get_cursor_path()
        self.sync_dir = Path.home() / '.cursor-sync'
        
    def _get_cursor_path(self) -> Path:
        """Get platform-specific Cursor config path"""
        system = platform.system()
        
        if system == 'Darwin':  # macOS
            return Path.home() / 'Library/Application Support/Cursor'
        elif system == 'Windows':
            return Path(os.getenv('APPDATA')) / 'Cursor'
        else:  # Linux
            return Path.home() / '.config/Cursor'
    
    def export_extensions(self) -> list[str]:
        """Export list of installed extensions"""
        result = subprocess.run(
            ['cursor', '--list-extensions', '--show-versions'],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Failed to list extensions: {result.stderr}")
        
        return result.stdout.strip().split('\n')
    
    def export_config(self):
        """Export all configuration to sync directory"""
        self.sync_dir.mkdir(parents=True, exist_ok=True)
        
        # Export extensions
        extensions = self.export_extensions()
        (self.sync_dir / 'extensions.txt').write_text('\n'.join(extensions))
        
        # Copy settings
        user_dir = self.cursor_path / 'User'
        
        settings_src = user_dir / 'settings.json'
        if settings_src.exists():
            (self.sync_dir / 'settings.json').write_text(
                settings_src.read_text()
            )
        
        keybindings_src = user_dir / 'keybindings.json'
        if keybindings_src.exists():
            (self.sync_dir / 'keybindings.json').write_text(
                keybindings_src.read_text()
            )
        
        # Save metadata
        metadata = {
            'exported_at': datetime.utcnow().isoformat(),
            'platform': platform.system(),
            'extensions_count': len(extensions)
        }
        (self.sync_dir / 'metadata.json').write_text(
            json.dumps(metadata, indent=2)
        )
        
        print(f"✓ Exported {len(extensions)} extensions")
        print(f"✓ Configuration saved to {self.sync_dir}")
    
    def import_config(self):
        """Import configuration from sync directory"""
        if not self.sync_dir.exists():
            raise FileNotFoundError(f"Sync directory not found: {self.sync_dir}")
        
        # Install extensions
        extensions_file = self.sync_dir / 'extensions.txt'
        if extensions_file.exists():
            extensions = extensions_file.read_text().strip().split('\n')
            
            for ext in extensions:
                if ext:
                    print(f"Installing: {ext}")
                    subprocess.run(
                        ['cursor', '--install-extension', ext, '--force'],
                        check=False
                    )
        
        # Copy settings
        user_dir = self.cursor_path / 'User'
        user_dir.mkdir(parents=True, exist_ok=True)
        
        settings_src = self.sync_dir / 'settings.json'
        if settings_src.exists():
            (user_dir / 'settings.json').write_text(
                settings_src.read_text()
            )
        
        keybindings_src = self.sync_dir / 'keybindings.json'
        if keybindings_src.exists():
            (user_dir / 'keybindings.json').write_text(
                keybindings_src.read_text()
            )
        
        print("✓ Import complete. Restart Cursor to apply changes.")

def main():
    import sys
    
    sync = CursorSync()
    
    if len(sys.argv) < 2:
        print("Usage: cursor-sync.py {export|import}")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'export':
        sync.export_config()
    elif command == 'import':
        sync.import_config()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()
```

## Configuration Management

### Settings Sync via Git

Create a Git repository for version-controlled settings:

```bash
# Initialize sync repository
cd ~/.cursor-sync
git init
git add .
git commit -m "Initial Cursor configuration"

# Push to remote (GitHub/GitLab)
git remote add origin git@github.com:username/cursor-config.git
git push -u origin main

# On new machine
git clone git@github.com:username/cursor-config.git ~/.cursor-sync
./cursor-sync.sh import
```

### Selective Extension Install

Install only specific categories of extensions:

```python
# extension-categories.json
{
  "essential": [
    "GitHub.copilot",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ],
  "python": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-toolsai.jupyter"
  ],
  "web": [
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag"
  ]
}
```

```python
import json

def install_category(category: str):
    """Install extensions from specific category"""
    with open('extension-categories.json') as f:
        categories = json.load(f)
    
    extensions = categories.get(category, [])
    
    for ext in extensions:
        print(f"Installing: {ext}")
        subprocess.run(['cursor', '--install-extension', ext, '--force'])
    
    print(f"✓ Installed {len(extensions)} extensions from '{category}' category")

# Usage
install_category('essential')
install_category('python')
```

## Best Practices

### 1. Regular Backups

Create automated backups using cron or Task Scheduler:

```bash
# Add to crontab (daily backup at 2 AM)
0 2 * * * /path/to/cursor-sync.sh export && /path/to/cursor-sync.sh push
```

### 2. Version Control

Always version control your sync directory:
- Track changes to settings over time
- Rollback problematic configurations
- Share configurations with team members

### 3. Exclude Machine-Specific Settings

Create a `.gitignore` in your sync directory:

```gitignore
# Machine-specific cache
*.log
*.cache

# OS-specific files
.DS_Store
Thumbs.db
```

### 4. Document Custom Extensions

Maintain a README with extension purposes:

```markdown
# Cursor Extensions

## Essential
- `GitHub.copilot` - AI pair programming
- `esbenp.prettier-vscode` - Code formatting

## Language Support
- `ms-python.python` - Python development
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
```

### 5. Test Before Full Import

Test configuration on a clean profile first:

```bash
# Create test profile
cursor --user-data-dir /tmp/cursor-test

# Import configuration to test
# Verify everything works
# Then import to main profile
```

### 6. Workspace-Specific Settings

Separate workspace settings from user settings:

```json
// .vscode/settings.json (workspace-specific)
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "eslint.workingDirectories": ["./client", "./server"]
}
```

User settings should contain only global preferences.

## Security Considerations

### Sensitive Data

Never commit sensitive data to sync repository:
- API keys
- Auth tokens
- Personal information

Use environment variables or secret managers instead.

### Review Before Sync

Always review changes before pushing:

```bash
# Check what will be synced
git diff

# Review all changes
git status
git diff --cached
```

## Troubleshooting

### Extensions Not Installing

If extensions fail to install:

```bash
# Clear extension cache
rm -rf "$CURSOR_PATH/CachedExtensionVSIXs"

# Reinstall
cursor --install-extension <extension-id> --force
```

### Settings Not Applying

Force reload Cursor configuration:

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Run: "Developer: Reload Window"

### Version Conflicts

Handle extension version conflicts:

```bash
# Install specific version
cursor --install-extension author.extension@1.2.3

# Update all extensions
cursor --update-extensions
```

## Integration with Cloud Storage

### Dropbox/Google Drive Sync

Automatically sync via cloud storage:

```bash
# Create symlink to cloud storage
ln -s ~/Dropbox/cursor-sync ~/.cursor-sync

# Or move and link
mv ~/.cursor-sync ~/Dropbox/
ln -s ~/Dropbox/cursor-sync ~/.cursor-sync
```

### Network Share

For team synchronization:

```bash
# Mount network share
NETWORK_SHARE="//server/cursor-configs"

# Export to network location
./cursor-sync.sh export
cp -r ~/.cursor-sync "$NETWORK_SHARE/$(whoami)/"
```

## Advanced Usage

### CI/CD Integration

Automate environment setup in CI:

```yaml
# .github/workflows/setup-dev.yml
name: Setup Development Environment

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Cursor Extensions
        run: |
          while IFS= read -r ext; do
            cursor --install-extension "$ext" --force
          done < extensions.txt
```

### Multi-Profile Management

Manage different profiles for different projects:

```bash
# Work profile
cursor --user-data-dir ~/.cursor-profiles/work

# Personal profile  
cursor --user-data-dir ~/.cursor-profiles/personal

# Client project
cursor --user-data-dir ~/.cursor-profiles/client-x
```

## Dependencies

```bash
# Cursor CLI must be in PATH
# Git for version control (optional)
# Python 3.7+ for Python scripts (optional)
```

## Related Skills

- Git Workflow - For version controlling configurations
- MCP Builder - For building custom Cursor integrations
- Webapp Testing - For testing extension functionality
