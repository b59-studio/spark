import { createHmac, timingSafeEqual } from "node:crypto";

type SessionPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function requireSecret(): string | null {
  const s = process.env.AUTH_SECRET;
  return s && s.length > 0 ? s : null;
}

export function signSessionCookie(payload: SessionPayload): string | null {
  const secret = requireSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload), "utf8");
  const bodyB64 = body.toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${bodyB64}.${sig}`;
}

export function verifySessionCookie(token: string): SessionPayload | null {
  const secret = requireSecret();
  if (!secret) return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const bodyB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let body: Buffer;
  try {
    body = Buffer.from(bodyB64, "base64url");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(body.toString("utf8"));
  } catch {
    return null;
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as SessionPayload).sub !== "string" ||
    typeof (parsed as SessionPayload).exp !== "number"
  ) {
    return null;
  }
  const p = parsed as SessionPayload;
  if (p.exp <= Date.now() / 1000) {
    return null;
  }
  return p;
}
