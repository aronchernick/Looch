"use client";
import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Add event"
      className="
        fixed right-4 bottom-24 z-30
        w-14 h-14 rounded-full
        bg-burgundy text-white
        flex items-center justify-center
        shadow-lg shadow-burgundy/40
        transition-transform active:scale-95 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2
      "
      style={{ backgroundColor: "#6B1A1A" }}
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}
