# Testing Strategy

See also: [Architecture](architecture.md) | [Music Theory Logic](music-theory.md) | [Deployment](deployment.md)

---

## Test Commands

```bash
npm test               # Full suite: Vitest + build + Playwright
npm run test:vitest    # Vitest only (unit + integration + property)
npm run test:watch     # Vitest in watch mode
npm run test:e2e       # Playwright only (requires prior `npm run build`)
```

---

## Test Structure

```
tests/
  unit/          # Pure logic tests (Vitest)
  integration/   # Component tests with Testing Library (Vitest)
  property/      # Property-based tests with fast-check (Vitest)
  e2e/           # Browser tests (Playwright)
```

---

## 1. Unit Tests (Vitest)

### `noteUtils.test.ts`

- Note-to-MIDI conversion for all 12 chromatic pitches across multiple octaves.
- MIDI-to-note conversion round-trip: `midiToNote(noteToMidi(n))` equals `n` for all natural notes.
- Edge cases: boundary octaves, double sharps, double flats.

### `noteGenerator.test.ts`

- With 0 ledger lines, all generated notes fall within staff positions 0–8.
- With N ledger lines above/below, positions extend correctly.
- Accidentals disabled → only in-key notes generated (verify over many iterations).
- Single accidentals enabled → sharp/flat/natural variants appear.
- Double accidentals enabled → double-sharp/double-flat variants appear.
- Generated notes respect the selected clef and key signature.
- Pool size matches expected count for a given config.

### `transposition.test.ts`

- C transposition → output equals input.
- Bb transposition: verify known pairs (C→Bb, D→C, G→F, etc.).
- Eb transposition: verify known pairs (C→Eb, G→Bb, etc.).
- F transposition: verify known pairs (C→F, G→C, etc.).
- Round-trip: transposing to concert and back yields the original note name.
- Enharmonic spelling follows concert key signature direction.

---

## 2. Property-Based Tests (fast-check)

### `noteGeneration.property.test.ts`

Uses `fast-check` to generate arbitrary valid `AppConfig` values, then asserts invariants over many iterations:

- Every generated note is within the valid position range for the config.
- The note pool is never empty for any valid config.
- Transposition round-trip preserves the pitch class (MIDI number mod 12).
- All generated "in-key" notes match the key signature's accidentals.

---

## 3. Integration Tests (Vitest + Testing Library)

### `ConfigScreen.test.tsx`

- Renders all form fields with correct defaults.
- Changing clef/key/transposition and pressing Start calls `onStart` with correct config.
- Validation rejects invalid ledger line values (negative, >10).
- Validation rejects timer values outside 1–60.
- Double Accidentals is disabled when Single Accidentals is off.
- Pre-populates from `initialConfig` prop.

### `NotesScreen.test.tsx`

- Renders StaveDisplay with the given note and config.
- Clicking Next calls `onNext`.
- Clicking Change Settings calls `onChangeSettings`.
- NoteReveal is collapsed by default; clicking expands it.
- NoteReveal shows written and concert note names when expanded.
- NoteReveal stays expanded when Next is clicked (if it was open).

---

## 4. E2E Tests (Playwright)

### `app.spec.ts`

- **Happy path:** load → configure (change clef to Bass, key to F major, enable accidentals, timer 5s) → Start → see a note → reveal note name → verify displayed → Next → new note appears.
- **Settings persistence:** configure → Start → Change Settings → verify form reflects last saved config.
- **Timer:** configure with 5s timer → Start → wait 5s → verify new note appears automatically.
- **Responsive:** test at mobile viewport (375×667) — all elements visible, no horizontal scroll.
- **Clef rendering:** each clef renders without error.
- **Concert pitch:** reveal shows concert pitch when transposition is not C; does not show it when transposition is C.

---

## Test Rules

- All features must be covered by both Vitest tests (unit/integration/property) **and** E2E tests.
- `npm test` runs the full suite — it must pass before considering any work complete.
- If only test files were changed, only the failing/changed tests need to be re-run.
- If any source files were changed, the full suite must pass.
- Fix any test failures before finishing.

## Quality Gate

For any source file change, all of the following must pass before the work is considered complete:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test` (full suite: Vitest → build → Playwright)

CI enforces the same checks in the same order (lint, typecheck, then `npm test`), without redundant build steps.

## Deterministic Testing

Pure logic and timer-related code should accept injected randomness/time controls where practical:

- Note generation accepts an `rng` parameter (defaults to `Math.random`).
- Timer hooks should work with fake timers (`vi.useFakeTimers()`) in tests.
- Avoid direct dependencies on `Date.now()` or `Math.random()` in testable logic.

## Accessibility & Responsive Verification

- Integration and E2E tests should verify keyboard-accessible controls (tab navigation, Enter/Space to activate).
- E2E tests should verify critical screen-reader text (aria-labels on the stave, labelled buttons).
- At least one E2E test should run at mobile viewport (375×667) to catch layout regressions.
