"use client";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CalendarEvent, RepeatFrequency } from "@/types";
import { toDateStr } from "@/lib/hebcal";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  editEvent?: CalendarEvent | null;
  defaultDate?: string;
}

const REPEAT_OPTIONS: { value: RepeatFrequency; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function AddEventModal({
  open,
  onClose,
  editEvent,
  defaultDate,
}: AddEventModalProps) {
  const { members, addEvent, updateEvent } = useStore();
  const today = toDateStr(new Date());

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate ?? today);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [assignedTo, setAssignedTo] = useState<string[]>(["all"]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [repeat, setRepeat] = useState<RepeatFrequency>("none");

  // Populate form when editing
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDate(editEvent.date);
      setAllDay(editEvent.allDay);
      setStartTime(editEvent.startTime ?? "09:00");
      setEndTime(editEvent.endTime ?? "10:00");
      setAssignedTo(editEvent.assignedTo);
      setLocation(editEvent.location ?? "");
      setNotes(editEvent.notes ?? "");
      setRepeat(editEvent.repeat);
    } else {
      setTitle("");
      setDate(defaultDate ?? today);
      setAllDay(true);
      setStartTime("09:00");
      setEndTime("10:00");
      setAssignedTo(["all"]);
      setLocation("");
      setNotes("");
      setRepeat("none");
    }
  }, [editEvent, open, defaultDate, today]);

  function toggleMember(id: string) {
    if (id === "all") {
      setAssignedTo(["all"]);
      return;
    }
    setAssignedTo((prev) => {
      const withoutAll = prev.filter((x) => x !== "all");
      if (withoutAll.includes(id)) {
        const next = withoutAll.filter((x) => x !== id);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, id];
    });
  }

  function handleSubmit() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      date,
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      assignedTo,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      repeat,
    };
    if (editEvent) {
      updateEvent(editEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "#E5E5EA" }}
        >
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
          <h2 className="font-bold text-base" style={{ color: "#1B3A5C" }}>
            {editEvent ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="font-bold text-sm disabled:opacity-40 transition-opacity"
            style={{ color: "#6B1A1A" }}
          >
            {editEvent ? "Save" : "Add"}
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <input
              autoFocus
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base font-semibold border-b-2 pb-2 outline-none placeholder-gray-300 focus:border-burgundy"
              style={{ borderColor: title ? "#6B1A1A" : "#E5E5EA" }}
            />
          </div>

          {/* Date + All-day */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-burgundy"
                style={{ borderColor: "#E5E5EA" }}
              />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <label className="text-xs font-bold text-gray-500">All day</label>
              <button
                onClick={() => setAllDay((v) => !v)}
                className="w-10 h-6 rounded-full transition-colors"
                style={{ backgroundColor: allDay ? "#6B1A1A" : "#E5E5EA" }}
              >
                <span
                  className="block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5"
                  style={{ transform: allDay ? "translateX(16px)" : "translateX(0)" }}
                />
              </button>
            </div>
          </div>

          {/* Time */}
          {!allDay && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 block mb-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-burgundy"
                  style={{ borderColor: "#E5E5EA" }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 block mb-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-burgundy"
                  style={{ borderColor: "#E5E5EA" }}
                />
              </div>
            </div>
          )}

          {/* Assign to */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">Who</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const isSelected = assignedTo.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
                    style={{
                      borderColor: isSelected ? m.color : "#E5E5EA",
                      color: isSelected ? m.color : "#8E8E93",
                      backgroundColor: isSelected ? `${m.color}15` : "white",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    {m.name}
                    {isSelected && <Check size={10} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Location</label>
            <input
              type="text"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-burgundy"
              style={{ borderColor: "#E5E5EA" }}
            />
          </div>

          {/* Repeat */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Repeat</label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-burgundy bg-white"
              style={{ borderColor: "#E5E5EA" }}
            >
              {REPEAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Notes</label>
            <textarea
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-burgundy"
              style={{ borderColor: "#E5E5EA" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
