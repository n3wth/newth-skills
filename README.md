# n3wth/skills

AI assistant skills for Gemini CLI and Claude Code. Markdown files that teach your AI new tricks.

**[skills.newth.ai](https://skills.newth.ai)**

## Install

```bash
curl -sL https://skills.newth.ai/api/install/<skill-name> | bash
```

Or visit the website and click any skill to copy the install command.

## Categories

**Development** - GSAP animations, MCP servers, webapp testing, frontend patterns

**Documents** - DOCX, XLSX, PPTX, PDF generation and manipulation

**Creative** - Algorithmic art, canvas design, typography, theme generation

**Business** - Copywriting, internal comms, dashboard UIs

## How it works

Skills are markdown files with YAML frontmatter. They live in your AI assistant's config directory and work completely offline.

```markdown
---
name: skill-name
category: development
compatibility: [gemini, claude]
---

# Skill Name

Instructions for your AI...
```

## Development

```bash
npm install
npm run dev      # localhost:5173
npm run build
npm run test
```

## Stack

React 19, Vite 7, Tailwind CSS 4, TypeScript, Vercel

## License

MIT
