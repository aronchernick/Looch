"use client";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@/lib/store";
import type { CalendarEvent, FamilyMember } from "@/types";

const POLL_MS = 15_000; // 15 second polling interval

/**
 * Handles all cloud sync for authenticated users:
 * 1. On first sign-in → setup family, optionally push local events
 * 2. Poll every 15 s → pull latest events + members from Turso
 *
 * Place this hook in a top-level client component (e.g. app/page.tsx).
 */
export function useCloudSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const {
    events: localEvents,
    members: localMembers,
    setUserId,
    setFamilyId,
    familyId,
    synced,
    setSynced,
    // Replace local state with cloud data after first sync
    addEvent,
    updateEvent,
    deleteEvent,
    addMember,
    updateMember,
    deleteMember,
    members,
    events,
    updateSettings,
  } = useStore();

  const bootstrapped = useRef(false);

  // ── Bootstrap: runs once when user signs in ──────────────────────────
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || bootstrapped.current) return;
    bootstrapped.current = true;

    async function bootstrap() {
      setUserId(user!.id);

      // Ensure user + family exist in DB
      const setupRes = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const { family, members: cloudMembers, isNew } = await setupRes.json();
      setFamilyId(family.id);

      // If brand-new family, push any local events/members up
      if (isNew && (localEvents.length > 0 || localMembers.length > 1)) {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: localEvents, members: localMembers }),
        });
      }

      // Pull latest data
      await pullFromCloud(family.id, cloudMembers);

      // Sync premium status
      const userRes = await fetch("/api/family").catch(() => null);
      if (userRes?.ok) {
        const data = await userRes.json();
        if (data.family) updateSettings({ premium: Boolean(data.family.premium) });
      }

      setSynced(true);
    }

    bootstrap().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user]);

  // ── Poll every 15 s once bootstrapped ────────────────────────────────
  useEffect(() => {
    if (!synced || !familyId) return;

    const interval = setInterval(() => {
      pullFromCloud(familyId, null).catch(console.error);
    }, POLL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synced, familyId]);

  // ── Handle sign-out ───────────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setUserId(null);
      setFamilyId(null);
      setSynced(false);
      bootstrapped.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  // ── Helper: merge cloud data into local Zustand store ────────────────
  async function pullFromCloud(
    _familyId: string,
    preloadedMembers: FamilyMember[] | null
  ) {
    const [eventsRes, membersData] = await Promise.all([
      fetch("/api/events").then((r) => r.json()),
      preloadedMembers
        ? Promise.resolve({ members: preloadedMembers })
        : fetch("/api/family").then((r) => r.json()),
    ]);

    const cloudEvents: CalendarEvent[] = eventsRes.events ?? [];
    const cloudMembers: FamilyMember[] = membersData.members ?? [];

    // Merge members
    for (const cm of cloudMembers) {
      const local = members.find((m) => m.id === cm.id);
      if (!local) addMember({ name: cm.name, color: cm.color, role: cm.role });
      else if (local.name !== cm.name || local.color !== cm.color)
        updateMember(cm.id, { name: cm.name, color: cm.color });
    }
    // Remove members deleted on server (except "all")
    for (const lm of members) {
      if (lm.id === "all") continue;
      if (!cloudMembers.find((cm) => cm.id === lm.id)) deleteMember(lm.id);
    }

    // Merge events (server is source of truth)
    const cloudIds = new Set(cloudEvents.map((e) => e.id));
    for (const ce of cloudEvents) {
      const local = events.find((e) => e.id === ce.id);
      if (!local) addEvent({ ...ce } as Omit<CalendarEvent, "id">);
      else {
        // Overwrite with server version (server wins)
        updateEvent(ce.id, ce);
      }
    }
    // Soft-delete events that disappeared from server
    for (const le of events) {
      if (!cloudIds.has(le.id)) deleteEvent(le.id);
    }
  }
}
