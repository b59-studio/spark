# Design standards pass — open findings

Audit of the site against the standards added since this repo was archived.
The mechanical fixes are in `c90af8f`. What follows is what was **found and
deliberately not changed**, with the reasoning, so the decisions are not lost.

This repo is dormant (`bin/dormant.conf`), so its `standards/` projection is
frozen at 2026-07-26 and stops at 39. Everything from 40 up — including the
design set — was read from the hub.

---

## 1. The header is `fixed`, and standard 53 says `sticky`

`53-marketing-header.md`: *"Sticky, with a breath of page above it — not flush
to the viewport edge, and not `fixed`. Sticky keeps its layout slot so nothing
downstream needs a manual top offset."*

The site has exactly the manual offset that rule predicts:

```tsx
// src/components/MainFrame.tsx
className={`min-w-0 flex-1 overflow-x-hidden ${isHome ? "pt-0" : "pt-24"}`}
```

`pt-24` is 96px of hand-tuned clearance for the floating bar, and `pt-0` on
home is there because the hero is *designed* to sit under it.

**Not changed, because converting is not mechanical.** `sticky` takes a layout
slot, so the home hero would be pushed down and the signature
floating-bar-over-hero composition would change. On a project whose stated
priority is "make it look good now", that is a look decision, not a compliance
one. The conversion is: `position: sticky; top: 1rem` on the header,
`display: contents` on any wrapper (53 notes a wrapper exactly as tall as the
header is the usual cause of "it says sticky and it isn't"), then delete the
`pt-24`/`pt-0` split.

## 2. The bar is 256px wider than the content on interior pages

Measured at 1440px on `/about`:

| | x | width |
|---|---|---|
| Header bar | 80 | **1280** (`max-w-7xl`) |
| Page content | 208 | **1024** (`.spark-page` → `max-w-5xl`) |

53: *"The bar shares the page's shell — same max width and gutters, so the
wordmark sits on the same left line as the first heading."* It does not — the
wordmark overhangs the first heading by 128px on each side.

Home is fine (`.spark-page-home` is also `max-w-7xl`); the divergence is on
every `.spark-page` and `.spark-page-narrow` route.

**Not changed, because 53 says to measure both and then decide which is
wrong — and that is a taste call, not a defect.** Two coherent answers: widen
the interior pages to `max-w-7xl`, or narrow the bar to match `.spark-page`.
53 warns specifically against the third option of widening the bar alone. Note
its companion point: a reading measure (~60–75 characters) belongs to the text
block inside a section, not to the shell, so `max-w-5xl` on the *container* may
itself be the original mistake.

## 3. There is no primary CTA in the header

53: *"Exactly one filled control, and it is the primary CTA."* The bar carries
a wordmark, three nav links, a theme toggle and "Log In" — every control is a
peer, and none is filled. `48-marketing-page-architecture.md` separately wants
a get-started path one click from everywhere.

**Not changed, because choosing the verb is a product decision.** The
candidates already on the site are the newsletter signup and `/toolkits`.
Adding a filled CTA is a one-line change once someone says which.

## 4. `prefers-color-scheme` is not honoured

The theme init script reads `localStorage` only:

```js
// src/app/layout.tsx
(function(){try{var t=localStorage.getItem('theme');
if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();
```

A visitor whose OS is set to light gets the dark site until they find the
toggle. `globals.css` states this as intent: *"Light is opt-in via the toggle
only — dark is the brand default, so there is no `prefers-color-scheme`
switch."*

**This is why the theme toggle correctly stays in the header.** 53 puts the
light/dark control in the footer, but carves out exactly this case: *"A site
that … ignores `prefers-color-scheme` has not earned the footer: there the
control is the way in rather than the override, and it belongs in the header
until the default is real."*

So the toggle's position is not the finding — the missing default is. Fix the
default first; the toggle moves to the footer only after that.

## 5. Pricing and get-started pages do not exist

48 calls pricing **load-bearing even for a free product**: *"A missing pricing
page reads as 'expensive, and they won't say' — the absence is itself a
claim."* TX*SPARK's tools are free, which is a strong thing to say on a page
and is currently said nowhere.

**Not changed — that is new product surface, not a standards fix**, and not
something to invent unilaterally on an archived project.

## 6. Text hierarchy: 8–9 treatments per surface, six roles allowed

Distinct size/weight/colour combinations counted in the browser: **9 on `/`,
8 on `/about`**. 54 allows six, and says more than six means roles have been
invented.

The specific tells:

- **19px and 20px both carry rank.** 54: a size step used for rank must be a
  real jump; adjacent steps *"read as sloppiness rather than structure."* One
  pixel apart is the worst case of this.
- **The same role renders differently across pages** — section headings at 32px
  on `/`, 30px on `/about`. 54's check 2 ("compare siblings, not the scale") is
  the only check that catches this, and both values pass a scale check.
- **There is no `base`/16px body step.** The scale jumps 20px → 12px (now 14px),
  so nothing sits at the size 54 assigns to body and section headings.

**The role table is now in `docs/design/design-system.md`** — that is step 1 of
54's adoption path, and it binds new code immediately. Steps 3–4 (the eyebrow
sweep, then converting surface by surface) are deliberately left: 54 and 44
both warn that a mechanical sweep produces a diff nobody can review and burns
the credibility the rule needs.

## 7. `ContactForm.tsx` is dead code carrying three violations

`/contact` returns `notFound()` and the whole page body is commented out, but
`src/app/contact/ContactForm.tsx` survives and contains a `<select>`, five
native `title` tooltips, and `required` fields with no `novalidate` (so the
browser would draw its own validation bubbles — 47).

None of it ships. **Left alone because the right fix is deleting the file**, and
that is the owner's call while `/contact` is only "temporarily disabled".

## 8. The cart stepper could not be exercised live

The `<select>` → stepper replacement typechecks, lints and builds, but
WooCommerce is unconfigured locally, so `/shop/cart` renders the "shop coming
soon" branch and `CartView`'s line items never mount. **The stepper's rendered
geometry and keyboard behaviour are unverified** — they need a configured Woo
backend or a fixture.

---

## Verified clean

Not findings — checked and passing, recorded so nobody re-runs them:

- **Contrast.** `/about` in a real light-mode load: 16.4:1 and 19.4:1, zero AA
  failures. An earlier reading of 1.33:1 was an artifact of setting
  `data-theme` by hand after hydration — a reminder that the surface has to
  produce the reading honestly (`41-verification-surfaces.md`).
- **Horizontal scroll.** Zero across 15 routes × 4 widths (320/375/768/1440) ×
  2 themes.
- **Inputs at 1rem.** `.form-input` and `.spark-text-input` both 1rem, so 44's
  16px-on-mobile MUST is satisfied and iOS will not zoom on focus.
- **`<details>` marker** on `/events` is already suppressed with
  `list-none` + `[&::-webkit-details-marker]:hidden` — 47 compliant.
- **Heading outline.** Every route: exactly one `h1`, no skipped levels.
- **Two-group header structure** (browse left, act right, space between rather
  than a divider) is already correct.
