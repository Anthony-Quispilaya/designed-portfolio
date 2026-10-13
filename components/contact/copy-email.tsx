"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-1 flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="text-[1.125rem] font-medium break-all underline decoration-chalk/30 underline-offset-4 hover:decoration-brand"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard unavailable: the mailto link still works */
          }
        }}
        className="label min-h-9 rounded-sm border border-ink-4 px-2.5 text-mist transition-colors hover:border-brand hover:text-chalk"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
