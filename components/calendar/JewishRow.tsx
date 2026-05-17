"use client";

import { Flame, Moon, BookOpen, Star } from "lucide-react";

interface JewishRowProps {
  type: "candle" | "havdalah" | "shabbat" | "yomtov" | "roshchodesh" | "chol_hamoed" | "fast" | "minor";
  label: string;
  time?: string;
  sub?: string;
}

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  candle:       { bg: "transparent", text: "#92400E" },
  havdalah:     { bg: "transparent", text: "#4338CA" },
  shabbat:      { bg: "transparent", text: "#4338CA" },
  yomtov:       { bg: "transparent", text: "#92400E" },
  roshchodesh:  { bg: "transparent", text: "#065F46" },
  chol_hamoed:  { bg: "transparent", text: "#92400E" },
  fast:         { bg: "transparent", text: "#6B7280" },
  minor:        { bg: "transparent", text: "#6B1A1A" },
};

function Icon({ type }: { type: JewishRowProps["type"] }) {
  const sz = 13;
  const sw = 1.8;
  switch (type) {
    case "candle":    return <Flame size={sz} strokeWidth={sw} />;
    case "havdalah":  return <Star size={sz} strokeWidth={sw} />;
    case "shabbat":   return <BookOpen size={sz} strokeWidth={sw} />;
    case "yomtov":    return <Star size={sz} strokeWidth={sw} />;
    case "roshchodesh": return <Moon size={sz} strokeWidth={sw} />;
    default:          return <Star size={sz} strokeWidth={sw} />;
  }
}

export default function JewishRow({ type, label, time, sub }: JewishRowProps) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.minor;
  const isCandle = type === "candle";

  return (
    <div
      className="flex items-center gap-2 py-1 px-1"
      style={{ color: style.text }}
    >
      <Icon type={type} />
      <span className={`font-semibold ${isCandle ? "text-xs" : "text-xs"} hebrew`}>
        {label}
      </span>
      {time && (
        <span className="ml-auto text-[11px] font-medium opacity-80">
          {time}
        </span>
      )}
      {sub && !time && (
        <span className="ml-auto text-[10px] opacity-70">{sub}</span>
      )}
    </div>
  );
}
