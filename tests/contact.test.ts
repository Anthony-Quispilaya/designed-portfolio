import { describe, expect, it } from "vitest";

import { looksAutomated, mailtoFallback, validateContact } from "@/lib/contact";

const ok = { name: "Ada", email: "ada@example.com", message: "Let's talk about a frontend role.", company: "" };

describe("contact form validation", () => {
  it("accepts a complete message", () => {
    expect(validateContact(ok)).toEqual({});
  });
  it("requires every field", () => {
    expect(Object.keys(validateContact({ name: " ", email: "", message: "", company: "" }))).toEqual(["name", "email", "message"]);
  });
  it("rejects malformed emails and too-short messages", () => {
    expect(validateContact({ ...ok, email: "ada@example" }).email).toBeTruthy();
    expect(validateContact({ ...ok, message: "hi" }).message).toBeTruthy();
  });
  it("flags honeypot fills and instant submissions as automated", () => {
    expect(looksAutomated({ ...ok, company: "spam inc" }, 0, 10_000)).toBe(true);
    expect(looksAutomated(ok, 9_000, 10_000)).toBe(true);
    expect(looksAutomated(ok, 0, 10_000)).toBe(false);
  });
  it("builds an encoded mailto fallback", () => {
    const url = mailtoFallback("me@example.com", ok);
    expect(url.startsWith("mailto:me@example.com?subject=")).toBe(true);
    expect(url).not.toContain(" ");
  });
});
