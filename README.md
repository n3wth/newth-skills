# skills.newth.ai

> **Build animations. Generate documents. Create art.**

AI-powered skill discovery and installation platform for Gemini CLI and Claude Code. Skills are markdown files that teach your AI assistant new capabilities—from GSAP animations to DOCX generation to algorithmic art.

**One command. Works offline. No servers.**

🌐 **[skills.newth.ai](https://skills.newth.ai)**

---

## What is this?

This project provides:

1. **A web platform** ([skills.newth.ai](https://skills.newth.ai)) for discovering and browsing AI skills
2. **A CLI tool** for installing skills into your AI assistant
3. **A VS Code extension** for skill management
4. **A curated library** of community-contributed skills

Skills are simply markdown files with YAML frontmatter that live in your AI assistant's configuration directory. They work completely offline once installed.

---

## Features

- 🎯 **19+ Skills** across development, documents, creative, and business categories
- 📦 **One-command installation** via CLI or web UI
- 🔌 **Works offline** - skills are markdown files, no API calls required
- 🎨 **Beautiful UI** with flat design, GSAP animations, and glass morphism
- 🔍 **Smart discovery** with category filtering and search
- 🤖 **AI-powered recommendations** to suggest relevant skills
- 📊 **Analytics** to track popular skills and improve recommendations
- 🌙 **Dark mode** support with system preference detection

---

## Installation

### Quick Start

Visit [skills.newth.ai](https://skills.newth.ai) and click any skill to copy the install command:

```bash
curl -sL https://skills.newth.ai/api/install/<skill-name> | bash
```

### CLI Tool (Coming Soon)

```bash
npm install -g newth-skills
newth-skills install <skill-name>
```

### VS Code Extension (Coming Soon)

Search for "Newth Skills" in the VS Code marketplace.

---

## Available Skills

### Development
- **Git Workflow** - Branching strategies and commit conventions
- **MCP Builder** - Create Model Context Protocol servers
- **Webapp Testing** - Browser automation and E2E testing
- **GSAP Animations** - Professional web animations
- **Frontend Design** - Modern UI/UX patterns

### Documents
- **DOCX** - Generate Word documents programmatically
- **XLSX** - Create Excel spreadsheets
- **PPTX** - Build PowerPoint presentations
- **PDF** - Generate and manipulate PDFs
- **Doc Coauthoring** - Collaborative document editing

### Creative
- **Algorithmic Art** - Generative art with code
- **Canvas Design** - HTML5 canvas graphics
- **Typography Selector** - Font pairing and hierarchy
- **Theme Factory** - Design system generation
- **Slack GIF Creator** - Custom GIF generation

### Business
- **Copywriting** - Marketing and sales copy
- **Internal Comms** - Team communication templates
- **Business Panel** - Dashboard and analytics UIs

---

## Project Structure

```
.
├── api/                 # Vercel serverless functions
│   ├── analytics.ts     # Skill install tracking
│   ├── recommend.ts     # AI-powered skill recommendations
│   └── vote.ts          # Skill voting system
├── cli/                 # CLI tool for skill installation
├── vscode-extension/    # VS Code extension for skill management
├── skills/              # Markdown skill files with YAML frontmatter
├── src/                 # React web application
│   ├── components/      # Reusable UI components
│   ├── config/          # Site and category configuration
│   ├── data/            # Skill data and types
│   ├── lib/             # Utilities (analytics, etc)
│   └── pages/           # Route components
└── public/              # Static assets
```

---

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/n3wth/newth-skills.git
cd newth-skills

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173
```

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest
npm run test:coverage # Run tests with coverage
```

### Testing Locally

Always test changes locally before pushing:

```bash
# 1. Run development server
npm run dev

# 2. Build and preview production
npm run build && npm run preview

# 3. Run linting
npm run lint

# 4. Run tests
npm run test
```

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Animation**: GSAP with useGSAP hook
- **Routing**: React Router v7

### Backend
- **Hosting**: Vercel
- **Database**: Neon (PostgreSQL)
- **AI**: Vercel AI SDK with OpenAI
- **Analytics**: Sentry

### Tooling
- **TypeScript**: Strict mode enabled
- **ESLint**: TypeScript-aware linting
- **Vitest**: Unit testing framework
- **Testing Library**: React component testing

---

## Design System

This project follows a **flat design philosophy**:

- ✅ **Use**: Borders, opacity variations, transforms
- ❌ **No**: Shadows, glows, gradient orbs, blur effects (except backdrop-blur for glass morphism)

### Category Colors
- **Development**: `#30d158` (green)
- **Documents**: `#ff6961` (coral)
- **Creative**: `#64d2ff` (blue)
- **Business**: `#ffd60a` (gold)

### Category Shapes
- **Development**: Circle
- **Documents**: Square
- **Creative**: Triangle
- **Business**: Diamond

See [CLAUDE.md](CLAUDE.md) for complete design system documentation.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Skill

1. Create a markdown file in `skills/` with YAML frontmatter
2. Add skill metadata to `src/data/skills.ts`
3. Test locally with `npm run dev`
4. Submit a PR

### Skill File Format

```markdown
---
name: Your Skill Name
version: 1.0.0
author: Your Name
category: development|documents|creative|business
tags:
  - tag1
  - tag2
compatibility:
  - gemini
  - claude
---

# Your Skill Name

Description of what your skill does...

## Triggers
Keywords and phrases that should activate this skill...

## Features
List of capabilities...
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Author

**Oliver Newth**  
[newth.ai](https://newth.ai) | [GitHub](https://github.com/n3wth)

---

## Support

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/n3wth/newth-skills/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/n3wth/newth-skills/discussions)
- 🌐 **Website**: [skills.newth.ai](https://skills.newth.ai)
