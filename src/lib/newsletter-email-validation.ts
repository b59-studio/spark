const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidNewsletterEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length <= 320 && EMAIL_RE.test(trimmed);
}
