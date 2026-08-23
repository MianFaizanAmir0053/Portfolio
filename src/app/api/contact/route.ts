import { NextRequest, NextResponse } from "next/server";

/*
 * Server-side because a captcha checked only in the browser is not checked at
 * all — a spam script never runs the client JS, it just replays the fetch. The
 * Turnstile token and the message both get verified here, where a bot can't
 * skip the check.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";

type Body = { name?: unknown; email?: unknown; message?: unknown; turnstileToken?: unknown };

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: params });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";

  if (!name) return badRequest("Name is required.");
  if (!EMAIL_RE.test(email)) return badRequest("A valid email is required.");
  if (message.length < 10) return badRequest("Message must be at least 10 characters.");

  // Distinct from "you forgot to check the box" — this is a deploy issue, not
  // something the visitor can fix by retrying.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return NextResponse.json(
      { error: "Captcha is not configured on the server. Set TURNSTILE_SECRET_KEY." },
      { status: 500 },
    );
  }
  if (!turnstileToken) return badRequest("Captcha is required.");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const verified = await verifyTurnstile(turnstileSecret, turnstileToken, ip);
  if (!verified) return NextResponse.json({ error: "Captcha verification failed." }, { status: 403 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Email is not configured on the server. Set RESEND_API_KEY and CONTACT_TO_EMAIL." },
      { status: 500 },
    );
  }

  const from = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `Portfolio contact — ${name}`,
      text: `${message}\n\n—\n${name} <${email}>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json({ error: `Failed to send (${res.status}). ${detail}`.trim() }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
