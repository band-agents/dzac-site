"use client";

/**
 * Header, footer and countdown.
 *
 * The header is three zones, with the navigation exactly centred, and turns
 * solid once the page scrolls. The language switch keeps you on the same
 * page. The countdown renders dashes until it mounts, so the static HTML and
 * the first client render agree. No animation library: the menu animates in
 * CSS.
 */

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MapPin, Menu, X } from "lucide-react";
import { EVENT, NAV, UI } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { useScrolled } from "@/lib/motion";
import { asset, page } from "@/lib/paths";
import { DzMark, Wordmark } from "./brand";

function useSwitchHref() {
  const path = usePathname() || "/en/";
  const locale = useLocale();
  const other = locale === "en" ? "ar" : "en";
  return path.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}/`;
}

export function Header() {
  const t = useT();
  const locale = useLocale();
  const path = usePathname() || "";
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);
  const switchHref = useSwitchHref();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <header className={`hd${scrolled || open ? " is-solid" : ""}`}>
      <div className="wrap hd-in">
        <Link href={page(locale)} className="hd-logo" aria-label={`DZAC 5, ${t(EVENT.full)}`}>
          <DzMark />
          <Wordmark />
        </Link>
        <nav className="hd-nav" aria-label={t(UI.menu)}>
          {NAV.map((n) => (
            <Link key={n.href} href={page(locale, n.href)} aria-current={path.includes(`/${n.href}/`) ? "page" : undefined}>{t(n.label)}</Link>
          ))}
        </nav>
        <div className="hd-actions">
          <Link href={switchHref} className="hd-lang" hrefLang={locale === "en" ? "ar" : "en"} aria-label={t(UI.langLabel)}>{t(UI.lang)}</Link>
          <Link href={page(locale, "apply")} className="btn btn-ghost btn-sm hd-apply">{t(UI.apply)}</Link>
          <Link href={page(locale, "register")} className="btn btn-primary btn-sm">{t(UI.register)}</Link>
          <button type="button" className="hd-burger" onClick={() => setOpen(true)} aria-label={t(UI.menu)} aria-expanded={open}><Menu size={20} /></button>
        </div>
      </div>

      {open && (
        <div className="menu" role="dialog" aria-modal="true" aria-label={t(UI.menu)}>
          <div className="wrap menu-top">
            <Wordmark style={{ fontSize: 28 }} />
            <button type="button" className="hd-burger" style={{ display: "grid" }} onClick={() => setOpen(false)} aria-label={t(UI.close)}><X size={20} /></button>
          </div>
          <nav className="wrap menu-links">
            {[{ href: "", label: { en: "Home", ar: "الرئيسية" } }, ...NAV, { href: "apply", label: UI.apply }, { href: "register", label: UI.register }].map((n, i) => (
              <Link key={n.href || "home"} href={page(locale, n.href)} style={{ ["--k" as string]: i } as CSSProperties}>{t(n.label)}</Link>
            ))}
          </nav>
          <div className="wrap menu-foot">
            <Link href={switchHref} className="hd-lang">{t(UI.lang)}</Link>
            <span>{t(EVENT.date)} · {t(EVENT.venue)}</span>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const t = useT();
  const locale = useLocale();
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-brand">
          <Wordmark />
          <p>{t(EVENT.full)} · {t(EVENT.tagline)}</p>
          <p className="ft-meta">
            <span><CalendarDays size={15} /> {t(EVENT.date)}</span>
            <span><MapPin size={15} /> {t(EVENT.venue)}</span>
          </p>
        </div>
        <div className="ft-grid">
          <div className="ft-col">
            <h4>{t({ en: "Conference", ar: "المؤتمر" })}</h4>
            {NAV.slice(0, 3).map((n) => <Link key={n.href} href={page(locale, n.href)}>{t(n.label)}</Link>)}
            <Link href={page(locale, "abstracts")}>{t({ en: "Submit an abstract", ar: "قدّم ملخصًا بحثيًا" })}</Link>
          </div>
          <div className="ft-col">
            <h4>{t({ en: "Attend", ar: "الحضور" })}</h4>
            <Link href={page(locale, "apply")}>{t(UI.apply)}</Link>
            <Link href={page(locale, "register")}>{t(UI.register)}</Link>
            <Link href={page(locale, "certificate")}>{t({ en: "Certificate of attendance", ar: "شهادة الحضور" })}</Link>
            <Link href={page(locale, "check-in")}>{t({ en: "Staff check-in", ar: "تسجيل الدخول للفريق" })}</Link>
          </div>
          <div className="ft-col">
            <h4>{t({ en: "Follow", ar: "تابعنا" })}</h4>
            <a href={EVENT.facebook} target="_blank" rel="noreferrer">Facebook · DZAC</a>
            <Link href={page(locale, "gallery")}>{t({ en: "DZAC 4 gallery", ar: "صور DZAC 4" })}</Link>
            <Link href={page(locale, "films")}>{t({ en: "Films", ar: "الأفلام" })}</Link>
            <span style={{ color: "var(--champagne)" }}>{EVENT.hashtag}</span>
          </div>
        </div>
        <div className="ft-base">
          <span>{t({ en: "Organized by Dar El Zokora Group · Scientific partner ISMHA", ar: "تنظيم مجموعة دار الذكورة · الشريك العلمي ISMHA" })}</span>
          <span className="ft-org">{t({ en: "Event organizer", ar: "منظم الحدث" })} <img src={asset("/brand/horizon.png")} alt="Horizon" width={640} height={273} loading="lazy" /></span>
          <span>© 2026 {t(EVENT.organizer)} · DZAC</span>
        </div>
      </div>
    </footer>
  );
}

/** Days, hours, minutes, seconds to the opening. */
export function Countdown() {
  const t = useT();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = now === null ? null : Math.max(0, new Date(EVENT.startsAt).getTime() - now);
  const parts = left === null ? null : [
    Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60,
  ];
  const labels = [UI.days, UI.hours, UI.minutes, UI.seconds];
  return (
    <div className="cd" role="timer" aria-label={t({ en: "Time until DZAC 5 opens", ar: "الوقت المتبقي على افتتاح DZAC 5" })}>
      {labels.map((l, i) => (
        <div key={i} className="cd-cell">
          <span className="cd-v u-tnum">{parts ? String(parts[i]).padStart(i ? 2 : 1, "0") : "–"}</span>
          <span className="cd-l">{t(l)}</span>
        </div>
      ))}
    </div>
  );
}
