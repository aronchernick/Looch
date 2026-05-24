import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events, users, familyMembers } from "@/lib/schema";
import { eq } from "drizzle-orm";

// POST /api/sync
// Called once when a user first signs in.
// Body: { events: CalendarEvent[], members: FamilyMember[] }
// Pushes localStorage data into the user's cloud family.
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  const { events: localEvents, members: localMembers } = await req.json();

  // Sync family members (skip "all" / "Everyone" — already created by POST /api/family)
  if (Array.isArray(localMembers)) {
    for (const m of localMembers) {
      if (m.id === "all") continue;
      await db
        .insert(familyMembers)
        .values({
          id: m.id,
          familyId: user.familyId,
          name: m.name,
          color: m.color,
          role: m.role ?? "parent",
        })
        .onConflictDoNothing();
    }
  }

  // Sync events (insert only — don't overwrite server events with stale local ones)
  if (Array.isArray(localEvents)) {
    for (const e of localEvents) {
      if (!e.id || !e.title || !e.date) continue;
      await db
        .insert(events)
        .values({
          id: e.id,
          familyId: user.familyId,
          title: e.title,
          date: e.date,
          startTime: e.startTime ?? null,
          endTime: e.endTime ?? null,
          allDay: e.allDay ?? false,
          assignedTo: JSON.stringify(e.assignedTo ?? ["all"]),
          location: e.location ?? null,
          notes: e.notes ?? null,
          repeat: e.repeat ?? "none",
          repeatUntil: e.repeatUntil ?? null,
          color: e.color ?? null,
          createdBy: userId,
        })
        .onConflictDoNothing();
    }
  }

  return NextResponse.json({ ok: true });
}
