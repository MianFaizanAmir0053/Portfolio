"use client";

import { useState, type FormEvent } from "react";

type Errors = { name?: string; email?: string; message?: string };
type Status = "idle" | "sending" | "success" | "error";

const validate = (values: { name: string; email: string; message: string }): Errors => {
  const e: Errors = {};
  if (!values.name.trim()) e.name = "Required";
  if (!values.email.trim()) e.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email";
  if (values.message.trim().length < 10) e.message = "At least 10 characters";
  return e;
};

// Statically referenced so Next inlines it at build time.
const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));
  const blur = (k: keyof typeof values) => () =>
    setErrors((prev) => ({ ...prev, [k]: validate(values)[k] }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!ENDPOINT) {
      setStatus("error");
      setErrorMsg("Form endpoint not configured. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "w-full bg-paper-deep px-3 py-3 text-sm text-ink outline-none border border-ink placeholder:text-ink-muted";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="label mb-2 block">
          [NAME]
        </label>
        <input
          id="name"
          name="name"
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
            * {errors.name}
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
            * {errors.email}
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
            * {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
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
          Download Resume ↓
        </a>
      </div>

      <div aria-live="polite" className="min-h-5">
        {status === "success" && (
          <p className="label text-cobalt">* MESSAGE SENT — I&apos;ll reply within a day or two.</p>
        )}
        {status === "error" && <p className="label text-cobalt">* {errorMsg}</p>}
      </div>
    </form>
  );
}
