"use client";
import { useStore } from "@/lib/store";
import type { CalendarView } from "@/types";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "agenda", label: "Agenda" },
  { value: "3day", label: "3-Day" },
  { value: "month", label: "Month" },
];

export default function ViewToggle() {
  const { currentView, setCurrentView } = useStore();

  return (
    <div
      className="flex px-4 py-2 gap-1 border-b shrink-0"
      style={{ backgroundColor: "#1B3A5C", borderColor: "#2A5F8A" }}
    >
      {VIEWS.map(({ value, label }) => {
        const isActive = currentView === value;
        return (
          <button
            key={value}
            onClick={() => setCurrentView(value)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: isActive ? "#6B1A1A" : "rgba(255,255,255,0.08)",
              color: isActive ? "white" : "rgba(184,217,232,0.7)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
