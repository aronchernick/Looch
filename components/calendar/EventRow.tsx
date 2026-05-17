"use client";
import type { CalendarEvent, FamilyMember } from "@/types";
import { MapPin } from "lucide-react";

interface EventRowProps {
  event: CalendarEvent;
  members: FamilyMember[];
  onClick: (event: CalendarEvent) => void;
}

function fmt12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "p" : "a";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}

export default function EventRow({ event, members, onClick }: EventRowProps) {
  const assigned = event.assignedTo.includes("all")
    ? [members.find((m) => m.id === "all") ?? members[0]]
    : members.filter((m) => event.assignedTo.includes(m.id));

  const primaryColor =
    event.color ??
    assigned[0]?.color ??
    "#2A5F8A";

  return (
    <button
      onClick={() => onClick(event)}
      className="w-full flex items-start gap-2.5 py-1.5 px-1 text-left hover:opacity-75 active:opacity-60 transition-opacity"
    >
      {/* Left color bar */}
      <div
        className="w-0.5 self-stretch rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: primaryColor, minHeight: "20px" }}
      />

      {/* Time */}
      {!event.allDay && event.startTime && (
        <span
          className="text-[11px] font-medium shrink-0 mt-0.5 tabular-nums"
          style={{ color: "#8E8E93", minWidth: "36px" }}
        >
          {fmt12(event.startTime)}
        </span>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] font-semibold truncate"
          style={{ color: "#1C1C1E" }}
        >
          {event.title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {assigned.map((m) => (
            <span key={m.id} className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span className="text-[10px] font-medium" style={{ color: "#8E8E93" }}>
                {m.name}
              </span>
            </span>
          ))}
          {event.location && (
            <>
              <span style={{ color: "#C7C7CC" }} className="text-[10px]">·</span>
              <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "#8E8E93" }}>
                <MapPin size={9} />
                {event.location}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
