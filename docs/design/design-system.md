# TX\*SPARK — design system

> **Shared design language** for the TX\*SPARK repos (currently `spark`; `spark-admin` and
> `seamus-core` moved to the `seamus` design system in 2026-07).
> This file is synced from a shared upstream source of truth into each member repo's
> `docs/design/design-system.md` — treat this copy as read-only and make changes upstream so
> all member repos stay identical. This is **not** a universal standard — it applies only to
> the TX\*SPARK member repos. Read it before building or editing any UI in a member repo.
> Pairs with `standards/25-product-taste.md` (generic, project-neutral design philosophy)
> and `docs/txspark-brand-tokens.md` (brand context).

---

## Single design system

Every TX*SPARK product uses identical canonical color tokens, typography scale,
and component utilities. Different repos may omit specialized components
(header nav, PAL page styles, etc.), but must not redefine base tokens or
deviate from the palette.

**Why:** Consistency reduces cognitive load, improves maintainability, and
ensures WCAG compliance is baked in, not added later. One person changing
a token fixes it everywhere.

---

## Canonical source

**`globals.css` is law.** The canonical implementation is
`spark/src/app/globals.css`; any future member repo must match it up to the
component layer. Differences below that are OK (e.g., a login app omits
header/footer styles); differences above that are violations.
(`spark-admin` and `seamus-core` globals no longer track this file — they
follow the `seamus` design system.)

---

## Token system

### Canonical palette (immutable)

Define these at `@theme` scope in globals.css:

```css
--color-spark-void: #14081e;      /* Deep purple-black; primary background */
--color-spark-space: #2f0951;     /* Dark purple; secondary surfaces */
--color-spark-star: #edc973;      /* Gold; primary accent (logo color) */
--color-spark-earth: #f4dcb6;     /* Light tan; body text */
--color-spark-sky: #a9c7cc;       /* Cool blue; rare accent */
--color-spark-alert: #d93802;     /* Red-orange; alerts only */
```

**Legacy aliases (map these to canonical tokens):**
```css
--color-spark-bg: var(--color-spark-void);
--color-spark-bone: var(--color-spark-earth);
--color-spark-purple: var(--color-spark-space);
--color-spark-red: var(--color-spark-alert);
--color-spark-gold: var(--color-spark-star);
```

**Usage:** Prefer canonical names in new code. Legacy names are for existing components.

### Semantic aliases (at `:root` scope)

```css
:root {
  --color-bg-primary: var(--color-spark-void);
  --color-bg-secondary: var(--color-spark-space);
  --color-text-primary: var(--color-spark-earth);
  --color-accent: var(--color-spark-star);
  --color-alert: var(--color-spark-alert);

  /* WCAG focus ring — visible on void/space backgrounds */
  --focus-ring-color: #f5e5a0;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* Link color on void (72% star + space mix for 4.5:1 contrast) */
  --color-link-on-void: color-mix(in srgb, var(--color-spark-star) 72%, var(--color-spark-space));
}
```

---

## Typography

### Font stack

**Headings (display):**
```css
--font-heading: "Rockwell", "Rockwell Extra Bold", Georgia, serif;
```

**Body:**
```css
--font-body: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

See `docs/txspark-brand-tokens.md` for brand rationale.

### Type scale (mathematical, base 8)

All sizes follow a consistent ratio. **Do not introduce arbitrary intermediate sizes.**

| Class | Size | Weight | Line Height | WCAG |
|-------|------|--------|-------------|------|
| `.heading-xl` | 3.5rem (56px) | 700 | 1.1 | Large text ✓ |
| `.heading-lg` | 2rem (32px) | 700 | 1.2 | Large text ✓ |
| `.heading-md` | 1.5rem (24px) | 600 | 1.3 | Large text ✓ |
| `.heading-sm` | 1.125rem (18px) | 600 | 1.4 | Large text ✓ |
| `.body-lg` | 1.75rem (28px) | 400 | 1.45 | — |
| `.body-md` | 1.25rem (20px) | 400 | 1.6 | — |
| `.body-sm` | 0.875rem (14px) | 400 | 1.5 | — |

**WCAG note:** Large text (≥24px or ≥18pt bold) can use lower contrast ratios
(3:1 vs 4.5:1). All headings meet this threshold to relax contrast requirements
without compromising readability.

**Hard floor: 0.8rem (12.8px).** Nothing ships below it. `.body-sm` sat at
0.75rem and was raised — it carries sentences on the shop, about and events
pages, not incidental marks.

**Inputs are 1rem minimum on any surface a phone can open.** iOS Safari zooms
the page when focus lands on a field under 16px and does not reliably zoom back
out. `.form-input` and `.spark-text-input` are both 1rem; keep them there.

**Delete, don't shrink.** A caption that only earns its place by being
whisper-quiet is a caption the surface does not need. Fix the control, or move
the words into the label, before reaching for a smaller size.

### Text roles

A scale says how big. It does not say what for, and a scale without roles
produces surfaces that each pick a plausible size independently. Every piece of
text is exactly one of these six:

| Role | Treatment | What it is |
|------|-----------|------------|
| **Page title** | `.heading-xl` / `.heading-lg` on interior pages | the `h1`. One per surface. |
| **Section heading** | `.heading-md` | names a block. Same size as body is fine — weight and colour separate them. |
| **Field label** | `.form-label` | names one control. Never an `h*`. |
| **Body** | `.body-md` | sentences. The default. |
| **Meta** | `.body-sm` | a row's date, a hint under a field. |
| **Eyebrow** | uppercase micro-caps | a **repeated** marker — a column header, a chip's category. **Not a section heading.** |

**Weight does the outranking, not size.** Size is the expensive channel — there
are six steps and two are already spent above body. Two treatments one pixel
apart (19px beside 20px) read as sloppiness, not rank.

**The outline is a second axis.** Visual role decides how a line looks; document
position decides its `h*` level. A section heading set at body size is still an
`h2`. An eyebrow is never an `h*`.

---

## Spacing scale

**4px base, seven steps, nothing between them.** Pick a step by reading the
right-hand column, not by looking at the screen and deciding what feels right.

| Step | Value | The relationship it expresses |
|------|-------|------------------------------|
| 1 | 4px | inside one control — icon to its own label |
| 2 | 8px | siblings that belong together — a field and its caption |
| 3 | 12px | between fields in one group |
| 4 | 16px | between groups inside one card |
| 5 | 24px | between cards or blocks in a column |
| 6 | 32px | between sections of a page |
| 7 | 48px | above a major heading |

Governs margin, padding and gap only — not border widths, radii, line-height,
icon dimensions, or a 1px optical nudge.

**A value off the scale in new code is a review finding.** Existing ad-hoc
values convert by surface, not by grep: take one screen and convert all of it,
so the screen actually gains rhythm.

### Targets

- **44×44 is the floor** for anything tappable. This site is a responsive web
  app, so it is a touch surface at every width — a wide viewport is not a
  licence to shrink. WCAG 2.2 SC 2.5.8's 24×24 is the law; 44 is ours.
- **Build the size from padding, not a fixed height**, so a label that wraps
  can grow.
- **The hit area may be larger than the ink.** A 22px icon in a 44px pressable
  is correct; do not inflate the glyph to reach the number.

### No boxes

An outline drawn around content is not a grouping tool. Group with space, with
type, and with background. Carve-outs: focus rings, a control that must read as
a control, a genuinely floating plane, data grids, author-supplied content.

**A floating plane gets elevation *or* an edge, not both.** `.nav-dropdown-panel`
carried a fill, a 28px shadow and a border at once; the border was furniture and
has been removed.

---

## Component layer (`@layer components`)

Reusable utilities defined in globals.css. Prefer these over inline styles.

### Page layouts

```css
.spark-page          /* max-w-5xl, centered, responsive padding */
.spark-page-wide     /* max-w-7xl */
.spark-page-narrow   /* max-w-4xl */
.spark-page-home     /* adjusted rhythm for hero patterns */
```

### Surface utilities

```css
.spark-input-surface       /* 8% earth on void; input backgrounds */
.spark-border-accent-soft  /* 35% star; soft gold borders */
.spark-hover-accent        /* 14% star; interactive hover state */
.spark-panel               /* 16% purple; callout containers */
```

### Specialized components (add only if repo needs them)

- `.spark-carousel-nav-btn`, `.spark-framed` — specialized UI patterns
- `.faq-*` — accordion structure
- `.grow-timeline-*` — GROW toolkit sequence
- Header/nav/footer — omit if not needed

**Rule:** Do not create one-off `.spark-*` utilities. Extract to component layer
only if used twice.

---

## Form styles

### Text inputs

```css
.form-input {
  border: 2px solid var(--color-spark-star);
  background-color: color-mix(in srgb, var(--color-spark-earth) 8%, var(--color-spark-void));
  color: var(--color-spark-earth);
  transition: all 0.2s;
  font-size: 1rem;
}

.form-input:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-color: var(--color-spark-star);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-spark-star) 35%, transparent);
}

.form-input:user-invalid {
  border-color: var(--color-spark-alert);
  /* DO NOT change text color; use aria-invalid + error message instead */
}
```

**Important:** Use `:user-invalid` (not `:invalid`) to avoid styling before
user interaction.

### Buttons

**Primary (outline style):**
```css
.btn-primary {
  border: 2px solid var(--color-spark-bone);
  color: var(--color-spark-bone);
  background-color: transparent;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  border-color: var(--color-spark-star);
  background-color: color-mix(in srgb, var(--color-spark-star) 18%, transparent);
}

.btn-primary:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

**Secondary (filled style):**
```css
.btn-secondary {
  background-color: var(--color-spark-purple);
  color: var(--color-spark-bone);
  padding: 0.75rem 2rem;
  font-weight: 600;
  border: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: color-mix(in srgb, var(--color-spark-purple) 78%, var(--color-spark-bg));
}
```

---

## Color-mix notation

The system uses CSS `color-mix(in srgb, ...)` for precision color blends.

```css
/* Syntax: color-mix(in srgb, color percentage, color percentage) */
color-mix(in srgb, var(--color-spark-star) 35%, transparent);
/* 35% star + 65% transparent = 35% opacity over background */
```

**Do not use:** opacity filters, rgba values, or hardcoded hex. Color-mix is
more predictable and composable.

---

## Accessibility (WCAG 2.2 AA)

### Color contrast

- **Standard text:** 4.5:1 minimum
- **Large text** (≥24px or ≥18pt bold): 3:1 minimum
- **Links:** use `--color-link-on-void` (achieves 4.5:1 on void)
- **Alerts:** `--color-spark-alert` achieves 5.2:1 on void

**Test before shipping.** Use a contrast checker (WebAIM, Stark, etc.).

### Focus indicators

**Every interactive element must have a visible `:focus-visible` outline:**

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

No exceptions. A `:focus-visible` without a visible outline is a WCAG violation.

### Semantic HTML

- Use `<button>` for actions, `<a>` for navigation
- Form inputs must have associated `<label>` elements
- Error messages: pair `aria-invalid="true"` with `aria-describedby` pointing
  to a `.form-error` element
- Never use color alone to communicate state; pair with text or icon

### Keyboard navigation

- All interactions must be keyboard-accessible
- Tab order must be logical (visual top-to-bottom, left-to-right)
- Custom dropdowns must implement ARIA-compliant keyboard handling
  (Arrow keys, Escape, Enter)

---

## Implementation checklist

When updating or creating globals.css:

- [ ] All six canonical palette tokens at `@theme` scope
- [ ] Legacy utility names mapped to canonical tokens
- [ ] Font families defined (--font-heading, --font-body)
- [ ] `:root` includes semantic aliases + WCAG focus ring + link color
- [ ] Typography hierarchy matches type scale (heading-xl through body-sm)
- [ ] Form inputs: 2px gold border + focus ring with shadow box
- [ ] Buttons: primary (outline) and secondary (filled) defined
- [ ] All interactive elements have `:focus-visible` styles
- [ ] Error handling: aria-invalid + .form-error, not color alone
- [ ] No hardcoded color values outside of token definitions
- [ ] No opacity filters; use color-mix instead
- [ ] Contrast tested (4.5:1 standard text, 3:1 large text)

---

## Deviations and extensions

### Valid (requires review, not blocking)

1. **Adding a new color token** — justify (e.g., data viz, error states)
2. **Creating a new component utility** — must appear 2+ times in codebase
3. **Omitting a component** — OK for specialized layouts (e.g., login omits header)
4. **Typography adjustments** — OK for specific contexts (e.g., hero text size)

### Invalid (block merge)

- Redefining canonical palette colors
- Hardcoding color values in component CSS
- Using opacity filters instead of color-mix
- Removing or hiding `:focus-visible` styles
- Changing typography scale without justification
- Using semantic alias for wrong purpose (e.g., alert token for body text)

---

## References

- **`docs/txspark-brand-tokens.md`** — brand context, logo rules, tone, naming
- **`standards/25-product-taste.md`** — design philosophy (surface simplicity,
  60/30/10 color ratio, component reuse)
- **`standards/05-accessibility.md`** — WCAG 2.2 AA standards, screen readers
- **Canonical source:** `spark/src/app/globals.css` (copy when creating new file)
