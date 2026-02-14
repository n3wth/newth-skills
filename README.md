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
npm run dev          # localhost:3000
npm run build
npm run test:unit    # single run
npm run test         # watch mode
```

### Env (optional)

Copy `.env.example` to `.env.local` and add Supabase + Neon credentials for upvotes, comments, and analytics. See [docs/](docs/) for SUPABASE, REFACTORING, and TESTING-AND-LINTING.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run test:unit` | Unit tests |
| `npm run test:e2e` | Playwright E2E |
| `npm run verify:supabase` | Verify Supabase connection |

## Stack

Next.js 16, React 19, Tailwind CSS 4, TypeScript, Supabase, Vercel

## License

MIT
