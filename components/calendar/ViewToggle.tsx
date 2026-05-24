"use client";
import { useStore } from "@/lib/store";
import type { CalendarView } from "@/types";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "agenda", label: "Agenda" },
  { value: "month", label: "Month" },
];

export default function ViewToggle() {
  const { currentView, setCurrentView } = useStore();

  return (
    <div
      className="flex px-4 py-2 gap-1 border-b shrink-0"
      style={{ backgroundColor: "#B8D9E8", borderColor: "#1B3A5C" }}
    >
      {VIEWS.map(({ value, label }) => {
        const isActive = currentView === value;
        return (
          <button
            key={value}
            onClick={() => setCurrentView(value)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: isActive ? "#6B1A1A" : "rgba(27,58,92,0.10)",
              color: isActive ? "white" : "rgba(27,58,92,0.65)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
