# Random Note Generator

A web-based tool for practising reading musical notes on a stave. Configure a clef, key signature, transposition, and optional timer, then test yourself with randomly generated notes.

**Live site:** [random-notes.jdc-projects.dev](https://random-notes.jdc-projects.dev)

## Features

- Four clefs: Treble, Bass, Alto, Tenor
- 30 key signatures (all major and minor keys)
- Configurable ledger lines above and below the staff
- Single and double accidental support
- Transposition for Bb, Eb, and F instruments (with concert pitch display)
- Optional per-note timer (up to 60 seconds)
- Settings persisted in localStorage
- Responsive design for desktop and mobile

## Tech Stack

- **Framework:** Next.js (App Router, static export)
- **Language:** TypeScript
- **UI:** Mantine + Tabler Icons
- **Music notation:** VexFlow
- **Testing:** Vitest (unit/integration/property), Playwright (e2e)
- **Deployment:** GitHub Pages via GitHub Actions

## Documentation

- [Product Specification](docs/spec.md) — features, UI behaviour, music theory reference
- [Architecture](docs/architecture.md) — project structure, components, state management, VexFlow
- [Music Theory Logic](docs/music-theory.md) — types, algorithms, constants, transposition
- [Testing Strategy](docs/testing.md) — unit, integration, property, and e2e tests
- [Deployment](docs/deployment.md) — CI/CD, scripts, configuration

## Getting Started

### Prerequisites

- Node.js 24+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Build (static export)

```bash
npm run build
```

Outputs to `./out`.

### Serve production build locally

```bash
npm run start
```

Serves `./out` on port 3000. **Requires a prior `npm run build`.**

### Test

```bash
npm test               # Full suite: Vitest → build → Playwright
npm run test:vitest    # Vitest only (unit + integration + property)
npm run test:watch     # Vitest in watch mode
npm run test:e2e       # Playwright only (requires prior build)
```

### Lint & Type Check

```bash
npm run lint
npm run typecheck
```

## Project Structure

```
src/
  app/          # Next.js App Router pages and layout
  components/   # React components (ConfigScreen, NotesScreen, StaveDisplay, etc.)
  lib/          # Music theory logic (note generation, transposition, constants)
  hooks/        # Custom React hooks (useTimer)
tests/          # Test files (unit, integration, property, e2e)
docs/           # Specification and architecture documents
```

## Deployment

Pushes to `trunk` trigger a GitHub Actions workflow that runs the full test suite, builds the static export, and deploys to GitHub Pages at `random-notes.jdc-projects.dev`.
