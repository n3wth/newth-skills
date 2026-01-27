# VS Code Extension for Contextual Skill Suggestions

## Issue Reference
GitHub Issue #71: https://github.com/n3wth/newth-skills/issues/71

## Requirements

### Core Features
1. **VS Code Extension with Skill Browser**
   - Extension that integrates into VS Code
   - Sidebar panel for browsing available skills
   - Search and filter capabilities

2. **Project Type Detection**
   - Analyze project files (package.json, requirements.txt, etc.)
   - Detect tech stack (React, Python, Node.js, etc.)
   - Identify project patterns and frameworks

3. **File-Based Skill Suggestions**
   - Analyze current file content and type
   - Suggest relevant skills based on file context
   - Show suggestions in status bar or sidebar

4. **One-Click Skill Installation**
   - Install skills directly from VS Code
   - Integration with Gemini CLI / Claude Code
   - Copy installation commands

5. **Skill Usage Within Editor**
   - Quick access to skill information
   - View skill features and use cases
   - Link to full skill documentation

### Technical Implementation
- VS Code extension scaffold in `vscode-extension/` directory
- TypeScript-based extension
- Skills data synced from main `src/data/skills.ts`
- Webview for skill browser UI
- Context analysis for intelligent suggestions

### Integration Points
- Main skills catalog from `src/data/skills.ts`
- Gemini CLI installation commands
- Claude Code installation commands
