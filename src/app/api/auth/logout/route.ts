import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

function safeInternalPath(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }
  return raw;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let next = url.searchParams.get("next");
  const ct = req.headers.get("content-type") ?? "";
  if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    try {
      const form = await req.formData();
      const fromForm = form.get("next");
      if (typeof fromForm === "string" && fromForm.length > 0) {
        next = fromForm;
      }
    } catch {
      /* ignore */
    }
  }

  const path = safeInternalPath(next, "/");
  const dest = new URL(path, url.origin);

  const res = NextResponse.redirect(dest);
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
