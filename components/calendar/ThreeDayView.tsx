"use client";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { getHebrewDayInfo, computeDiaspora, toDateStr } from "@/lib/hebcal";
import EventRow from "./EventRow";
import JewishRow from "./JewishRow";
import type { CalendarEvent } from "@/types";

interface ThreeDayViewProps {
  onEventClick: (event: CalendarEvent) => void;
}

const TODAY = toDateStr(new Date());
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export default function ThreeDayView({ onEventClick }: ThreeDayViewProps) {
  const { events, members, settings, activeFilter } = useStore();

  // Show today + next 2 days
  const dates = useMemo(() => {
    const result: string[] = [];
    const start = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      result.push(toDateStr(d));
    }
    return result;
  }, []);

  const hebrewInfoMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof getHebrewDayInfo>> = {};
    for (const d of dates) map[d] = getHebrewDayInfo(d, computeDiaspora(settings.location));
    return map;
  }, [dates, settings.location]);

  function getEventsForDay(dateStr: string): CalendarEvent[] {
    return events.filter((ev) => {
      if (ev.date !== dateStr) return false;
      if (activeFilter === "all") return true;
      return ev.assignedTo.includes(activeFilter) || ev.assignedTo.includes("all");
    });
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {dates.map((dateStr) => {
        const date = new Date(dateStr + "T12:00:00");
        const dow = date.getDay();
        const info = hebrewInfoMap[dateStr];
        const isToday = dateStr === TODAY;
        const dayEvents = getEventsForDay(dateStr).sort((a, b) => {
          if (a.allDay && !b.allDay) return -1;
          if (!a.allDay && b.allDay) return 1;
          if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
          return 0;
        });

        return (
          <div
            key={dateStr}
            className="flex-1 border-r last:border-r-0 flex flex-col overflow-y-auto"
            style={{ borderColor: "#E5E5EA" }}
          >
            {/* Column header */}
            <div
              className="sticky top-0 z-10 px-2 py-2 border-b-2 text-center"
              style={{
                backgroundColor: isToday ? "#FFF9E6" : info.isShabbat ? "#EEF0FF" : "white",
                borderColor: "#D1D5DB",
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: isToday ? "#92400E" : "#8E8E93" }}
              >
                {DAY_NAMES[dow]}
              </div>
              <div
                className="text-xl font-extrabold"
                style={{ color: isToday ? "#6B1A1A" : "#1C1C1E" }}
              >
                {date.getDate()}
              </div>
              <div
                className="text-[9px] hebrew"
                style={{ color: "#8A6800", direction: "rtl" }}
              >
                {info.hebrewDateShort}
              </div>
              {info.holidays.slice(0, 1).map((h, i) => (
                <span
                  key={i}
                  className="text-[8px] font-bold px-1 py-0.5 rounded mt-0.5 inline-block hebrew"
                  style={{ backgroundColor: "#6B1A1A", color: "white" }}
                >
                  {h.name}
                </span>
              ))}
            </div>

            {/* Day content */}
            <div className="flex-1 p-2 space-y-1 pb-36">
              {info.isShabbat && <JewishRow type="shabbat" label="שבת קודש" />}
              {info.holidays.filter(h => h.type === "yomtov").map((h, i) => (
                <JewishRow key={i} type="yomtov" label={h.name} />
              ))}
              {info.holidays.filter(h => h.type === "roshchodesh").map((h, i) => (
                <JewishRow key={i} type="roshchodesh" label={h.name} />
              ))}
              {dayEvents.map((ev) => (
                <EventRow key={ev.id} event={ev} members={members} onClick={onEventClick} />
              ))}
              {dayEvents.length === 0 && !info.isShabbat && info.holidays.length === 0 && (
                <p className="text-[10px] italic text-center mt-4" style={{ color: "#C7C7CC" }}>
                  No events
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
