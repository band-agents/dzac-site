/**
 * Registrations, abstracts and partner enquiries for the preview.
 *
 * Until the backend joins, everything lives in this browser's localStorage,
 * guarded, because storage can be missing in a private window. At launch
 * these functions become API calls; the shapes stay the same.
 */

import type { Category, PassId } from "@/content/site";

export type Registration = {
  code: string;
  pass: PassId;
  category: Category;
  name: string;
  email: string;
  phone: string;
  country: string;
  specialty: string;
  institution: string;
  createdAt: string;
  checkedInAt?: string;
};

const KEY = "dzac5.registrations";
const ABS = "dzac5.abstracts";
const PARTNERS = "dzac5.partners";

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]") as T[]; } catch { return []; }
}
function write<T>(key: string, list: T[]) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* preview only */ }
}

/** Codes avoid 0/O and 1/I so they read cleanly off a phone at the door. */
export function newCode(prefix: string) {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `${prefix}-${Array.from(bytes, (b) => abc[b % abc.length]).join("")}`;
}

export const registrations = () => read<Registration>(KEY);
export const findRegistration = (code: string) => registrations().find((r) => r.code === code.trim().toUpperCase());

export function saveRegistration(r: Omit<Registration, "code" | "createdAt">): Registration {
  const full: Registration = { ...r, code: newCode("DZ5"), createdAt: new Date().toISOString() };
  write(KEY, [...registrations(), full]);
  return full;
}

/** Marks a ticket as arrived. Returns the record and whether it was already in. */
export function checkIn(code: string): { reg?: Registration; already: boolean } {
  const list = registrations();
  const i = list.findIndex((r) => r.code === code.trim().toUpperCase());
  if (i < 0) return { already: false };
  if (list[i].checkedInAt) return { reg: list[i], already: true };
  list[i] = { ...list[i], checkedInAt: new Date().toISOString() };
  write(KEY, list);
  return { reg: list[i], already: false };
}

export function saveAbstract(a: Record<string, string>) {
  const code = newCode("ABS");
  write(ABS, [...read<Record<string, string>>(ABS), { ...a, code, createdAt: new Date().toISOString() }]);
  return code;
}

export function savePartnerEnquiry(p: Record<string, string>) {
  const code = newCode("PRT");
  write(PARTNERS, [...read<Record<string, string>>(PARTNERS), { ...p, code, createdAt: new Date().toISOString() }]);
  return code;
}

/** Where a ticket's QR points: its own page, so a scan at the door or on a phone opens it. */
export const ticketUrl = (code: string, locale: string) =>
  `${typeof window === "undefined" ? "" : window.location.origin}${process.env.NEXT_PUBLIC_BASE ?? ""}/${locale}/ticket/?c=${code}`;

/** An all-day calendar entry for 14 January 2027; the start time is not fixed yet. */
export function icsFile(title: string, location: string) {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DZAC//DZAC 5//EN", "BEGIN:VEVENT",
    `UID:dzac5-${Date.now()}@dzac`, "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""),
    "DTSTART;VALUE=DATE:20270114", "DTEND;VALUE=DATE:20270115", `SUMMARY:${title}`, `LOCATION:${location}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
export const isPhone = (s: string) => /^\+?[\d\s()-]{8,18}$/.test(s.trim()) && (s.match(/\d/g) || []).length >= 8;

/* ── Applications ─────────────────────────────────────── */

const APPS = "dzac5.applications";
const DRAFT = "dzac5.apply.draft";
const PREFILL = "dzac5.prefill";

export type Answers = Record<string, string | string[]>;

export function saveApplication(intent: string, answers: Answers) {
  const code = newCode("APP");
  write(APPS, [...read<Record<string, unknown>>(APPS), { code, intent, answers, createdAt: new Date().toISOString() }]);
  return code;
}

/** The half-finished application, so an applicant can close the tab and come back. */
export function loadDraft(): { answers: Answers; step: number } | null {
  try { return JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch { return null; }
}
export function saveDraft(d: { answers: Answers; step: number } | null) {
  try { if (d) localStorage.setItem(DRAFT, JSON.stringify(d)); else localStorage.removeItem(DRAFT); } catch { /* preview only */ }
}

/**
 * Hands answers from the application to the registration or abstract form.
 * Stored on the device, never in the URL, and read once.
 */
export function setPrefill(p: Record<string, string>) {
  try { localStorage.setItem(PREFILL, JSON.stringify(p)); } catch { /* preview only */ }
}
export function takePrefill(): Record<string, string> | null {
  try {
    const v = JSON.parse(localStorage.getItem(PREFILL) || "null");
    localStorage.removeItem(PREFILL);
    return v;
  } catch { return null; }
}

/** "name@gmial.com" → "name@gmail.com". Only suggests for near misses of common providers. */
export function emailSuggestion(email: string): string | null {
  const m = email.trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m) return null;
  const domain = m[2];
  const known = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "live.com", "msn.com"];
  if (known.includes(domain)) return null;
  let best: string | null = null, bestD = 3;
  for (const k of known) {
    const d = distance(domain, k);
    if (d < bestD) { bestD = d; best = k; }
  }
  return best && bestD <= 2 ? `${m[1]}@${best}` : null;
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
