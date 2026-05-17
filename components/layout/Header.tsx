"use client";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useStore } from "@/lib/store";
import { getMonthHebrewLabel } from "@/lib/hebcal";

interface HeaderProps {
  onSearch?: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Header({ onSearch }: HeaderProps) {
  const { currentMonth, setCurrentMonth } = useStore();
  const { year, month } = currentMonth;

  function prevMonth() {
    if (month === 0) setCurrentMonth(year - 1, 11);
    else setCurrentMonth(year, month - 1);
  }

  function nextMonth() {
    if (month === 11) setCurrentMonth(year + 1, 0);
    else setCurrentMonth(year, month + 1);
  }

  const hebLabel = getMonthHebrewLabel(year, month);

  return (
    <header
      className="sticky top-0 z-30 pb-3 px-4 pt-3"
      style={{ backgroundColor: "#1B3A5C" }}
    >
      {/* Top row: logo centered + actions on right */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10" /> {/* spacer to balance right icons */}
        <Logo size={52} />
        <div className="flex items-center gap-4">
          <button
            onClick={onSearch}
            aria-label="Search"
            className="text-blue-light/70 hover:text-white transition-colors"
          >
            <Search size={20} strokeWidth={2} />
          </button>
          <button
            aria-label="Profile"
            className="text-blue-light/70 hover:text-white transition-colors"
          >
            <User size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-blue-light/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <div className="text-white font-bold text-lg leading-tight">
            {MONTHS[month]} {year}
          </div>
          <div
            className="text-xs font-semibold mt-0.5 hebrew"
            style={{ color: "#B8D9E8", direction: "rtl" }}
          >
            {hebLabel}
          </div>
        </div>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-blue-light/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
