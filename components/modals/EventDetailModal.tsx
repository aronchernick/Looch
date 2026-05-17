"use client";
import { X, Pencil, Trash2, MapPin, Clock, Users, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CalendarEvent } from "@/types";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
}

function fmt12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function EventDetailModal({ event, onClose, onEdit }: EventDetailModalProps) {
  const { members, deleteEvent } = useStore();

  if (!event) return null;

  const assigned = event.assignedTo.includes("all")
    ? [members.find((m) => m.id === "all")]
    : members.filter((m) => event.assignedTo.includes(m.id));

  const primaryColor = event.color ?? assigned[0]?.color ?? "#2A5F8A";

  const [y, mo, d] = event.date.split("-").map(Number);
  const dateLabel = `${MONTHS_LONG[mo - 1]} ${d}, ${y}`;

  function handleDelete() {
    if (!event) return;
    deleteEvent(event.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col">
        {/* Color accent bar */}
        <div className="h-1 rounded-t-2xl" style={{ backgroundColor: primaryColor }} />

        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-2 shrink-0">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-lg font-extrabold leading-tight" style={{ color: "#1C1C1E" }}>
              {event.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onEdit(event)}
              aria-label="Edit"
              className="text-gray-400 hover:text-blue-mid transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-3">
          {/* Date / time */}
          <div className="flex items-center gap-3">
            <Clock size={16} color="#8E8E93" />
            <div>
              <div className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                {dateLabel}
              </div>
              {!event.allDay && event.startTime && (
                <div className="text-xs" style={{ color: "#8E8E93" }}>
                  {fmt12(event.startTime)}
                  {event.endTime && ` – ${fmt12(event.endTime)}`}
                </div>
              )}
              {event.allDay && (
                <div className="text-xs" style={{ color: "#8E8E93" }}>All day</div>
              )}
            </div>
          </div>

          {/* Who */}
          <div className="flex items-center gap-3">
            <Users size={16} color="#8E8E93" />
            <div className="flex flex-wrap gap-1.5">
              {assigned.map((m) =>
                m ? (
                  <span
                    key={m.id}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${m.color}20`, color: m.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.name}
                  </span>
                ) : null
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin size={16} color="#8E8E93" />
              <span className="text-sm" style={{ color: "#1C1C1E" }}>{event.location}</span>
            </div>
          )}

          {/* Repeat */}
          {event.repeat !== "none" && (
            <div className="flex items-center gap-3">
              <RotateCcw size={16} color="#8E8E93" />
              <span className="text-sm capitalize" style={{ color: "#1C1C1E" }}>
                Repeats {event.repeat}
              </span>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div
              className="bg-gray-50 rounded-xl px-4 py-3 text-sm"
              style={{ color: "#48484A" }}
            >
              {event.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
