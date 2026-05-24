export type RepeatFrequency = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface FamilyMember {
  id: string;
  name: string;
  color: string; // hex color
  role: "parent" | "child";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (24h)
  endTime?: string; // HH:mm (24h)
  allDay: boolean;
  assignedTo: string[]; // FamilyMember ids, or ["all"]
  location?: string;
  notes?: string;
  repeat: RepeatFrequency;
  repeatUntil?: string; // YYYY-MM-DD
  color?: string; // override color
}

export interface AppLocation {
  lat: number;
  lng: number;
  tzid: string; // e.g. "America/New_York"
  city: string;
}

export interface AppSettings {
  familyName: string;
  location: AppLocation | null;
  premium: boolean;
  locationDenied: boolean;
}

export type CalendarView = "agenda" | "3day" | "month";

export interface ZmanimTimes {
  date: string; // YYYY-MM-DD
  candleLighting?: string; // HH:mm
  havdalah?: string; // HH:mm
  alotHaShachar?: string;
  misheyakir?: string;
  sunrise?: string;
  sofZmanShma?: string;
  sofZmanTfilla?: string;
  chatzot?: string;
  minchaGedola?: string;
  minchaKetana?: string;
  plagHaMincha?: string;
  sunset?: string;
  tzait?: string;
  shabbatEnd?: string;
}

export interface HebrewDayInfo {
  hebrewDate: string; // e.g. "כ״ט אייר תשפ״ו"
  hebrewDateShort: string; // e.g. "כ״ט אייר"
  holidays: HebrewHoliday[];
  parsha?: string; // Hebrew parsha name (Shabbat only)
  omerDay?: number; // 1-49 during Sefirat HaOmer
  omerWeekDays?: string; // e.g. "4 weeks, 1 day"
  isShabbat: boolean;
  isRoshChodesh: boolean;
  isYomTov: boolean;
  isCholHaMoed: boolean;
  isErevShabbat: boolean;
  isErevYomTov: boolean;
}

export interface HebrewHoliday {
  name: string; // Hebrew name e.g. "שבועות"
  nameEn: string; // English name e.g. "Shavuot"
  type: "yomtov" | "roshchodesh" | "chol_hamoed" | "minor" | "fast" | "shabbat";
  desc?: string; // extra desc e.g. "Day 1", "Yizkor"
}
