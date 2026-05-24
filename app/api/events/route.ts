import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events, users } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

// GET /api/events — fetch all non-deleted events for the user's family
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.familyId) return NextResponse.json({ events: [] });

  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.familyId, user.familyId), isNull(events.deletedAt)));

  return NextResponse.json({
    events: rows.map((e) => ({
      ...e,
      assignedTo: JSON.parse(e.assignedTo ?? "[]"),
      allDay: Boolean(e.allDay),
    })),
  });
}

// POST /api/events — create a new event
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  const body = await req.json();
  const { id, title, date, startTime, endTime, allDay, assignedTo, location, notes, repeat, repeatUntil, color } = body;

  if (!id || !title || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await db.insert(events).values({
    id,
    familyId: user.familyId,
    title,
    date,
    startTime: startTime ?? null,
    endTime: endTime ?? null,
    allDay: allDay ?? false,
    assignedTo: JSON.stringify(assignedTo ?? ["all"]),
    location: location ?? null,
    notes: notes ?? null,
    repeat: repeat ?? "none",
    repeatUntil: repeatUntil ?? null,
    color: color ?? null,
    createdBy: userId,
  });

  return NextResponse.json({ ok: true });
}

// PATCH /api/events/[id] is in its own route file
