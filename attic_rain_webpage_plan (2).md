# Attic Rain Landing Page — Plan v04 (Homeowner-Facing)

A single high-quality landing page built **for one reader: the Calgary homeowner**. It explains what attic rain is, why Calgary homes get it, what the fix looks like, why this company is the right one to call, and how to get a free assessment. The contact form is functional: submissions deliver to `bmad.developments@gmail.com` via a minimal serverless backend. Source: forwarded email from Tomas MacLean forwarding David Rinker's "attic rain page" content (Calgary roofing/insulation specialist, 15+ years in market).

**What changed from v03 → v04**
- **Single audience: the homeowner.** v03 split readers into "homeowner + stakeholder" and embedded a stakeholder-flavored pitch deck. v04 removes that second reader entirely. No investor language anywhere.
- **S6 reframed as a homeowner walkthrough.** The 6-slide scrollable component stays (visuals, layout, arrow-key UX all preserved) but every slide now answers a question a Calgary homeowner would actually ask: *is this happening to me? why my house? do you cover my area? how do you fix it? can I trust you? what's the next step?*
- **Three deck visuals swapped** to homeowner-relevant content: A8-1 (warning-signs self-diagnosis instead of investor bar chart), A8-5 (trust markers instead of competitor feature grid), A8-6 (a warm homeowner "Get your free assessment" card instead of the prior investor-style "THE ASK" CTA). A8-2, A8-3, A8-4 keep their format but their captions/alt-text are reframed in homeowner voice.
- **Simplicity preserved:** same 8 sections, same 13-visual inventory, same minimal stack, no framework, no build step.

---

## 1. Goal (one reader: the homeowner)

| Reader | What they get from the page |
|---|---|
| **Calgary homeowner** | A clear explanation of what attic rain is, why Calgary has it, what the 3-step fix looks like, why this company is qualified to do it, and an easy way to book a free assessment. |

Every word, visual, and CTA on the page is written for someone staring at a water stain on their ceiling and trying to decide if this company is worth a phone call. If a sentence would sound strange read aloud over the phone to a homeowner, it does not belong on the page.

---

## 2. Tech Stack (deliberately minimal — now functional)

**Frontend (unchanged from v02)**
- **HTML5** — single `index.html`
- **CSS3** — single `styles.css`, no framework, no Tailwind, no preprocessor. ~450–700 lines total.
- **Light JS** — one inline `<script>` block (~120–180 lines) handling:
  - Contact-form submission via `fetch` to the serverless function, inline validation, success/error states, copy-email fallback
  - Smooth scroll for anchor links
  - Pitch-deck keyboard nav (left/right arrows, slide dots)
  - Mobile menu toggle
  - Lazy-load via `loading="lazy"` + `IntersectionObserver` for the pitch deck

**Backend (NEW, minimal)**
- **One serverless function** — e.g. `api/contact.ts`. Receives the form `POST`, validates server-side, and sends the lead via a **transactional email API** (default **Resend**; Postmark / Brevo as drop-in alternatives) to `bmad.developments@gmail.com`, with the submitter set as `reply-to`.
- **State & config:** one environment variable (`EMAIL_API_KEY`); no database; no stored leads. Scales to zero.
- **Language:** default **Node/TypeScript** (native to Netlify / Vercel / Cloudflare Pages+Functions, which bundle the function on deploy — so still no local build step).
- **Stack-alignment note:** the repo's `AGENTS.md` states a C#/.NET identity. If you prefer stack alignment, the same function ports cleanly to **C# on Azure Functions** (isolated worker, one HTTP trigger). This is surfaced only; Node/TS is the default pick because the chosen static hosts run it natively with zero extra config.

**Asset tooling (NEW)**
- **A1 hero** is photo-real and produced with the `imagegen` skill, exported as **WebP (~150 KB) + PNG fallback**, served via a `<picture>` element.
- **A2–A8** (13 assets) are **hand-authored modern flat SVG** — tiny (<15 KB), crisp at any size.

**Still no build step. No `package.json` for the frontend. No React/Astro/Next. Drop the folder on any host with functions and it works.**

---

## 3. Page Structure (8 sections, top to bottom)

| # | Section | id | Purpose |
|---|---|---|---|
| S1 | **Hero** | `#hero` | Brand name, tagline, one-sentence value prop, primary CTA → posts to backend |
| S2 | **The Problem** | `#problem` | What is attic rain? Calgary-specific. New illustration asset |
| S3 | **Why Calgary** | `#why-calgary` | Chinook explanation, temperature swing visual. New infographic asset |
| S4 | **The Solution** | `#solution` | Three prevention steps (venting, bath fan adapter, insulation). Three small SVG icons |
| S5 | **The Company** | `#company` | 15+ years, Calgary-only focus, professional consultation. Team/office illustration |
| S6 | **What to Expect** | `#walkthrough` | 6-slide homeowner walkthrough (see §5) — a friendly guided tour, not a sales deck |
| S7 | **Contact / Email Us** | `#contact` | Functional serverless form + copy-email fallback + phone |
| S8 | **Footer** | `#footer` | Service area, license disclaimer, copyright, phone |

---

## 3a. Section Copy & Layout Spec

Ready-to-use draft copy (brand tokens shown as `[BRAND]` / `[PHONE]`; edit words freely). Each entry lists heading level, the `id` anchor, responsive rule, and the asset alt text.

### S1 — Hero  (`<h1>` · `#hero`)
- **Headline:** Stop Attic Rain Before It Damages Your Home
- **Subhead:** Calgary's attic-rain specialists. Over 15 years stopping frost, moisture, and ceiling stains — for good.
- **Primary CTA:** Get Your Free Assessment → (submits the §8 form; jumps to `#contact` if triggered from hero)
- **Secondary CTA:** Call `[PHONE]`
- **Trust line (under CTAs):** Free assessment · Calgary-wide · 15+ years
- **Layout:** two-column ≥768px (copy left, A1 photo-real hero right); single column, stacked, under 768px.
- **Alt (A1):** "Frost-covered Calgary rooftop at dawn, warm sunrise light melting frost from the shingles."

### S2 — The Problem  (`<h2>` · `#problem`)
- **Heading:** What is attic rain?
- **Body (2–3 short paragraphs):**
  - Attic rain is moisture that condenses and freezes inside your attic over a Calgary winter, then melts rapidly during a warm spell — dripping onto insulation, drywall, and ceilings.
  - It's not a roof leak. The shingles are fine. The problem happens *under* the roof, where warm household air meets freezing attic surfaces.
  - Left unchecked it stains ceilings, saturates insulation, and grows mould.
- **Asset:** A2 frost cross-section, placed beside/under the body.
- **Alt (A2):** "Cross-section diagram of an attic showing warm air rising, frost forming on the underside of the roof, and meltwater dripping onto insulation."

### S3 — Why Calgary  (`<h2>` · `#why-calgary`)
- **Heading:** Why Calgary, and not somewhere else?
- **Body (1–2 short paragraphs):** Calgary's Chinooks swing temperatures 30°C in hours — from deep freeze to above freezing. That fast swing is what turns built-up frost into sudden "rain" inside the attic. Few climates on earth do this as often or as hard.
- **Takeaway callout (Frost Blue panel, large text only — see §7 contrast note):** A 30°C swing in a single day is normal here. That's the whole problem.
- **Asset:** A3 Chinook thermometer.
- **Alt (A3):** "Thermometer graphic showing a Calgary Chinook temperature swing from −25°C to +5°C with an arrow marking the rapid rise."

### S4 — The Solution  (`<h2>` · `#solution`)
- **Heading:** Three things stop attic rain
- **Intro (1 line):** Done together, these three steps prevent frost from forming in the first place.
- **3-column card grid** (A4 / A5 / A6 flat line icons), each card = icon + title + one sentence; **3 → 1 columns under 768px**.
  1. **Ventilation** — Balanced intake-and-exhaust venting keeps the attic cold and dry so frost can't build up. *(Alt A4: "Line icon of a roof vent with airflow arrows showing balanced ventilation.")*
  2. **Bath-fan adapter** — A sealed adapter routes moist bathroom air fully outside instead of dumping it into the attic. *(Alt A5: "Line icon of a bath-fan hose connected through a sealed adapter to a roof vent.")*
  3. **Insulation** — Correct depth and R-value keeps house heat out of the attic, the root cause of melt. *(Alt A6: "Line icon of layered insulation rolls with an R-value marker.")*

### S5 — The Company  (`<h2>` · `#company`)
- **Heading:** Built for Calgary roofs
- **Body (1–2 short paragraphs):** Over 15 years of direct focus on attic-rain issues in the Calgary area. We answer any question about your roof — and we only work here, so we know exactly how Chinook cycles behave in every neighbourhood.
- **Optional testimonials:** up to 3 short quote lines (owner-supplied; gated behind §13 open question).
- **Asset:** A7 modern flat illustration of a roofing team inspecting an attic.
- **Alt (A7):** "Flat illustration of two roofing specialists inspecting an attic interior with clipboards and a flashlight."

### S6 — What to Expect  (`<h2>` · `#walkthrough`)
- **Heading:** What to expect
- **Intro (1 line):** A short walkthrough so you know what's happening in your attic and what we'll do about it.
- Then the §5 inline 6-slide walkthrough (kept as a scroll-snap component for visual rhythm; content reframed for homeowners — see §5).

### S7 — Contact / Email Us  (`<h2>` · `#contact`)
- **Heading:** Get your free assessment
- **Subhead:** Tell us a bit about your home. We'll reply within one business day.
- **Phone line (above the form):** Prefer to talk? Call `[PHONE]`.
- Functional form spec: see §8.

### S8 — Footer  (`<footer>` · `#footer`)
- Service area (Calgary-wide), Alberta roofing-license placeholder, copyright year, phone `[PHONE]`, and a plain `bmad.developments@gmail.com` mailto link.

---

## 4. Visual Asset Inventory (all NEW, each used exactly once)

All assets are generated specifically for this page. The three source images from Tomas's email are NOT reused. Each asset here appears once and only once on the page.

**Modern look (v03): photo-real hero + modern flat SVG everything else.**

| ID | Asset | Type | Style | Used In |
|---|---|---|---|---|
| A1 | `A1-hero-rooftop` | Illustration — **photo-real target** (see §10) | Frosty Calgary roof at dawn; warm sunrise light + frost; on-palette | S1 |
| A2 | `A2-frost-formation-diagram.svg` | Diagram (flat SVG) | Cross-section of attic + arrows showing heat/frost cycle; soft layered depth | S2 |
| A3 | `A3-chinook-thermometer.svg` | Infographic (flat SVG) | Thermometer showing −25°C ↔ +5°C swing with arrow | S3 |
| A4 | `A4-ventilation-icon.svg` | Icon (flat SVG) | Roof vent with airflow arrows | S4 (step 1) |
| A5 | `A5-adapter-icon.svg` | Icon (flat SVG) | Bath-fan hose + roof vent + sealed adapter | S4 (step 2) |
| A6 | `A6-insulation-icon.svg` | Icon (flat SVG) | Layered insulation rolls with R-value marker | S4 (step 3) |
| A7 | `A7-team-portrait.svg` | Illustration (flat SVG) | Roofing team inspecting an attic | S5 |
| A8 | walkthrough visuals (×6): `A8-1-warning-signs.svg`, `A8-2-chinook-cycle.svg`, `A8-3-service-area.svg`, `A8-4-solution-three-step.svg`, `A8-5-trust-markers.svg`, `A8-6-cta-contact.svg` | Slides (flat SVG) | See §5 — one homeowner-relevant visual per slide | S6 |

**Modern style guide (applies to A2–A8; A1 follows it tonally)**
- Refined **2 px** stroke, cohesive Calgary palette, **rounded forms**, **soft layered depth**.
- **Subtle gradients allowed** (within the 4-color palette) and **gentle shadows** — replacing v02's "flat, no gradients beyond subtle" rule, while staying restrained.
- Sizes: icons at 200×200; diagram/infographic assets at 800×500; illustrations at 600×400; hero at ~3:2 (1200×800).
- File budgets: photo-real hero WebP ≈150 KB (+ PNG fallback); every SVG **<15 KB**, hand-cleaned so it's crisp at any size.
- Required **alt text** is written per asset in §3a/§5/§6.

**Asset count note (corrected from v02):** there are **13 unique visuals**, not 14. The original v02 count of "8 (A1–A8) + 6 sub-assets = 14" double-counted A8's sub-block. The real count is A1–A7 (7) + A8-1…A8-6 (6) = **13**, each used exactly once. All 13 are authored and validated in `assets/`.

---

## 5. Walkthrough Inline (S6 — homeowner)

6 slides inside the landing page itself. Slide UX: arrow keys OR on-screen dots, single horizontal scroll-snap on desktop, vertical fall-through on mobile. Content is a friendly guided walkthrough of what we do for the homeowner — not a sales pitch.

| Slide | Title | Visual | Alt |
|---|---|---|---|
| PD1 | What you'll see | 4 warning signs a homeowner can check themselves — ceiling stains, frost on nails, damp insulation, peeling paint (A8-1) | "Four illustrated warning signs of attic rain a homeowner can spot: ceiling stain, frost on nail tips, damp attic insulation, and peeling paint near the ceiling." |
| PD2 | Why your home gets it | A simple Chinook swing graphic showing how fast a Calgary attic goes from freeze to thaw (A8-2) | "Graphic of a five-day Chinook temperature cycle with the cold-then-warm swing that drives attic-rain damage." |
| PD3 | Where we work | A friendly Calgary-area service map showing the neighbourhoods we cover (A8-3) | "Simplified map of Calgary with shaded service-area ring and small neighborhood markers." |
| PD4 | How we fix it | The 3-step prevention diagram — ventilation, sealed adapter, insulation (A8-4) | "Diagram combining the three prevention steps: ventilation, sealed adapter, insulation." |
| PD5 | Why homeowners trust us | Timeline of 15 years working on Calgary attics + trust markers (A8-5) | "Timeline of 15 years of work on Calgary attics with small trust icons: licensed, insured, Calgary-only, warranty." |
| PD6 | Get your free assessment | Warm "next steps" card leading into §8 contact form (A8-6) | "A friendly card titled 'Your free assessment' listing the four next steps: a phone call, an attic visit, a written quote, and the work." |

Visual rule: each slide uses exactly one custom-generated visual. Total deck assets: 6 (A8-1…A8-6) — part of the §4 inventory, not reused elsewhere.

---

## 6. Walkthrough Asset Specifications (A8 sub-block)

| Asset ID | Visualization | Purpose |
|---|---|---|
| A8-1 | **Warning-signs panel** — 4 small illustrated signs (ceiling stain, frost on nail tips, damp insulation, peeling paint) a homeowner can spot themselves | Help the homeowner self-diagnose |
| A8-2 | **Chinook cycle graphic** — a 5-day temperature arc showing how fast an attic goes from freeze to thaw | Explain *why* Calgary homes get this |
| A8-3 | **Calgary service-area map** — simplified Calgary grid with a soft service-radius ring and labelled neighbourhoods (no call-density dots) | Reassure the homeowner we cover their area |
| A8-4 | Consolidated 3-icon solution graphic (rebuilt from scratch, not reusing A4–A6) | Show the fix at a glance |
| A8-5 | **Trust timeline + markers** — timeline of 15 years of work on Calgary attics beside small trust icons (licensed, insured, Calgary-only, written quote, warranty) — **not** a competitor comparison | Build homeowner trust |
| A8-6 | **Next-steps card** — a friendly "Your free assessment" card listing the four steps after they call (phone call → attic visit → written quote → the work) | Make the next step feel small and predictable |

Note: A4–A6 (icons) and A8-4 (consolidated 3-icon graphic) are visually related, but A8-4 is a fresh composition — no asset is shared.

---

## 7. Color, Type, Layout — Design System (plain CSS)

**Palette (unchanged)**
- `#0F2A44` Calgary Sky — primary (headings, nav, footer bg)
- `#E76F2C` Chinook Orange — accent (primary buttons, links, highlights)
- `#F4F1EC` Cloud — page background
- `#A9D5E8` Frost Blue — secondary (decoration, large text, callouts)
- `#1A1A1A` — body text

**Type scale** (rem; `html { font-size: 16px }`)
- h1: 2.5rem / line-height 1.1
- h2: 2rem / 1.15
- h3: 1.375rem / 1.25
- body: 1.0625rem / 1.6
- small/caption: 0.875rem / 1.5
- Headings: `"Inter", system-ui, sans-serif`. Body: `"Source Serif", Georgia, serif` for warmth.

**Spacing tokens** (`--space` ladder): 4 / 8 / 16 / 24 / 40 / 64 (px).

**Buttons**
- Primary: Chinook Orange bg, Cloud text, `padding: 14px 24px`, `border-radius: 10px`, subtle `:hover` scale (1.02), visible `:focus-visible` ring (2px Frost Blue outline offset 2px).
- Secondary: transparent bg, 2px Calgary Sky border, same padding/radius/focus.
- Submit shows a **disabled state** while the request is in flight.

**Layout**
- CSS Grid for sections; **max content width 1100px**; single column under 768px.
- Hover/focus: subtle scale (1.02) + orange underline. No flashy animations.

**Accessibility / contrast (build-time note)**
- `#A9D5E8` Frost Blue **fails WCAG AA for body text** against the Cloud background. Restrict it to decoration, large text (≥18.66px bold / 24px regular), and panel backgrounds with dark text on top.
- Body text stays `#0F2A44` or `#1A1A1A` on `#F4F1EC` (AA-passing).
- Every interactive element gets a visible `:focus-visible` style; every form field has an associated `<label>`; the status region uses `aria-live`.

---

## 8. Contact / Email Interface (S7) — functional, no persistent backend

The form **posts to the serverless function**; the function emails the lead. No data is stored. Two user paths plus a manual fallback:

**Form fields**
- `name` — text, required
- `email` — email, required, client `pattern` + server re-validation
- `message` — textarea, required, `maxlength` (e.g. 1000)
- `<label for>` on every field. Hidden **honeypot** field; function rejects silently if filled.

**Primary path — submit**
1. JS intercepts submit, runs inline validation (required + email pattern), focuses the first invalid field, shows messages under fields (no `alert`).
2. On valid, JS `POST`s JSON to `/api/contact`. Submit button enters disabled/"Sending…" state. An `aria-live` status region narrates progress.
3. Function validates server-side → calls **Resend** (`EMAIL_API_KEY`) → sends to `bmad.developments@gmail.com` with submitter as `reply-to` → returns `{ok:true}`.
4. On `{ok:true}`: show success state — *"Message sent — we'll reply within one business day."* Form resets.
5. On `{ok:false}` or network error: show inline error — *"Something went wrong. Please try again, or copy our email below."*

**Secondary path — manual email**
- A **Copy** button writes `bmad.developments@gmail.com` to the clipboard via `navigator.clipboard.writeText`, with an `execCommand` fallback for older browsers. Hint: *"No mail app? Copy the address instead."*

**Caller path**
- Phone `[PHONE]` shown above the form (pending owner value — see §13).

**Abuse protection (minimal)**
- Honeypot field + platform-level rate limiting on the function. No CAPTCHA dependency unless spam appears post-launch.

---

## 9. Sections-to-Content Mapping (from email)

| Section | Email source content used |
|---|---|
| S1 Hero | "Deal with professionals who can answer any question about your roof" + "over 15 years of direct focus" |
| S2 Problem | "What is attic rain?" + "How does frost build up in my attic?" |
| S3 Calgary | "Why is this such a problem here but not in other parts..." + Chinook paragraph |
| S4 Solution | 3 prevention steps (ventilation / bath fan adapter / insulation) + "Primex RV28" product reference becomes A5 visual |
| S5 Company | "Over 15 years of direct focus on solving attic rain issues in the Calgary area" |
| S6 Walkthrough | Email content reframed into a 6-slide homeowner walkthrough — see §5 |
| S7 Contact | Email closing block + Tomas's signature phone line |
| S8 Footer | Service area + license disclosure placeholder |

---

## 10. Asset Generation Plan (regenerated to the modern look)

Assets were generated once before (v02, bundled in `agent-zero-selected-36-20260715-180902.zip`). **This pass regenerates all 13 visuals** to the v03 modern spec and writes them to `assets/`. The old zip is left in place, untouched.

**Status (v03):**
- ✅ **A2–A7** (6 flat SVGs) and **A8-1…A8-6** (6 flat SVGs) — authored, validated as well-formed XML, each <15 KB. A7 stays a flat illustration to keep the page light (photo-real swap noted as easy).
- ✅ **A6 SVG gap closed** — the previously-missing final `A6-insulation-icon.svg` export is now produced.
- 🟡 **A1 hero** — a polished **modern flat SVG stopgap** (`A1-hero-rooftop.svg`) is in place so the page is not blocked. The **photo-real** version (the intended hero look) is the one remaining generation task — it requires the `imagegen` skill's `image_gen` tool.

**A1 photo-real generation prompt (run via the `imagegen` skill → built-in `image_gen`):**
```text
Use case: photorealistic-natural
Asset type: landing page hero (S1), ~3:2 landscape (1536×1024 or 2048×1152)
Primary request: a frost-covered Calgary residential rooftop at dawn, warm sunrise light
melting frost from the asphalt shingles, thin wisps of melt-steam, two small roof vents
and one chimney as silhouettes, distant layered winter city skyline.
Scene/backdrop: early-morning Calgary winter, clear sky with a warm orange-to-cool-blue
dawn gradient.
Subject: the frosted roof, front and slightly elevated, as the hero subject.
Composition/framing: wide, usable negative space lower-left for headline copy, subject
offset to the right.
Lighting/mood: hopeful, warm — relief-after-solving-the-problem; golden dawn rim light.
Color palette: Calgary Sky #0F2A44, Chinook Orange #E76F2C, Frost Blue #A9D5E8, Cloud
#F4F1EC. Cool blues top, warm orange dawn light bottom.
Materials/textures: crystalline frost on shingles, soft snow, crisp cold air.
Constraints: no people, no logos, no watermark, no text, no readable signage.
```
Export both **WebP** (~150 KB) and **PNG** fallback, then serve via `<picture>` (§3a references the WebP+PNG pair). When this lands, swap the stopgap SVG for the raster hero in `index.html` — no other plan changes needed.

---

## 11. Implementation Order (when building)

1. **Regenerate all 13 visuals** to the modern spec into `assets/` (flat SVGs done; photo-real A1 hero pending `image_gen` — see §10).
2. Build `index.html` skeleton with the §3 sections and the §3a draft copy.
3. Build `styles.css` per the §7 design system.
4. **Build the serverless function** `api/contact.ts` (validate → Resend → reply-to) and set the `EMAIL_API_KEY` env var.
5. Wire the inline JS: form `fetch` + validation + success/error + copy-email fallback; pitch-deck nav; mobile menu; smooth scroll; lazy-load.
6. Test locally — verify all 13 assets render exactly once, the form end-to-end delivers an email, and focus/contrast/a11y checks pass.
7. Deploy (static folder + function on Netlify / Vercel / Cloudflare).

---

## 12. Out of Scope

- Complex booking systems with calendar integration
- Multi-page site / separate deck
- CMS
- Analytics dashboards (basic GA tag only if needed)
- A/B testing infrastructure
- **No persistent database / lead storage** (the function emails and forgets)
- Authentication
- Any framework, build tool, or package manager for the frontend

> Note: v02 listed "Backend, database, API" here. The **minimal** contact backend (one serverless function + transactional email API) is now **in scope**; a persistent database remains out of scope.

---

## 13. Open Questions (for owner)

1. Brand name + logo lockup for S1 → `[BRAND]`
2. Real **phone number** for S7/S8 → `[PHONE]` (email is resolved: `bmad.developments@gmail.com`)
3. Service-area polygon for A8-3 map
4. Alberta roofing license number text for footer
5. Two or three real customer quote lines (optional in S5)
6. Pitch-deck statistical claims (PD1 call volume, PD2 temperature data) — sourced from public reports or owner data?
7. **Transactional-email provider confirm:** Resend (default) vs Postmark vs Brevo, and the `EMAIL_API_KEY`.
8. **Host confirm:** Netlify / Vercel / Cloudflare Pages+Functions (drives function runtime).
9. **Function language confirm:** Node/TypeScript (default, native to the hosts) vs C# on Azure Functions (for .NET stack alignment).

---

**Plan status:** v04 — single-audience (homeowner); S6 reframed from a stakeholder pitch deck into a homeowner walkthrough; 12 flat SVGs done + A1 stopgap in place (photo-real A1 still pending `imagegen`'s `image_gen` — prompt locked in §10). Page assembly not yet started.
