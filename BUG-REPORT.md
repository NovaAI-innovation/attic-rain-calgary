# QA Report — Cochrane Insulation landing page

Tested with Playwright 1.61 (Chromium) against `index.html` served via a local
static server. Suite: `tests/landing.spec.js` (38 tests). 19 screenshots in
`screenshots/`. Every finding below was verified empirically, not just read off
the source.

**Result: 35 passed · 3 failed** (all 3 failures are real defects, listed below).

---

## 🔴 Critical — block leads or ship broken content

### 1. Page is completely blank for no-JavaScript users — *the lead path is dead*
**Verified:** `tests/landing.spec.js › Without JavaScript` *(failing)*
With JS disabled, **all 21 `.reveal` elements stay at `opacity: 0`** — the hero
headline, every section, and the contact form are invisible. The `<form>` also
has **no `action` attribute**, so even if it were visible it could not submit
anywhere. A user with JS blocked, a search-engine crawler executing only the
HTML, or a JS error on load sees a blank dark page.

- `styles.css:210` — `.reveal { opacity: 0; }` is only undone by JS adding `.in`.
- `index.html:228` — `<form id="contact-form" ... novalidate>` has no `action`.

**Fix (minimal):**
```css
/* styles.css — make no-JS the default, JS progressively enhances */
.reveal { opacity: 1; transform: none; }
.reveal:not(.in) { /* only hide when JS is active */ }
```
```html
<!-- index.html <html> or <head> -->
<script>document.documentElement.classList.add('js');</script>
```
then scope the hidden state: `.js .reveal { opacity: 0; transform: translateY(18px); }`
And add a real fallback `action` to Web3Forms' native form endpoint so the form
works with no JS.

---

### 2. Phone number is a non-dialable placeholder — `(403) 555-0199`
**Verified:** `tests/landing.spec.js › phone number is not a 555 placeholder` *(failing)*
555-01xx numbers are reserved/fictional in the North American Numbering Plan.
This number appears **3 times** (hero trust line, contact section, footer) and
is wrapped in `tel:` links — a mobile user who taps "Call now" gets a
cannot-be-completed error. The primary "Prefer to talk?" conversion path is dead.
Replace before launch.

---

### 3. Footer still shows the template token `[LICENSE #]`
**Verified:** `tests/landing.spec.js › license number is not an unfilled template token` *(failing)*
`index.html:274` — `License #[LICENSE #].` ships verbatim. This reads as
unfinished/amateur and undermines the "Alberta-licensed" trust claim that the
whole page leans on.

---

## 🟠 High — measurably reduce conversion

### 4. Carousel slides 4–6 never load until the user advances the carousel
**Verified:** probe — 6 slides, first 3 `naturalWidth=800`, slides 4–6
`naturalWidth=0` until `#deck-next` is clicked 3+ times.
Every slide `<img>` is `loading="lazy"` AND off-screen (horizontal scroll-snap),
so the browser defers them. A user who reads only the first 1–3 slides (the
common case) sees them fine — but **the dots/arrows invite advancing into
half-loaded slides** that pop in on scroll. More importantly, the
*call-to-action slide* (slide 6, "Get your free assessment") is the last to
load. Lazy-loading inside a horizontal scroller is a known footgun.
**Fix:** drop `loading="lazy"` on `.slide img` (there are only 6 small SVGs;
preload them), or drop `loading="lazy"` on the first slide only.

---

### 5. Tap targets are below the 44×44px minimum (WCAG 2.5.5 / Apple HIG)
**Verified:** measured on 390px viewport.

| Element | Size | Gap |
|---|---|---|
| Carousel dots (×6) | **10×10px** | −34px |
| Carousel prev/next arrows | **40×40px** | −4px |
| Mobile "Menu" toggle | **59×33px** | −11px height |

Tiny dots are genuinely hard to hit with a thumb; users miss and hit the slide
or the arrow. Give dots a larger hit area (e.g. `padding`/transparent box) even
if the visual stays 10px.

---

### 6. Mobile users download the full 249 KB hero photo
**Verified:** `A1-hero-rooftop.jpg` = 255,418 bytes served identically at 390px
and 1280px. No `<picture>`/`srcset`. On a typical 4G phone this is the bulk of
page weight and delays the LCP (the hero is above the fold). A 390px-wide screen
does not need a 1600px image.
**Fix:** `<picture>` with `srcset` widths (480/800/1200/1600) + AVIF/WebP, or at
minimum a `sizes` + `srcset`. The README's own "to-do" calls this out.

---

## 🟡 Medium — friction / polish / resilience

### 7. Orphan CSS: `.copy-mail button { … }` styles a button that doesn't exist
**Verified:** `.copy-mail` exists and contains plain text, but `0` matching
`<button>`. `styles.css:201` styles a "copy email" button that was removed in
commit `69e4d92`. Dead CSS; harmless but signals incomplete refactor.

### 8. After the hero CTA click, the form lands low in the viewport
**Verified:** form top = 755px in a 900px viewport (~84% down). The user sees
the section heading and the "Prefer to talk?" sidebar, then must scroll to reach
the first input. Minor, but on the single most important click the form's first
field should be higher. Either point the CTA `href` at `#contact-form` (the form)
instead of `#contact` (the section), or add `scroll-margin-top` to the form.

### 9. `og:image` / `twitter:image` point at an SVG
**Verified:** both meta tags → `…/A1-hero-rooftop.svg`. Many social platforms
(iMessage, Slack, X, LinkedIn) **do not render SVG** for link previews — the
preview will be blank or fall back. This is the first thing a lead sees when a
friend shares the link. Point at a 1200×630 JPG/PNG. (The README's checklist
already flags this.)

### 10. No sticky-nav scroll offset on anchor jumps
**Verified:** `html { scroll-padding-top: auto }` and all `section`
`scroll-margin-top: 0`. Currently headings land *just* clear of the 64px nav
because sections have top padding — but it's fragile. Add
`html { scroll-padding-top: 80px; }` so deep links and anchor clicks never tuck
a heading under the sticky nav.

### 11. No submit timeout — a hung Web3Forms request leaves the user stuck
**Verified:** the `fetch` has no `AbortController`/timeout. If Web3Forms hangs,
the button stays "Sending…" and disabled indefinitely with no feedback. Add a
~15s timeout that surfaces the existing "Something went wrong" state.

---

## ✅ What works well (verified passing)

- **Form validation** — empty / whitespace / bad-email all rejected, first
  invalid field auto-focused, errors clear on correction. *(5 tests pass)*
- **Network resilience** — 5xx, `success:false`, and network failure all surface
  the friendly error and **preserve the user's typed text** (no retype).
- **Double-submit guard** — button disables on first click; only **1** request
  fires under rapid double/triple clicking.
- **Honeypot** — a filled honeypot shows "Thanks…" and fires **0** network calls.
- **Keyboard nav** — logical tab order (name→email→message), arrow keys drive the
  carousel when focused, focus ring renders on mouse-click (`:focus-visible` ✓).
- **Mobile menu** — opens/closes, toggles `aria-expanded`, closes on link tap,
  no horizontal page overflow at any tested width (360–1280px).
- **Accessibility** — every interactive element has an accessible name; all
  `<img>` have alt text; `prefers-reduced-motion` correctly forces reveal.
- **No console errors / page errors** on a clean load.

---

## Conversion-onboarding summary

The lead form *itself* is well-built — validation, error recovery, and the
honeypot/double-submit guards are genuinely good. The conversion risk is
**upstream and contextual**, not in the form mechanics:

1. **The phone number doesn't work** (#2) — the "I'd rather call" path is dead.
2. **The whole page can be blank** for no-JS / crawler traffic (#1).
3. **Trust signals are self-defeating** — a `[LICENSE #]` token (#3) and a
   blank social preview (#9) undercut the "15+ years, licensed, insured" pitch.
4. **Mobile friction** — 249 KB hero (#6) and undersized carousel controls (#5)
   make the walkthrough (which ends in the CTA slide) awkward on phones.

Fix #1–#3 before launch; they're the difference between a page that can capture
leads and one that quietly can't.

---

## Reproducing

```bash
python -m http.server 8765 &        # serve the folder
npx playwright test                 # run tests/landing.spec.js
node tests/visual-snapshots.js      # regenerate screenshots/
```
