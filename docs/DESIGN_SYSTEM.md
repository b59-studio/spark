# TX*SPARK Design System

Complete guide to the TX*SPARK design tokens, brand context, and implementation standards across spark, spark-admin, and seamus-core.

---

## Brand Context

### Organization

TX*SPARK is a Texas-based data and technology PAC founded in Austin, May 2025. It fills civic infrastructure gaps — reducing duplicated labor, democratizing access to information, and making civic tools legible to ordinary people. It is **not** a campaign organization and does **not** compete with existing orgs.

### Aesthetic Direction — "Cosmic Cowboy"

> "Willie Nelson in a data center."  
> "A desert punk giving water to a neighbor."  
> "Analog humanity inside modern systems."  
> "A cactus that's been groomed as a bonsai."

The brand is the **canvas** (night sky) that lets the stars of Texas shine. Reference feeling: a lit roadside sign pointing to your destination. "Clippy with a cowboy hat and an attitude."

### Tone

| ✅ IS | ❌ IS NOT |
|---|---|
| Rebellious but trustworthy | Startup-founder energy |
| Rugged but intelligent | Campaign celebrity |
| Accessible but sophisticated | Detached analyst |
| Grassroots — not amateur | Consultant voice |
| Anti-establishment + practical | Inside baseball |

### Brand Voice Phrases (use as copy guidance)

- "Don't reinvent the wheel every cycle."
- "Built to outlast campaigns."
- "Data people can actually use."
- "No inside baseball required."
- "Public information should actually be public."
- "Make power legible."
- "Local accountability through accessible data."
- "Understand your district without a political science degree."

### Brand Pillars

1. **Continuity Over Chaos** — preserve institutional knowledge; pass the torch without losing momentum
2. **Plain Language Over Gatekeeping** — translate analytics into human-readable insights
3. **Accountability Over Opacity** — civic watchdog; make local power structures legible

### Persona Archetype

The brand is *the person making sure the lights stay on after everyone else leaves*:
- Longtime organizer
- Technically sharp
- Suspicious of unnecessary hierarchy
- Deeply practical
- Politically informed, not performative
- Building systems that survive them

---

## Color Palette

### Canonical tokens (immutable)

Define these at `@theme` scope in globals.css:

```css
--color-spark-void: #14081e;      /* Deep purple-black; primary background (60%) */
--color-spark-space: #2f0951;     /* Dark purple; secondary surfaces (20%) */
--color-spark-star: #edc973;      /* Gold; primary accent — logo color (15%) */
--color-spark-earth: #f4dcb6;     /* Light tan; body text (10%) */
--color-spark-sky: #a9c7cc;       /* Cool blue; highlights and texture (<5%) */
--color-spark-alert: #d93802;     /* Red-orange; alerts only (functional) */
```

### Legacy utility names

These map to canonical tokens. Use canonical names in new code; legacy names appear in existing components:

```css
--color-spark-bg: var(--color-spark-void);
--color-spark-bone: var(--color-spark-earth);
--color-spark-purple: var(--color-spark-space);
--color-spark-red: var(--color-spark-alert);
--color-spark-gold: var(--color-spark-star);
```

### Semantic aliases (at `:root` scope)

```css
:root {
  --color-bg-primary: var(--color-spark-void);
  --color-bg-secondary: var(--color-spark-space);
  --color-text-primary: var(--color-spark-earth);
  --color-accent: var(--color-spark-star);
  --color-highlight: var(--color-spark-sky);
  --color-alert: var(--color-spark-alert);

  /* WCAG focus ring — visible on void/space backgrounds */
  --focus-ring-color: #f5e5a0;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* Accessible link color on void (72% star + space mix for 4.5:1 contrast) */
  --color-link-on-void: color-mix(in srgb, var(--color-spark-star) 72%, var(--color-spark-space));
}
```

### Color usage ratio (design guidance)

Allocate colors using the 60/30/10 rule:

| Token | Use | Target % |
|---|---|---|
| spark-void | Primary background | ~60% |
| spark-space | Secondary bg, panels, text boxes | ~20% |
| spark-star | Accents, headers, logo, secondary elements | ~15% |
| spark-earth | Body text | ~10% |
| spark-sky | Highlights, depth, texture | <5% |
| spark-alert | Alerts and warnings only | Functional only |

---

## Wordmark & Logo

### Wordmark variations

- **Dark backgrounds** → use the stencil wordmark (hollow/cutout letterforms)
- **Light backgrounds** → stencil filled with spark-star (#edc973), outlined with spark-void (#14081e)

### The Asterisk ("The Spark")

The `*` asterisk is the primary logo mark. It must appear on every screen, page, or product in some form.

- Always **8 points** — no exceptions
- Always **two color fills**: a body fill + a shadow drop (body fill may be transparent)
- The spark can adapt in size and placement, but the 8-point / two-fill rule is fixed

---

## Typography

### Font stack

**Headings (display):**
```css
--font-heading: "Rockwell", "Rockwell Extra Bold", Georgia, serif;
```

Rockwell evokes the rugged Texas counterculture that informs the brand voice.

**Body:**
```css
--font-body: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

A clean, neutral sans-serif for plain-language legibility.

*Note: A custom TX*SPARK sans-serif with Western twist is in development.*

### Type scale (mathematical, base 8)

All sizes follow a consistent ratio. Do not introduce arbitrary intermediate sizes.

| Class | Size | Weight | Line Height | WCAG |
|-------|------|--------|-------------|------|
| `.heading-xl` | 3.5rem (56px) | 700 | 1.1 | Large text ✓ |
| `.heading-lg` | 2rem (32px) | 700 | 1.2 | Large text ✓ |
| `.heading-md` | 1.5rem (24px) | 600 | 1.3 | Large text ✓ |
| `.heading-sm` | 1.125rem (18px) | 600 | 1.4 | Large text ✓ |
| `.body-lg` | 1.75rem (28px) | 400 | 1.45 | — |
| `.body-md` | 1.25rem (20px) | 400 | 1.6 | — |
| `.body-sm` | 0.75rem (12px) | 400 | 1.5 | — |

**WCAG note:** Large text (≥24px or ≥18pt bold) can use lower contrast ratios (3:1 vs 4.5:1). All headings meet this threshold to relax contrast requirements without compromising readability.

---

## Implementation

### Principle: One design system, three contexts

Every TX*SPARK product (spark, spark-admin, seamus-core) uses identical canonical color tokens, typography scale, and component utilities. Different repos may omit specialized components (header nav, PAL page styles, etc.), but must not redefine base tokens or deviate from the palette.

**Why:** Consistency reduces cognitive load, improves maintainability, and ensures WCAG compliance is baked in, not added later. One person changing a token fixes it everywhere.

### Canonical source

**`globals.css` is law.** All three repos have identical token definitions and component utilities:
- `spark/src/app/globals.css`
- `spark-admin/src/app/globals.css`
- `seamus-core/apps/login/src/globals.css`

Differences below the component layer are OK (e.g., login omits header/footer styles). Differences above that are violations.

### Component layer (`@layer components`)

Reusable utilities defined in globals.css. Prefer these over inline styles.

**Page layouts:**
```css
.spark-page          /* max-w-5xl, centered, responsive padding */
.spark-page-wide     /* max-w-7xl (widest standard layout) */
.spark-page-narrow   /* max-w-4xl (narrowest standard layout) */
.spark-page-home     /* adjusted rhythm for hero patterns */
```

**Surface utilities:**
```css
.spark-input-surface       /* 8% earth on void; input backgrounds */
.spark-border-accent-soft  /* 35% star; soft gold borders */
.spark-hover-accent        /* 14% star; interactive hover state */
.spark-panel               /* 16% purple; callout containers */
```

**Specialized components** (add only if repo needs them):
- `.spark-carousel-nav-btn`, `.spark-framed` — UI patterns
- `.faq-*` — accordion structure
- `.grow-timeline-*` — GROW toolkit sequence
- Header/nav/footer — omit if not needed

**Rule:** Do not create one-off `.spark-*` utilities. Extract to component layer only if used twice or more in the codebase.

### Form styles

**Text inputs:**
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

**Important:** Use `:user-invalid` (not `:invalid`) to avoid styling before user interaction.

**Buttons:**

Primary (outline style):
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

Secondary (filled style):
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

### Color blending with color-mix

The system uses CSS `color-mix(in srgb, ...)` for precision color blends:

```css
color-mix(in srgb, var(--color-spark-star) 35%, transparent);
/* 35% star + 65% transparent = 35% opacity over background */
```

**Do not use:** opacity filters, rgba values, or hardcoded hex. Color-mix is more predictable and composable.

---

## Accessibility (WCAG 2.2 AA)

### Color contrast

- **Standard text:** 4.5:1 minimum
- **Large text** (≥24px or ≥18pt bold): 3:1 minimum
- **Links:** use `--color-link-on-void` (achieves 4.5:1 on void)
- **Alerts:** `--color-spark-alert` achieves 5.2:1 on void

**Test before shipping.** Use a contrast checker (WebAIM, Stark, etc.).

### Focus indicators

Every interactive element must have a visible `:focus-visible` outline:

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
- Error messages: pair `aria-invalid="true"` with `aria-describedby` pointing to a `.form-error` element
- Never use color alone to communicate state; pair with text or icon

### Keyboard navigation

- All interactions must be keyboard-accessible
- Tab order must be logical (visual top-to-bottom, left-to-right)
- Custom dropdowns must implement ARIA-compliant keyboard handling (Arrow keys, Escape, Enter)

---

## Implementation Checklist

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

## Naming

Always set product and org names in full capitals: **TX*SPARK**, **GROW**, **PAL**.  
Do not use title case or mixed case (TX*Spark, Grow, Pal, TX Spark, etc.) in user-facing text, metadata, or legal copy.  
Ordinary English verbs stay lowercase (grow, grow relationships).

---

## Valid Deviations (requires review)

1. **Adding a new color token** — justify (e.g., data viz, error states)
2. **Creating a new component utility** — must appear 2+ times in codebase
3. **Omitting a component** — OK for specialized layouts (e.g., login omits header)
4. **Typography adjustments** — OK for specific contexts (e.g., hero text size)

## Invalid Deviations (block merge)

- Redefining canonical palette colors
- Hardcoding color values in component CSS
- Using opacity filters instead of color-mix
- Removing or hiding `:focus-visible` styles
- Changing typography scale without justification
- Using semantic alias for wrong purpose (e.g., alert token for body text)

---

*Source: TX*SPARK Brand Identity Guide & Design System, May 2026*
