// Capture clean full-page + section renders for design critique.
// Scroll slowly first so all reveal animations complete.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const BASE = "http://localhost:8765/index.html";
const OUT = path.join(__dirname, "screenshots", "critique");
fs.mkdirSync(OUT, { recursive: true });

const views = [
  { name: "desktop", w: 1280, h: 900 },
  { name: "tablet", w: 820, h: 1180 },
  { name: "phone", w: 390, h: 844 },
];

const sections = ["hero", "problem", "why-calgary", "solution", "company", "walkthrough", "contact", "footer"];

(async () => {
  const browser = await chromium.launch();
  for (const v of views) {
    const page = await browser.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 2 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    // trigger every reveal
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 350) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    // full page
    await page.screenshot({ path: path.join(OUT, `full-${v.name}.png`), fullPage: true });
    // per section
    for (const id of sections) {
      const loc = id === "footer" ? page.locator(".site-footer") : page.locator(`#${id}`);
      const count = await loc.count();
      if (!count) continue;
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(250);
      await loc.screenshot({ path: path.join(OUT, `${v.name}-${id}.png`) }).catch(() => {});
    }
    await page.close();
  }
  // nav bar close-up (desktop + mobile-open)
  for (const [name, w, open] of [["desktop", 1280, false], ["phone", 390, true]]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
    await p.goto(BASE, { waitUntil: "networkidle" });
    if (open) await p.locator(".nav-toggle").click();
    await p.waitForTimeout(300);
    await p.locator(".site-nav").screenshot({ path: path.join(OUT, `nav-${name}${open ? "-open" : ""}.png`) });
    await p.close();
  }
  await browser.close();
  console.log("Wrote", fs.readdirSync(OUT).length, "images to", OUT);
})();
