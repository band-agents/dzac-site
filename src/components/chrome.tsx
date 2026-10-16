"use client";

/**
 * Header, phone menu, phone bottom bar, footer and the countdowns, as in the
 * DZAC 5 design.
 *
 * The header is transparent over the hero, turns solid once the page
 * scrolls, slides away while you scroll down and returns when you scroll up.
 * On phones a slim bar with the live countdown and Register follows you
 * after the hero. Countdowns render dashes until mounted, so the static HTML
 * and the first client render agree.
 */

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT, NAV, UI } from "@/content/site";
import { H } from "@/content/home";
import { useLocale, useT } from "@/lib/locale";
import { page } from "@/lib/paths";

function useSwitchHref() {
  const path = usePathname() || "/en/";
  const locale = useLocale();
  const other = locale === "en" ? "ar" : "en";
  return path.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}/`;
}

/** Scroll state: past the top, past the first screen, and whether we're heading down. */
function useScrollState() {
  const [s, setS] = useState({ solid: false, past: false, hide: false });
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > last + 4, up = y < last - 4;
        setS((p) => ({ solid: y > 40, past: y > window.innerHeight * 0.85, hide: y > 240 && (down ? true : up ? false : p.hide) }));
        last = y;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return s;
}

function Mark() {
  const t = useT();
  return (
    <span className="mark">
      <span className="mark-5">5</span>
      <span className="mark-t"><b dir="ltr">DZAC</b><small>{t(H.brandSub)}</small></span>
    </span>
  );
}

export function Header() {
  const t = useT();
  const locale = useLocale();
  const path = usePathname() || "";
  const { solid, past, hide } = useScrollState();
  const [open, setOpen] = useState(false);
  const switchHref = useSwitchHref();
  const home = path === `/${locale}/` || path === `/${locale}`;

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <>
      <header className={`hd${solid || open || !home ? " is-solid" : ""}${hide && !open ? " is-hidden" : ""}`}>
        <Link href={page(locale)} className="hd-logo" aria-label={`DZAC 5, ${t(EVENT.full)}`}><Mark /></Link>
        <nav className="hd-nav" aria-label={t(UI.menu)}>
          {NAV.map((n) => (
            <Link key={n.href} href={page(locale, n.href)} aria-current={path.includes(`/${n.href}/`) ? "page" : undefined}>{t(n.label)}</Link>
          ))}
        </nav>
        <div className="hd-actions">
          <Link href={switchHref} className="hd-lang" hrefLang={locale === "en" ? "ar" : "en"} aria-label={t(UI.langLabel)}>{locale === "en" ? "عربي" : "EN"}</Link>
          <Link href={page(locale, "register")} className="hd-reg">{t(UI.register)}</Link>
          <button type="button" className={`hd-burger${open ? " is-open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label={open ? t(UI.close) : t(UI.menu)} aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </header>

      {open && (
        <div className="menu" role="dialog" aria-modal="true" aria-label={t(UI.menu)}>
          <nav className="menu-links">
            {[{ href: "", label: { en: "Home", ar: "الرئيسية" } }, ...NAV].map((n, i) => (
              <Link key={n.href || "home"} href={page(locale, n.href)} style={{ ["--k" as string]: i } as CSSProperties}>
                <span>{t(n.label)}</span><small dir="ltr">{String(i + 1).padStart(2, "0")}</small>
              </Link>
            ))}
          </nav>
          <div className="menu-foot">
            <Link href={page(locale, "register")} className="btn btn-light btn-lg">{t(UI.register)}</Link>
            <Link href={page(locale, "apply")} className="btn btn-line btn-lg">{t(UI.apply)}</Link>
            <span>{t(EVENT.date)} · {t(EVENT.venue)}</span>
          </div>
        </div>
      )}

      <div className={`mbar${past && !open ? " is-on" : ""}`} aria-hidden={!past}>
        <div className="mbar-t">
          <Clock compact />
          <small>{t({ en: "14 Jan 2027 · Cairo", ar: "14 يناير 2027 · القاهرة" })}</small>
        </div>
        <Link href={page(locale, "register")} className="btn btn-light">{t(UI.register)}</Link>
      </div>
    </>
  );
}

export function Footer() {
  const t = useT();
  const locale = useLocale();
  return (
    <footer className="ft t-dark">
      <div className="wrap ft-in">
        <div className="ft-brand">
          <span className="ft-wm" dir="ltr">DZAC<sup>05</sup></span>
          <p>{t(EVENT.tagline)}</p>
        </div>
        <div className="ft-col">
          <h4>{t(H.explore)}</h4>
          {NAV.map((n) => <Link key={n.href} href={page(locale, n.href)}>{t(n.label)}</Link>)}
        </div>
        <div className="ft-col">
          <h4>{t(H.attendees)}</h4>
          <Link href={page(locale, "register")}>{t(UI.register)}</Link>
          <Link href={page(locale, "apply")}>{t(UI.apply)}</Link>
          <Link href={page(locale, "abstracts")}>{t({ en: "Submit an abstract", ar: "قدّم ملخصًا بحثيًا" })}</Link>
          <Link href={page(locale, "certificate")}>{t({ en: "Certificate of attendance", ar: "شهادة الحضور" })}</Link>
          <Link href={page(locale, "check-in")}>{t({ en: "Staff check-in", ar: "تسجيل دخول الفريق" })}</Link>
        </div>
      </div>
      <div className="wrap ft-base">
        <span>© 2027 {t({ en: "Dar El Zokora Group · ISMHA · Horizon", ar: "مجموعة دار الذكورة · ISMHA · Horizon" })}</span>
        <a href={EVENT.facebook} target="_blank" rel="noreferrer" dir="ltr">{EVENT.hashtag}</a>
      </div>
    </footer>
  );
}

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = now === null ? null : Math.max(0, new Date(EVENT.startsAt).getTime() - now);
  return left === null ? null : [Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60];
}

/** The small inline countdown of the hero and the phone bar. */
export function Clock({ compact }: { compact?: boolean }) {
  const t = useT();
  const parts = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  if (compact) {
    return <b className="clock-c u-tnum" dir="ltr">{parts ? `${parts[0]}d ${pad(parts[1])}:${pad(parts[2])}:${pad(parts[3])}` : "–"}</b>;
  }
  return (
    <span className="clock u-tnum" dir="ltr" role="timer">
      {H.units.map((u, i) => (
        <span key={i}><b>{parts ? (i ? pad(parts[i]) : parts[i]) : "–"}</b><small>{t(u)}</small></span>
      ))}
    </span>
  );
}

/** The large countdown of the final call. */
export function Countdown() {
  const t = useT();
  const parts = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cd u-tnum" dir="ltr" role="timer" aria-label={t({ en: "Time until DZAC 5 opens", ar: "الوقت المتبقي على افتتاح DZAC 5" })}>
      {H.units.map((u, i) => (
        <span key={i} className="cd-cell"><b>{parts ? (i ? pad(parts[i]) : parts[i]) : "–"}</b><small>{t(u)}</small></span>
      ))}
    </div>
  );
}
