import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, families, familyMembers } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET /api/family — get the current user's family + members
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.familyId) return NextResponse.json({ family: null, members: [] });

  const family = await db.query.families.findFirst({
    where: eq(families.id, user.familyId),
  });
  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.familyId, user.familyId));

  return NextResponse.json({ family, members });
}

// POST /api/family — ensure user record exists; create family if they don't have one
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = clerkUser?.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
    : email;

  // Upsert user record
  let user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    await db.insert(users).values({ id: userId, email, name });
    user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  }

  // If user already has a family, return it
  if (user?.familyId) {
    const family = await db.query.families.findFirst({
      where: eq(families.id, user.familyId),
    });
    const members = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.familyId, user.familyId));
    return NextResponse.json({ family, members, isNew: false });
  }

  // Parse optional family name from body
  const body = await req.json().catch(() => ({}));
  const familyName: string = body.familyName ?? `${name}'s Family`;

  // Create a new family
  const [family] = await db
    .insert(families)
    .values({ name: familyName, ownerId: userId })
    .returning();

  // Create default "Everyone" member
  await db.insert(familyMembers).values({
    familyId: family.id,
    name: "Everyone",
    color: "#2A5F8A",
    role: "parent",
  });

  // Link user to family
  await db.update(users).set({ familyId: family.id }).where(eq(users.id, userId));

  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.familyId, family.id));

  return NextResponse.json({ family, members, isNew: true });
}
