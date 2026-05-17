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

// Default family colors (blue/burgundy palette + extras)
const DEFAULT_COLORS = [
  "#2A5F8A", // blue-mid
  "#6B1A1A", // burgundy
  "#10B981", // emerald
  "#F97316", // orange
  "#8B5CF6", // violet
  "#EC4899", // pink
];

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "all", name: "Everyone", color: "#2A5F8A", role: "parent" },
];

const DEFAULT_SETTINGS: AppSettings = {
  familyName: "My Family",
  location: null,
  diaspora: true,
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
  adDismissed: boolean;
  setAdDismissed: (v: boolean) => void;
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
    }),
    {
      name: "looch-storage",
      // Only persist events, members, settings — not UI state
      partialize: (s) => ({
        events: s.events,
        members: s.members,
        settings: s.settings,
      }),
    }
  )
);

export { DEFAULT_COLORS };
