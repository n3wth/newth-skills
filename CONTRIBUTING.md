# Contributing to skills.newth.ai

## Local Development Setup

```bash
# Clone the repo
git clone https://github.com/n3wth/newth-skills.git
cd newth-skills

# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:5173
```

## Testing Your Changes

Since Vercel previews may require authentication, always test locally:

```bash
# 1. Run the development server
npm run dev

# 2. Build and preview production build
npm run build && npm run preview
# Opens at http://localhost:4173

# 3. Run type checking
npm run typecheck

# 4. Run linting
npm run lint
```

## Verification Checklist

Before marking a PR as ready:

- [ ] `npm run build` completes without errors
- [ ] `npm run typecheck` passes (if available)
- [ ] `npm run lint` passes (if available)
- [ ] Tested in browser at localhost
- [ ] Tested on mobile viewport (use browser dev tools)
- [ ] No console errors in browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Site configuration (categories, commands, site info)
├── data/           # Skill data definitions
├── hooks/          # Custom React hooks
├── pages/          # Route page components
└── index.css       # Global styles and Tailwind theme
```

## Key Files

- `src/data/skills.ts` - Skill definitions and types
- `src/config/site.ts` - Site-wide configuration
- `src/config/categories.ts` - Category colors and shapes
- `src/index.css` - CSS variables and theme

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- GSAP for animations
- React Router for routing

## Creating a PR

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally (see above)
4. Commit with clear message
5. Push and create PR
6. Verify GitHub Actions pass (build check)
