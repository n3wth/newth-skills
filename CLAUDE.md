# skills.newth.ai

AI-powered skill discovery and installation platform for Claude Code and other AI assistants.

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Animation**: GSAP with useGSAP hook
- **Data**: Supabase (auth, upvotes, comments), Neon (anonymous votes)

## Design System

### Core Principles

**LIQUID GLASS (iOS 26 inspired)**
- Glass material: backdrop-blur + translucent backgrounds + inset highlights
- Solid black background
- Depth through translucency, not elevation
- No pseudo-element overlays (no ::before/::after gradients on cards)

### Visual Hierarchy

- Glass card with backdrop-filter blur, border, inset shadow
- Border brightens on hover
- Keep animations subtle and purposeful

### Color Palette

```css
/* Category colors */
development: #30d158 (green)
documents: #ff6961 (coral)
creative: #64d2ff (blue)
business: #ffd60a (gold)

/* Liquid Glass variables */
--glass-bg: rgba(255, 255, 255, 0.06)
--glass-border: rgba(255, 255, 255, 0.08)
--glass-highlight: rgba(255, 255, 255, 0.18)
--glass-blur: blur(20px) saturate(180%)
--glass-inset: inset 0 1px 0 0 rgba(255, 255, 255, 0.12)

/* Background */
Solid black (#000000) - no gradient mesh
```

### Category Shapes

Each category has a distinct shape:
- **development**: Circle
- **documents**: Square
- **creative**: Triangle
- **business**: Diamond

### Glass Card Variants

- `.glass-card` - Standard glass (blur 20px, 20px radius)
- `.glass-card--featured` - 24px radius variant
- `.glass-card--hero` - 24px radius variant

### Allowed Effects

- `backdrop-filter: blur()` with `saturate()` for glass material
- `box-shadow: inset` for top-edge highlight
- `transform` for hover interactions
- CSS/GSAP animations for entrance/motion

### Forbidden Effects

- `drop-shadow()` filter
- `text-shadow`
- Outer `box-shadow` (elevation shadows)
- Pseudo-element gradient overlays (::before/::after with gradients)
- Bright/neon glow animations

## Project Structure

```
app/                 # Next.js App Router (pages, API routes)
src/
├── components/      # React components
├── config/          # Configuration (categories, site)
├── data/            # Skill data and types
├── lib/             # Utilities (analytics, supabase)
└── index.css        # Global styles
supabase/
└── migrations/      # Supabase schema (profiles, upvotes, comments)
docs/                # SUPABASE.md, REFACTORING.md, TESTING-AND-LINTING.md
```

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run test:unit    # Unit tests
npm run verify:supabase  # Verify Supabase connection
```

## Component Patterns

### Skill Cards
- Glass card with backdrop-filter blur
- No movement on hover (no translateY, no scale)
- Border brightens on hover

### Glass Elements
- Use `backdrop-filter: var(--glass-blur)` for glass effect
- Border with `--glass-border`, inset highlight with `--glass-inset`

### Category Indicators
- Solid color shapes
- Simple SVG with fill color

## Adding New Features

1. Follow Liquid Glass design principles
2. Use existing CSS variables (--glass-*)
3. Only inset box-shadows (for glass highlight effect)
4. Test reduced motion support
5. Use glass-card variant classes for appropriate depth level

## Skills Data

Skills are defined in `src/data/skills.ts` and real skill files exist in `skills/` directory as markdown with YAML frontmatter.

## Telemetry

Web Vitals (LCP, CLS, INP, FCP, TTFB) are collected via [Axiom](https://app.axiom.co) (`next-axiom`) and PostHog (`capture_performance`). Data flows to the `vercel` dataset in Axiom. Only production deployments send data.

- Axiom dashboard: https://app.axiom.co
- PostHog web vitals: https://us.posthog.com (Web Analytics > Web Vitals)

## Deployment

Deployed to Vercel. The `install.sh` endpoint handles skill installation.
