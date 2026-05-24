import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adMetrics } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { adId, event } = await req.json();
    if (!adId || !["impression", "click"].includes(event)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await db.insert(adMetrics).values({ adId, eventType: event });
    return NextResponse.json({ ok: true });
  } catch {
    // Gracefully fail if DB is not yet configured — never block the UI
    return NextResponse.json({ ok: true });
  }
}
