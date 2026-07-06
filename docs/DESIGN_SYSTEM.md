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

The brand is the **canvas** — a warm bone field, like unbleached cotton or sun-aged paper — that lets the pieced star of Texas shine. The recurring mark is a **carpenter's-wheel quilt star** in prairie green and weathered brass: heritage craft, made by hand to outlast the season. Reference feeling: a lit roadside sign pointing to your destination. "Clippy with a cowboy hat and an attitude."

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

The brand is a **single warm-bone (light) theme** — a Texas heritage-quilt palette.
Dark mode is intentionally **tabled** until a dark-background logo exists (see
[Dark mode](#dark-mode-tabled)).

### Core palette (brand v3, 2026-07)

| Name | Hex | Role |
|---|---|---|
| **Warm Bone** | `#F4EFE4` | Page background (~60%) |
| **Prairie Green** | `#274536` | Primary accent — headings, logo, rules, primary CTA (~15%) |
| **Weathered Brass** | `#B08A43` | Secondary accent — panels, trim, secondary CTA (~15%) |
| **Charcoal Ink** | `#2C2A27` | Body text (~10%) |
| **Prairie Sky** | `#5D7E97` | Highlight / texture (<5%) |
| **Indian Paintbrush** | `#C85B42` | Functional alerts only |

### Supplementary palette (highlights, callouts, and fun — use sparingly)

| Name | Hex |
|---|---|
| Red Clay | `#9C6A4A` |
| Bluebonnet | `#5869A8` |
| Sage Silver | `#B6B8A8` |
| Mesquite Bark | `#6A5847` |
| Sunset Ochre | `#C58D45` |

Green and brass stay dominant; reach into the supplementary palette only for
accents — a rotating callout tint, a quilt-star colorway, a section highlight.

### Canonical tokens

The palette is defined once at `@theme` scope in `globals.css`. Token **names match
their brand roles** (renamed from the old cosmic palette — `spark-green`, not
`spark-gold`; `spark-bone`, not `spark-void`):

```css
--color-spark-bone:  #f4efe4;  /* Warm Bone        — page background */
--color-spark-ink:   #2c2a27;  /* Charcoal Ink     — body text */
--color-spark-green: #274536;  /* Prairie Green    — primary accent: headings, logo, rules, primary CTA */
--color-spark-brass: #b08a43;  /* Weathered Brass  — secondary accent: panels, trim, secondary CTA */
--color-spark-sky:   #5d7e97;  /* Prairie Sky      — highlight / texture */
--color-spark-paint: #c85b42;  /* Indian Paintbrush — functional alerts only */

/* Supplementary */
--color-spark-clay: #9c6a4a;  --color-spark-bluebonnet: #5869a8;
--color-spark-sage: #b6b8a8;  --color-spark-mesquite:  #6a5847;
--color-spark-ochre: #c58d45;
```

Utilities follow the names: `text-spark-green`, `bg-spark-bone`, `border-spark-brass`,
`text-spark-ink`, etc.

### Semantic aliases (at `:root` scope)

```css
:root {
  color-scheme: light;                         /* single warm-bone theme */
  --color-accent:    var(--color-spark-green);
  --color-highlight: var(--color-spark-sky);
  --color-alert:     var(--color-spark-paint);

  /* Focus ring — prairie green reads on the warm-bone page */
  --focus-ring-color: var(--color-spark-green);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* Body links — prairie green (underline also distinguishes them) */
  --color-link: var(--color-spark-green);
}
```

### Color usage ratio (design guidance)

Allocate colors using the 60/30/10 rule:

| Color | Use | Target % |
|---|---|---|
| Warm Bone | Primary background | ~60% |
| Prairie Green | Headings, logo, rules, primary CTA | ~15% |
| Weathered Brass | Panels, trim, secondary CTA | ~15% |
| Charcoal Ink | Body text | ~10% |
| Prairie Sky | Highlights, depth, texture | <5% |
| Indian Paintbrush | Alerts and warnings only | Functional only |

### Contrast (WCAG 2.2 AA)

All text pairs clear AA on Warm Bone: charcoal body text ~12:1 · prairie-green
headings / links ~8.5:1 · warm-bone text on the prairie-green primary button
~8.5:1. **Weathered brass is trim, not text** — charcoal-on-brass fill lands at
~4.47:1 (just under AA), so the secondary button is an **outline** (charcoal text
stays on bone) and brass is otherwise reserved for borders, panels, and rules.
Indian-Paintbrush alerts are always a bar/border paired with charcoal text, never
the text color itself.

<a id="dark-mode-tabled"></a>
### Dark mode (tabled)

Dark mode is **removed for now** — the brand refresh ships without a
dark-background logo, so there is no `prefers-color-scheme` switch and no theme
toggle in the header. `color-scheme` is fixed to `light`. The `ThemeToggle`
component is kept on disk (unmounted) so dark mode can be reintroduced once a
dark-ground wordmark exists; reviving it means restoring the toggle, a
`:root[data-theme="dark"]` token scope, and a dark logo asset.

---

## Wordmark & Logo

### Full wordmark

The header lockup is the **full horizontal wordmark** — `TEXAS ✦ SPARK` in a
Western slab serif with the quilt star as the `✦`: black letterforms, green +
brass star. Asset: `/images/brand/wm-full-v3.png` (`siteImages.brand.wordmark`,
wired through the `--wordmark-image` CSS variable in `globals.css`). It sits on the
warm-bone header bar — the black letters require a light ground.

Source of truth is the vector `WM_FULL_v3.pdf`; the web PNG is a transparent render
of it (regenerate with a PDF→pngalpha renderer, e.g. `sips -Z 2000 WM_FULL_v3.pdf`).
A stacked lockup (`wm-full-stack-v3.png`) and abbreviated `TX ✦ SPARK` marks
(`wm-ab-*`) exist for tighter placements.

### The Spark (quilt star)

The star is a **carpenter's-wheel barn-quilt block** — an 8-point compass star in
prairie green with a weathered-brass center and cream radiating lines. It is the
primary logo mark and the `✦` inside the wordmark; it must appear on every screen,
page, or product in some form.

- Always **8 points** — no exceptions
- Prairie green + brass by default; may take a **supplementary colorway** for accent placements
- Standalone asset: `/images/brand/spark-solo.svg` (`siteImages.brand.sparkStar`); a fire/alt colorway is `spark-solo-fire.svg`
- Tiled as a **quilt-band divider** between sections via the `.spark-quilt-divider` utility (see Component layer)

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
.spark-input-surface       /* 8% charcoal on bone; input backgrounds */
.spark-border-accent-soft  /* 35% green; soft accent borders */
.spark-hover-accent        /* 14% green; interactive hover state */
.spark-panel               /* 16% brass on bone; warm callout containers */
```

**Quilt-star divider:**
```css
.spark-quilt-divider   /* carpenter's-wheel star (quilt-band.svg) tiled repeat-x
                          between sections; `background-size: auto 100%` keeps the
                          full star + cream lines uncropped. Use <QuiltDivider /> */
```

**Specialized components** (add only if repo needs them):
- `.spark-carousel-nav-btn`, `.spark-framed` — UI patterns
- `.spark-quilt-divider` / `<QuiltDivider />` — heritage-quilt section divider
- `.faq-*` — accordion structure
- `.grow-timeline-*` — GROW toolkit sequence
- Header/nav/footer — omit if not needed

**Rule:** Do not create one-off `.spark-*` utilities. Extract to component layer only if used twice or more in the codebase.

### Form styles

**Text inputs:**
```css
.form-input {
  border: 2px solid var(--color-spark-green);
  background-color: color-mix(in srgb, var(--color-spark-ink) 8%, var(--color-spark-bone));
  color: var(--color-spark-ink);
  transition: all 0.2s;
  font-size: 1rem;
}

.form-input:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-color: var(--color-spark-green);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-spark-green) 35%, transparent);
}

.form-input:user-invalid {
  border-color: var(--color-spark-paint);
  /* DO NOT change text color; use aria-invalid + error message instead */
}
```

**Important:** Use `:user-invalid` (not `:invalid`) to avoid styling before user interaction.

**Buttons:**

Primary (solid prairie-green fill — the main-accent CTA):
```css
.btn-primary {
  border: 2px solid var(--color-spark-green);
  background-color: var(--color-spark-green);
  color: var(--color-spark-bone);               /* warm bone (~8.5:1) */
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: color-mix(in srgb, var(--color-spark-green) 88%, black);
}
```

Secondary (weathered-brass outline — charcoal text stays on bone):
```css
.btn-secondary {
  border: 2px solid var(--color-spark-brass);
  background-color: transparent;
  color: var(--color-spark-ink);                /* charcoal (~12:1 on bone) */
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: color-mix(in srgb, var(--color-spark-brass) 16%, transparent);
}
```

### Color blending with color-mix

The system uses CSS `color-mix(in srgb, ...)` for precision color blends:

```css
color-mix(in srgb, var(--color-spark-green) 35%, transparent);
/* 35% green + 65% transparent = 35% opacity over background */
```

**Do not use:** opacity filters, rgba values, or hardcoded hex. Color-mix is more predictable and composable.

---

## Accessibility (WCAG 2.2 AA)

### Color contrast

- **Standard text:** 4.5:1 minimum
- **Large text** (≥24px or ≥18pt bold): 3:1 minimum
- **Links:** use `--color-link` (prairie green, ~8.5:1 on warm bone)
- **Alerts:** Indian Paintbrush as a bar/border paired with charcoal text — never as the text color
- **Brass is trim, not text:** weathered brass on bone (and charcoal on brass) is sub-AA; keep it to borders, panels, and rules

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

- [ ] Six core palette tokens (+ five supplementary) at `@theme` scope
- [ ] Legacy utility names mapped to canonical tokens (read roles, not names)
- [ ] `color-scheme: light` — single warm-bone theme, no dark scope / toggle
- [ ] Font families defined (--font-heading, --font-body)
- [ ] `:root` includes semantic aliases + WCAG focus ring + link color
- [ ] Typography hierarchy matches type scale (heading-xl through body-sm)
- [ ] Form inputs: 2px prairie-green border + focus ring with shadow box
- [ ] Buttons: primary (green fill) and secondary (brass outline) defined
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

*Source: TX*SPARK Brand Identity Guide & Design System v3 (heritage-quilt refresh), July 2026*
