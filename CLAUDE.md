# skills.newth.ai

AI-powered skill discovery and installation platform for Claude Code and other AI assistants.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **Animation**: GSAP with useGSAP hook
- **Routing**: React Router v6

## Design System

### Core Principles

**FLAT DESIGN ONLY**
- No shadows (box-shadow, drop-shadow, text-shadow)
- No glows or glow effects
- No blur filters on shapes (backdrop-blur for glass morphism is acceptable)
- No gradient orbs or ambient lighting effects
- Use borders for depth and separation instead

### Visual Hierarchy

- Use opacity variations (0.05 - 0.15 for backgrounds)
- Use border colors for visual separation
- Use transform (translateY, scale) for hover states
- Keep animations subtle and purposeful

### Color Palette

```css
/* Category colors - flat, no glow */
development: #30d158 (green)
documents: #ff6961 (coral)
creative: #64d2ff (blue)
business: #ffd60a (gold)

/* UI colors */
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--glass-highlight: rgba(255, 255, 255, 0.15)
```

### Category Shapes

Each category has a distinct shape (no shadows/glows):
- **development**: Circle
- **documents**: Square
- **creative**: Triangle
- **business**: Diamond

### Acceptable Effects

- `backdrop-filter: blur()` for glass morphism on nav/modals
- `transform` for hover interactions
- CSS animations for entrance/exit
- GSAP for complex motion sequences

### Forbidden Effects

- `box-shadow` anywhere
- `drop-shadow()` filter
- `text-shadow`
- Glow animations or pulsing
- Gradient orbs/blurs for ambient effects
- Any "ethereal" or "atmospheric" visual effects

## Project Structure

```
src/
├── components/      # React components
├── config/          # Configuration (categories, site)
├── data/            # Skill data and types
├── lib/             # Utilities (analytics, etc)
├── pages/           # Route pages
└── index.css        # Global styles
```

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

## Component Patterns

### Skill Cards
- Flat border with hover state
- Transform on hover (translateY, scale)
- No shadow on hover

### Glass Elements
- Use `backdrop-filter: blur(20px)` for glass effect
- Subtle border with `--glass-border`
- No box-shadow

### Category Indicators
- Solid color shapes
- No drop-shadow or glow
- Simple SVG with fill color

## Adding New Features

1. Follow flat design principles
2. Use existing CSS variables
3. No shadows or glows under any circumstances
4. Test in both light and dark modes
5. Ensure reduced motion support

## Skills Data

Skills are defined in `src/data/skills.ts` and real skill files exist in `skills/` directory as markdown with YAML frontmatter.

## Deployment

Deployed to Vercel. The `install.sh` endpoint handles skill installation.
