# Project Index: skills.newth.ai

**Generated:** 2026-01-30
**Purpose:** Comprehensive project context for efficient LLM iteration

## Quick Reference

| Aspect | Value |
|--------|-------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 with CSS variables |
| Animation | GSAP + useGSAP hook |
| Type System | TypeScript (strict) |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

## Project Overview

AI-powered skill discovery and installation platform for Claude Code, Gemini CLI, and other AI assistants. Users browse, search, and install "skills" (markdown files that extend AI capabilities).

## Architecture

```
newth-skills/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (SSR wrapper)
│   ├── HomeClient.tsx      # Main client component
│   ├── skill/[skillId]/    # Dynamic skill detail pages
│   ├── workflows/          # Workflow builder feature
│   ├── bundles/            # Skill bundles feature
│   └── ...                 # Other routes
├── src/
│   ├── components/         # React components (35+ components)
│   ├── hooks/              # Custom React hooks (20+ hooks)
│   ├── data/               # Static data (skills, bundles, workflows)
│   ├── config/             # Configuration (categories, assistants)
│   └── lib/                # Utilities (analytics, recommendations)
├── api/                    # Edge API routes (Vercel)
├── skills/                 # Actual skill markdown files (35+)
└── public/                 # Static assets
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                             │
├─────────────────────────────────────────────────────────────┤
│  src/data/skills.ts       → Skill definitions (metadata)    │
│  src/data/bundles.ts      → Curated skill collections       │
│  src/data/workflows.ts    → Workflow configurations         │
│  src/config/categories.ts → Category colors/shapes          │
│  src/config/assistants.ts → AI assistant compatibility      │
│  skills/*.md              → Actual skill content files      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────┤
│  useSkillSearch           → Filter/sort/search skills       │
│  useAIRecommendations     → AI-powered skill suggestions    │
│  useSkillNavigation       → Keyboard navigation             │
│  useTheme                 → Dark/light theme                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  api/recommend.ts         → AI skill recommendations        │
│  api/vote.ts              → Skill voting system             │
│  api/analytics.ts         → Usage tracking                  │
└─────────────────────────────────────────────────────────────┘
```

## Key Types

### Skill Interface
```typescript
interface Skill {
  id: string                    // Unique identifier
  name: string                  // Display name
  description: string           // Short description
  longDescription?: string      // Extended description
  category: CategoryId          // 'development' | 'documents' | 'creative' | 'productivity' | 'business'
  tags: string[]                // Searchable tags
  featured?: boolean            // Show in featured section
  icon: string                  // Unicode icon character
  color: string                 // oklch() color string
  features?: string[]           // Feature list
  useCases?: string[]           // Use case examples
  compatibility?: AssistantId[] // 'claude' | 'gemini' | 'cursor' | 'windsurf' | 'copilot'
  version: string               // Semver version
  lastUpdated: string           // ISO date
  skillFile?: string            // URL to raw markdown
  samplePrompts?: SamplePrompt[] // Example interactions
  contributor?: Contributor     // Attribution
}
```

### Category System
```typescript
type CategoryId = 'development' | 'documents' | 'creative' | 'productivity' | 'business'

const categoryConfig = {
  development: { color: '#30d158', shape: 'circle' },
  documents:   { color: '#ff6961', shape: 'square' },
  creative:    { color: '#64d2ff', shape: 'triangle' },
  productivity:{ color: '#a855f7', shape: 'hexagon' },
  business:    { color: '#ffd60a', shape: 'diamond' },
}
```

## Component Index

### Layout Components
| Component | File | Purpose |
|-----------|------|---------|
| Nav | `src/components/Nav.tsx` | Top navigation bar |
| Footer | `src/components/Footer.tsx` | Site footer |
| Hero | `src/components/Hero.tsx` | Homepage hero section |

### Skill Components
| Component | File | Purpose |
|-----------|------|---------|
| SkillCard | `src/components/SkillCard.tsx` | Skill preview card |
| SkillRecommendations | `src/components/SkillRecommendations.tsx` | AI recommendations display |
| CategoryFilter | `src/components/CategoryFilter.tsx` | Category filter pills |
| CategoryShape | `src/components/CategoryShape.tsx` | Geometric category indicators |
| CompatibilityMatrix | `src/components/CompatibilityMatrix.tsx` | Assistant compatibility grid |

### Interactive Components
| Component | File | Purpose |
|-----------|------|---------|
| SearchInput | `src/components/SearchInput.tsx` | Search box with keyboard shortcuts |
| SortDropdown | `src/components/SortDropdown.tsx` | Sort options dropdown |
| TaskInput | `src/components/TaskInput.tsx` | Natural language task input |
| VoteButton | `src/components/VoteButton.tsx` | Skill voting |
| CompareButton | `src/components/CompareButton.tsx` | Add to comparison |

### Workflow Components
| Component | File | Purpose |
|-----------|------|---------|
| WorkflowBuilder | `src/components/WorkflowBuilder.tsx` | Main workflow editor |
| WorkflowCanvas | `src/components/WorkflowCanvas.tsx` | Visual workflow canvas |
| WorkflowNode | `src/components/WorkflowNode.tsx` | Individual workflow node |
| WorkflowSidebar | `src/components/WorkflowSidebar.tsx` | Workflow tools sidebar |

## Hook Index

### Core Hooks
| Hook | File | Purpose |
|------|------|---------|
| useSkillSearch | `src/hooks/useSkillSearch.ts` | Search, filter, sort skills |
| useAIRecommendations | `src/hooks/useAIRecommendations.ts` | Fetch AI recommendations |
| useKeyboardShortcuts | `src/hooks/useKeyboardShortcuts.ts` | Global keyboard shortcuts |
| useTheme | `src/hooks/useTheme.ts` | Theme management |

### Animation Hooks (GSAP)
| Hook | File | Purpose |
|------|------|---------|
| useScrollReveal | `src/hooks/useScrollReveal.ts` | Scroll-triggered reveals |
| useCardAnimation | `src/hooks/useCardAnimation.ts` | Card entrance animations |
| usePageTransition | `src/hooks/usePageTransition.ts` | Page transition effects |
| useTextReveal | `src/hooks/useTextReveal.ts` | Text reveal animations |
| useStaggerList | `src/hooks/useStaggerList.ts` | Staggered list animations |

### Interaction Hooks
| Hook | File | Purpose |
|------|------|---------|
| useRipple | `src/hooks/useRipple.ts` | Click ripple effect |
| useMagneticHover | `src/hooks/useMagneticHover.ts` | Magnetic cursor effect |
| useButtonPulse | `src/hooks/useButtonPulse.ts` | Button pulse animation |
| useHoverPreview | `src/hooks/useHoverPreview.ts` | Skill preview on hover |

## API Endpoints

### `/api/recommend` - AI Skill Recommendations
**Method:** POST
**Tech:** Vercel AI SDK + OpenAI
**Request:**
```typescript
{ task: string }  // Natural language task description
```
**Response:**
```typescript
{
  recommendations: Array<{
    skillId: string
    reason: string
  }>  // Max 4 recommendations
}
```
**File:** `api/recommend.ts:1-89`

### `/api/vote` - Skill Voting System
**Methods:** GET, POST, DELETE
**Tech:** Neon PostgreSQL via @neondatabase/serverless
**Database:** `votes` table with `skill_id`, `fingerprint` columns

| Method | Purpose | Body |
|--------|---------|------|
| GET | Get vote count | `?skillId=xxx` |
| POST | Add vote | `{ fingerprint: string }` |
| DELETE | Remove vote | `{ fingerprint: string }` |

**File:** `api/vote.ts:1-87`

### `/api/analytics` - Usage Tracking
**Methods:** GET, POST
**Tech:** Neon PostgreSQL
**Database:** `analytics` table with `skill_id`, `event_type` columns

| Method | Purpose | Body |
|--------|---------|------|
| GET | Get view/copy counts | `?skillId=xxx` (optional) |
| POST | Track event | `{ skillId, eventType: 'view' | 'copy' }` |

**File:** `api/analytics.ts:1-87`

### Database Connection
**File:** `api/_lib/db.ts`
**Provider:** Neon Serverless PostgreSQL
**Connection:** Supports multiple env vars: `DATABASE_URL`, `POSTGRES_URL`, or individual `PG*` vars

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage with skill grid |
| `/skill/[skillId]` | `app/skill/[skillId]/page.tsx` | Skill detail page |
| `/workflows` | `app/workflows/page.tsx` | Workflow list |
| `/workflows/[id]` | `app/workflows/[workflowId]/page.tsx` | Workflow builder |
| `/bundles` | `app/bundles/page.tsx` | User bundles |
| `/curated-bundles` | `app/curated-bundles/page.tsx` | Curated collections |
| `/compare` | `app/compare/page.tsx` | Skill comparison |
| `/submit` | `app/submit/page.tsx` | Submit new skill |
| `/request-skill` | `app/request-skill/page.tsx` | Request a skill |
| `/about` | `app/about/page.tsx` | About page |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/analytics` | `app/analytics/page.tsx` | Analytics dashboard |
| `/playground` | `app/playground/page.tsx` | Skill playground |
| `/requests` | `app/requests/page.tsx` | Community requests |
| `/create` | `app/create/page.tsx` | Create new skill |
| `/contribute` | `app/contribute/page.tsx` | Contribution guide |
| `/workflow-builder` | `app/workflow-builder/page.tsx` | Legacy workflow builder |

## Utility Libraries

### `src/lib/analytics.ts`
Client-side analytics tracking with event batching.

### `src/lib/recommendations.ts`
Local skill recommendation logic (fallback for API).

### `src/lib/fingerprint.ts`
Browser fingerprinting for anonymous voting.

### `src/lib/workflowExecutor.ts`
Workflow execution engine for skill chains.

### `src/lib/community.ts`
Community features (requests, submissions).

### `src/lib/sentry.ts`
Error tracking integration.

## Design System

### FLAT DESIGN PRINCIPLES
- **No shadows** (box-shadow, drop-shadow, text-shadow)
- **No glows** or glow effects
- **No blur filters** on shapes (backdrop-blur OK for glass)
- **No gradient orbs** or ambient lighting
- Use **borders** for depth/separation
- Use **opacity variations** (0.05-0.15 for backgrounds)
- Use **transform** for hover states

### CSS Variables
```css
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--glass-highlight: rgba(255, 255, 255, 0.15)
```

### Category Colors (Flat, No Glow)
```css
development: #30d158 (green)
documents:   #ff6961 (coral)
creative:    #64d2ff (blue)
productivity:#a855f7 (purple)
business:    #ffd60a (gold)
```

## Common Tasks

### Add a New Skill
1. Create skill entry in `src/data/skills.ts`
2. Create markdown file in `skills/[skill-name].md`
3. Add to `api/recommend.ts` SKILL_CATALOG if relevant

### Add a New Component
1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Follow flat design principles

### Add a New Route
1. Create directory in `app/[route-name]/`
2. Add `page.tsx` (server component)
3. Add `[Route]Client.tsx` (client component)
4. Add `layout.tsx` if custom metadata needed

### Add Animation
1. Use GSAP hooks from `src/hooks/`
2. Apply via `ref` from hook
3. Common: `useScrollReveal`, `useCardAnimation`

## Testing

```bash
npm run test          # Run tests
npm run test:coverage # With coverage
```

Test files are co-located: `ComponentName.test.tsx`

## Build Commands

```bash
npm run dev           # Development server
npm run build         # Production build
npm run lint          # ESLint
npm run start         # Production server
```

## File Counts

| Directory | Count | Description |
|-----------|-------|-------------|
| app/ | 45 files | Next.js routes |
| src/components/ | 40 files | React components |
| src/hooks/ | 20 files | Custom hooks |
| src/lib/ | 7 files | Utilities |
| skills/ | 36 files | Skill markdown |
| api/ | 4 files | Edge functions |

## Dependencies Summary

### Production
- react 19, react-dom 19
- next 16
- gsap 3.14 + @gsap/react
- tailwindcss 4
- ai, @ai-sdk/openai (Vercel AI SDK)
- zod 4 (validation)

### Development
- typescript 5.9
- vitest 4
- @testing-library/react 16
- eslint 9

## LLM Quick Context

**What is this?** A skill discovery platform for AI assistants (Claude Code, Gemini CLI). Skills are markdown files that extend AI capabilities.

**Key patterns:**
- Server/Client split: `page.tsx` (SSR metadata) → `*Client.tsx` (interactive)
- Skills data: `src/data/skills.ts` (metadata) + `skills/*.md` (content)
- Hooks for everything: search, animations, theme, keyboard
- Flat design: NO shadows, glows, or blur on shapes

**Most common edits:**
- Add skill: `src/data/skills.ts` + `skills/[name].md`
- UI changes: `src/components/` (follow flat design)
- New route: `app/[route]/page.tsx` + `[Route]Client.tsx`
- Animation: Use existing GSAP hooks from `src/hooks/`

**Database:** Neon PostgreSQL (votes + analytics tables)

**Avoid:** shadows, box-shadow, drop-shadow, glow effects, gradient orbs
