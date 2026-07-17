# Cochrane Insulation · Cochrane &amp; Calgary

A single static landing page for Cochrane Insulation, a Cochrane &amp; Calgary insulation company.
Plain HTML + one CSS file + a small inline script. No framework, no build
step, no backend — drop the folder on any static host and it works.

The page targets one reader: a Calgary homeowner worried about ceiling
stains, frost in the attic, or moisture during a Chinook. Eight sections
walk them from "what is attic rain?" through "how do I book a free
assessment?" The contact form delivers leads to the owner's inbox via
[Web3Forms](https://web3forms.com) — no serverless function required.

---

## Tech stack

- **HTML5** — one file: [`index.html`](index.html)
- **CSS3** — one file: [`styles.css`](styles.css). No framework, no
  Tailwind, no preprocessor. Mobile-first, with a tokenized design system
  ("Midnight Authority": flat depth tiers, 1px hairlines, one shadow family).
- **JavaScript** — one inline `<script>` block in `index.html` (~150 lines):
  contact-form submission + validation, reveal-on-scroll, walkthrough
  carousel, mobile menu, footer year.
- **Contact delivery** — [Web3Forms](https://web3forms.com). The form
  `POST`s JSON directly from the browser; Web3Forms routes each submission
  to the owner's inbox with the submitter set as `reply-to`. No database,
  no stored leads.
- **Assets** — 1 JPG hero + 12 hand-authored SVGs. No bundled fonts; the
  page loads Archivo + Inter from Google Fonts.

No `package.json`. No build tool. No server runtime.

---

## Quick start

You need [Git](https://git-scm.com/) and any modern browser. A local web
server is recommended (see below) so the form's `fetch` and the
`config.js` script load correctly.

```bash
git clone <repo-url> cochrane-insulation
cd cochrane-insulation
cp config.example.js config.js      # then paste your Web3Forms key
```

Open the folder one of these ways:

```bash
# Option A — Python (already installed on most systems)
python -m http.server 8000

# Option B — Node, no install
npx serve

# Option C — just double-click index.html
# (works for preview, but the form needs http(s) — see "Configuration" below)
```

Visit `http://localhost:8000`.

---

## Configuration

The only setup step is pasting a Web3Forms access key into `config.js`.

1. Copy the template: `cp config.example.js config.js`
2. Open `https://web3forms.com`, enter the inbox where submissions should
   land, and copy the access key it emails you (free, no account).
3. Paste it into `config.js`:

   ```js
   window.SITE_CONFIG = {
     web3formsKey: "YOUR_ACCESS_KEY"
   };
   ```

`config.js` is gitignored — the key never gets committed. The key is safe
to expose in frontend code: Web3Forms maps it to your inbox on their side,
and your email address never appears in the repo.

Without a valid key, the form shows a clear "isn't configured yet" message
instead of failing silently.

---

## Project structure

```
.
├── index.html              # the whole page (8 sections + inline JS)
├── styles.css              # design system + responsive rules
├── config.example.js       # template — copy to config.js and fill in
├── config.js               # YOUR key — gitignored, not committed
├── photos-needed.md        # spec for the 2 photos this page expects
├── assets/
│   ├── A1-hero-rooftop.jpg        # hero (1600×1000, loads above the fold)
│   ├── A1-hero-rooftop.svg        # alternate/stopgap hero
│   ├── A2-frost-formation-diagram.svg   # S2: attic cross-section
│   ├── A3-chinook-thermometer.svg       # S3: temperature swing graphic
│   ├── A4-ventilation-icon.svg          # S4: step 1
│   ├── A5-adapter-icon.svg              # S4: step 2
│   ├── A6-insulation-icon.svg           # S4: step 3
│   ├── A7-team-portrait.svg             # S5: team illustration
│   └── A8-1 … A8-6 *.svg                # S6: 6 walkthrough slides
├── .gitignore             # ignores config.js, .zcode/, build dirs, etc.
└── .gitattributes         # enforces LF line endings
```

### Page sections

| # | Section | Anchor | Purpose |
|---|---|---|---|
| S1 | Hero | `#hero` | Headline, value prop, primary CTA |
| S2 | The Problem | `#problem` | What attic rain is (and isn't) |
| S3 | Why Calgary | `#why-calgary` | The Chinook temperature swing |
| S4 | The Solution | `#solution` | Three prevention steps |
| S5 | The Company | `#company` | 15+ years, Cochrane &amp; Calgary focus, credentials |
| S6 | What to Expect | `#walkthrough` | 6-slide homeowner walkthrough |
| S7 | Contact | `#contact` | The form (posts to Web3Forms) |
| S8 | Footer | `#footer` | Service area, license, copyright |

---

## Assets

The page renders 13 visuals, each used exactly once. Twelve are diagrams,
icons, or illustrations (SVG, hand-authored, each under 15 KB). One is the
hero photo.

See [`photos-needed.md`](photos-needed.md) for the full spec on the two
slots that benefit from real photography (the hero and the team portrait).
Drop the exact filenames into `assets/` and the page picks them up — no
code changes needed.

**Compression tips** (from `photos-needed.md`):
- Export JPG at quality 80–82. Below 78 you'll see banding; above 85 it's
  wasted bytes.
- WebP at quality 78 is visually identical to JPG 85 at ~30% smaller —
  preferred if your host supports it.
- Run final files through [Squoosh](https://squoosh.app) if you don't have
  a preferred tool.

---

## Deployment

Any static host works. The form posts to Web3Forms from the browser, so
**no server-side runtime is required**.

### Netlify / Vercel / Cloudflare Pages

1. Connect the repo (or drag-and-drop the folder in Netlify's UI).
2. Build command: *(none)*. Publish directory: `.` (repo root).
3. Done. Set a custom domain in the host dashboard if you have one.

### GitHub Pages

1. Push to a repo, enable Pages in Settings → Pages.
2. Source: `main` branch, `/` (root).

### Suggested cache headers

```
/*.html        Cache-Control: public, max-age=0, must-revalidate
/styles.css    Cache-Control: public, max-age=31536000, immutable
/assets/*      Cache-Control: public, max-age=31536000, immutable
```

Because asset filenames aren't content-hashed, version the path (e.g.
`/assets/v2/…`) or fingerprint filenames on deploys that change assets,
so browsers pick up new versions immediately.

---

## Pre-launch checklist

These placeholders ship in the page and **must be replaced before going
live**:

- [ ] **Phone number** — currently `(403) 555-0199` (a fictional 555
      placeholder). Search `index.html` for `555-0199` (appears in the
      hero trust line, contact section, and footer).
- [ ] **License number** — currently `[LICENSE #]` in the footer.
- [ ] **Web3Forms key** — paste into `config.js` (see Configuration).
- [ ] **Domain** — canonical URL and OG tags assume
      `https://cochraneinsulation.ca/`. Update `<link rel="canonical">` and
      the `og:url` / `og:image` / `twitter:image` tags if different.
- [ ] **Hero photo** — a stopgap SVG exists. Drop a real
      `A1-hero-rooftop.jpg` (1600×1000, ≤250 KB) into `assets/` for the
      intended photo-real hero.
- [ ] **OG image** — currently points at `A1-hero-rooftop.svg`; point it
      at the final hero JPG (or a dedicated 1200×630 social image) so link
      previews render correctly.
- [ ] **Testimonials** — the company section has none yet. Two or three
      short customer quotes materially help conversion.
- [ ] **Send yourself a test submission** through the deployed form to
      confirm leads reach the inbox.

---

## Browser support

Modern evergreen browsers. The page uses:

- CSS Grid, custom properties, `clamp()`, `scroll-snap-type`
- `IntersectionObserver`, `fetch`, `AbortController`-free timeout via
  `Promise` race (or the native pattern once added)
- Web Fonts via `display=swap`

Internet Explorer is not supported.

---

## Accessibility & performance notes

- **Keyboard** — all interactive elements are reachable; the mobile menu,
  carousel arrows/dots, and form fields work without a mouse. Focus is
  shown via a 2px inset ring.
- **Reduced motion** — `prefers-reduced-motion` disables transitions and
  the reveal-on-scroll effect.
- **Color contrast** — the palette is built to pass WCAG AA against the
  dark background tiers. Muted secondary text (`#94A3B8` on `#080D17`)
  passes at ~6:1.
- **Core Web Vitals** — the hero uses `fetchpriority="high"` and explicit
  dimensions to avoid layout shift; below-the-fold images are
  `loading="lazy"`. Known follow-up: serve the hero as responsive AVIF/WebP
  via `<picture>` to cut its ~255 KB weight on mobile.

---

## License

Source code is proprietary to the business owner. The 13 visual assets in
`assets/` were generated for this page and are not licensed for reuse.
