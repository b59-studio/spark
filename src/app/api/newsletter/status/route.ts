import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NEWSLETTER_COOKIE } from "@/lib/newsletter-cookie";

export async function GET() {
  const jar = await cookies();
  const cookie = jar.get(NEWSLETTER_COOKIE);
  return NextResponse.json({ subscribed: Boolean(cookie?.value) });
}
