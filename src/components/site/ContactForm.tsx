"use client";

import { useRef, useState, type FormEvent } from "react";
import { Turnstile } from "./Turnstile";
import { PERSON } from "@/lib/site";

type Errors = { name?: string; email?: string; message?: string };
type Status = "idle" | "sending" | "success" | "error";

const FIELDS = ["name", "email", "message"] as const;
type Field = (typeof FIELDS)[number];

const validate = (values: { name: string; email: string; message: string }): Errors => {
  const e: Errors = {};
  if (!values.name.trim()) e.name = "Required";
  if (!values.email.trim()) e.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email";
  if (values.message.trim().length < 10) e.message = "At least 10 characters";
  return e;
};

/**
 * What the visitor is told when the request fails.
 *
 * The API answers a failed send with whatever went wrong on the server, which
 * includes strings like "Set TURNSTILE_SECRET_KEY" and raw upstream response
 * bodies. Those are addressed to whoever runs the site, not to the person
 * trying to reach him, so only the 400 case — this form's own validation,
 * echoed back — is shown verbatim. Everything else becomes a sentence with a
 * way out of it.
 */
function failureFor(httpStatus: number, serverError?: string) {
  if (httpStatus === 400 && serverError) return { text: serverError, offerEmail: false };
  if (httpStatus === 403)
    return { text: "Captcha check failed. Reload the page and try again.", offerEmail: false };
  return { text: "Message didn’t send. Reach me directly at", offerEmail: true };
}

// Read directly (not just inside <Turnstile>) so a missing key disables the
// gate instead of leaving the submit button permanently stuck on a captcha
// that will never render.
const CAPTCHA_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState({ text: "", offerEmail: false });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Turnstile tokens are single-use — a failed submit needs a fresh widget,
  // not just a cleared token, so a retry has something to send.
  const [captchaKey, setCaptchaKey] = useState(0);

  /*
   * Submitting an invalid form has to put the caret somewhere. Without this the
   * only signal is a line of text appearing further down the page, which a
   * screen reader never announces (aria-describedby is read on entering the
   * field, not when it changes) and a keyboard visitor may not have scrolled to.
   */
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Typing a correction clears its error immediately. Leaving it on screen
  // while the visitor fixes the field is the form arguing with them.
  const set = (k: Field) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };
  const blur = (k: Field) => () => setErrors((prev) => ({ ...prev, [k]: validate(values)[k] }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    const firstInvalid = FIELDS.find((k) => next[k]);
    if (firstInvalid) {
      // Resolved in the handler, not by indexing a ref object during render.
      const target =
        firstInvalid === "name"
          ? nameRef.current
          : firstInvalid === "email"
            ? emailRef.current
            : messageRef.current;
      target?.focus();
      return;
    }

    if (CAPTCHA_CONFIGURED && !captchaToken) {
      setStatus("error");
      setFailure({ text: "Complete the captcha below, then send again.", offerEmail: false });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: captchaToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        // The operator's version of the failure goes to the console; the
        // visitor's version goes on screen.
        console.error("Contact form failed:", res.status, data.error);
        setStatus("error");
        setFailure(failureFor(res.status, data.error));
        setCaptchaToken(null);
        setCaptchaKey((k) => k + 1);
        return;
      }
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    } catch (err) {
      console.error("Contact form failed:", err);
      setStatus("error");
      // No response at all: offline, DNS, blocked request.
      setFailure({ text: "Message didn’t send. Reach me directly at", offerEmail: true });
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    }
  }

  /*
   * No `outline-none`. Tailwind v4 emits it from the utilities layer, which is
   * declared after base, so it silently deleted the site-wide
   * `:focus-visible` ring on the only three inputs on the site. The border
   * change gives the field a visible focus state of its own and the ring is
   * pulled onto the border box rather than 3px outside it, where it would
   * collide with the next field.
   */
  /*
   * 16px on phones, the site's 14px from `md` up. iOS Safari zooms the whole
   * page in when a focused field is under 16px and never zooms back out, so a
   * visitor who tapped the name box spent the rest of the form scrolling
   * sideways.
   */
  const field =
    "w-full border border-ink bg-paper-deep px-3 py-3 text-base text-ink transition-colors placeholder:text-ink-muted focus-visible:border-cobalt focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cobalt md:text-sm";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="label mb-2 block">
          [NAME]
        </label>
        <input
          id="name"
          name="name"
          ref={nameRef}
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name")(e.target.value)}
          onBlur={blur("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={field}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="label mt-1 text-cobalt">
            ! {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label mb-2 block">
          [EMAIL]
        </label>
        <input
          id="email"
          name="email"
          type="email"
          ref={emailRef}
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          onBlur={blur("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p id="email-error" className="label mt-1 text-cobalt">
            ! {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label mb-2 block">
          [MESSAGE]
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          ref={messageRef}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          onBlur={blur("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={field}
          placeholder="What are you building?"
        />
        {errors.message && (
          <p id="message-error" className="label mt-1 text-cobalt">
            ! {errors.message}
          </p>
        )}
      </div>

      <Turnstile key={captchaKey} onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

      <div className="flex flex-wrap items-center gap-4">
        {/*
         * Disabled only while the request is in flight. Gating it on the
         * captcha token meant a blocked Cloudflare script left the button dead
         * with nothing to explain it, and made the "complete the captcha"
         * branch above unreachable.
         */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <a
          href="/resume.pdf"
          className="border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Download resume (PDF) ↓
        </a>
      </div>

      {/*
       * Sent and failed are both cobalt — the palette is locked and lime is the
       * only accent there is. The bracket label carries the state instead, the
       * same way [404] and [ERROR] do on their own pages.
       */}
      <div aria-live="polite" className="min-h-5">
        {/* Same promise the FAQ and the contact page make. It read "a day or
            two" here and "one working day" everywhere else. */}
        {status === "success" && (
          <p className="label text-cobalt">[SENT] A reply usually lands within one working day.</p>
        )}
        {status === "error" && (
          <p className="label text-cobalt">
            [FAILED] {failure.text}
            {failure.offerEmail && (
              <>
                {" "}
                <a href={`mailto:${PERSON.email}`} className="underline">
                  {PERSON.email}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
