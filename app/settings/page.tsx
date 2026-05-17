"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";

import { MapPin, RefreshCw, Star, Check } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  function refreshLocation() {
    setRefreshing(true);
    updateSettings({ location: null, locationDenied: false });
    setTimeout(() => setRefreshing(false), 2000);
  }

  return (
    <div className="flex flex-col pb-36">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: "#1B3A5C" }}>
        <h1 className="text-white font-extrabold text-xl">Settings</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Family name */}
        <Section title="Family">
          <div className="px-4 py-3">
            <label className="text-xs font-bold block mb-1" style={{ color: "#8E8E93" }}>
              Family Name
            </label>
            <input
              type="text"
              value={settings.familyName}
              onChange={(e) => updateSettings({ familyName: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-burgundy"
              style={{ borderColor: "#E5E5EA" }}
            />
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={16} color="#6B1A1A" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                  {settings.location?.city ?? "Not set"}
                </div>
                <div className="text-xs" style={{ color: "#8E8E93" }}>
                  {settings.location?.tzid ?? "Unknown timezone"}
                </div>
              </div>
              <button
                onClick={refreshLocation}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                style={{ backgroundColor: "#E8F4F9", color: "#1B3A5C" }}
              >
                <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
            {settings.locationDenied && (
              <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                Location access was denied. Using Brooklyn, NY as default.
                Enable location in your browser settings, then tap Refresh.
              </p>
            )}
          </div>
        </Section>

        {/* Calendar */}
        <Section title="Calendar">
          <ToggleRow
            label="Chutz L'Aretz (Diaspora)"
            sublabel="2 days Yom Tov"
            value={settings.diaspora}
            onChange={(v) => updateSettings({ diaspora: v })}
          />
        </Section>

        {/* Premium */}
        <Section title="Premium" id="premium">
          {settings.premium ? (
            <div className="px-4 py-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#D1FAE5" }}
              >
                <Check size={18} color="#059669" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>
                  Looch Premium Active
                </div>
                <div className="text-xs" style={{ color: "#8E8E93" }}>
                  No ads. Thank you for supporting Looch!
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#F5E8E8" }}
                >
                  <Star size={18} color="#6B1A1A" />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>
                    Go Premium
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#8E8E93" }}>
                    Remove ads and support the Looch family calendar.
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs" style={{ color: "#48484A" }}>
                {["No ads — ever", "Unlimited family members", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={12} color="#6B1A1A" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => updateSettings({ premium: true })} // Demo: toggle on
                className="w-full py-3 rounded-xl text-sm font-extrabold text-white"
                style={{ backgroundColor: "#6B1A1A" }}
              >
                Upgrade to Premium — coming soon
              </button>
              <p className="text-[10px] text-center" style={{ color: "#C7C7CC" }}>
                Stripe payments integration coming in v2
              </p>
            </div>
          )}
        </Section>

        {/* About */}
        <Section title="About">
          <div className="px-4 py-3 space-y-1">
            <Row label="Version" value="1.0.0" />
            <Row label="Zmanim" value="KosherZmanim" />
            <Row label="Calendar" value="Hebcal Core" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id}>
      <div className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "#8E8E93" }}>
        {title}
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E5E5EA" }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, sublabel, value, onChange }: {
  label: string;
  sublabel?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>{label}</div>
        {sublabel && <div className="text-xs" style={{ color: "#8E8E93" }}>{sublabel}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-colors"
        style={{ backgroundColor: value ? "#6B1A1A" : "#E5E5EA" }}
      >
        <span
          className="block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5"
          style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs" style={{ color: "#8E8E93" }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: "#1C1C1E" }}>{value}</span>
    </div>
  );
}
