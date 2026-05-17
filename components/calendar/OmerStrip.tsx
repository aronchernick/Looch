"use client";

interface OmerStripProps {
  day: number;
  weekDays?: string;
}

export default function OmerStrip({ day, weekDays }: OmerStripProps) {
  if (!day || day < 1 || day > 49) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 border-b"
      style={{
        backgroundColor: "#F5F3FF",
        borderColor: "#DDD6FE",
      }}
    >
      <div>
        <div className="text-xs font-bold" style={{ color: "#6D28D9" }}>
          ספירת העומר
        </div>
        {weekDays && (
          <div className="text-[10px] mt-0.5" style={{ color: "#7C3AED" }}>
            {weekDays}
          </div>
        )}
      </div>
      <div className="text-center">
        <div
          className="font-extrabold text-2xl leading-none"
          style={{ color: "#6D28D9" }}
        >
          {day}
        </div>
        <div
          className="text-[9px] font-semibold mt-0.5 uppercase tracking-wider"
          style={{ color: "#9B78CC" }}
        >
          days
        </div>
      </div>
    </div>
  );
}
