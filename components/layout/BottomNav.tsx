"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Clock, Users, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/zmanim", label: "Zmanim", icon: Clock },
  { href: "/family", label: "Family", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname === "/calendar"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors"
              style={{ color: isActive ? "#6B1A1A" : "#8E8E93" }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                color={isActive ? "#6B1A1A" : "#8E8E93"}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
