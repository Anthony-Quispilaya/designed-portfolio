"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { cx } from "@/components/ui/primitives";
import {
  LIMITS,
  looksAutomated,
  mailtoFallback,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";

/**
 * Posts JSON to NEXT_PUBLIC_CONTACT_ENDPOINT (a form service such as Formspree,
 * whose endpoint is public by design — no secret ever reaches the client).
 * Without an endpoint, it hands the message to the visitor's email app.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error" | "handoff";

export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactInput>({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactErrors, boolean>>
  >({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  const form = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (k: keyof ContactInput, v: string) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k as keyof ContactErrors]) setErrors(validateContact(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    const first = (Object.keys(errs) as (keyof ContactErrors)[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (looksAutomated(values, startedAt.current)) {
      // Pretend success to bots; nothing is sent.
      setStatus("sent");
      return;
    }
    if (!ENDPOINT) {
      window.location.href = mailtoFallback(email, values);
      setStatus("handoff");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Portfolio inquiry from ${values.name.trim()}`,
          _gotcha: values.company,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setValues({ name: "", email: "", message: "", company: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-sm border border-brand/50 bg-ink-2 p-8"
      >
        <p className="label text-brand">Message sent</p>
        <p className="mt-3 text-headline font-medium">
          Thanks! I’ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-10 text-sm text-mist underline underline-offset-4 hover:text-chalk"
        >
          Send another
        </button>
      </div>
    );
  }

  const field = (k: keyof ContactErrors) => ({
    id: `${uid}-${k}`,
    name: k,
    value: values[k],
    "aria-invalid": !!(touched[k] && errors[k]) || undefined,
    "aria-describedby":
      touched[k] && errors[k] ? `${uid}-${k}-error` : undefined,
    onBlur: () => {
      setTouched((t) => ({ ...t, [k]: true }));
      setErrors(validateContact(values));
    },
  });
  const inputCls = (k: keyof ContactErrors) =>
    cx(
      "mt-2 w-full rounded-sm border bg-ink-2 px-4 text-[1rem] text-chalk placeholder:text-mist/60 transition-colors focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-brand",
      touched[k] && errors[k] ? "border-[#ff8a80]" : "border-ink-4",
    );
  const err = (k: keyof ContactErrors) =>
    touched[k] && errors[k] ? (
      <p id={`${uid}-${k}-error`} className="mt-1.5 text-sm text-[#ff9a90]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5"
      aria-describedby={`${uid}-note`}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="label text-mist">
            Name
          </label>
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            onChange={(e) => set("name", e.target.value)}
            className={cx(inputCls("name"), "min-h-12")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="label text-mist">
            Email
          </label>
          <input
            {...field("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            onChange={(e) => set("email", e.target.value)}
            className={cx(inputCls("email"), "min-h-12")}
          />
          {err("email")}
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${uid}-message`} className="label text-mist">
            What are you building?
          </label>
          <span
            className={cx(
              "text-xs",
              values.message.length > LIMITS.messageMax
                ? "text-[#ff9a90]"
                : "text-mist",
            )}
            aria-hidden="true"
          >
            {values.message.length}/{LIMITS.messageMax}
          </span>
        </div>
        <textarea
          {...field("message")}
          rows={6}
          onChange={(e) => set("message", e.target.value)}
          className={cx(inputCls("message"), "resize-y py-3 leading-relaxed")}
        />
        {err("message")}
      </div>
      {/* honeypot: hidden from people and assistive tech */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          id={`${uid}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-brand px-6 font-medium text-ink transition-[background-color,transform] hover:bg-brand-soft active:scale-[0.98] disabled:opacity-60"
        >
          {status === "sending" && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-ink border-t-transparent"
            />
          )}
          {status === "sending"
            ? "Sending…"
            : ENDPOINT
              ? "Send message"
              : "Write the email"}
        </button>
        <p id={`${uid}-note`} className="text-sm text-mist">
          {ENDPOINT
            ? "Goes straight to my inbox."
            : "Opens your email app with this message filled in."}
        </p>
      </div>
      <div aria-live="polite" className="min-h-[1.5rem] text-sm">
        {status === "error" && (
          <p className="text-[#ff9a90]">
            That didn’t go through. Please try again, or email me directly at{" "}
            <a
              href={`mailto:${email}`}
              className="underline underline-offset-4"
            >
              {email}
            </a>
            .
          </p>
        )}
        {status === "handoff" && (
          <p className="text-mist">
            Your email app should be open with the message ready. If not, write
            to {email}.
          </p>
        )}
      </div>
    </form>
  );
}
