import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";

// PATCH /api/events/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, date, startTime, endTime, allDay, assignedTo, location, notes, repeat, repeatUntil, color } = body;

  await db
    .update(events)
    .set({
      ...(title !== undefined && { title }),
      ...(date !== undefined && { date }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(allDay !== undefined && { allDay }),
      ...(assignedTo !== undefined && { assignedTo: JSON.stringify(assignedTo) }),
      ...(location !== undefined && { location }),
      ...(notes !== undefined && { notes }),
      ...(repeat !== undefined && { repeat }),
      ...(repeatUntil !== undefined && { repeatUntil }),
      ...(color !== undefined && { color }),
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));

  return NextResponse.json({ ok: true });
}

// DELETE /api/events/[id] — soft delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db
    .update(events)
    .set({ deletedAt: new Date() })
    .where(eq(events.id, id));

  return NextResponse.json({ ok: true });
}
