import { HDate, HebrewCalendar, flags, OmerEvent } from "@hebcal/core";
import type { HebrewDayInfo, HebrewHoliday } from "@/types";

// Hebrew month names (Gershayim already included by HDate.toString())
const HEB_MONTHS: Record<number, string> = {
  1:  "ניסן",  2:  "אייר",   3:  "סיון",   4:  "תמוז",
  5:  "אב",    6:  "אלול",   7:  "תשרי",   8:  "חשון",
  9:  "כסלו",  10: "טבת",    11: "שבט",    12: "אדר",
  13: "אדר ב׳",
};

const HEB_DAYS: Record<number, string> = {
  1: "א׳", 2: "ב׳", 3: "ג׳", 4: "ד׳", 5: "ה׳", 6: "ו׳",
  7: "ז׳", 8: "ח׳", 9: "ט׳", 10: "י׳", 11: "י״א", 12: "י״ב",
  13: "י״ג", 14: "י״ד", 15: "ט״ו", 16: "ט״ז", 17: "י״ז",
  18: "י״ח", 19: "י״ט", 20: "כ׳", 21: "כ״א", 22: "כ״ב",
  23: "כ״ג", 24: "כ״ד", 25: "כ״ה", 26: "כ״ו", 27: "כ״ז",
  28: "כ״ח", 29: "כ״ט", 30: "ל׳",
};

const HEB_YEARS: Record<number, string> = {};
function toHebrewYear(y: number): string {
  if (HEB_YEARS[y]) return HEB_YEARS[y];
  // Simple mapping for תשפ"ה through תשצ"ט
  const map: Record<number, string> = {
    5780: "תש״פ", 5781: "תשפ״א", 5782: "תשפ״ב", 5783: "תשפ״ג",
    5784: "תשפ״ד", 5785: "תשפ״ה", 5786: "תשפ״ו", 5787: "תשפ״ז",
    5788: "תשפ״ח", 5789: "תשפ״ט", 5790: "תש״צ", 5791: "תשצ״א",
    5792: "תשצ״ב", 5793: "תשצ״ג", 5794: "תשצ״ד", 5795: "תשצ״ה",
  };
  return map[y] ?? `${y}`;
}

export function formatHebrewDate(d: HDate): string {
  const day = HEB_DAYS[d.getDate()] ?? `${d.getDate()}`;
  const month = HEB_MONTHS[d.getMonth()] ?? "";
  const year = toHebrewYear(d.getFullYear());
  return `${day} ${month} ${year}`;
}

export function formatHebrewDateShort(d: HDate): string {
  const day = HEB_DAYS[d.getDate()] ?? `${d.getDate()}`;
  const month = HEB_MONTHS[d.getMonth()] ?? "";
  return `${day} ${month}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getHebrewDayInfo(dateStr: string, diaspora = true): HebrewDayInfo {
  const date = parseDate(dateStr);
  const hdate = new HDate(date);
  const dow = date.getDay(); // 0=Sun ... 6=Sat
  const isShabbat = dow === 6;
  const isErevShabbat = dow === 5;

  // Get events for this day
  const eventsRaw = HebrewCalendar.calendar({
    start: hdate,
    end: hdate,
    isHebrewYear: false,
    il: !diaspora,
  });

  const holidays: HebrewHoliday[] = [];
  let parsha: string | undefined;
  let omerDay: number | undefined;
  let omerWeekDays: string | undefined;
  let isRoshChodesh = false;
  let isYomTov = false;
  let isCholHaMoed = false;
  let isErevYomTov = false;

  for (const ev of eventsRaw) {
    const mask = ev.getFlags();

    // Parsha
    if (mask & flags.PARSHA_HASHAVUA) {
      parsha = ev.render("he");
      continue;
    }

    // Omer
    if (ev instanceof OmerEvent) {
      omerDay = ev.omer;
      const weeks = Math.floor(omerDay / 7);
      const days = omerDay % 7;
      const parts: string[] = [];
      if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "שבוע" : "שבועות"}`);
      if (days > 0) parts.push(`${days} ${days === 1 ? "יום" : "ימים"}`);
      omerWeekDays = parts.join(", ");
      continue;
    }

    if (mask & flags.ROSH_CHODESH) {
      isRoshChodesh = true;
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "roshchodesh" });
      continue;
    }

    if (mask & flags.YOM_TOV_ENDS) continue; // skip end markers

    if (mask & (flags.CHOL_HAMOED)) {
      isCholHaMoed = true;
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "chol_hamoed" });
      continue;
    }

    if (mask & flags.EREV) {
      isErevYomTov = true;
      continue; // we show erev as candle lighting, not a holiday row
    }

    if (mask & (flags.CHAG | flags.LIGHT_CANDLES_TZEIS)) {
      isYomTov = true;
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "yomtov" });
      continue;
    }

    if (mask & flags.MINOR_FAST) {
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "fast" });
      continue;
    }

    if (mask & flags.SPECIAL_SHABBAT) {
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "shabbat" });
      continue;
    }

    // Generic minor holiday
    if (mask & flags.MINOR_HOLIDAY) {
      const hName = ev.render("he");
      holidays.push({ name: hName, nameEn: ev.render("en"), type: "minor" });
    }
  }

  return {
    hebrewDate: formatHebrewDate(hdate),
    hebrewDateShort: formatHebrewDateShort(hdate),
    holidays,
    parsha,
    omerDay,
    omerWeekDays,
    isShabbat,
    isRoshChodesh,
    isYomTov,
    isCholHaMoed,
    isErevShabbat,
    isErevYomTov,
  };
}

// Returns the Hebrew month display for a Gregorian month (e.g. "אייר – סיון")
export function getMonthHebrewLabel(year: number, month: number): string {
  const first = new HDate(new Date(year, month, 1));
  const last = new HDate(new Date(year, month + 1, 0));
  const m1 = HEB_MONTHS[first.getMonth()] ?? "";
  const m2 = HEB_MONTHS[last.getMonth()] ?? "";
  const y = toHebrewYear(first.getFullYear());
  if (first.getMonth() === last.getMonth()) return `${m1} ${y}`;
  return `${m1} – ${m2} ${y}`;
}

// Get all days in a Gregorian month, sorted
export function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(toDateStr(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Get a range of dates from today onwards (agenda)
export function getAgendaDates(startDate: string, count = 60): string[] {
  const result: string[] = [];
  const d = parseDate(startDate);
  for (let i = 0; i < count; i++) {
    result.push(toDateStr(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
}
