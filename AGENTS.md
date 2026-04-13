# AGENTS.md

Rules and conventions for agents working on this project.

## Project Overview

Random Note Generator — a static Next.js app that displays random musical notes on a stave for sight-reading practice. See `docs/spec.md` for the full product specification, and the following for technical detail:

- [Architecture](docs/architecture.md) — project structure, components, state management, VexFlow
- [Music Theory Logic](docs/music-theory.md) — types, algorithms, constants, transposition
- [Testing Strategy](docs/testing.md) — unit, integration, property, and e2e tests
- [Deployment](docs/deployment.md) — CI/CD, scripts, configuration

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Static export → ./out
npm run start        # Serve ./out on port 3000 (requires prior build)
npm test             # Full suite: Vitest → build → Playwright
npm run test:vitest  # Vitest only (unit + integration + property)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright e2e tests (requires prior build)
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
```

## Test Rules

- **All features must be covered by tests** (unit/integration AND e2e).
- **`npm test` runs the full suite** (Vitest + build + Playwright). Run it before considering any work complete.
- If only test files were changed, only the failing/changed tests need to be re-run.
- If any source files were changed, the full suite must pass.
- **Fix any test failures before finishing.**

## Test Structure

```
tests/
  unit/          # Pure logic tests (Vitest)
  integration/   # Component tests with Testing Library (Vitest)
  property/      # Property-based tests with fast-check (Vitest)
  e2e/           # Browser tests (Playwright)
```

- Unit tests cover: `noteUtils`, `noteGenerator`, `transposition` — all music theory logic.
- Integration tests cover: `ConfigScreen`, `NotesScreen` — component behaviour.
- Property tests use `fast-check` to fuzz note generation with arbitrary configs.
- E2E tests cover: full user flows, timer behaviour, settings persistence, responsive layout.

## Quality Gate

For any source file change, all of the following must pass before the work is considered complete:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test` (full suite: Vitest → build → Playwright)

CI enforces the same checks in the same order (lint, typecheck, then `npm test`), without redundant build steps.

## Documentation

- Keep all docs in `docs/` up-to-date when making changes that affect documented behaviour, architecture, or configuration.
- If a change contradicts or is not covered by existing docs, update the relevant doc before finishing.
- If package scripts or CI behaviour change, update `README.md`, `docs/deployment.md`, and `AGENTS.md` in the same change.

## Code Conventions

- **TypeScript** everywhere — no `any` types.
- **No comments** in code unless explicitly asked for.
- Use **named exports** for components and utilities.
- Use **Mantine components** for all UI elements — do not build custom UI primitives.
- Use **Tabler icons** (`@tabler/icons-react`) for iconography.
- Follow existing file patterns — check neighbouring files for style.

## Architecture

- **Single-page app:** `src/app/page.tsx` is the root. It toggles between `ConfigScreen` and `NotesScreen` via React state (no Next.js routing).
- **Music logic** lives in `src/lib/` — pure functions with no React dependencies. All music theory constants, note generation, transposition, and MIDI conversion are here.
- **Components** in `src/components/` — presentational, receiving data and callbacks via props.
- **Hooks** in `src/hooks/` — reusable React hooks (`useTimer`).
- **State management** is React `useState` in the root page component. No external state library.
- **VexFlow** renders the stave in `StaveDisplay.tsx` using a ref + Factory API. Re-render on note/clef/key change using `useEffect`.

## Implementation Rules

- **Deterministic logic:** pure logic and timer-related code should accept injected randomness/time controls where practical (e.g. `rng` parameter, fake timers) to keep tests deterministic.
- **Rendering hygiene:** `StaveDisplay` must clear previous VexFlow output before re-rendering to avoid duplicate SVG/canvas content.
- **Persistence compatibility:** changes to the localStorage config shape (`random-note-config`) must include backward-compatible defaults or migration logic, plus tests covering the migration path.
- **Accessibility:** interactive UI must remain keyboard-accessible and labelled. Tests should cover keyboard flows and key screen-reader text.
- **Responsive verification:** UI changes must be checked at both mobile (375px) and desktop widths.
- **Dependency preference:** prefer established libraries over custom implementations for UI, notation, storage helpers, and testing. Keep app-specific music logic in `src/lib/`.

## Key Implementation Details

- Transposition offsets: C=0, Bb=-2, Eb=+3, F=-7 semitones (written → concert).
- Key signatures are stored as ordered lists of `{ letter, accidental }` entries.
- Staff positions: 0 = bottom line, 8 = top line. Ledger lines extend by 2 positions per line.
- Enharmonic spelling for concert pitch follows the concert key signature's accidental direction.
- The note reveal (expand/collapse) resets to closed on new runs but persists across Next presses.
- Settings are persisted to localStorage under key `random-note-config`.

## Deployment

- Branch: `trunk`
- Runner: `self-hosted`
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Static export to `./out`, deployed to GitHub Pages
- Domain: `random-notes.jdc-projects.dev` (CNAME in `public/`)
- Tests run in CI before deployment
