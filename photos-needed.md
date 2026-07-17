# Photos needed

The page expects **2 real photos**. Drop these exact filenames into `assets/`
and the page will work — no code changes needed.

The other 12 images stay as SVG diagrams/icons. They explain mechanisms
(how frost forms, the Chinook temperature swing, the three-step fix) that a
photo can't show. Don't convert those.

## Slot 1 — Hero (most important)

| | |
|---|---|
| **Filename** | `assets/A1-hero-rooftop.jpg` |
| **Dimensions** | 1600 × 1000 px |
| **Aspect ratio** | 16:10 |
| **Format** | JPG (photographic) or WebP (smaller, preferred if your host supports it) |
| **Max file size** | ≤ 250 KB after compression |
| **Loads** | Above the fold — keep it light, it's the first thing visitors see |

**What it should show:** A frost-covered Calgary residential rooftop at dawn.
Warm sunrise light raking across the shingles, frost visibly melting where the
sun hits. The mood is cold-then-warm — visually echoing the Chinook thaw that
causes attic rain. No people, no text overlays.

**Composition:** Subject (the roof) fills the frame. Leave a little sky at the
top for the dawn light. Avoid heavy shadows — the page background is dark, so
the photo should be bright enough to read as a distinct element, not blend in.

**Tone:** Documentary, not stock-photo-cheerful. A homeowner worried about
ceiling stains should look at this and think "they know my climate."

## Slot 2 — Team portrait

| | |
|---|---|
| **Filename** | `assets/A7-team-portrait.jpg` |
| **Dimensions** | 1200 × 800 px |
| **Aspect ratio** | 3:2 |
| **Format** | JPG or WebP |
| **Max file size** | ≤ 200 KB |
| **Loads** | Lazy — below the fold, size matters less than the hero |

**What it should show:** Two Cochrane Insulation specialists at work inside an attic.
One shining a flashlight up at the underside of the roof deck (where frost
forms); the other taking notes on a clipboard. Real tools, real attic
environment — exposed joists, insulation visible, a headlamp if you have one.

**Composition:** Wide enough to show context (the attic space), tight enough
that the people are clearly the subject. Eye-level or slightly below — we want
to see what they're inspecting, not a top-down drone shot.

**Tone:** Competent and unglamorous. No posed team-in-polo-shirts-in-front-of-
a-van shots. The point is: these people actually go into your attic.

## What NOT to convert

Keep as diagrams — they explain mechanisms, not proof:

- `A2-frost-formation-diagram.svg` — labeled attic cross-section
- `A3-chinook-thermometer.svg` — temperature swing graphic
- `A8-2-chinook-cycle.svg` — five-day cycle chart
- `A8-4-solution-three-step.svg` — combined fix diagram

Keep as icons:

- `A4-ventilation-icon.svg`, `A5-adapter-icon.svg`, `A6-insulation-icon.svg`

Keep as illustrated slides (part of a cohesive walkthrough carousel):

- `A8-1-warning-signs.svg`, `A8-3-service-area.svg`,
  `A8-5-trust-markers.svg`, `A8-6-cta-contact.svg`

## Compression tips

- Export JPG at quality 80–82. Below 78 you'll see banding in skies; above 85
  it's wasted bytes.
- If you can export WebP, use quality 78 — visually identical to JPG 85 at
  ~30% smaller. If you switch the extension in `index.html`, also update the
  `og:image` URL in the `<head>`.
- Run the final files through [Squoosh](https://squoosh.app) if you don't have
  a preferred tool — free, browser-based, no upload.
- Keep the originals somewhere safe; only commit the compressed versions.

## After dropping in the files

1. Open `index.html` in a browser.
2. Check the hero loads immediately and the team portrait loads on scroll.
3. Resize the browser narrow (≤ 720px) — both images should stack cleanly
   above/below their text columns on mobile.
4. If a photo looks too dark against the page's `#080D17` background, that's
   expected — the surrounding card has a `1px var(--line)` border + shadow that
   separates it. If it still blends, brighten the photo ~10%.
