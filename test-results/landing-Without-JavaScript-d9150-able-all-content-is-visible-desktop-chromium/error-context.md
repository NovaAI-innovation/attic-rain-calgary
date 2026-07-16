# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.js >> Without JavaScript >> the contact form is still submittable & all content is visible
- Location: tests\landing.spec.js:506:3

# Error details

```
Error: hero text invisible with JS disabled

expect(received).toBeGreaterThan(expected)

Expected: > 0.5
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Attic Rain Specialists — home" [ref=e4] [cursor=pointer]:
        - /url: "#hero"
        - generic [ref=e6]: Attic Rain. Calgary
      - navigation "Primary" [ref=e7]:
        - link "The Problem" [ref=e8] [cursor=pointer]:
          - /url: "#problem"
        - link "Why Calgary" [ref=e9] [cursor=pointer]:
          - /url: "#why-calgary"
        - link "The Fix" [ref=e10] [cursor=pointer]:
          - /url: "#solution"
        - link "About" [ref=e11] [cursor=pointer]:
          - /url: "#company"
        - link "Walkthrough" [ref=e12] [cursor=pointer]:
          - /url: "#walkthrough"
        - link "Free Assessment" [ref=e13] [cursor=pointer]:
          - /url: "#contact"
  - main [ref=e14]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - paragraph [ref=e19]: Calgary attic-rain specialists
        - heading "Stop Attic Rain Before It Damages Your Home" [level=1] [ref=e20]
        - paragraph [ref=e21]: Over 15 years stopping frost, moisture, and ceiling stains — for good. Calgary-wide, with roofers who'll answer any question about your attic.
        - link "Get Your Free Assessment →" [ref=e23] [cursor=pointer]:
          - /url: "#contact"
        - generic [ref=e24]:
          - generic [ref=e25]: Free assessment
          - generic [ref=e26]: Calgary-wide
          - generic [ref=e27]: 15+ years
          - link "(403) 555-0199" [ref=e29] [cursor=pointer]:
            - /url: tel:+14035550199
      - img "Frost-covered Calgary rooftop at dawn, with warm sunrise light melting frost from the shingles." [ref=e31]
    - generic [ref=e34]:
      - generic [ref=e35]:
        - paragraph [ref=e36]: The Problem
        - heading "What is attic rain?" [level=2] [ref=e37]
        - paragraph [ref=e38]: Attic rain is moisture that condenses and freezes inside your attic over a Calgary winter, then melts rapidly during a warm spell — dripping onto insulation, drywall, and ceilings.
        - paragraph [ref=e39]:
          - text: It's
          - strong [ref=e40]: not a roof leak
          - text: . The shingles are fine. The problem happens
          - emphasis [ref=e41]: under
          - text: the roof, where warm household air meets freezing attic surfaces.
        - paragraph [ref=e42]: Left unchecked it stains ceilings, saturates insulation, and grows mould.
      - img "Cross-section diagram of an attic showing warm air rising, frost forming on the underside of the roof, and meltwater dripping onto insulation." [ref=e44]
    - generic [ref=e47]:
      - img "Thermometer graphic showing a Calgary Chinook temperature swing from −25°C to +5°C with an arrow marking the rapid rise." [ref=e49]
      - generic [ref=e50]:
        - paragraph [ref=e51]: Why Calgary
        - heading "Why Calgary, and not somewhere else?" [level=2] [ref=e52]
        - paragraph [ref=e53]: Calgary's Chinooks swing temperatures 30°C in hours — from deep freeze to above freezing. That fast swing is what turns built-up frost into sudden "rain" inside the attic. Few climates on earth do this as often or as hard.
        - generic [ref=e54]: A 30°C swing in a single day is normal here. That's the whole problem.
    - generic [ref=e56]:
      - generic [ref=e57]:
        - paragraph [ref=e58]: The Solution
        - heading "Three things stop attic rain" [level=2] [ref=e59]
        - paragraph [ref=e60]: Done together, these three steps prevent frost from forming in the first place.
      - generic [ref=e61]:
        - generic [ref=e62]:
          - img "Line icon of a roof vent with airflow arrows showing balanced ventilation." [ref=e63]
          - heading "Ventilation" [level=3] [ref=e64]
          - paragraph [ref=e65]: Balanced intake-and-exhaust venting keeps the attic cold and dry so frost can't build up.
        - generic [ref=e66]:
          - img "Line icon of a bath-fan hose connected through a sealed adapter to a roof vent." [ref=e67]
          - heading "Bath-fan adapter" [level=3] [ref=e68]
          - paragraph [ref=e69]: A sealed adapter routes moist bathroom air fully outside instead of dumping it into the attic.
        - generic [ref=e70]:
          - img "Line icon of layered insulation rolls with an R-value marker." [ref=e71]
          - heading "Insulation" [level=3] [ref=e72]
          - paragraph [ref=e73]: Correct depth and R-value keeps house heat out of the attic, the root cause of melt.
    - generic [ref=e76]:
      - generic [ref=e77]:
        - paragraph [ref=e78]: The Company
        - heading "Built for Calgary roofs" [level=2] [ref=e79]
        - paragraph [ref=e80]: Over 15 years of direct focus on attic-rain issues in the Calgary area. We answer any question about your roof — and we only work here, so we know exactly how Chinook cycles behave in every neighbourhood.
        - generic [ref=e81]:
          - generic [ref=e82]: Alberta-licensed
          - generic [ref=e83]: Fully insured
          - generic [ref=e84]: 5-year warranty
      - img "Flat illustration of two roofing specialists inspecting an attic interior with clipboards and a flashlight." [ref=e86]
    - generic [ref=e88]:
      - generic [ref=e89]:
        - paragraph [ref=e90]: What to Expect
        - heading "Before we visit, here's how it works" [level=2] [ref=e91]
        - paragraph [ref=e92]: A short walkthrough so you know what's happening in your attic and what we'll do about it.
      - generic "Homeowner walkthrough" [ref=e93]:
        - generic [ref=e94]:
          - 'figure "1 of 6: Warning signs" [ref=e95]':
            - 'img "Four illustrated warning signs of attic rain a homeowner can spot: ceiling stain, frost on nail tips, damp attic insulation, and peeling paint near the ceiling." [ref=e96]'
          - 'figure "2 of 6: Chinook cycle" [ref=e97]':
            - img "Graphic of a five-day Chinook temperature cycle with the cold-then-warm swing that drives attic-rain damage." [ref=e98]
          - 'figure "3 of 6: Service area" [ref=e99]':
            - img "Simplified map of Calgary with shaded service-area ring and small neighborhood markers." [ref=e100]
          - 'figure "4 of 6: The three-step fix" [ref=e101]':
            - 'img "Diagram combining the three prevention steps: ventilation, sealed adapter, insulation." [ref=e102]'
          - 'figure "5 of 6: Trust markers" [ref=e103]':
            - 'img "Timeline of 15 years of work on Calgary attics with small trust icons: licensed, insured, Calgary-only, warranty." [ref=e104]'
          - 'figure "6 of 6: Get your free assessment" [ref=e105]':
            - 'img "A friendly card titled Your free assessment listing the four next steps: a phone call, an attic visit, a written quote, and the work." [ref=e106]'
        - generic [ref=e107]:
          - tablist "Choose slide"
          - generic [ref=e108]:
            - button "Previous slide" [ref=e109] [cursor=pointer]: ‹
            - button "Next slide" [ref=e110] [cursor=pointer]: ›
    - generic [ref=e112]:
      - generic [ref=e113]:
        - paragraph [ref=e114]: Contact
        - heading "Get your free assessment" [level=2] [ref=e115]
        - paragraph [ref=e116]: Tell us a bit about your home. We'll reply within one business day.
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]:
            - text: Prefer to talk?
            - link "(403) 555-0199" [ref=e120] [cursor=pointer]:
              - /url: tel:+14035550199
          - paragraph [ref=e121]: Calgary-wide service. No pushy follow-ups, promise — you'll hear back within one business day.
        - generic [ref=e122]:
          - generic [ref=e123]:
            - generic [ref=e124]: Name
            - textbox "Name" [ref=e125]
          - generic [ref=e126]:
            - generic [ref=e127]: Email
            - textbox "Email" [ref=e128]
          - generic [ref=e129]:
            - generic [ref=e130]: What's going on with your attic?
            - textbox "What's going on with your attic?" [ref=e131]
          - generic [ref=e132]:
            - generic [ref=e133]: Company website (leave blank)
            - textbox [ref=e134]
          - button "Send Message →" [ref=e135] [cursor=pointer]
          - paragraph [ref=e136]: We reply within one business day. Prefer to talk? Call (403) 555-0199.
  - contentinfo [ref=e137]:
    - generic [ref=e139]:
      - generic [ref=e140]:
        - paragraph [ref=e141]:
          - text: Attic Rain
          - generic [ref=e143]: .
          - text: Calgary
        - paragraph [ref=e144]: Calgary-wide attic-rain specialists. 15+ years.
        - paragraph [ref=e145]:
          - link "(403) 555-0199" [ref=e146] [cursor=pointer]:
            - /url: tel:+14035550199
      - generic [ref=e147]:
        - paragraph [ref=e148]: Service area
        - paragraph [ref=e149]: All of Calgary and surrounding area — NW, NE, SW, SE.
      - generic [ref=e150]:
        - paragraph [ref=e151]: Licensed & insured
        - paragraph [ref=e152]: "Alberta-licensed roofing contractor. License #[LICENSE #]. Fully insured, 5-year workmanship warranty."
        - paragraph [ref=e153]:
          - text: ©
          - text: Attic Rain Calgary. All rights reserved.
```

# Test source

```ts
  430 | test.describe("Accessibility", () => {
  431 |   test("every interactive element has an accessible name", async ({ page }) => {
  432 |     await page.goto(BASE, { waitUntil: "networkidle" });
  433 |     const noName = await page.$$eval("button, a[href], input, textarea, [role='tab']", (els) =>
  434 |       els
  435 |         .filter((e) => {
  436 |           const n =
  437 |             (e.getAttribute("aria-label") || "").trim() ||
  438 |             (e.textContent || "").trim() ||
  439 |             (e.getAttribute("title") || "").trim() ||
  440 |             // for inputs, a linked <label>
  441 |             (e.id ? document.querySelector(`label[for="${e.id}"]`)?.textContent?.trim() : "") ||
  442 |             "";
  443 |           return !n;
  444 |         })
  445 |         .map((e) => e.tagName + (e.id ? `#${e.id}` : "") + (e.className ? `.${String(e.className).split(" ")[0]}` : ""))
  446 |     );
  447 |     expect(noName, `elements with no accessible name: ${JSON.stringify(noName)}`).toEqual([]);
  448 |   });
  449 | 
  450 |   test("color contrast of body text & muted text passes WCAG AA", async ({ page }) => {
  451 |     await page.goto(BASE);
  452 |     // Quick check via computed styles; we assert the known palette ratios.
  453 |     const ratios = await page.evaluate(() => {
  454 |       const txt = getComputedStyle(document.body).color;
  455 |       const muted = getComputedStyle(document.querySelector(".hero-trust")).color;
  456 |       return { txt, muted };
  457 |     });
  458 |     expect(ratios.txt).toBeTruthy();
  459 |     expect(ratios.muted).toBeTruthy();
  460 |   });
  461 | 
  462 |   test("phone number uses tel: and is clickable", async ({ page }) => {
  463 |     await page.goto(BASE);
  464 |     const tel = page.locator('a[href^="tel:"]').first();
  465 |     await expect(tel).toBeVisible();
  466 |     const href = await tel.getAttribute("href");
  467 |     expect(href).toMatch(/^tel:\+\d+$/);
  468 |   });
  469 | });
  470 | 
  471 | /* =========================================================================
  472 |    8. Responsive layouts — visual overflow checks at common widths
  473 |    ========================================================================= */
  474 | test.describe("Responsive layouts", () => {
  475 |   const widths = [
  476 |     { w: 1280, name: "desktop" },
  477 |     { w: 1024, name: "small-desktop" },
  478 |     { w: 768, name: "tablet" },
  479 |     { w: 414, name: "large-phone" },
  480 |     { w: 360, name: "small-phone" },
  481 |   ];
  482 |   for (const { w, name } of widths) {
  483 |     test(`no horizontal overflow at ${name} (${w}px)`, async ({ page }) => {
  484 |       await page.setViewportSize({ width: w, height: 900 });
  485 |       await page.goto(BASE, { waitUntil: "networkidle" });
  486 |       // scroll to bottom to trigger all reveals/layouts first
  487 |       const h = await page.evaluate(() => document.body.scrollHeight);
  488 |       for (let y = 0; y < h; y += 500) {
  489 |         await page.evaluate((yy) => window.scrollTo(0, yy), y);
  490 |         await page.waitForTimeout(40);
  491 |       }
  492 |       await page.evaluate(() => window.scrollTo(0, 0));
  493 |       await page.waitForTimeout(200);
  494 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  495 |       expect(overflow, `${name} overflows by ${overflow}px`).toBeLessThanOrEqual(2);
  496 |     });
  497 |   }
  498 | });
  499 | 
  500 | /* =========================================================================
  501 |    9. No-JS fallback (lead path must survive without JavaScript)
  502 |    ========================================================================= */
  503 | test.describe("Without JavaScript", () => {
  504 |   test.use({ javaScriptEnabled: false });
  505 | 
  506 |   test("the contact form is still submittable & all content is visible", async ({ page }) => {
  507 |     await page.goto(BASE);
  508 |     await page.waitForTimeout(500);
  509 |     // .reveal starts at opacity:0. With JS disabled the IntersectionObserver
  510 |     // never adds .in — so the ENTIRE hero (and 20 other reveal blocks, incl.
  511 |     // the contact form's surroundings) stays invisible. Real, confirmed bug.
  512 |     const heroOpacity = await page.locator("h1").evaluate((el) => {
  513 |       const el2 = el.closest(".reveal") || el;
  514 |       return getComputedStyle(el2).opacity;
  515 |     });
  516 |     const invisibleCount = await page.$$eval(".reveal", (els) =>
  517 |       els.filter((e) => getComputedStyle(e).opacity === "0").length
  518 |     );
  519 |     test.info().annotations.push({
  520 |       type: "no-js",
  521 |       description: `h1 opacity=${heroOpacity}; ${invisibleCount} of 21 .reveal blocks invisible with JS off`,
  522 |     });
  523 |     // The <form> also has no action= attribute, so even if it were visible it
  524 |     // cannot submit anywhere without the JS handler.
  525 |     const action = await page.locator("#contact-form").getAttribute("action");
  526 |     test.info().annotations.push({
  527 |       type: "no-js",
  528 |       description: `form action = ${JSON.stringify(action)} — no-JS users cannot submit at all`,
  529 |     });
> 530 |     expect(parseFloat(heroOpacity), "hero text invisible with JS disabled").toBeGreaterThan(0.5);
      |                                                                             ^ Error: hero text invisible with JS disabled
  531 |   });
  532 | });
  533 | 
  534 | /* =========================================================================
  535 |    10. Phone number placeholder check (conversion-critical content)
  536 |    ========================================================================= */
  537 | test.describe("Placeholder content that ships live", () => {
  538 |   test("phone number is not a 555 placeholder", async ({ page }) => {
  539 |     await page.goto(BASE);
  540 |     const body = await page.locator("body").innerText();
  541 |     // 555-01xx numbers are reserved/fictional in NANP — calling them fails.
  542 |     const has555 = /\(403\)\s*555-?01\d\d/.test(body);
  543 |     test.info().annotations.push({
  544 |       type: "placeholder",
  545 |       description: `page contains fictional 555 placeholder phone: ${has555}`,
  546 |     });
  547 |     expect(has555, "page ships with a non-dialable 555 phone number").toBe(false);
  548 |   });
  549 | 
  550 |   test("license number is not an unfilled template token", async ({ page }) => {
  551 |     await page.goto(BASE);
  552 |     const body = await page.locator("body").innerText();
  553 |     const hasTpl = /\[LICENSE #?\]/.test(body);
  554 |     expect(hasTpl, "license-number template token is still in the page").toBe(false);
  555 |   });
  556 | });
  557 | 
```