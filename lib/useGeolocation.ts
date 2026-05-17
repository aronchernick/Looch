"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { detectTimezone, DEFAULT_LOCATION } from "@/lib/zmanim";
import type { AppLocation } from "@/types";

// Reverse-geocode coordinates to a city name using a free API
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const city =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.county ||
      "";
    const state = data?.address?.state_code || data?.address?.state || "";
    return city && state ? `${city}, ${state}` : city || "Your location";
  } catch {
    return "Your location";
  }
}

export function useGeolocation() {
  const { settings, updateSettings } = useStore();

  useEffect(() => {
    // Already have location or already denied
    if (settings.location || settings.locationDenied) return;

    if (!navigator.geolocation) {
      updateSettings({ location: DEFAULT_LOCATION, locationDenied: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const tzid = detectTimezone();
        const city = await reverseGeocode(latitude, longitude);
        const location: AppLocation = {
          lat: latitude,
          lng: longitude,
          tzid,
          city,
        };
        updateSettings({ location, locationDenied: false });
      },
      () => {
        // Denied or unavailable — use NYC default
        updateSettings({
          location: DEFAULT_LOCATION,
          locationDenied: true,
        });
      },
      { timeout: 8000 }
    );
  }, [settings.location, settings.locationDenied, updateSettings]);

  return settings.location ?? DEFAULT_LOCATION;
}
