# Future-Complete Checklist

Verified as of last update. This project is ready for ongoing development and deployment.

## ✅ CI/CD

- [x] Typecheck, lint, test, build in CI
- [x] Parallel jobs (typecheck, lint, test run concurrently; build depends on all)
- [x] Unit tests (270) run on every push/PR

## ✅ Code Quality

- [x] ESLint passing
- [x] TypeScript strict, typecheck excludes test files
- [x] Pure logic extracted for testability (`filterAndSortSkills`, `skillSearch`)
- [x] Hook tests (`useSkillSearch`)

## ✅ Supabase

- [x] Migrations: `001_profiles`, `002_upvotes`, `003_comments`
- [x] API routes: `/api/vote`, `/api/comments`, auth callback
- [x] Verification: `npm run verify:supabase`, `/api/health/supabase`
- [x] Docs: [SUPABASE.md](SUPABASE.md)
- [ ] **You** must: add env vars to `.env.local` and Vercel, apply migrations

## ✅ Documentation

- [x] [docs/README.md](README.md) – doc index
- [x] [SUPABASE.md](SUPABASE.md) – Supabase setup
- [x] [REFACTORING.md](REFACTORING.md) – TDD & refactoring roadmap
- [x] [TESTING-AND-LINTING.md](TESTING-AND-LINTING.md) – test & lint setup
- [x] `.env.example` – env var template
- [x] README.md – dev commands, stack, links to docs
- [x] CLAUDE.md – design system, structure, commands

## ✅ Visual / UX

- [x] Card hover clipping (overflow-hidden on skill-card)
- [x] Spacing (grid gaps, Featured padding)
- [x] Header (site name + nav links same size)

## ✅ Build & Deploy

- [x] `npm run build` succeeds
- [x] Vercel config (vercel.json) with headers, CSP
- [x] Deploy-ready

## Remaining (Optional)

- E2E in CI (Playwright; currently manual)
- Coverage thresholds
- `eslint-plugin-testing-library` (was unstable)
- Further refactors per [REFACTORING.md](REFACTORING.md)
