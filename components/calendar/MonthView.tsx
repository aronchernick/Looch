"use client";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { getHebrewDayInfo, computeDiaspora, toDateStr } from "@/lib/hebcal";
import type { CalendarEvent } from "@/types";

interface MonthViewProps {
  onDayClick: (dateStr: string) => void;
}

const TODAY = toDateStr(new Date());
const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthView({ onDayClick }: MonthViewProps) {
  const { events, currentMonth, settings, activeFilter } = useStore();
  const { year, month } = currentMonth;

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Array<{ dateStr: string | null }> = [];
    // Padding before
    for (let i = 0; i < firstDay; i++) result.push({ dateStr: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      result.push({ dateStr: ds });
    }
    return result;
  }, [year, month]);

  function getEventsForDay(dateStr: string): CalendarEvent[] {
    return events.filter((ev) => {
      if (ev.date !== dateStr) return false;
      if (activeFilter === "all") return true;
      return ev.assignedTo.includes(activeFilter) || ev.assignedTo.includes("all");
    });
  }

  return (
    <div className="flex-1 overflow-y-auto pb-36 px-2 pt-2">
      {/* DOW headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-wider py-1"
            style={{ color: i === 6 ? "#4338CA" : "#8E8E93" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: "#E5E5EA" }}>
        {cells.map((cell, idx) => {
          if (!cell.dateStr) {
            return <div key={idx} className="bg-gray-50 min-h-[60px]" />;
          }
          const isToday = cell.dateStr === TODAY;
          const info = getHebrewDayInfo(cell.dateStr, computeDiaspora(settings.location));
          const dayEvents = getEventsForDay(cell.dateStr);
          const isShabbat = new Date(cell.dateStr + "T12:00:00").getDay() === 6;

          return (
            <button
              key={cell.dateStr}
              onClick={() => onDayClick(cell.dateStr!)}
              className="flex flex-col p-1 min-h-[60px] text-left transition-colors hover:bg-blue-pale"
              style={{
                backgroundColor: info.isYomTov
                  ? "#FFFBEB"
                  : info.isShabbat
                  ? "#EEF0FF"
                  : "white",
              }}
            >
              {/* Date number */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full`}
                  style={{
                    backgroundColor: isToday ? "#6B1A1A" : "transparent",
                    color: isToday
                      ? "white"
                      : isShabbat
                      ? "#4338CA"
                      : info.isYomTov
                      ? "#92400E"
                      : "#1C1C1E",
                  }}
                >
                  {new Date(cell.dateStr + "T12:00:00").getDate()}
                </span>
                <span
                  className="text-[8px] hebrew leading-tight"
                  style={{ color: "#8A6800", direction: "rtl" }}
                >
                  {info.hebrewDateShort.split(" ")[0]}
                </span>
              </div>

              {/* Yom tov badges */}
              {info.holidays.slice(0, 1).map((h, i) => (
                <span
                  key={i}
                  className="text-[8px] font-bold px-1 py-0.5 rounded mt-0.5 leading-tight truncate w-full hebrew"
                  style={
                    h.type === "roshchodesh"
                      ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                      : { backgroundColor: "#6B1A1A", color: "white" }
                  }
                >
                  {h.name}
                </span>
              ))}

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-auto pt-1 flex-wrap">
                  {dayEvents.slice(0, 3).map((ev) => {
                    const m = ev.assignedTo.includes("all")
                      ? "#2A5F8A"
                      : (ev.color ?? "#2A5F8A");
                    return (
                      <span
                        key={ev.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: m }}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px]" style={{ color: "#8E8E93" }}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
