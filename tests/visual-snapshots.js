// @ts-check
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:8765/index.html";
const OUT = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const views = [
  { name: "desktop-1280", w: 1280, h: 900 },
  { name: "tablet-768", w: 768, h: 1024 },
  { name: "phone-390", w: 390, h: 844 },
  { name: "phone-360", w: 360, h: 720 },
];

(async () => {
  const browser = await chromium.launch();
  for (const v of views) {
    const page = await browser.newPage({ viewport: { width: v.w, height: v.h } });
    await page.goto(BASE, { waitUntil: "networkidle" });

    // Full-page screenshot (after reveals fire)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `full-${v.name}.png`), fullPage: true });

    // Contact form close-up (the conversion moment)
    await page.locator("#contact-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator("#contact-form").screenshot({ path: path.join(OUT, `contact-${v.name}.png`) });

    // Hero (first impression)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `hero-${v.name}.png`) });

    // Mobile: the nav menu open state
    if (v.w <= 720) {
      await page.locator(".nav-toggle").click();
      await page.waitForTimeout(400);
      await page.locator(".site-nav").screenshot({ path: path.join(OUT, `nav-open-${v.name}.png`) });
    }

    // Validation state on mobile/form
    await page.locator("#contact-form").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.locator("#submit-btn").click();
    await page.waitForTimeout(400);
    await page.locator("#contact-form").screenshot({ path: path.join(OUT, `form-invalid-${v.name}.png`) });

    await page.close();
  }

  // Config-missing scenario: simulate a fresh checkout with no key.
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page2.addInitScript(() => { window.__NO_CONFIG__ = true; window.SITE_CONFIG = {}; });
  await page2.goto(BASE, { waitUntil: "networkidle" });
  await page2.locator("#contact-form").scrollIntoViewIfNeeded();
  await page2.waitForTimeout(400);
  await page2.fill("#name", "Test");
  await page2.fill("#email", "test@example.com");
  await page2.fill("#message", "Frost in attic");
  await page2.locator("#submit-btn").click();
  await page2.waitForTimeout(600);
  const status = await page2.locator("#form-status").textContent();
  console.log("config-missing status:", JSON.stringify(status));
  await page2.locator("#contact-form").screenshot({ path: path.join(OUT, "form-config-missing.png") });

  await browser.close();
  console.log("Screenshots written to", OUT);
  for (const f of fs.readdirSync(OUT)) console.log("  ", f);
})();
