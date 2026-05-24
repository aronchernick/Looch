import type { AppLocation, ZmanimTimes } from "@/types";

// kosher-zmanim types
interface KZLocation {
  setLatitude(lat: number): void;
  setLongitude(lng: number): void;
  setTimeZone(tzid: string): void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface KZCalculator {
  setGeoLocation(loc: KZLocation): void;
  setDate(d: Date): void;
  getSunrise(): Date | null;
  getSunset(): Date | null;
  getBeginNauticalTwilight(): Date | null;
  getMisheyakir10Point2Degrees(): Date | null;
  getSofZmanShmaMGA(): Date | null;
  getSofZmanTfillaMGA(): Date | null;
  getChatzot(): Date | null;
  getMinchaGedola(): Date | null;
  getMinchaKetana(): Date | null;
  getPlagHaMincha(): Date | null;
  getBainHasmashosRT13Point5MinutesBefore7Point083Degrees(): Date | null;
  getTzais(): Date | null;
}

// kosher-zmanim returns Luxon DateTime objects, not native Dates
function toNativeDate(d: unknown): Date | null {
  if (!d) return null;
  // Luxon DateTime has toJSDate()
  if (typeof (d as { toJSDate?: () => Date }).toJSDate === "function") {
    return (d as { toJSDate: () => Date }).toJSDate();
  }
  // Already a native Date
  if (d instanceof Date) return d;
  return null;
}

function fmt(d: unknown, tzid: string): string | undefined {
  const native = toNativeDate(d);
  if (!native || isNaN(native.getTime())) return undefined;
  try {
    return native.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tzid,
    });
  } catch {
    return undefined;
  }
}

// Candle lighting is 18 minutes before sunset (standard Ashkenaz)
function addMinutes(d: unknown, mins: number): Date | null {
  const native = toNativeDate(d);
  if (!native) return null;
  return new Date(native.getTime() + mins * 60_000);
}

let kosherZmanim: typeof import("kosher-zmanim") | null = null;

async function getKZ() {
  if (kosherZmanim) return kosherZmanim;
  kosherZmanim = await import("kosher-zmanim");
  return kosherZmanim;
}

export async function getZmanim(
  location: AppLocation,
  dateStr: string // YYYY-MM-DD
): Promise<ZmanimTimes> {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);

  try {
    const kz = await getKZ();
    const geoLocation = new kz.GeoLocation(
      location.city,
      location.lat,
      location.lng,
      0,
      location.tzid
    );
    const calc = new kz.ComplexZmanimCalendar(geoLocation);
    calc.setDate(date);

    const sunset = calc.getSunset();
    const candleLightingDate = addMinutes(sunset, -18);
    const havdalahDate = calc.getTzais();

    return {
      date: dateStr,
      candleLighting: fmt(candleLightingDate, location.tzid),
      havdalah: fmt(havdalahDate, location.tzid),
      alotHaShachar: fmt(calc.getBeginNauticalTwilight(), location.tzid),
      misheyakir: fmt(calc.getMisheyakir10Point2Degrees(), location.tzid),
      sunrise: fmt(calc.getSunrise(), location.tzid),
      sofZmanShma: fmt(calc.getSofZmanShmaMGA(), location.tzid),
      sofZmanTfilla: fmt(calc.getSofZmanTfilaMGA(), location.tzid),
      chatzot: fmt(calc.getChatzos(), location.tzid),
      minchaGedola: fmt(calc.getMinchaGedola(null, null), location.tzid),
      minchaKetana: fmt(calc.getMinchaKetana(null, null), location.tzid),
      plagHaMincha: fmt(calc.getPlagHamincha(null, null), location.tzid),
      sunset: fmt(sunset, location.tzid),
      tzait: fmt(havdalahDate, location.tzid),
    };
  } catch {
    return { date: dateStr };
  }
}

// Fetch zmanim for a range of dates (used for the agenda to show candle lighting)
export async function getZmanimRange(
  location: AppLocation,
  dates: string[]
): Promise<Record<string, ZmanimTimes>> {
  const results: Record<string, ZmanimTimes> = {};
  await Promise.all(
    dates.map(async (d) => {
      results[d] = await getZmanim(location, d);
    })
  );
  return results;
}

// Default location: New York City
export const DEFAULT_LOCATION: AppLocation = {
  lat: 40.6501,
  lng: -73.9496,
  tzid: "America/New_York",
  city: "Brooklyn, NY",
};

// Detect timezone from browser
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}
