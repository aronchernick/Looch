"use client";
import type { CalendarEvent, FamilyMember, ZmanimTimes, HebrewDayInfo } from "@/types";
import EventRow from "./EventRow";
import JewishRow from "./JewishRow";

interface DayGroupProps {
  dateStr: string; // YYYY-MM-DD
  isToday: boolean;
  events: CalendarEvent[];
  members: FamilyMember[];
  hebrewInfo: HebrewDayInfo;
  zmanim?: ZmanimTimes;
  onEventClick: (event: CalendarEvent) => void;
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
}: DayGroupProps) {
  const date = new Date(dateStr + "T12:00:00");
  const dow = date.getDay();
  const dayName = DAY_NAMES[dow];
  const dayNum = date.getDate();
  const monthShort = MONTH_SHORT[date.getMonth()];

  const headerBg = isToday ? "#FFF9E6" : hebrewInfo.isShabbat ? "#EEF0FF" : "var(--cream, #FAFAF7)";

  // Sort events: all-day first, then by startTime
  const sorted = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    return 0;
  });

  return (
    <div className="border-b-2" style={{ borderColor: "#D1D5DB" }}>
      {/* Day header */}
      <div
        className="flex items-center gap-3 px-4 py-2 sticky top-[104px] z-10"
        style={{ backgroundColor: headerBg }}
      >
        {/* Date block */}
        <div className="flex flex-col items-center min-w-[36px]">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: isToday ? "#92400E" : "#8E8E93" }}
          >
            {dayName}
          </span>
          <span
            className="text-xl font-extrabold leading-none mt-0.5"
            style={{ color: isToday ? "#92400E" : hebrewInfo.isShabbat ? "#4338CA" : "#1C1C1E" }}
          >
            {dayNum}
          </span>
          {isToday && (
            <span
              className="w-1 h-1 rounded-full mt-0.5"
              style={{ backgroundColor: "#6B1A1A" }}
            />
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-semibold"
            style={{ color: isToday ? "#92400E" : "#1C1C1E" }}
          >
            {monthShort} {dayNum}
            {isToday && (
              <span className="ml-2 text-[10px] font-normal opacity-70">Today</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span
              className="text-[11px] font-semibold hebrew"
              style={{ color: "#8A6800", direction: "rtl" }}
            >
              {hebrewInfo.hebrewDateShort}
            </span>
            {hebrewInfo.holidays.map((h, i) => (
              <span
                key={i}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  h.type === "roshchodesh"
                    ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                    : h.type === "yomtov" || h.type === "chol_hamoed"
                    ? { backgroundColor: "#6B1A1A", color: "white" }
                    : h.type === "fast"
                    ? { backgroundColor: "#F3F4F6", color: "#6B7280" }
                    : { backgroundColor: "#EEF0FF", color: "#4338CA" }
                }
              >
                {h.name}
              </span>
            ))}
            {hebrewInfo.isShabbat && hebrewInfo.parsha && (
              <span className="text-[10px] font-medium hebrew" style={{ color: "#4338CA" }}>
                {hebrewInfo.parsha}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Events + Jewish rows */}
      <div className="px-4 pb-2.5 space-y-0.5">
        {/* Yom Tov / Shabbat */}
        {hebrewInfo.isShabbat && (
          <JewishRow type="shabbat" label="שבת קודש" sub={hebrewInfo.parsha} />
        )}
        {hebrewInfo.holidays.filter(h => h.type === "yomtov").map((h, i) => (
          <JewishRow key={i} type="yomtov" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "roshchodesh").map((h, i) => (
          <JewishRow key={i} type="roshchodesh" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "chol_hamoed").map((h, i) => (
          <JewishRow key={i} type="chol_hamoed" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "fast").map((h, i) => (
          <JewishRow key={i} type="fast" label={h.name} />
        ))}
        {hebrewInfo.holidays.filter(h => h.type === "minor").map((h, i) => (
          <JewishRow key={i} type="minor" label={h.name} />
        ))}

        {/* Personal events */}
        {sorted.map((ev) => (
          <EventRow key={ev.id} event={ev} members={members} onClick={onEventClick} />
        ))}

        {/* Candle lighting */}
        {zmanim?.candleLighting && (hebrewInfo.isErevShabbat || hebrewInfo.isErevYomTov) && (
          <JewishRow
            type="candle"
            label={hebrewInfo.isYomTov && !hebrewInfo.isErevShabbat ? "הדלקת נרות (מאש קיים)" : "הדלקת נרות"}
            time={zmanim.candleLighting}
          />
        )}

        {/* Havdalah */}
        {zmanim?.havdalah && (hebrewInfo.isShabbat || (hebrewInfo.isYomTov && !hebrewInfo.isErevShabbat)) && (
          <JewishRow type="havdalah" label="הבדלה" time={zmanim.havdalah} />
        )}

        {/* No events */}
        {sorted.length === 0 &&
          !hebrewInfo.isShabbat &&
          hebrewInfo.holidays.length === 0 && (
          <p className="text-[11px] italic py-1" style={{ color: "#C7C7CC" }}>
            No events
          </p>
        )}
      </div>
    </div>
  );
}
