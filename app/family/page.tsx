"use client";
import { useState } from "react";
import { useStore, DEFAULT_COLORS } from "@/lib/store";
import type { FamilyMember } from "@/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function FamilyPage() {
  const { members, addMember, updateMember, deleteMember, settings, updateSettings } = useStore();

  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  // Colors available for individual members (blue reserved for Everyone)
  const MEMBER_COLORS = DEFAULT_COLORS;

  function startAdd() {
    setName("");
    const nonAll = members.filter((m) => m.id !== "all");
    setColor(DEFAULT_COLORS[nonAll.length % DEFAULT_COLORS.length]);
    setAdding(true);
    setEditing(null);
  }

  function startEdit(m: FamilyMember) {
    setName(m.name);
    setColor(m.color);
    setEditing(m);
    setAdding(false);
  }

  function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      updateMember(editing.id, { name: name.trim(), color });
    } else {
      addMember({ name: name.trim(), color, role: "parent" });
    }
    setEditing(null);
    setAdding(false);
  }

  function handleDelete(id: string) {
    if (id === "all") return;
    deleteMember(id);
  }

  const isFormOpen = adding || !!editing;

  return (
    <div className="flex flex-col pb-36">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: "#1B3A5C" }}>
        <h1 className="text-white font-extrabold text-xl">Family</h1>
        <p className="text-xs mt-0.5" style={{ color: "#B8D9E8" }}>
          {settings.familyName}
        </p>
      </div>

      {/* Diaspora toggle */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "#E5E5EA", backgroundColor: "#F3F1EB" }}
      >
        <div>
          <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>Outside Israel (Chutz L&apos;Aretz)</div>
          <div className="text-xs mt-0.5" style={{ color: "#8E8E93" }}>2 days Yom Tov</div>
        </div>
        <button
          onClick={() => updateSettings({ diaspora: !settings.diaspora })}
          className="w-11 h-6 rounded-full transition-colors"
          style={{ backgroundColor: settings.diaspora ? "#6B1A1A" : "#E5E5EA" }}
        >
          <span
            className="block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5"
            style={{ transform: settings.diaspora ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      </div>

      {/* Member list */}
      <div className="px-4 pt-4 space-y-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border"
            style={{ borderColor: "#E5E5EA" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: m.color }}
            >
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>{m.name}</div>
              <div className="text-xs capitalize" style={{ color: "#8E8E93" }}>{m.role}</div>
            </div>
            {m.id !== "all" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(m)}
                  className="text-gray-400 hover:text-blue-mid transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add member button */}
      {!isFormOpen && (
        <button
          onClick={startAdd}
          className="mx-4 mt-3 flex items-center gap-2 border-2 border-dashed rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:border-burgundy hover:text-burgundy"
          style={{ borderColor: "#D1D5DB", color: "#8E8E93" }}
        >
          <Plus size={18} />
          Add family member
        </button>
      )}

      {/* Add/Edit form */}
      {isFormOpen && (
        <div
          className="mx-4 mt-3 bg-white rounded-2xl border p-4 space-y-3"
          style={{ borderColor: "#E5E5EA" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: "#1B3A5C" }}>
              {editing ? "Edit Member" : "Add Member"}
            </h3>
            <button
              onClick={() => { setAdding(false); setEditing(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Name */}
          <input
            autoFocus
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-burgundy"
            style={{ borderColor: "#E5E5EA" }}
          />

          {/* Color picker */}
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: "#8E8E93" }}>Color</div>
            <div className="flex gap-2 flex-wrap">
              {MEMBER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `3px solid ${c}` : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: "#6B1A1A" }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Check size={14} />
              {editing ? "Save Changes" : "Add Member"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
