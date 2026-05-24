"use client";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MapPin, RefreshCw, Star, Check, User, LogOut, Link2, Copy } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // Load invite code when the Account section is shown
  async function loadInviteCode() {
    if (inviteCode) return;
    const res = await fetch("/api/family");
    if (res.ok) {
      const data = await res.json();
      setInviteCode(data.family?.inviteCode ?? null);
    }
  }

  function copyInviteCode() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    });
  }

  async function searchLocation(e: React.FormEvent) {
    e.preventDefault();
    const q = locationQuery.trim();
    if (!q) return;
    setLocationSearching(true);
    setLocationError("");
    try {
      // US ZIP code — use structured postalcode lookup for better accuracy
      const isZip = /^\d{5}$/.test(q);
      const url = isZip
        ? `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(q)}&countrycodes=us&format=json&limit=1&addressdetails=1`
        : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (!data.length) {
        setLocationError("Location not found. Try a city name or ZIP code.");
        return;
      }
      const r = data[0];
      const lat = parseFloat(r.lat);
      const lng = parseFloat(r.lon);
      const cc: string = r.address?.country_code ?? "us";
      const tzid = estimateTzid(cc, lat, lng);
      const city =
        r.address?.city ??
        r.address?.town ??
        r.address?.village ??
        r.address?.county ??
        r.display_name.split(",")[0];
      updateSettings({ location: { lat, lng, tzid, city }, locationDenied: false });
      setLocationQuery("");
    } catch {
      setLocationError("Search failed. Check your connection.");
    } finally {
      setLocationSearching(false);
    }
  }

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
            {/* Manual city search */}
            <form onSubmit={searchLocation} className="space-y-1.5">
              <label className="text-xs font-bold block" style={{ color: "#8E8E93" }}>CHANGE CITY</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City name or US ZIP code"
                  className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "#E5E5EA" }}
                />
                <button
                  type="submit"
                  disabled={locationSearching || !locationQuery.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#1B3A5C" }}
                >
                  {locationSearching ? "…" : "Set"}
                </button>
              </div>
              {locationError && (
                <p className="text-xs" style={{ color: "#DC2626" }}>{locationError}</p>
              )}
            </form>
          </div>
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
                {["No ads — ever"].map((f) => (
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

        {/* Account */}
        <Section title="Account">
          {isSignedIn ? (
            <div className="divide-y" style={{ borderColor: "#E5E5EA" }}>
              {/* User info */}
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#E8F4F9" }}>
                  <User size={18} color="#1B3A5C" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: "#1C1C1E" }}>
                    {user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress}
                  </div>
                  <div className="text-xs truncate" style={{ color: "#8E8E93" }}>
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </div>
                </div>
              </div>

              {/* Invite code */}
              <div className="px-4 py-3">
                <div className="text-xs font-bold mb-2" style={{ color: "#8E8E93" }}>
                  FAMILY INVITE CODE
                </div>
                {inviteCode ? (
                  <button
                    onClick={copyInviteCode}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border"
                    style={{ borderColor: "#E5E5EA" }}
                  >
                    <span className="font-mono font-bold text-lg tracking-widest flex-1" style={{ color: "#1C1C1E" }}>
                      {inviteCode}
                    </span>
                    <Copy size={15} color={inviteCopied ? "#059669" : "#8E8E93"} />
                    {inviteCopied && <span className="text-xs" style={{ color: "#059669" }}>Copied!</span>}
                  </button>
                ) : (
                  <button
                    onClick={loadInviteCode}
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "#1B3A5C" }}
                  >
                    <Link2 size={14} /> Show invite code
                  </button>
                )}
                <p className="text-[10px] mt-1.5" style={{ color: "#C7C7CC" }}>
                  Share this code with family members so they can join your synced calendar.
                </p>
              </div>

              {/* Sign out */}
              <button
                onClick={() => signOut(() => router.push("/"))}
                className="w-full px-4 py-3 flex items-center gap-2 text-sm font-semibold text-left"
                style={{ color: "#DC2626" }}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              <p className="text-sm" style={{ color: "#48484A" }}>
                Sign in to sync your calendar across devices and share it with family.
              </p>
              <button
                onClick={() => router.push("/sign-in")}
                className="w-full py-3 rounded-xl font-bold text-white"
                style={{ backgroundColor: "#1B3A5C" }}
              >
                Sign in / Create account
              </button>
              <button
                onClick={() => router.push("/join")}
                className="w-full py-2.5 rounded-xl font-bold border text-sm"
                style={{ borderColor: "#1B3A5C", color: "#1B3A5C" }}
              >
                Join a family with invite code
              </button>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs" style={{ color: "#8E8E93" }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: "#1C1C1E" }}>{value}</span>
    </div>
  );
}

function estimateTzid(cc: string, lat: number, lng: number): string {
  if (cc === "il") return "Asia/Jerusalem";
  if (cc === "gb") return "Europe/London";
  if (cc === "fr" || cc === "be") return "Europe/Paris";
  if (cc === "de" || cc === "ch" || cc === "at") return "Europe/Berlin";
  if (cc === "au") return "Australia/Sydney";
  if (cc === "za") return "Africa/Johannesburg";
  if (cc === "ar") return "America/Argentina/Buenos_Aires";
  if (cc === "br") return "America/Sao_Paulo";
  if (cc === "mx") return "America/Mexico_City";
  if (cc === "ca") return lng < -100 ? "America/Vancouver" : "America/Toronto";
  if (cc === "us") {
    if (lng > -75) return "America/New_York";
    if (lng > -90) return "America/Chicago";
    if (lng > -115) return "America/Denver";
    return "America/Los_Angeles";
  }
  return "America/New_York";
}
