import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Users (synced with Clerk) ─────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  premium: integer("premium", { mode: "boolean" }).default(false),
  familyId: text("family_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// ─── Families ──────────────────────────────────────────────────────────────
export const families = sqliteTable("families", {
  id: text("id").primaryKey().$defaultFn(uid),
  name: text("name").notNull(),
  ownerId: text("owner_id").notNull(),
  inviteCode: text("invite_code").notNull().unique().$defaultFn(
    () => Math.random().toString(36).slice(2, 8).toUpperCase()
  ),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// ─── Family members (the colored names in the calendar) ───────────────────
export const familyMembers = sqliteTable("family_members", {
  id: text("id").primaryKey().$defaultFn(uid),
  familyId: text("family_id").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  role: text("role", { enum: ["parent", "child"] }).default("parent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});

// ─── Events ────────────────────────────────────────────────────────────────
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  startTime: text("start_time"),
  endTime: text("end_time"),
  allDay: integer("all_day", { mode: "boolean" }).default(false),
  assignedTo: text("assigned_to").notNull().default("[]"), // JSON array of member IDs
  location: text("location"),
  notes: text("notes"),
  repeat: text("repeat").default("none"),
  repeatUntil: text("repeat_until"),
  color: text("color"),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }), // soft delete
});

// ─── Ad metrics ────────────────────────────────────────────────────────────
export const adMetrics = sqliteTable("ad_metrics", {
  id: text("id").primaryKey().$defaultFn(uid),
  adId: text("ad_id").notNull(),
  eventType: text("event_type", { enum: ["impression", "click"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});
