# Random Note Generator — Product Specification

## Overview

A web-based tool for practising reading musical notes on a stave. The user configures a clef, key signature, transposition, ledger line range, and optional timer, then is presented with random notes to identify. The note name is revealed on demand in both written and concert pitch.

Deployed at `https://random-notes.jdc-projects.dev` via GitHub Pages. Built as a static Next.js app.

---

## Screens

### 1. Config Screen (Home)

Displayed on initial load and when the user taps **Change Settings**.

| Field | Type | Options / Constraints | Default |
|---|---|---|---|
| Clef | Select | Treble, Bass, Alto, Tenor | Treble |
| Key Signature | Grouped Select | 15 major keys + 15 minor keys (see §5.1). Organised in circle-of-fifths order within each group. Labels show key name and accidental count, e.g. "G major (1#)". Selected key is the **written** key (in the chosen transposition pitch). | C major |
| Single Accidentals | Switch | On / Off. When on, notes with single sharps, flats, and naturals (to cancel key-sig accidentals) may appear. | Off |
| Double Accidentals | Switch | On / Off. Only visible/editable when Single Accidentals is On. When on, double sharps and double flats may also appear. | Off |
| Pitch (Transposition) | Select | C (Concert), Bb, Eb, F | C |
| Ledger Lines Above | Number Input | 0–10. Integer. Number of ledger lines drawn above the staff. | 0 |
| Ledger Lines Below | Number Input | 0–10. Integer. Number of ledger lines drawn below the staff. | 0 |
| Timer | Slider | "No timer", 1s, 2s, 3s, 4s, 5s, 10s, 20s, 30s, 60s. | No timer |
| Sound | Switch | On / Off. When on, a continuous tone of the displayed note plays via Web Audio API. Instrument can be selected below. | Off |
| Instrument | Select | Sine Wave, Piano, Trumpet / Cornet, Trombone, Tuba. Only visible when Sound is on. Uses `smplr` Soundfont with loop sustain for sampled instruments. Samples loaded on demand from public CDN. | Sine Wave |
| 8vb | Switch | On / Off. When on, notes sound one octave lower than written. The clef displays an "8vb" annotation, and pitches in the reveal section reflect the shifted octave. | Off |

**Advanced Settings** (collapsible section at the bottom of the form):

| Field | Type | Options / Constraints | Default |
|---|---|---|---|
| Single Accidental Chance (%) | Number Input | 0–100. Only used when Single Accidentals is enabled. The probability that a generated note will have a single accidental. | 20 |
| Double Accidental Chance (%) | Number Input | 0–100. Only used when Double Accidentals is enabled. The probability that a generated note will have a double accidental. | 5 |

**Buttons:**

- **Start** — validates the form, saves settings to localStorage, navigates to the Notes screen (closes the note reveal if open from a previous run).

**Validation:**

- Ledger lines must be non-negative integers ≤ 10.
- Timer (when not "No timer") must be an integer 1–60.
- Double Accidentals switch is disabled and forced Off when Single Accidentals is Off.

**Persistence:**

- All settings are persisted to localStorage under a single key (e.g. `random-note-config`).
- On load, the form is pre-populated from localStorage if a saved config exists.
- Saving occurs when **Start** is pressed (only valid configs are saved).

---

### 2. Notes Screen

#### 2.1 Stave Display

- A single musical stave rendered using VexFlow.
- Displays the selected **clef** and **key signature**.
- A single whole note is shown at a random staff position within the configured ledger-line range.
- If the note requires an accidental (due to chromatic alteration from the key signature), the accidental symbol is drawn next to the note head.
- When **8vb** is enabled, the clef displays an "8vb" annotation below it, and the note is understood to sound one octave lower than written.

#### 2.2 Note Reveal (Expand/Collapse)

- Below the stave, a collapsible section that shows the note name.
- **Collapsed by default** at the start of each run (i.e. when Start is pressed).
- Expand/collapse state **persists across "Next" presses** within the same run.
- Content when expanded:

| Label | Format | Condition |
|---|---|---|
| Written pitch | `"{NoteName}{Accidental}{Octave}"` e.g. "F#4", "Eb3" | Always shown |
| Concert pitch | `"{NoteName}{Accidental}{Octave}"` | Shown only when transposition ≠ C |

- Written pitch reflects the **sounding** pitch. When 8vb is on, the displayed octave is one lower than the written position on the stave.
- Concert pitch is derived by transposing the sounding note by the interval defined by the transposition setting (see §3.3).
- The enharmonic spelling of the concert pitch should respect the concert key signature: use sharps for sharp keys, flats for flat keys. For C major / A minor, default to sharps.

#### 2.3 Controls

- **Next** button — generates the next random note. Resets the timer if active.
- **Change Settings** button — returns to the Config screen. Current note and timer are discarded. Settings form is pre-populated from the last saved config.

#### 2.4 Timer

- Only visible when a timer value was configured.
- Displayed as a progress bar that smoothly depletes over the configured duration.
- When the timer reaches zero, the app acts as if **Next** was pressed: a new note is generated and the timer resets.
- Pressing **Next** manually resets the timer to the full duration.
- The timer does **not** run while the Config screen is displayed.

#### 2.5 Sound

- When **Sound** is enabled, a continuous tone plays the sounding pitch of the displayed note.
- **Instrument** selection (only visible when Sound is on): Sine Wave, Piano, Trumpet / Cornet, Trombone, Tuba.
- Sine Wave uses the Web Audio API oscillator directly. All other instruments use `smplr` Soundfont with loop sustain for continuous tone.
- The tone starts when a new note is generated and stops when the note changes or sound is disabled.
- When 8vb is active, the tone plays one octave lower than the written position.

---

## 3. Behaviour

### 3.1 Note Generation Algorithm

On each note generation (Start or Next):

1. **Select a staff position.** Each clef has 9 on-staff positions (5 lines + 4 spaces). With N ledger lines above, 2N additional positions are available above the staff. With N ledger lines below, 2N additional positions are available below the staff. A position is chosen uniformly at random.

2. **Determine the base note.** Get the natural note name (A–G), octave, and key-signature accidental for the selected position.

3. **Apply accidental chance.** Check in order:
   - If **Double Accidentals** is on, roll against `doubleAccidentalChance` (default 5%). If triggered, randomly choose double-sharp or double-flat.
   - Else if **Single Accidentals** is on, roll against `singleAccidentalChance` (default 20%). If triggered, randomly choose from the available single accidental variants (sharp, flat, or natural to cancel a key-sig accidental) that differ from the key signature.
   - Otherwise, use the in-key accidental (from the key signature).

4. Consecutive repeats are allowed.

### 3.2 Clef / Staff-Position Reference

Each clef maps staff positions (0 = bottom line, 8 = top line) to note names:

| Pos | Treble | Bass | Alto | Tenor |
|---|---|---|---|---|
| 0 | E4 | G2 | F3 | D3 |
| 1 | F4 | A2 | G3 | E3 |
| 2 | G4 | B2 | A3 | F3 |
| 3 | A4 | C3 | B3 | G3 |
| 4 | B4 | D3 | C4 | A3 |
| 5 | C5 | E3 | D4 | B3 |
| 6 | D5 | F3 | E4 | C4 |
| 7 | E5 | G3 | F4 | D4 |
| 8 | F5 | A3 | G4 | E4 |

Positions below 0 and above 8 continue the diatonic sequence (one letter-name step per position, wrapping A→B→C…→G→A, octave incrementing when crossing C).

### 3.3 Transposition

Transposition offsets from written pitch to concert pitch (in semitones):

| Pitch | Offset | Description |
|---|---|---|
| C | 0 | Concert pitch — no transposition |
| Bb | −2 | Written sounds a major 2nd lower |
| Eb | +3 | Written sounds a minor 3rd higher |
| F | −7 | Written sounds a perfect 5th lower |

To compute concert pitch:
1. Convert written note to a MIDI number: `(octave + 1) × 12 + semitone`, where C=0, C#/Db=1, …, B=11. Accidentals adjust the semitone value: sharp +1, flat −1, double sharp +2, double flat −2, natural 0.
2. Add the transposition offset.
3. Convert the resulting MIDI number back to a note name + octave.
4. Choose enharmonic spelling based on the concert key signature (see §3.4).

### 3.4 Concert Key Signature

When transposition is not C, the concert key is derived by transposing the written key's tonic by the same interval. Example: written key = G major, transposition = Bb → concert key = F major. The concert key's accidental direction (sharps vs flats) determines enharmonic spelling for the concert note name.

### 3.5 Settings Persistence

- **Storage key:** `random-note-config`
- **Saved on:** Start button press (after validation passes)
- **Loaded on:** App initialisation (pre-populates the config form)
- **Shape:** a JSON object matching the config form fields
- **Not saved:** current note, timer state, reveal state — these reset on each run

---

## 4. UI / UX Requirements

### 4.1 Layout

- **Desktop:** centred container, max-width ~600px.
- **Mobile:** full-width with horizontal padding (16px).
- The stave should scale responsively — width fills the container, height scales proportionally.
- Buttons are full-width on mobile, auto-width on desktop.
- The Mantine `AppShell` component is not required; a simple centred layout suffices.

### 4.2 Style

- Clean, minimal design with generous spacing.
- Use Mantine's default light theme (no custom colour palette required).
- Tabler icons for any iconography (e.g. settings icon, reveal icon).

### 4.3 Accessibility

- All interactive elements must be keyboard-accessible.
- The stave image should have an `aria-label` describing the displayed note (available when revealed).
- Colour is not the sole indicator of state.

---

## 5. Reference Data

### 5.1 Key Signatures (30 keys)

**Major keys (circle of fifths, sharp side):**

| Key | Accidentals |
|---|---|
| C major | none |
| G major | F♯ |
| D major | F♯ C♯ |
| A major | F♯ C♯ G♯ |
| E major | F♯ C♯ G♯ D♯ |
| B major | F♯ C♯ G♯ D♯ A♯ |
| F♯ major | F♯ C♯ G♯ D♯ A♯ E♯ |
| C♯ major | F♯ C♯ G♯ D♯ A♯ E♯ B♯ |

**Major keys (circle of fifths, flat side):**

| Key | Accidentals |
|---|---|
| F major | B♭ |
| B♭ major | B♭ E♭ |
| E♭ major | B♭ E♭ A♭ |
| A♭ major | B♭ E♭ A♭ D♭ |
| D♭ major | B♭ E♭ A♭ D♭ G♭ |
| G♭ major | B♭ E♭ A♭ D♭ G♭ C♭ |
| C♭ major | B♭ E♭ A♭ D♭ G♭ C♭ F♭ |

**Minor keys** follow the same accidental sets as their relative majors:

| Minor key | Accidentals (same as relative major) |
|---|---|
| A minor | none (= C major) |
| E minor | F♯ (= G major) |
| B minor | F♯ C♯ (= D major) |
| F♯ minor | F♯ C♯ G♯ (= A major) |
| C♯ minor | F♯ C♯ G♯ D♯ (= E major) |
| G♯ minor | F♯ C♯ G♯ D♯ A♯ (= B major) |
| D♯ minor | F♯ C♯ G♯ D♯ A♯ E♯ (= F♯ major) |
| A♯ minor | F♯ C♯ G♯ D♯ A♯ E♯ B♯ (= C♯ major) |
| D minor | B♭ (= F major) |
| G minor | B♭ E♭ (= B♭ major) |
| C minor | B♭ E♭ A♭ (= E♭ major) |
| F minor | B♭ E♭ A♭ D♭ (= A♭ major) |
| B♭ minor | B♭ E♭ A♭ D♭ G♭ (= D♭ major) |
| E♭ minor | B♭ E♭ A♭ D♭ G♭ C♭ (= G♭ major) |
| A♭ minor | B♭ E♭ A♭ D♭ G♭ C♭ F♭ (= C♭ major) |

### 5.2 Transposition Quick Reference

| Written Note | Bb Concert | Eb Concert | F Concert |
|---|---|---|---|
| C | Bb | Eb | F |
| D | C | F | G |
| E | D | G | A |
| F | Eb | Ab | Bb |
| G | F | Bb | C |
| A | G | C | D |
| B | A | D | E |
