// Contact form validation, shared by the form and its tests.

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /** honeypot — real people never see or fill this */
  company: string;
};

export type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

export const LIMITS = { name: 80, email: 160, messageMin: 20, messageMax: 2000 } as const;

// Deliberately simple: one @, something on both sides, a dot in the domain.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (!email) errors.email = "I’ll need an email to reply to.";
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = "That email doesn’t look quite right.";

  if (!message) errors.message = "What would you like to build or talk about?";
  else if (message.length < LIMITS.messageMin)
    errors.message = `A little more detail, please — at least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.messageMax) errors.message = `Please keep it under ${LIMITS.messageMax} characters.`;

  return errors;
}

/** Bot heuristics: honeypot filled, or submitted faster than a human could type. */
export function looksAutomated(input: ContactInput, startedAt: number, now = Date.now()) {
  return input.company.trim().length > 0 || now - startedAt < 2500;
}

export function mailtoFallback(to: string, input: ContactInput) {
  const subject = encodeURIComponent(`Portfolio inquiry from ${input.name.trim()}`);
  const body = encodeURIComponent(`${input.message.trim()}\n\n— ${input.name.trim()} (${input.email.trim()})`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
