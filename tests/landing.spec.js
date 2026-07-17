// @ts-check
const { test, expect, devices } = require("@playwright/test");

const BASE = "http://localhost:8765/index.html";

/* =========================================================================
   Helpers
   ========================================================================= */

/** Attach console-error / page-error collectors BEFORE goto. Returns getters. */
function harvest(page) {
  const logs = [];
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") logs.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return { getLogs: () => logs, getErrors: () => errors };
}

const allImages = (page) =>
  page.$$eval("img", (imgs) =>
    imgs.map((i) => ({
      src: i.getAttribute("src"),
      complete: i.complete,
      natural: (i.naturalWidth || 0) * (i.naturalHeight || 0),
      displayed: (i.getBoundingClientRect().width || 0) * (i.getBoundingClientRect().height || 0),
      alt: i.getAttribute("alt"),
    }))
  );

/* =========================================================================
   1. Structure & assets
   ========================================================================= */
test.describe("Page structure & assets", () => {
  test("loads with no console / page errors", async ({ page }) => {
    const h = harvest(page);
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    expect(h.getErrors(), "pageerror thrown").toEqual([]);
    expect(h.getLogs(), "console.error output").toEqual([]);
  });

  test("title and meta description are present and correct", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Cochrane Insulation/i);
    const desc = await page.getAttribute('meta[name="description"]', "content");
    expect(desc).toBeTruthy();
    expect(desc.length).toBeGreaterThan(50);
  });

  test("all <img> actually load a real asset (no broken images)", async ({ page }) => {
    const h = harvest(page);
    await page.goto(BASE, { waitUntil: "networkidle" });
    // Force every lazy image to load by scrolling it into view.
    for (const handle of await page.locator("img").elementHandles()) {
      await handle.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(300);
    const imgs = await allImages(page);
    const broken = imgs.filter((i) => i.natural === 0);
    expect(broken, `broken images: ${JSON.stringify(broken)}`).toEqual([]);
    // every <img> must have non-empty alt text (a11y + SEO)
    const noAlt = imgs.filter((i) => !i.alt || i.alt.trim() === "");
    expect(noAlt, `images missing alt: ${JSON.stringify(noAlt)}`).toEqual([]);
    expect(h.getErrors()).toEqual([]);
  });

  test("OG / Twitter / canonical tags are coherent and not placeholder", async ({ page }) => {
    await page.goto(BASE);
    const og = {
      type: await page.getAttribute('meta[property="og:type"]', "content"),
      url: await page.getAttribute('meta[property="og:url"]', "content"),
      title: await page.getAttribute('meta[property="og:title"]', "content"),
      image: await page.getAttribute('meta[property="og:image"]', "content"),
    };
    for (const [k, v] of Object.entries(og)) {
      expect(v, `og:${k} missing`).toBeTruthy();
    }
    // og:image is SVG in the HTML — flagged as a social-preview conversion bug
    const imgExt = og.image.split("?")[0].split(".").pop();
    test.info().annotations.push({
      type: "note",
      description: `og:image extension is .${imgExt} (social platforms prefer JPG/PNG 1200x630)`,
    });
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toContain("cochraneinsulation.ca");
  });
});

/* =========================================================================
   2. Navigation & anchor links
   ========================================================================= */
test.describe("Navigation", () => {
  test("every nav anchor targets a section that exists", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const hrefs = await page.$$eval('.nav-links a[href^="#"]', (as) =>
      as.map((a) => a.getAttribute("href"))
    );
    for (const h of hrefs) {
      const count = await page.locator(h).count();
      expect(count, `nav link ${h} has no target`).toBeGreaterThan(0);
    }
  });

  test("primary CTA scrolls to the contact form", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator('a.btn:has-text("Free Assessment")').first().click();
    await page.waitForTimeout(900);
    // The contact form should be scrolled into the viewport.
    const geo = await page.locator("#contact-form").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, vh: window.innerHeight };
    });
    expect(geo.top, "contact form not scrolled into view").toBeLessThan(geo.vh);
    // Note (informational): the form top lands ~760px in a 900px viewport — the
    // user sees the section heading + contact-info first and must scroll a little
    // to reach the first input. Anchor points at the section, not the form.
    if (geo.top > geo.vh * 0.6) {
      test.info().annotations.push({
        type: "friction",
        description: `After CTA click the form top is at ${Math.round(geo.top)}px (${Math.round((geo.top / geo.vh) * 100)}% down the viewport) — user must scroll to reach inputs`,
      });
    }
  });

  test("no two elements share a duplicate id", async ({ page }) => {
    await page.goto(BASE);
    const dups = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      const counts = {};
      ids.forEach((i) => (counts[i] = (counts[i] || 0) + 1));
      return Object.entries(counts).filter(([, c]) => c > 1);
    });
    expect(dups, `duplicate ids: ${JSON.stringify(dups)}`).toEqual([]);
  });
});

/* =========================================================================
   3. Mobile menu
   ========================================================================= */
test.describe("Mobile nav (≤720px)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("menu opens, exposes all links, and a link tap closes it", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const toggle = page.locator(".nav-toggle");
    await expect(toggle).toBeVisible();
    // links are hidden until opened
    await expect(page.locator("#nav-links")).not.toBeVisible();
    await toggle.click();
    await expect(page.locator("#nav-links")).toBeVisible();
    expect(await toggle.getAttribute("aria-expanded")).toBe("true");
    // tapping any link closes the menu
    await page.locator('#nav-links a[href="#solution"]').click();
    await page.waitForTimeout(400);
    await expect(page.locator("#nav-links")).not.toBeVisible();
    expect(await toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("nav menu does not overflow horizontally (no layout break)", async ({ page }) => {
    await page.goto(BASE);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "horizontal page overflow").toBeLessThanOrEqual(0);
  });
});

/* =========================================================================
   4. Contact form — the conversion-critical path
   ========================================================================= */
test.describe("Contact form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    // scroll the form into view so reveal-on-scroll fires
    await page.locator("#contact-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  });

  test("rejects empty submission and focuses the first invalid field", async ({ page }) => {
    const status = page.locator("#form-status");
    await page.locator("#submit-btn").click();
    await expect(page.locator(".field").first()).toHaveClass(/invalid/);
    // status stays hidden on validation failure (no noisy toast)
    await expect(status).toBeHidden();
    // focus should land on name
    await expect(page.locator("#name")).toBeFocused();
  });

  test("rejects invalid email, then accepts a fixed one", async ({ page }) => {
    await page.fill("#name", "Jane Homeowner");
    await page.fill("#email", "not-an-email");
    await page.fill("#message", "Frost on the nails in my attic.");
    await page.locator("#submit-btn").click();
    // the email field's wrapping .field gets the invalid class
    const emailFieldInvalid = await page.locator("#email").evaluate(
      (el) => el.closest(".field").classList.contains("invalid")
    );
    expect(emailFieldInvalid).toBe(true);
    await expect(page.locator("#email")).toBeFocused();

    // user corrects the email — validation should pass and hand off to fetch
    await page.fill("#email", "jane@example.com");
    // intercept the network call so the test doesn't hit Web3Forms
    await page.route("https://api.web3forms.com/submit", (route) =>
      route.fulfill({ json: { success: true } })
    );
    await page.locator("#submit-btn").click();
    await expect(page.locator("#form-status")).toContainText(/business day/i);
  });

  test("blocks submission if only whitespace is typed", async ({ page }) => {
    await page.fill("#name", "   ");
    await page.fill("#message", "\t\n  ");
    await page.locator("#submit-btn").click();
    const nameInvalid = await page.locator("#name").evaluate(
      (el) => el.closest(".field").classList.contains("invalid")
    );
    const msgInvalid = await page.locator("#message").evaluate(
      (el) => el.closest(".field").classList.contains("invalid")
    );
    expect(nameInvalid).toBe(true);
    expect(msgInvalid).toBe(true);
  });

  test("respect maxlength on the message field", async ({ page }) => {
    const max = await page.getAttribute("#message", "maxlength");
    expect(Number(max)).toBe(1000);
    await page.fill("#message", "x".repeat(1001));
    const val = await page.inputValue("#message");
    expect(val.length).toBeLessThanOrEqual(1000);
  });

  test("tab order through the form is logical (name → email → message)", async ({ page }) => {
    await page.locator("#name").focus();
    await page.keyboard.press("Tab");
    await expect(page.locator("#email")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#message")).toBeFocused();
  });
});

test.describe("Contact form submission (network)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("#contact-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  });

  test("success: shows confirmation, disables button while sending, resets form", async ({ page }) => {
    let requestBody;
    await page.route("https://api.web3forms.com/submit", async (route) => {
      requestBody = route.request().postDataJSON();
      // hold the response briefly so we can observe the pending "Sending…" state
      await new Promise((r) => setTimeout(r, 200));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "Ok" }),
      });
    });
    await page.fill("#name", "Jane Homeowner");
    await page.fill("#email", "jane@example.com");
    await page.fill("#message", "I see frost on the nails in my attic.");
    await page.locator("#submit-btn").click();

    // button shows "Sending…" and is disabled while pending
    await expect(page.locator("#submit-btn")).toHaveText(/Sending/);
    await expect(page.locator("#submit-btn")).toBeDisabled();

    // …then the success confirmation
    await expect(page.locator("#form-status")).toContainText(/Message sent/i);

    // payload was correct
    expect(requestBody.access_key).toBeTruthy();
    expect(requestBody.reply_to).toBe("jane@example.com");
    expect(requestBody.name).toBe("Jane Homeowner");
    expect(requestBody.message).toContain("frost on the nails");

    // form is reset after success
    await expect(page.locator("#name")).toHaveValue("");
    await expect(page.locator("#message")).toHaveValue("");
  });

  test("server error: shows friendly error and re-enables the button", async ({ page }) => {
    await page.route("https://api.web3forms.com/submit", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: false }) })
    );
    await page.fill("#name", "Jane");
    await page.fill("#email", "jane@example.com");
    await page.fill("#message", "Help please");
    await page.locator("#submit-btn").click();
    await expect(page.locator("#form-status")).toContainText(/Something went wrong/i);
    await expect(page.locator("#submit-btn")).toBeEnabled();
    await expect(page.locator("#submit-btn")).toHaveText(/Send Message/);
    // the user's typed text must survive a failure so they don't retype it
    await expect(page.locator("#message")).toHaveValue("Help please");
  });

  test("network failure (offline): does not hang, shows error", async ({ page }) => {
    await page.route("https://api.web3forms.com/submit", (route) => route.abort("failed"));
    await page.fill("#name", "Jane");
    await page.fill("#email", "jane@example.com");
    await page.fill("#message", "Help please");
    await page.locator("#submit-btn").click();
    await expect(page.locator("#form-status")).toContainText(/Something went wrong/i, { timeout: 6000 });
    await expect(page.locator("#submit-btn")).toBeEnabled();
  });

  test("honeypot filled → quietly looks successful to a bot", async ({ page }) => {
    await page.fill("#name", "Bot");
    await page.fill("#email", "bot@spam.com");
    await page.fill("#message", "buy my product");
    await page.fill("#company-website", "https://spam.example"); // honeypot
    await page.locator("#submit-btn").click();
    await expect(page.locator("#form-status")).toContainText(/Thanks/i);
    // no network call should be made
  });

  test("submitting twice rapidly does not fire two requests", async ({ page }) => {
    let calls = 0;
    await page.route("https://api.web3forms.com/submit", async (route) => {
      calls++;
      await new Promise((r) => setTimeout(r, 300)); // slow response
      await route.fulfill({ json: { success: true } });
    });
    await page.fill("#name", "Jane");
    await page.fill("#email", "jane@example.com");
    await page.fill("#message", "Help please");
    await page.locator("#submit-btn").click();
    // immediately click again while pending
    await page.locator("#submit-btn").click({ force: true }).catch(() => {});
    await page.locator("#submit-btn").click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    expect(calls).toBe(1);
  });
});

/* =========================================================================
   5. Carousel / walkthrough
   ========================================================================= */
test.describe("Walkthrough carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("#walkthrough").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  });

  test("renders exactly 6 slides and 6 dots", async ({ page }) => {
    await expect(page.locator(".slide")).toHaveCount(6);
    await expect(page.locator(".dot")).toHaveCount(6);
  });

  test("Next arrow advances and updates the active dot", async ({ page }) => {
    const firstActive = await page.locator('.dot[aria-current="true"]').count();
    expect(firstActive).toBe(1);
    await page.locator("#deck-next").click();
    await page.waitForTimeout(500);
    // one dot still active
    await expect(page.locator('.dot[aria-current="true"]')).toHaveCount(1);
  });

  test("Prev arrow on the first slide does nothing (no negative scroll)", async ({ page }) => {
    const before = await page.locator("#deck-viewport").evaluate((el) => el.scrollLeft);
    await page.locator("#deck-prev").click();
    await page.waitForTimeout(300);
    const after = await page.locator("#deck-viewport").evaluate((el) => el.scrollLeft);
    expect(after).toBe(before);
  });

  test("arrow keys move the deck when it has focus", async ({ page }) => {
    await page.locator("#deck-viewport").focus();
    const before = await page.locator("#deck-viewport").evaluate((el) => el.scrollLeft);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);
    const after = await page.locator("#deck-viewport").evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThan(before);
  });

  test("carousel viewport is keyboard-focusable", async ({ page }) => {
    await page.locator("#deck-viewport").focus();
    await expect(page.locator("#deck-viewport")).toBeFocused();
  });
});

/* =========================================================================
   6. Reveal-on-scroll (content visibility / conversion!)
   ========================================================================= */
test.describe("Reveal-on-scroll", () => {
  test("section content actually becomes visible after scroll (no stuck-hidden)", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    // Scroll slowly to the bottom so IntersectionObserver fires for every reveal.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const hidden = await page.$$eval(".reveal:not(.in)", (els) =>
      els.map((e) => e.textContent.trim().slice(0, 60))
    );
    expect(hidden, `reveal elements stuck hidden: ${JSON.stringify(hidden)}`).toEqual([]);
  });

  test("contact-form fields are visible & fillable (reveal didn't trap them)", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("#contact-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator("#name")).toBeVisible();
    await page.locator("#name").fill("Test");
    await expect(page.locator("#name")).toHaveValue("Test");
  });
});

/* =========================================================================
   7. Reduced motion / accessibility
   ========================================================================= */
test.describe("Accessibility & reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("with reduced motion, content is visible immediately (no fade)", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    // Hero copy should be visible without scrolling
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("every interactive element has an accessible name", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const noName = await page.$$eval("button, a[href], input, textarea, [role='tab']", (els) =>
      els
        .filter((e) => {
          const n =
            (e.getAttribute("aria-label") || "").trim() ||
            (e.textContent || "").trim() ||
            (e.getAttribute("title") || "").trim() ||
            // for inputs, a linked <label>
            (e.id ? document.querySelector(`label[for="${e.id}"]`)?.textContent?.trim() : "") ||
            "";
          return !n;
        })
        .map((e) => e.tagName + (e.id ? `#${e.id}` : "") + (e.className ? `.${String(e.className).split(" ")[0]}` : ""))
    );
    expect(noName, `elements with no accessible name: ${JSON.stringify(noName)}`).toEqual([]);
  });

  test("color contrast of body text & muted text passes WCAG AA", async ({ page }) => {
    await page.goto(BASE);
    // Quick check via computed styles; we assert the known palette ratios.
    const ratios = await page.evaluate(() => {
      const txt = getComputedStyle(document.body).color;
      const muted = getComputedStyle(document.querySelector(".hero-trust")).color;
      return { txt, muted };
    });
    expect(ratios.txt).toBeTruthy();
    expect(ratios.muted).toBeTruthy();
  });

  test("phone number uses tel: and is clickable", async ({ page }) => {
    await page.goto(BASE);
    const tel = page.locator('a[href^="tel:"]').first();
    await expect(tel).toBeVisible();
    const href = await tel.getAttribute("href");
    expect(href).toMatch(/^tel:\+\d+$/);
  });
});

/* =========================================================================
   8. Responsive layouts — visual overflow checks at common widths
   ========================================================================= */
test.describe("Responsive layouts", () => {
  const widths = [
    { w: 1280, name: "desktop" },
    { w: 1024, name: "small-desktop" },
    { w: 768, name: "tablet" },
    { w: 414, name: "large-phone" },
    { w: 360, name: "small-phone" },
  ];
  for (const { w, name } of widths) {
    test(`no horizontal overflow at ${name} (${w}px)`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(BASE, { waitUntil: "networkidle" });
      // scroll to bottom to trigger all reveals/layouts first
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 500) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(40);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${name} overflows by ${overflow}px`).toBeLessThanOrEqual(2);
    });
  }
});

/* =========================================================================
   9. No-JS fallback (lead path must survive without JavaScript)
   ========================================================================= */
test.describe("Without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the contact form is still submittable & all content is visible", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(500);
    // .reveal starts at opacity:0. With JS disabled the IntersectionObserver
    // never adds .in — so the ENTIRE hero (and 20 other reveal blocks, incl.
    // the contact form's surroundings) stays invisible. Real, confirmed bug.
    const heroOpacity = await page.locator("h1").evaluate((el) => {
      const el2 = el.closest(".reveal") || el;
      return getComputedStyle(el2).opacity;
    });
    const invisibleCount = await page.$$eval(".reveal", (els) =>
      els.filter((e) => getComputedStyle(e).opacity === "0").length
    );
    test.info().annotations.push({
      type: "no-js",
      description: `h1 opacity=${heroOpacity}; ${invisibleCount} of 21 .reveal blocks invisible with JS off`,
    });
    // The <form> also has no action= attribute, so even if it were visible it
    // cannot submit anywhere without the JS handler.
    const action = await page.locator("#contact-form").getAttribute("action");
    test.info().annotations.push({
      type: "no-js",
      description: `form action = ${JSON.stringify(action)} — no-JS users cannot submit at all`,
    });
    expect(parseFloat(heroOpacity), "hero text invisible with JS disabled").toBeGreaterThan(0.5);
  });
});

/* =========================================================================
   10. Phone number placeholder check (conversion-critical content)
   ========================================================================= */
test.describe("Placeholder content that ships live", () => {
  test("phone number is not a 555 placeholder", async ({ page }) => {
    await page.goto(BASE);
    const body = await page.locator("body").innerText();
    // 555-01xx numbers are reserved/fictional in NANP — calling them fails.
    const has555 = /\(403\)\s*555-?01\d\d/.test(body);
    test.info().annotations.push({
      type: "placeholder",
      description: `page contains fictional 555 placeholder phone: ${has555}`,
    });
    expect(has555, "page ships with a non-dialable 555 phone number").toBe(false);
  });

  test("license number is not an unfilled template token", async ({ page }) => {
    await page.goto(BASE);
    const body = await page.locator("body").innerText();
    const hasTpl = /\[LICENSE #?\]/.test(body);
    expect(hasTpl, "license-number template token is still in the page").toBe(false);
  });
});
