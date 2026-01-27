# Newth Skills VS Code Extension

A VS Code extension that suggests relevant AI coding skills based on your current file and project context.

## Features

### Contextual Skill Suggestions
The extension analyzes your code and project to suggest relevant skills from the Newth Skills catalog.

- **Project Analysis**: Detects your tech stack (languages, frameworks, tools)
- **File-Based Suggestions**: Suggests skills based on the current file's content and imports
- **Smart Matching**: Uses pattern recognition to match skills to your coding context

### Skill Browser
Browse and search the complete skills catalog directly in VS Code.

- Search skills by name, description, or tags
- Filter by category (Development, Documents, Creative, Business)
- View skill details and features
- One-click installation

### One-Click Installation
Install skills directly from VS Code for either Gemini CLI or Claude Code.

- Copy installation commands to clipboard
- Open terminal with pre-filled command
- Configure preferred AI assistant in settings

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Newth Skills"
4. Click Install

## Usage

### View Skill Browser
- Click the Newth Skills icon in the Activity Bar
- Or use Command Palette: `Newth Skills: Show Skill Browser`

### Get Suggestions for Current File
- Right-click in editor and select "Suggest Skills for Current File"
- Or use Command Palette: `Newth Skills: Suggest Skills for Current File`

### Analyze Project
- Use Command Palette: `Newth Skills: Analyze Project Tech Stack`
- This detects your project's languages, frameworks, and tools

### Install a Skill
- Use Command Palette: `Newth Skills: Install Skill`
- Or click "Install" on any skill in the browser

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `newthSkills.preferredAssistant` | Preferred AI assistant (gemini or claude) | `claude` |
| `newthSkills.autoSuggest` | Automatically suggest skills when opening files | `true` |
| `newthSkills.showStatusBarItem` | Show skill suggestions in status bar | `true` |

## Available Skills

The extension includes skills for:

- **Development**: GSAP Animations, MCP Builder, Frontend Design, Webapp Testing, Git Workflow
- **Documents**: PDF Toolkit, Word Documents, Presentations, Spreadsheets
- **Creative**: Algorithmic Art, Canvas Design, Slack GIF Creator, Theme Factory, Typography Selector
- **Business**: Business Panel, Doc Co-authoring, Internal Comms, Copywriting

## How It Works

1. **Project Detection**: Scans for `package.json`, `requirements.txt`, `Cargo.toml`, etc.
2. **Framework Detection**: Identifies React, Vue, GSAP, Playwright, and other frameworks
3. **File Analysis**: Examines imports, patterns, and keywords in your code
4. **Skill Matching**: Scores and ranks skills based on relevance to your context

## Links

- [Newth Skills Website](https://skills.newth.ai)
- [GitHub Repository](https://github.com/n3wth/newth-skills)
- [Report Issues](https://github.com/n3wth/newth-skills/issues)

## License

MIT
