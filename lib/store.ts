"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CalendarEvent,
  FamilyMember,
  AppSettings,
  CalendarView,
} from "@/types";
import { DEFAULT_LOCATION } from "@/lib/zmanim"; // eslint-disable-line @typescript-eslint/no-unused-vars

// Default family colors — blue (#2A5F8A) is reserved for "Everyone"
export const DEFAULT_COLORS = [
  "#6B1A1A", // burgundy
  "#10B981", // emerald
  "#F97316", // orange
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#EF4444", // red
  "#14B8A6", // teal
  "#F59E0B", // amber
  "#84CC16", // lime
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#F43F5E", // rose
  "#22C55E", // green
  "#3B82F6", // sky-blue (distinct from Everyone's #2A5F8A)
  "#D97706", // dark amber
  "#7C3AED", // deep violet
  "#0EA5E9", // light blue
  "#BE185D", // dark pink
  "#059669", // dark emerald
  "#DC2626", // dark red
];

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "all", name: "Everyone", color: "#2A5F8A", role: "parent" },
];

const DEFAULT_SETTINGS: AppSettings = {
  familyName: "My Family",
  location: null,
  premium: false,
  locationDenied: false,
};

interface StoreState {
  // Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Family members
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, "id">) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // UI state (not persisted)
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  activeFilter: string; // member id or "all"
  setActiveFilter: (id: string) => void;
  currentMonth: { year: number; month: number };
  setCurrentMonth: (year: number, month: number) => void;
  // Ad dismiss
  adDismissed: boolean;
  setAdDismissed: (v: boolean) => void;

  // Cloud sync state (not persisted)
  userId: string | null;
  setUserId: (id: string | null) => void;
  familyId: string | null;
  setFamilyId: (id: string | null) => void;
  /** True once the initial cloud sync has happened this session */
  synced: boolean;
  setSynced: (v: boolean) => void;
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const today = new Date();

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Events
      events: [],
      addEvent: (event) =>
        set((s) => ({
          events: [...s.events, { ...event, id: uid() }],
        })),
      updateEvent: (id, updates) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      // Family members
      members: DEFAULT_MEMBERS,
      addMember: (member) =>
        set((s) => ({
          members: [...s.members, { ...member, id: uid() }],
        })),
      updateMember: (id, updates) =>
        set((s) => ({
          members: s.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      deleteMember: (id) =>
        set((s) => ({
          members: s.members.filter((m) => m.id !== id && m.id !== "all"),
        })),

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),

      // UI (these are reset on reload but need to exist)
      currentView: "agenda",
      setCurrentView: (view) => set({ currentView: view }),
      activeFilter: "all",
      setActiveFilter: (id) => set({ activeFilter: id }),
      currentMonth: {
        year: today.getFullYear(),
        month: today.getMonth(),
      },
      setCurrentMonth: (year, month) => set({ currentMonth: { year, month } }),
      adDismissed: false,
      setAdDismissed: (v) => set({ adDismissed: v }),

      // Cloud sync
      userId: null,
      setUserId: (id) => set({ userId: id }),
      familyId: null,
      setFamilyId: (id) => set({ familyId: id }),
      synced: false,
      setSynced: (v) => set({ synced: v }),
    }),
    {
      name: "looch-storage",
      // Only persist events, members, settings — premium is not persisted (no real payment flow yet)
      partialize: (s) => ({
        events: s.events,
        members: s.members,
        settings: { ...s.settings, premium: false },
      }),
    }
  )
);
