---
name: VSCode ↔ Cursor Sync
version: 1.0.0
author: newth.ai
category: development
tags:
  - vscode
  - cursor
  - sync
  - settings
  - extensions
compatibility:
  - claude
  - cursor
  - copilot
---

# VSCode ↔ Cursor Sync

Mirror VSCode keybindings, extensions, and settings to Cursor to maintain a consistent development environment between editors.

## Triggers

Use this skill when the user requests:
- Syncing VSCode settings to Cursor
- Mirroring keybindings between editors
- Sharing extensions across VSCode and Cursor
- Maintaining consistent editor configuration
- Migrating from VSCode to Cursor

Keywords: "vscode", "cursor", "sync", "settings", "keybindings", "extensions", "editor sync"

## Features

- **Keybindings Mirror**: Automatically sync custom keybindings
- **Extension Sync**: Transfer installed extensions between editors
- **Settings Sync**: Share workspace and user settings
- **Theme Sync**: Keep color schemes consistent
- **Snippets Transfer**: Move custom code snippets

## Configuration Locations

### VSCode Paths

**macOS:**
- Settings: `~/Library/Application Support/Code/User/settings.json`
- Keybindings: `~/Library/Application Support/Code/User/keybindings.json`
- Extensions: `~/.vscode/extensions/`
- Snippets: `~/Library/Application Support/Code/User/snippets/`

**Windows:**
- Settings: `%APPDATA%\Code\User\settings.json`
- Keybindings: `%APPDATA%\Code\User\keybindings.json`
- Extensions: `%USERPROFILE%\.vscode\extensions\`
- Snippets: `%APPDATA%\Code\User\snippets\`

**Linux:**
- Settings: `~/.config/Code/User/settings.json`
- Keybindings: `~/.config/Code/User/keybindings.json`
- Extensions: `~/.vscode/extensions/`
- Snippets: `~/.config/Code/User/snippets/`

### Cursor Paths

**macOS:**
- Settings: `~/Library/Application Support/Cursor/User/settings.json`
- Keybindings: `~/Library/Application Support/Cursor/User/keybindings.json`
- Extensions: `~/.cursor/extensions/`
- Snippets: `~/Library/Application Support/Cursor/User/snippets/`

**Windows:**
- Settings: `%APPDATA%\Cursor\User\settings.json`
- Keybindings: `%APPDATA%\Cursor\User\keybindings.json`
- Extensions: `%USERPROFILE%\.cursor\extensions\`
- Snippets: `%APPDATA%\Cursor\User\snippets\`

**Linux:**
- Settings: `~/.config/Cursor/User/settings.json`
- Keybindings: `~/.config/Cursor/User/keybindings.json`
- Extensions: `~/.cursor/extensions/`
- Snippets: `~/.config/Cursor/User/snippets/`

## Sync Workflows

### One-Time Manual Sync

**Step 1: Copy Settings**
```bash
# macOS/Linux
cp ~/Library/Application\ Support/Code/User/settings.json \
   ~/Library/Application\ Support/Cursor/User/settings.json

# Windows (PowerShell)
Copy-Item "$env:APPDATA\Code\User\settings.json" `
          "$env:APPDATA\Cursor\User\settings.json"
```

**Step 2: Copy Keybindings**
```bash
# macOS/Linux
cp ~/Library/Application\ Support/Code/User/keybindings.json \
   ~/Library/Application\ Support/Cursor/User/keybindings.json

# Windows (PowerShell)
Copy-Item "$env:APPDATA\Code\User\keybindings.json" `
          "$env:APPDATA\Cursor\User\keybindings.json"
```

**Step 3: Copy Snippets**
```bash
# macOS/Linux
cp -r ~/Library/Application\ Support/Code/User/snippets/ \
      ~/Library/Application\ Support/Cursor/User/

# Windows (PowerShell)
Copy-Item -Recurse "$env:APPDATA\Code\User\snippets\*" `
                    "$env:APPDATA\Cursor\User\snippets\"
```

**Step 4: Sync Extensions**
```bash
# List VSCode extensions
code --list-extensions > vscode-extensions.txt

# Install in Cursor
cat vscode-extensions.txt | xargs -L 1 cursor --install-extension

# Windows (PowerShell)
code --list-extensions | ForEach-Object { cursor --install-extension $_ }
```

### Automated Sync Script

Create a sync script to automate the process:

**macOS/Linux: `sync-editors.sh`**
```bash
#!/bin/bash

VSCODE_DIR="$HOME/Library/Application Support/Code/User"
CURSOR_DIR="$HOME/Library/Application Support/Cursor/User"

echo "Syncing VSCode → Cursor..."

# Backup existing Cursor settings
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p "$CURSOR_DIR/backups/$timestamp"
cp "$CURSOR_DIR"/*.json "$CURSOR_DIR/backups/$timestamp/" 2>/dev/null || true

# Copy settings
echo "  → Settings..."
cp "$VSCODE_DIR/settings.json" "$CURSOR_DIR/settings.json"

# Copy keybindings
echo "  → Keybindings..."
cp "$VSCODE_DIR/keybindings.json" "$CURSOR_DIR/keybindings.json"

# Copy snippets
echo "  → Snippets..."
cp -r "$VSCODE_DIR/snippets/"* "$CURSOR_DIR/snippets/" 2>/dev/null || true

# Sync extensions
echo "  → Extensions..."
code --list-extensions > /tmp/vscode-extensions.txt
while read extension; do
  echo "    Installing: $extension"
  cursor --install-extension "$extension" --force
done < /tmp/vscode-extensions.txt

echo "✓ Sync complete!"
echo "Restart Cursor to apply changes."
```

**Windows: `sync-editors.ps1`**
```powershell
# PowerShell sync script
$VSCodeDir = "$env:APPDATA\Code\User"
$CursorDir = "$env:APPDATA\Cursor\User"

Write-Host "Syncing VSCode → Cursor..."

# Backup existing Cursor settings
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$CursorDir\backups\$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item "$CursorDir\*.json" $backupDir -ErrorAction SilentlyContinue

# Copy settings
Write-Host "  → Settings..."
Copy-Item "$VSCodeDir\settings.json" "$CursorDir\settings.json"

# Copy keybindings
Write-Host "  → Keybindings..."
Copy-Item "$VSCodeDir\keybindings.json" "$CursorDir\keybindings.json"

# Copy snippets
Write-Host "  → Snippets..."
Copy-Item -Recurse "$VSCodeDir\snippets\*" "$CursorDir\snippets\" -Force

# Sync extensions
Write-Host "  → Extensions..."
$extensions = code --list-extensions
foreach ($ext in $extensions) {
    Write-Host "    Installing: $ext"
    cursor --install-extension $ext --force
}

Write-Host "✓ Sync complete!"
Write-Host "Restart Cursor to apply changes."
```

### Using Settings Sync (Built-in)

Both VSCode and Cursor support Settings Sync via GitHub/Microsoft accounts:

**Enable in VSCode:**
1. Click account icon (bottom-left)
2. Select "Turn on Settings Sync..."
3. Choose what to sync (Settings, Keybindings, Extensions, etc.)
4. Sign in with GitHub or Microsoft

**Enable in Cursor:**
1. Click account icon (bottom-left)
2. Select "Turn on Settings Sync..."
3. Sign in with the same account
4. Your settings will sync automatically

**Note:** Settings Sync stores data in the cloud and syncs across all devices where you're signed in.

### Using Symbolic Links (Advanced)

Share configuration files between editors using symlinks:

**macOS/Linux:**
```bash
# Backup Cursor config
mv ~/Library/Application\ Support/Cursor/User/settings.json \
   ~/Library/Application\ Support/Cursor/User/settings.json.bak

# Create symlink to VSCode settings
ln -s ~/Library/Application\ Support/Code/User/settings.json \
      ~/Library/Application\ Support/Cursor/User/settings.json

# Repeat for keybindings
ln -s ~/Library/Application\ Support/Code/User/keybindings.json \
      ~/Library/Application\ Support/Cursor/User/keybindings.json
```

**Windows (as Administrator):**
```powershell
# Backup Cursor config
Move-Item "$env:APPDATA\Cursor\User\settings.json" `
          "$env:APPDATA\Cursor\User\settings.json.bak"

# Create symlink to VSCode settings
New-Item -ItemType SymbolicLink `
         -Path "$env:APPDATA\Cursor\User\settings.json" `
         -Target "$env:APPDATA\Code\User\settings.json"

# Repeat for keybindings
New-Item -ItemType SymbolicLink `
         -Path "$env:APPDATA\Cursor\User\keybindings.json" `
         -Target "$env:APPDATA\Code\User\keybindings.json"
```

**Pros:**
- Real-time sync (changes in one editor immediately affect the other)
- No manual sync needed

**Cons:**
- Can't have editor-specific settings
- Requires admin/elevated privileges on Windows

## Extension Management

### List All Extensions

```bash
# VSCode
code --list-extensions --show-versions > vscode-extensions.txt

# Cursor
cursor --list-extensions --show-versions > cursor-extensions.txt
```

### Compare Extension Lists

```bash
# Find extensions in VSCode but not in Cursor
comm -23 <(code --list-extensions | sort) \
         <(cursor --list-extensions | sort)

# Find extensions in Cursor but not in VSCode
comm -13 <(code --list-extensions | sort) \
         <(cursor --list-extensions | sort)
```

### Selective Extension Sync

```bash
# Install specific extensions in Cursor
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
```

### Extension Recommendations

Add to workspace `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

This file is recognized by both VSCode and Cursor.

## Common Settings to Sync

### Editor Settings

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "Fira Code, Menlo, Monaco, monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.rulers": [80, 120],
  "editor.minimap.enabled": false,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on"
}
```

### Workbench Settings

```json
{
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  "workbench.sideBar.location": "left",
  "workbench.activityBar.location": "default"
}
```

### Terminal Settings

```json
{
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "Fira Code",
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.cursorBlinking": true
}
```

## Keybinding Examples

Common custom keybindings to sync:

```json
[
  {
    "key": "cmd+shift+d",
    "command": "editor.action.duplicateLine"
  },
  {
    "key": "cmd+k cmd+c",
    "command": "editor.action.addCommentLine"
  },
  {
    "key": "cmd+k cmd+u",
    "command": "editor.action.removeCommentLine"
  },
  {
    "key": "cmd+shift+f",
    "command": "workbench.action.findInFiles"
  }
]
```

## Troubleshooting

### Settings Not Applying

1. Ensure Cursor is completely closed before copying files
2. Check file permissions (should be readable)
3. Verify JSON syntax is valid
4. Restart Cursor after making changes

### Extensions Not Installing

1. Check your internet connection
2. Verify extension ID is correct
3. Try installing one extension at a time
4. Check Cursor's extension marketplace for compatibility

### Symlinks Not Working

1. Windows: Run terminal as Administrator
2. Check that source files exist before creating symlinks
3. Verify symlinks are created correctly: `ls -la` (macOS/Linux) or `dir` (Windows)

### Conflicts with AI Features

Some settings may conflict with Cursor's AI features:

```json
{
  // These settings work well with Cursor's AI
  "editor.inlineSuggest.enabled": true,
  "editor.suggest.preview": true,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  }
}
```

## Best Practices

1. **Backup First**: Always backup existing configurations before syncing
2. **Test Incrementally**: Sync settings, test, then keybindings, then extensions
3. **Use Version Control**: Keep your settings in a Git repository
4. **Document Custom Settings**: Comment your settings.json for clarity
5. **Selective Sync**: Don't sync every setting - some are editor-specific
6. **Regular Updates**: Sync regularly to keep environments consistent
7. **Extension Compatibility**: Check that extensions work in both editors

## Git-Based Sync (Professional Setup)

Create a dotfiles repository for version-controlled syncing:

```bash
# Create dotfiles repo
mkdir ~/dotfiles
cd ~/dotfiles
git init

# Copy configs
mkdir -p vscode cursor
cp ~/Library/Application\ Support/Code/User/*.json vscode/
cp ~/Library/Application\ Support/Cursor/User/*.json cursor/

# Create install script
cat > install.sh << 'EOF'
#!/bin/bash
ln -sf ~/dotfiles/vscode/settings.json \
       ~/Library/Application\ Support/Code/User/settings.json
ln -sf ~/dotfiles/vscode/settings.json \
       ~/Library/Application\ Support/Cursor/User/settings.json
EOF

chmod +x install.sh
git add .
git commit -m "Initial editor config"
git remote add origin <your-repo-url>
git push -u origin main
```

## Platform-Specific Considerations

### macOS
- Use iCloud for automatic backup
- Settings can be symlinked without admin rights

### Windows
- UAC prompts for symlinks (requires admin)
- Use OneDrive for cloud backup
- PowerShell execution policy may need adjustment

### Linux
- Easier symlink management
- Can use rsync for automated sync
- Consider using dotfiles manager like GNU Stow

## Related Tools

- **Settings Sync Extension**: Deprecated in favor of built-in sync
- **Dotfiles Managers**: chezmoi, yadm, GNU Stow
- **Cloud Storage**: Dropbox, iCloud, OneDrive for config backup
- **VS Code CLI**: `code` command for automation
- **Cursor CLI**: `cursor` command for automation
