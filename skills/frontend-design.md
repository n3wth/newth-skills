---
name: Frontend Design
version: 1.4.0
author: newth.ai
category: development
tags:
  - ui
  - react
  - design
  - components
compatibility:
  - gemini
  - claude
---

# Frontend Design

Create distinctive, production-grade frontend interfaces with high design quality. Generate creative, polished UI that avoids generic AI aesthetics with thoughtful typography, spacing, and visual hierarchy.

## Triggers

Use this skill when the user asks to:
- Build web components or pages
- Create landing pages or dashboards
- Design React components
- Style or beautify web UI
- Create HTML/CSS layouts
- Build web applications with visual polish

Keywords: "design", "ui", "landing page", "dashboard", "component", "beautiful", "styled", "modern"

## Design Principles

### Typography
- Use a clear type scale (e.g., 12, 14, 16, 20, 24, 32, 48px)
- Limit to 2 font families maximum
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: slight negative for large headings

### Spacing
- Use a consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Generous whitespace creates visual breathing room
- Group related elements with tighter spacing
- Section padding: 80-120px vertical on desktop

### Color
- Limit primary palette to 3-5 colors
- Use neutral grays for text hierarchy
- Subtle gradients over flat colors for depth
- Ensure WCAG AA contrast ratios

### Visual Hierarchy
- One clear focal point per section
- Size and weight create importance
- Subtle shadows for depth
- Consistent border radius across components

## Usage Examples

### Modern card component

```tsx
interface CardProps {
  title: string
  description: string
  image?: string
}

export function Card({ title, description, image }: CardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-950/5 transition-shadow hover:shadow-lg">
      {image && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  )
}
```

### Hero section with gradient

```tsx
export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
            New release
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Build something
            <span className="block text-indigo-600">remarkable</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-8">
            Create beautiful, functional interfaces that users love.
            No compromises on quality or performance.
          </p>
          <div className="mt-10 flex gap-4">
            <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Get started
            </button>
            <button className="rounded-full px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:ring-gray-400 transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Anti-patterns to Avoid

- Generic blue gradients on everything
- Overuse of rounded corners (pick a consistent radius)
- Too many font weights
- Inconsistent spacing
- Low contrast text
- Generic stock photography
- Centered everything

## Recommended Tools

- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Radix UI**: Accessible primitives
- **shadcn/ui**: Pre-built components
- **Lucide**: Icon library
