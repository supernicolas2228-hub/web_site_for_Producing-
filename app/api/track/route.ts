import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ALLOWED = new Set([
  "page_view",
  "click_starter_pack",
  "starter_pack_survey_submit",
  "click_product",
  "click_pricing",
  "scroll_depth",
]);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      event?: string;
      data?: unknown;
      timestamp?: number;
    };

    const event = typeof body.event === "string" ? body.event : "";
    if (!ALLOWED.has(event)) {
      return NextResponse.json({ ok: false, error: "unknown event" }, { status: 400 });
    }

    const dataStr =
      body.data !== undefined ? JSON.stringify(body.data) : JSON.stringify({ ts: body.timestamp });

    await prisma.event.create({
      data: {
        event,
        data: dataStr,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
