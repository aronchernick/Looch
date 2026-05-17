"use client";
import { X, Star } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AdBanner() {
  const { settings, adDismissed, setAdDismissed } = useStore();

  if (settings.premium || adDismissed) return null;

  return (
    <div
      className="fixed bottom-[58px] left-0 right-0 z-20 bg-blue-deep border-t-2 border-blue-mid"
      style={{ backgroundColor: "#1B3A5C" }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Ad slot placeholder */}
        <div className="flex-1 min-w-0">
          <div className="bg-blue-mid/30 rounded-lg px-3 py-1.5 text-center">
            <span className="text-xs text-blue-light font-medium">
              Advertisement
            </span>
          </div>
        </div>

        {/* Upgrade CTA */}
        <a
          href="/settings#premium"
          className="flex items-center gap-1.5 bg-burgundy rounded-lg px-3 py-1.5 whitespace-nowrap shrink-0"
          style={{ backgroundColor: "#6B1A1A" }}
        >
          <Star size={12} fill="white" stroke="none" />
          <span className="text-white text-xs font-bold">Go Premium</span>
        </a>

        {/* Dismiss */}
        <button
          onClick={() => setAdDismissed(true)}
          aria-label="Dismiss ad"
          className="text-blue-light/60 hover:text-white transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
