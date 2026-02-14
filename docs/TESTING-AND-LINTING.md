# Testing & Linting

Overview of the testing and linting setup, and how to improve it.

---

## Current Setup

### Linting (ESLint)
- **Config:** `eslint.config.mjs` (flat config)
- **Command:** `npm run lint`
- **Scope:** `src/`, `app/`
- **Plugins:** typescript-eslint, react-hooks
- **Key rules:** hooks rules (error), exhaustive-deps (warn), no-unused-vars (warn), no-explicit-any (warn)

### Type Checking
- **Command:** `npm run typecheck`
- **Config:** `tsconfig.typecheck.json` (excludes test files to avoid jest-dom type augmentation issues)
- **Runs:** `tsc --noEmit` on app/source code only

### Unit Tests (Vitest)
- **Command:** `npm run test` (watch) / `npm run test:unit` (run once)
- **Config:** `vitest.config.ts`
- **Scope:** `src/**/*.{test,spec}.{ts,tsx}`
- **Environment:** jsdom
- **Coverage:** `npm run test:coverage`

### E2E Tests (Playwright)
- **Command:** `npm run test:e2e`
- **Config:** `playwright.config.ts`
- **Scope:** `e2e/**/*.spec.ts`
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, iPad

### CI (`.github/workflows/ci.yml`)
Runs on push/PR to `main`:
1. Type check
2. Lint
3. Unit tests
4. Build

---

## Recent Improvements

| Change | Purpose |
|--------|---------|
| Unit tests in CI | Catch regressions before merge |
| `typecheck` script + tsconfig.typecheck | Fast type verification; excludes test files (Vitest handles test types) |
| Fetch mock in analytics tests | Suppress stderr from `fetch('/api/analytics')` failing in Node |
| Junit reporter for Vitest on CI | Enables test result reporting in GitHub Actions |

---

## Potential Improvements

### Linting
- **eslint-plugin-testing-library** – Enforce Testing Library best practices in test files (e.g. `prefer-screen-queries`, `no-node-access`). Install with `npm i -D eslint-plugin-testing-library` and add a test-files block using `testingLibrary.configs['flat/react']`.
- **eslint-plugin-jsx-a11y** – Accessibility rules for JSX (aria, roles, alt text).
- **Stricter rules** – Consider `@typescript-eslint/no-explicit-any: error` or `consistent-type-imports`.

### Testing
- **Coverage thresholds** – Add `coverage.lines`, `coverage.functions`, etc. to fail the build if coverage drops.
- **Include `app/` in Vitest** – If Next.js app components are testable with jsdom, add `app/**/*.test.{ts,tsx}` to `include`.
- **API route tests** – Unit test `app/api/vote/route.ts` and `app/api/comments/route.ts` with mocked Supabase/Neon.
- **E2E in CI** – Run Playwright on PRs (e.g. Chromium only for speed).

### CI
- **Cache** – `actions/cache` for `node_modules` (already using `cache: 'npm'` on setup-node).
- **Parallel jobs** – Run lint, typecheck, and tests in parallel.
- **Status badges** – Add badges to README for build/test status.

---

## Commands Reference

```bash
npm run lint          # ESLint on src + app
npm run typecheck     # TypeScript (excludes tests)
npm run test          # Vitest watch mode
npm run test:unit     # Vitest single run
npm run test:coverage # Vitest with coverage report
npm run test:e2e      # Playwright E2E
```

---

## Test File Conventions

- Co-locate: `Component.test.tsx` next to `Component.tsx`
- Shared/design tests: `src/test/*.test.tsx`
- Use `screen` over `container.querySelector` when possible
- Mock at boundaries (fetch, localStorage, Supabase); avoid mocking internals
