# Refactoring & TDD Roadmap

A plan for making the skills.newth.ai codebase easier to work with at scale and aligned with test-driven development principles.

---

## Current State Summary

**Strengths:**
- Hooks already encapsulate domain logic (`useSkillSearch`, `useAIRecommendations`, `useSkillNavigation`)
- Reusable validators in `src/test/utils.ts` (design system, accessibility, responsive)
- 16 test files, 251 tests, Vitest + Testing Library setup
- Centralised design system (CLAUDE.md) and config (categories, commands)

**Gaps:**
- No tests for `useAIRecommendations`, `useWorkflowState`
- Large monolithic hooks (e.g. `useWorkflowState` ~500 lines)
- Card styling duplicated across components (skill-card + glass-card in many places)
- Vitest only covers `src/`, not `app/` route components
- API routes lack unit tests

---

## 1. Extract Pure Logic for Testability (TDD Foundation)

**Principle:** Pure functions are easy to test. Extract them from hooks and components.

### useSkillSearch
The filtering/sorting logic is buried in `useMemo`. Extract to a pure function:

```ts
// src/lib/skillSearch.ts
export function filterAndSortSkills(
  skills: Skill[],
  options: { category: string; query: string; sort: SortOption }
): Skill[]
```

**TDD flow:** Write tests for `filterAndSortSkills` first, then refactor the hook to call it. The hook becomes thin orchestration (state + side effects).

### useAIRecommendations
Extract local search into a pure function:

```ts
// src/lib/getRecommendations.ts (may already exist - verify)
export function getRecommendations(query: string, skills: Skill[], maxResults: number): RecommendationResult[]
```

### useWorkflowState
The ~500-line hook mixes node operations, connections, save/load, and execution. Split into:
- `workflowNodeOperations.ts` – add, remove, update, validate (pure)
- `workflowConnectionOperations.ts` – start, complete, remove (pure)
- `useWorkflowState` – composes these + React state + modals

---

## 2. Component Architecture for Scale

### Card Abstraction
Multiple components use `skill-card glass-card` with subtle variants (SkillCard, FeaturedCard, SkillOfTheDay, BundleCard, WorkflowCard, SkillRecommendations). Consider:

```tsx
// src/components/SkillCardLink.tsx
interface SkillCardLinkProps {
  skill: Skill
  variant?: 'default' | 'featured' | 'recommendation' | 'of-the-day'
  children: ReactNode
}
```

A shared `SkillCardLink` with `variant` props reduces duplication and centralises design-system changes (e.g. the recent overflow/clipping fix would apply everywhere).

### Page/Client Split
`app/HomeClient.tsx` is 200+ lines with layout, filters, grid, and animations. Consider:
- `HomePageLayout.tsx` – shell, Nav, Footer
- `BrowseSkillsSection.tsx` – filters + grid
- `HomeClient.tsx` – composes sections and wires hooks

Easier to test sections in isolation and to add new sections without bloating one file.

---

## 3. Test Strategy

### Unit Tests (Pure Logic)
- `src/lib/skillSearch.test.ts` – filter and sort behaviours
- `src/lib/analytics.test.ts` – already exists
- `src/lib/workflowNodeOperations.test.ts` – when extracted

### Hook Tests (Integration)
Use `@testing-library/react` and `renderHook`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useSkillSearch } from '../hooks/useSkillSearch'
```

Test state transitions, not implementation details. Mock `localStorage` and `fetch` where needed.

### Component Tests
- Prefer `screen.getByRole` over `getByTestId`
- Test behaviour: "when user clears search, results show all skills"
- Use `renderWithProviders` for components that need Router/context

### E2E (Playwright)
- Critical flows already covered
- Add regression tests for new features before merging

### Coverage Target
Aim for coverage on:
- `src/lib/*` – 90%+ (pure logic)
- `src/hooks/*` – 70%+ (key paths)
- `src/components/*` – 60%+ (critical UI)

---

## 4. TDD Workflow

### Red–Green–Refactor
1. **Red:** Write a failing test that describes the desired behaviour
2. **Green:** Write the minimum code to make it pass
3. **Refactor:** Improve structure without changing behaviour

### When Adding Features
1. Add or extend a test that captures the new behaviour
2. Implement until the test passes
3. Refactor if needed

### When Fixing Bugs
1. Add a regression test that reproduces the bug
2. Fix the implementation
3. Ensure the new test (and existing tests) pass

---

## 5. Suggested Refactoring Order

| Priority | Task | Impact | Effort | Status |
|----------|------|--------|--------|--------|
| 1 | Extract `filterAndSortSkills` from `useSkillSearch` + tests | High – unlocks TDD for search | Low | ✅ Done |
| 2 | Add `useSkillSearch` hook tests | Medium – guards regressions | Low | ✅ Done |
| 3 | Extract `getRecommendations` (if not pure) + tests | Medium | Low |
| 4 | Introduce `SkillCardLink` / card variant abstraction | Medium – reduces duplication | Medium |
| 5 | Split `useWorkflowState` into modules | High – improves maintainability | High |
| 6 | Add Vitest coverage for `app/` or migrate key logic to `src/` | Medium | Medium |
| 7 | Test API routes (`vote`, `comments`) | Medium | Low |

---

## 6. Conventions to Adopt

- **Co-locate tests:** `SkillCard.test.tsx` next to `SkillCard.tsx`
- **Test file naming:** `*.test.ts` or `*.test.tsx`
- **Mock at boundaries:** Mock `fetch`, `localStorage`, Supabase client—not internal modules
- **Avoid testing implementation:** Prefer "user sees X" over "component calls Y"
- **Small, focused tests:** One behaviour per test when practical

---

## 7. CI Integration

Ensure `npm run test` and `npm run lint` run in CI. Consider:
- Fail the build if coverage drops below a threshold
- Run E2E on main/PR branches
- Block merge if design-system tests fail (e.g. shadow/glow checks)
