"use client";
import type { CalendarEvent, FamilyMember, ZmanimTimes, HebrewDayInfo } from "@/types";
import EventRow from "./EventRow";
import JewishRow from "./JewishRow";

interface DayGroupProps {
  dateStr: string;
  isToday: boolean;
  events: CalendarEvent[];
  members: FamilyMember[];
  hebrewInfo: HebrewDayInfo;
  zmanim?: ZmanimTimes;
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (dateStr: string) => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DayGroup({
  dateStr,
  isToday,
  events,
  members,
  hebrewInfo,
  zmanim,
  onEventClick,
  onDayClick,
}: DayGroupProps) {
  const date = new Date(dateStr + "T12:00:00");
  const dow = date.getDay();
  const dayName = DAY_NAMES[dow];
  const dayNum = date.getDate();
  const monthShort = MONTH_SHORT[date.getMonth()];

  const isShabbatDay = hebrewInfo.isShabbat;
  const isErevShab = hebrewInfo.isErevShabbat;

  const headerBg = isToday
    ? "#FFF9E6"
    : isShabbatDay
    ? "#FDF5F5"
    : "var(--cream, #FAFAF7)";

  const dowColor = isToday ? "#92400E" : "#8E8E93";
  const numColor = isToday ? "#92400E" : isShabbatDay ? "#6B1A1A" : "#1C1C1E";
  const dateColor = isToday ? "#92400E" : "#1C1C1E";

  const sorted = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    return 0;
  });

  return (
    <div className="border-b-2" style={{ borderColor: "#D1D5DB" }}>
      {/* Day header — no sticky (removes scroll wiggle) */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer active:opacity-70"
        style={{ backgroundColor: headerBg }}
        onClick={() => onDayClick?.(dateStr)}
      >
        {/* Month + number column */}
        <div className="flex flex-col items-center w-10 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: dowColor }}>
            {monthShort}
          </span>
          <span className="text-2xl font-extrabold leading-none" style={{ color: numColor }}>
            {dayNum}
          </span>
          {isToday && (
            <span className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: "#6B1A1A" }} />
          )}
        </div>

        {/* Meta — date + Hebrew date on same line + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Day name — bold */}
            <span className="font-bold text-sm" style={{ color: dateColor }}>
              {dayName}
            </span>
            {isToday && (
              <span className="text-[10px] font-medium opacity-60" style={{ color: dateColor }}>Today</span>
            )}
            {/* Hebrew date */}
            <span className="text-[11px] font-semibold hebrew" style={{ color: "#8A6800" }}>
              {hebrewInfo.hebrewDateShort}
            </span>
            {/* Friday: candle lighting inline (no Shabbos label) */}
            {isErevShab && zmanim?.candleLighting && (
              <span className="text-[10px] font-semibold" style={{ color: "#6B1A1A" }}>
                · Candle lighting: {zmanim.candleLighting}
              </span>
            )}
            {/* Saturday: Shabbos label inline */}
            {isShabbatDay && (
              <span className="text-[10px] font-bold" style={{ color: "#6B1A1A" }}>
                · Shabbos
              </span>
            )}
            {/* Saturday / end of Yom Tov: Havdalah inline */}
            {zmanim?.havdalah && (isShabbatDay || (hebrewInfo.isYomTov && !isErevShab)) && (
              <span className="text-[10px] font-semibold" style={{ color: "#6B1A1A" }}>
                · הבדלה: {zmanim.havdalah}
              </span>
            )}
            {/* Erev Yom Tov (not Friday): candle lighting inline */}
            {hebrewInfo.isErevYomTov && !isErevShab && zmanim?.candleLighting && (
              <span className="text-[10px] font-semibold" style={{ color: "#6B1A1A" }}>
                · Candle lighting: {zmanim.candleLighting}
              </span>
            )}
            {/* Holiday badges — RC in light blue, yomtov in burgundy */}
            {hebrewInfo.holidays.map((h, i) => (
              <span
                key={i}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  h.type === "roshchodesh"
                    ? { backgroundColor: "#DBEAFE", color: "#1E40AF" }
                    : h.type === "yomtov" || h.type === "chol_hamoed"
                    ? { backgroundColor: "#6B1A1A", color: "white" }
                    : h.type === "fast"
                    ? { backgroundColor: "#F3F4F6", color: "#6B7280" }
                    : { backgroundColor: "#F5E8E8", color: "#6B1A1A" }
                }
              >
                {h.name}
              </span>
            ))}
            {/* Parsha in burgundy */}
            {isShabbatDay && hebrewInfo.parsha && (
              <span className="text-[10px] font-medium hebrew" style={{ color: "#6B1A1A" }}>
                {hebrewInfo.parsha}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Events + Jewish rows */}
      <div className="px-4 pb-2.5 space-y-0.5">
        {/* Rosh Chodesh row removed — header badge is sufficient */}
        {/* Yom Tov row removed — header badge is sufficient */}
        {hebrewInfo.holidays.filter(h => h.type === "chol_hamoed").map((h, i) => (
          <JewishRow key={i} type="chol_hamoed" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "fast").map((h, i) => (
          <JewishRow key={i} type="fast" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "minor").map((h, i) => (
          <JewishRow key={i} type="minor" label={h.name} />
        ))}

        {sorted.map((ev) => (
          <EventRow key={ev.id} event={ev} members={members} onClick={onEventClick} />
        ))}


        {sorted.length === 0 &&
          !isShabbatDay &&
          hebrewInfo.holidays.length === 0 && (
          <p className="text-[11px] italic py-1" style={{ color: "#C7C7CC" }}>
            No events
          </p>
        )}
      </div>
    </div>
  );
}
