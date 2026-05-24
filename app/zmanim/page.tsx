"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useGeolocation } from "@/lib/useGeolocation";
import { getZmanim } from "@/lib/zmanim";
import { getHebrewDayInfo, computeDiaspora, toDateStr } from "@/lib/hebcal";
import type { ZmanimTimes } from "@/types";
import { Sun, Sunrise, Sunset, Moon, Clock } from "lucide-react";

const TODAY = toDateStr(new Date());

interface ZmanimEntry {
  label: string;
  hebrewLabel: string;
  time?: string;
  category: "dawn" | "morning" | "afternoon" | "evening" | "night";
}

export default function ZmanimPage() {
  const location = useGeolocation();
  const { settings } = useStore();
  const [zmanim, setZmanim] = useState<ZmanimTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const todayInfo = getHebrewDayInfo(TODAY, computeDiaspora(settings.location));

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    getZmanim(location, TODAY).then((z) => {
      setZmanim(z);
      setLoading(false);
    });
  }, [location]);

  const entries: ZmanimEntry[] = zmanim
    ? [
        { label: "Alot HaShachar", hebrewLabel: "עלות השחר", time: zmanim.alotHaShachar, category: "dawn" },
        { label: "Misheyakir", hebrewLabel: "משיכיר", time: zmanim.misheyakir, category: "dawn" },
        { label: "Sunrise", hebrewLabel: "הנץ החמה", time: zmanim.sunrise, category: "morning" },
        { label: "Sof Zman Shma (MGA)", hebrewLabel: "סוף זמן ק״ש", time: zmanim.sofZmanShma, category: "morning" },
        { label: "Sof Zman Tfilla (MGA)", hebrewLabel: "סוף זמן תפילה", time: zmanim.sofZmanTfilla, category: "morning" },
        { label: "Chatzot", hebrewLabel: "חצות", time: zmanim.chatzot, category: "afternoon" },
        { label: "Mincha Gedola", hebrewLabel: "מנחה גדולה", time: zmanim.minchaGedola, category: "afternoon" },
        { label: "Mincha Ketana", hebrewLabel: "מנחה קטנה", time: zmanim.minchaKetana, category: "afternoon" },
        { label: "Plag HaMincha", hebrewLabel: "פלג המנחה", time: zmanim.plagHaMincha, category: "afternoon" },
        { label: "Sunset", hebrewLabel: "שקיעה", time: zmanim.sunset, category: "evening" },
        ...(zmanim.candleLighting && (todayInfo.isErevShabbat || todayInfo.isErevYomTov)
          ? [{ label: "Candle Lighting", hebrewLabel: "הדלקת נרות", time: zmanim.candleLighting, category: "evening" as const }]
          : []),
        { label: "Tzait HaKochavim", hebrewLabel: "צאת הכוכבים", time: zmanim.tzait, category: "night" },
        ...(zmanim.havdalah && (todayInfo.isShabbat)
          ? [{ label: "Havdalah", hebrewLabel: "הבדלה", time: zmanim.havdalah, category: "night" as const }]
          : []),
      ]
    : [];

  const CATEGORIES = [
    { key: "dawn", label: "Dawn", icon: Sun },
    { key: "morning", label: "Morning", icon: Sunrise },
    { key: "afternoon", label: "Afternoon", icon: Clock },
    { key: "evening", label: "Evening", icon: Sunset },
    { key: "night", label: "Night", icon: Moon },
  ] as const;

  return (
    <div className="flex flex-col pb-36">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: "#1B3A5C" }}>
        <h1 className="text-white font-extrabold text-xl">Zmanim</h1>
        <p className="text-blue-light/70 text-xs mt-0.5">
          {location?.city ?? "Detecting location..."}
        </p>
        <div className="mt-2">
          <span className="text-xs font-semibold" style={{ color: "#B8D9E8" }}>
            {todayInfo.hebrewDate}
          </span>
          {todayInfo.holidays.length > 0 && (
            <span
              className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#6B1A1A", color: "white" }}
            >
              {todayInfo.holidays[0].name}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-sm font-medium" style={{ color: "#8E8E93" }}>
            Calculating zmanim...
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
            const items = entries.filter((e) => e.category === key);
            if (items.length === 0) return null;
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} color="#8E8E93" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#8E8E93" }}>
                    {label}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#E5E5EA" }}>
                  {items.map((item, i) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        backgroundColor: i % 2 === 0 ? "white" : "#FAFAF7",
                        borderBottom: i < items.length - 1 ? "1px solid #F0F0F0" : "none",
                      }}
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                          {item.label}
                        </div>
                        <div className="text-[10px] hebrew mt-0.5" style={{ color: "#8A6800" }}>
                          {item.hebrewLabel}
                        </div>
                      </div>
                      <div
                        className="text-sm font-bold tabular-nums"
                        style={{ color: "#1B3A5C" }}
                      >
                        {item.time ?? "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
