/**
 * Attic Rain — contact endpoint (serverless function)
 *
 * Minimal contact backend: receives the landing-page form POST, validates
 * server-side, and emails the lead to the owner via a transactional email
 * API (default Resend). No database, no stored leads — it emails and forgets.
 *
 * Runtime: Node/TypeScript. Works natively on Netlify Functions, Vercel,
 * and Cloudflare Pages+Functions (each bundles the function on deploy, so
 * there is still no local build step for the static site).
 *
 * Config: set EMAIL_API_KEY in the host environment. Resend is the default;
 * Postmark/Brevo are drop-in (swap the URL + body shape noted below).
 */

// ---- Types ----
type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
};

const TO = "bmad.developments@gmail.com";
const FROM = "Attic Rain Site <noreply@a5dev.com>"; // must be a verified sender domain
const PROVIDER = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || "";

// ---- Helpers ----
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Call the configured transactional provider. Returns true on success. */
async function sendEmail(p: { name: string; email: string; message: string }): Promise<boolean> {
  const subject = `New attic-rain assessment request from ${p.name}`;
  const textBody =
    `New request from the attic-rain landing page.\n\n` +
    `Name: ${p.name}\n` +
    `Email: ${p.email}\n\n` +
    `Message:\n${p.message}\n`;

  const htmlBody =
    `<div style="font-family:Inter,Arial,sans-serif;max-width:560px">` +
    `<h2 style="color:#0B1220">New attic-rain assessment request</h2>` +
    `<p><strong>Name:</strong> ${escapeHtml(p.name)}<br>` +
    `<strong>Email:</strong> ${escapeHtml(p.email)}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<blockquote style="border-left:3px solid #FF6A1A;padding-left:12px;color:#334155;white-space:pre-wrap">${escapeHtml(p.message)}</blockquote>` +
    `<p style="color:#94A3B8;font-size:12px">Reply directly to this email to reach the homeowner.</p></div>`;

  let url = "";
  let init: RequestInit = { method: "POST", headers: {} };

  if (PROVIDER === "resend") {
    url = "https://api.resend.com/emails";
    init.headers = {
      Authorization: `Bearer ${EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    };
    init.body = JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: p.email,
      subject,
      text: textBody,
      html: htmlBody,
    });
  } else if (PROVIDER === "postmark") {
    // Drop-in: Postmark uses Sender + replyTo semantics.
    url = "https://api.postmarkapp.com/email";
    init.headers = {
      "X-Postmark-Server-Token": EMAIL_API_KEY,
      "Content-Type": "application/json",
    };
    init.body = JSON.stringify({
      From: FROM,
      To: TO,
      ReplyTo: p.email,
      Subject: subject,
      TextBody: textBody,
      HtmlBody: htmlBody,
    });
  } else if (PROVIDER === "brevo") {
    // Drop-in: Brevo (Sendinblue).
    url = "https://api.brevo.com/v3/smtp/email";
    init.headers = {
      "api-key": EMAIL_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    };
    init.body = JSON.stringify({
      sender: { email: FROM },
      to: [{ email: TO }],
      replyTo: { email: p.email },
      subject,
      textContent: textBody,
      htmlContent: htmlBody,
    });
  } else {
    return false;
  }

  const res = await fetch(url, init);
  return res.ok;
}

// ---- Handler (Web Fetch API — native to all three hosts) ----
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  // Honeypot: silently "succeed" for bots.
  if (body.company && body.company.trim() !== "") {
    return json(200, { ok: true });
  }

  // Server-side re-validation
  const name = (body.name || "").trim().slice(0, 120);
  const email = (body.email || "").trim().slice(0, 160);
  const message = (body.message || "").trim().slice(0, 2000);

  if (!name || !EMAIL_RE.test(email) || message.length < 2) {
    return json(422, { ok: false, error: "Validation failed" });
  }
  if (!EMAIL_API_KEY) {
    return json(500, { ok: false, error: "Email provider not configured" });
  }

  try {
    const sent = await sendEmail({ name, email, message });
    return sent
      ? json(200, { ok: true })
      : json(502, { ok: false, error: "Provider returned an error" });
  } catch {
    return json(502, { ok: false, error: "Failed to send email" });
  }
}
