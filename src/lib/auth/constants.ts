/** HttpOnly cookie storing the signed session blob (see `session-cookie.ts`). */
export const SESSION_COOKIE_NAME = "spark_session";

/** Magic link validity window (request → verify). */
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

/** Default browser session length after magic-link verify (when not “stay signed in”). */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 2;

/** Longer session when the user checks “Stay signed in” on the login form / magic link. */
export const SESSION_EXTENDED_MAX_AGE_SEC = 60 * 60 * 24 * 30;
