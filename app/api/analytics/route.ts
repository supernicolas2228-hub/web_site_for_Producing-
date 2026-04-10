import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-session";
import { buildAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  const ok = await verifyAdminCookie(cookie, process.env.ADMIN_PASSWORD?.trim());
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 120);

  const events = await prisma.event.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(buildAnalytics(events));
}
