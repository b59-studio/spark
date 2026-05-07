/**
 * Client-side rules for future password-based auth. Used by the login page signup stub.
 */

export type PasswordRuleId =
  | "length"
  | "upper"
  | "lower"
  | "digit"
  | "special";

export type PasswordRuleResult = {
  id: PasswordRuleId;
  label: string;
  satisfied: boolean;
};

const SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function evaluatePasswordRules(password: string): PasswordRuleResult[] {
  return [
    {
      id: "length",
      label: "At least 12 characters",
      satisfied: password.length >= 12,
    },
    {
      id: "upper",
      label: "One uppercase letter",
      satisfied: /[A-Z]/.test(password),
    },
    {
      id: "lower",
      label: "One lowercase letter",
      satisfied: /[a-z]/.test(password),
    },
    {
      id: "digit",
      label: "One number",
      satisfied: /\d/.test(password),
    },
    {
      id: "special",
      label: "One special character (!@#$…)",
      satisfied: SPECIAL_RE.test(password),
    },
  ];
}

export function passwordMeetsAllRules(password: string): boolean {
  return evaluatePasswordRules(password).every((r) => r.satisfied);
}
