import { NextResponse } from "next/server";
import { adminSessionCookieSecure } from "@/lib/admin-cookie-secure";
import { ADMIN_COOKIE, makeAdminSessionToken } from "@/lib/admin-session";

export async function POST(req: Request) {
  try {
    const { password: raw } = (await req.json()) as { password?: string };
    const password = typeof raw === "string" ? raw.trim() : "";
    const expected = process.env.ADMIN_PASSWORD?.trim();
    if (!expected || password !== expected) {
      return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
    }

    const token = await makeAdminSessionToken(expected);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: adminSessionCookieSecure(req),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
