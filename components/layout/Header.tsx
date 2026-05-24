"use client";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
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
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

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
      style={{ backgroundColor: "#B8D9E8" }}
    >
      {/* Top row: logo centered + actions on right */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10" /> {/* spacer to balance right icons */}
        <Logo size={52} />
        <div className="flex items-center gap-4">
          <button
            onClick={onSearch}
            aria-label="Search"
            className="text-blue-deep/70 hover:text-blue-deep transition-colors"
          >
            <Search size={20} strokeWidth={2} />
          </button>

          {/* Profile: UserButton when signed in, else icon → sign-in */}
          {isLoaded && isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7",
                },
              }}
            />
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              aria-label="Sign in"
              className="text-blue-deep/70 hover:text-blue-deep transition-colors"
            >
              <User size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-blue-deep/70 hover:text-blue-deep hover:bg-blue-deep/10 transition-all"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <div className="font-bold text-lg leading-tight" style={{ color: "#1B3A5C" }}>
            {MONTHS[month]} {year}
          </div>
          <div
            className="text-xs font-semibold mt-0.5 hebrew"
            style={{ color: "#1B3A5C", direction: "rtl" }}
          >
            {hebLabel}
          </div>
        </div>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-blue-deep/70 hover:text-blue-deep hover:bg-blue-deep/10 transition-all"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
