import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, families, familyMembers } from "@/lib/schema";
import { eq } from "drizzle-orm";

// POST /api/family/join — join a family by invite code
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inviteCode } = await req.json();
  if (!inviteCode) return NextResponse.json({ error: "No invite code" }, { status: 400 });

  const family = await db.query.families.findFirst({
    where: eq(families.inviteCode, inviteCode.toUpperCase()),
  });
  if (!family) return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });

  // Don't re-join if already a member
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (user?.familyId === family.id) {
    return NextResponse.json({ family, alreadyMember: true });
  }

  // Switch the user's family
  await db.update(users).set({ familyId: family.id }).where(eq(users.id, userId));

  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.familyId, family.id));

  return NextResponse.json({ family, members, joined: true });
}
