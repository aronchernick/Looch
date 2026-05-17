"use client";
import { useStore } from "@/lib/store";

export default function FamilyFilterBar() {
  const { members, activeFilter, setActiveFilter } = useStore();

  return (
    <div
      className="flex gap-2 px-4 py-2.5 overflow-x-auto border-b"
      style={{ backgroundColor: "#F3F1EB", borderColor: "#E5E5EA" }}
    >
      {members.map((m) => {
        const isActive = activeFilter === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setActiveFilter(m.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all shrink-0"
            style={{
              borderColor: isActive ? m.color : "#C7C7CC",
              color: isActive ? m.color : "#48484A",
              backgroundColor: isActive ? `${m.color}15` : "white",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: m.color }}
            />
            {m.name}
          </button>
        );
      })}
    </div>
  );
}
