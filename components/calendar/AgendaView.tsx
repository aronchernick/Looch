"use client";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { getAgendaDates, getHebrewDayInfo, toDateStr } from "@/lib/hebcal";
import { getZmanimRange } from "@/lib/zmanim";
import DayGroup from "./DayGroup";
import OmerStrip from "./OmerStrip";
import type { CalendarEvent, ZmanimTimes } from "@/types";

interface AgendaViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent?: (dateStr: string) => void;
  location: { lat: number; lng: number; tzid: string; city: string } | null;
}

const TODAY = toDateStr(new Date());

export default function AgendaView({ onEventClick, onAddEvent, location }: AgendaViewProps) {
  const { events, members, settings, activeFilter, currentMonth } = useStore();
  const [zmanim, setZmanim] = useState<Record<string, ZmanimTimes>>({});

  // Start from today if viewing current month, otherwise from 1st of selected month
  const startDate = useMemo(() => {
    const { year, month } = currentMonth;
    const now = new Date();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return TODAY;
    return `${year}-${String(month + 1).padStart(2, "0")}-01`;
  }, [currentMonth]);

  // Generate 120 days from start date — continuous scrolling across months
  const dates = useMemo(() => getAgendaDates(startDate, 120), [startDate]);

  // Compute Hebrew info for all dates (memoized)
  const hebrewInfoMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof getHebrewDayInfo>> = {};
    for (const d of dates) map[d] = getHebrewDayInfo(d, settings.diaspora);
    return map;
  }, [dates, settings.diaspora]);

  // Find the current Omer day (from today's info)
  const todayInfo = hebrewInfoMap[TODAY];

  // Load zmanim asynchronously
  useEffect(() => {
    if (!location) return;
    // Only fetch for Shabbat/Yom Tov adjacent days to save calls
    const relevantDates = dates.filter((d) => {
      const info = hebrewInfoMap[d];
      return info.isErevShabbat || info.isErevYomTov || info.isShabbat || info.isYomTov;
    });
    getZmanimRange(location, relevantDates).then(setZmanim);
  }, [location, dates, hebrewInfoMap]);

  // Filter events by active family member
  function getEventsForDay(dateStr: string): CalendarEvent[] {
    return events.filter((ev) => {
      if (ev.date !== dateStr) return false;
      if (activeFilter === "all") return true;
      return ev.assignedTo.includes(activeFilter) || ev.assignedTo.includes("all");
    });
  }

  return (
    <div className="overflow-y-auto flex-1 pb-36">
      {/* Omer strip — show today's count if applicable */}
      {todayInfo?.omerDay && (
        <OmerStrip day={todayInfo.omerDay} weekDays={todayInfo.omerWeekDays} />
      )}

      {/* View past events link */}
      <button
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b"
        style={{ color: "#8A6800", borderColor: "#E5E5EA" }}
      >
        View past events
      </button>

      {/* Day groups */}
      {dates.map((dateStr) => {
        const dayEvents = getEventsForDay(dateStr);
        const info = hebrewInfoMap[dateStr];
        // Always show every day for continuous scrolling
        return (
          <DayGroup
            key={dateStr}
            dateStr={dateStr}
            isToday={dateStr === TODAY}
            events={dayEvents}
            members={members}
            hebrewInfo={info}
            zmanim={zmanim[dateStr]}
            onEventClick={onEventClick}
            onDayClick={onAddEvent}
          />
        );
      })}
    </div>
  );
}
