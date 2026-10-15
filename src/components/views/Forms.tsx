"use client";

/**
 * Abstract submission, partner enquiries, certificates and staff check-in.
 * Preview storage is the browser; see lib/store.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, CircleAlert, Info, Printer, ScanLine, Send, UserCheck, Users } from "lucide-react";
import { EVENT, LEADERS, PASSES, TIERS, TRACKS, UI } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { checkIn, findRegistration, isEmail, registrations, saveAbstract, savePartnerEnquiry, saveRegistration, takePrefill, type Registration } from "@/lib/store";
import { Wordmark } from "../brand";

function Field({ label, bad, err, full, hint, children }: { label: string; bad?: boolean; err?: string; full?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className={`field${bad ? " is-bad" : ""}${full ? " full" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && !bad && <small>{hint}</small>}
      {bad && err && <em>{err}</em>}
    </label>
  );
}

function Sent({ title, body, code }: { title: string; body: string; code: string }) {
  const t = useT();
  return (
    <motion.div className="panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gap: 14 }}>
      <p className="kicker"><Check size={14} /> {t({ en: "Received", ar: "تم الاستلام" })}</p>
      <h2 className="h3">{title}</h2>
      <p className="lead">{body}</p>
      <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 18, color: "var(--cyan2)" }}>{code}</p>
      <p className="note"><Info size={16} />{t(UI.demo)}</p>
    </motion.div>
  );
}

/* ── Abstracts ─────────────────────────────────────────── */

const LIMIT = 300;

export function AbstractForm() {
  const t = useT();
  const [f, setF] = useState({ title: "", author: "", coauthors: "", email: "", institution: "", track: "", type: "oral", body: "" });
  const [tried, setTried] = useState(false);
  const [code, setCode] = useState("");
  /* Arriving from the application form: carry the pitch over. */
  useEffect(() => {
    const p = takePrefill();
    if (!p || p.kind !== "abstract") return;
    setF((x) => ({ ...x, title: p.title ?? "", author: p.author ?? "", email: p.email ?? "", institution: p.institution ?? "", track: p.track ?? "", type: p.type ?? "oral", body: p.body ?? "" }));
  }, []);
  const words = f.body.trim() ? f.body.trim().split(/\s+/).length : 0;
  const bad = {
    title: f.title.trim().length < 6, author: f.author.trim().length < 3, email: !isEmail(f.email), institution: f.institution.trim().length < 2,
    track: !f.track, body: words < 40 || words > LIMIT,
  };
  if (code) return <Sent code={code} title={t({ en: "Your abstract is in.", ar: "وصلنا ملخصك." })} body={t({ en: "The scientific committee reviews every abstract. We will email the presenting author with the result and the presentation format.", ar: "تراجع اللجنة العلمية كل الملخصات، وسنراسل الباحث المقدِّم بالنتيجة وطريقة العرض." })} />;
  return (
    <form className="panel" noValidate onSubmit={(e) => { e.preventDefault(); if (Object.values(bad).some(Boolean)) { setTried(true); return; } setCode(saveAbstract(f)); }}>
      <div className="form">
        <Field full label={t({ en: "Abstract title", ar: "عنوان الملخص" })} bad={tried && bad.title} err={t({ en: "Add a title", ar: "اكتب العنوان" })}>
          <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </Field>
        <Field label={t({ en: "Presenting author", ar: "الباحث المقدِّم" })} bad={tried && bad.author} err={t({ en: "Add the presenting author", ar: "اكتب اسم الباحث" })}>
          <input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} autoComplete="name" />
        </Field>
        <Field label={t({ en: "Email", ar: "البريد الإلكتروني" })} bad={tried && bad.email} err={t({ en: "Check the email", ar: "راجع البريد" })}>
          <input type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
        </Field>
        <Field label={t({ en: "Co-authors", ar: "الباحثون المشاركون" })} hint={t({ en: "Separate names with commas", ar: "افصل الأسماء بفواصل" })}>
          <input value={f.coauthors} onChange={(e) => setF({ ...f, coauthors: e.target.value })} />
        </Field>
        <Field label={t({ en: "Institution", ar: "جهة العمل" })} bad={tried && bad.institution} err={t({ en: "Add your institution", ar: "اكتب جهة العمل" })}>
          <input value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} autoComplete="organization" />
        </Field>
        <Field label={t({ en: "Track", ar: "المسار" })} bad={tried && bad.track} err={t({ en: "Choose a track", ar: "اختر المسار" })}>
          <select value={f.track} onChange={(e) => setF({ ...f, track: e.target.value })}>
            <option value="">{t({ en: "Choose", ar: "اختر" })}</option>
            {TRACKS.map((x) => <option key={x.n} value={x.title.en}>{t(x.title)}</option>)}
          </select>
        </Field>
        <Field label={t({ en: "Preferred format", ar: "طريقة العرض المفضلة" })}>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="oral">{t({ en: "Oral presentation", ar: "عرض شفهي" })}</option>
            <option value="poster">{t({ en: "Poster", ar: "بوستر" })}</option>
            <option value="video">{t({ en: "Surgical video", ar: "فيديو جراحي" })}</option>
          </select>
        </Field>
        <Field full label={t({ en: "Abstract (background, methods, results, conclusion)", ar: "الملخص (الخلفية، الطريقة، النتائج، الخلاصة)" })} bad={tried && bad.body}
          err={t({ en: `Between 40 and ${LIMIT} words`, ar: `من 40 إلى ${LIMIT} كلمة` })}>
          <textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <small className="u-tnum" style={{ color: words > LIMIT ? "#FF8E8E" : undefined }}>{words} / {LIMIT}</small>
        </Field>
      </div>
      <div className="nav-row">
        <span className="note" style={{ background: "none", boxShadow: "none", padding: 0 }}><Info size={16} />{t({ en: "Submission deadline to be announced.", ar: "يُعلن الموعد النهائي للتقديم قريبًا." })}</span>
        <button type="submit" className="btn btn-primary"><Send size={16} />{t({ en: "Submit abstract", ar: "أرسل الملخص" })}</button>
      </div>
    </form>
  );
}

/* ── Partner enquiry ───────────────────────────────────── */

export function PartnerForm() {
  const t = useT();
  const [f, setF] = useState({ company: "", contact: "", email: "", phone: "", tier: "", message: "" });
  const [tried, setTried] = useState(false);
  const [code, setCode] = useState("");
  const bad = { company: f.company.trim().length < 2, contact: f.contact.trim().length < 3, email: !isEmail(f.email) };
  if (code) return <Sent code={code} title={t({ en: "Thank you. We'll be in touch.", ar: "شكرًا لك. سنتواصل معك." })} body={t({ en: "The partnerships team will send the full package and prices for your chosen tier.", ar: "سيرسل فريق الشراكات تفاصيل الباقة وأسعارها للفئة التي اخترتها." })} />;
  return (
    <form className="panel" noValidate onSubmit={(e) => { e.preventDefault(); if (Object.values(bad).some(Boolean)) { setTried(true); return; } setCode(savePartnerEnquiry(f)); }}>
      <p className="q">{t({ en: "Tell us about your company", ar: "عرّفنا بشركتك" })}</p>
      <div className="form">
        <Field label={t({ en: "Company or institution", ar: "الشركة أو الجهة" })} bad={tried && bad.company} err={t({ en: "Add the company name", ar: "اكتب اسم الشركة" })}>
          <input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} autoComplete="organization" />
        </Field>
        <Field label={t({ en: "Contact person", ar: "مسؤول التواصل" })} bad={tried && bad.contact} err={t({ en: "Add a name", ar: "اكتب الاسم" })}>
          <input value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} autoComplete="name" />
        </Field>
        <Field label={t({ en: "Email", ar: "البريد الإلكتروني" })} bad={tried && bad.email} err={t({ en: "Check the email", ar: "راجع البريد" })}>
          <input type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
        </Field>
        <Field label={t({ en: "Phone", ar: "الهاتف" })}>
          <input type="tel" dir="ltr" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />
        </Field>
        <Field full label={t({ en: "Interested in", ar: "مهتم بـ" })}>
          <select value={f.tier} onChange={(e) => setF({ ...f, tier: e.target.value })}>
            <option value="">{t({ en: "Not sure yet", ar: "لم أحدد بعد" })}</option>
            {TIERS.map((x) => <option key={x.id} value={x.id}>{t(x.name)}</option>)}
          </select>
        </Field>
        <Field full label={t({ en: "Anything we should know", ar: "أي تفاصيل إضافية" })}>
          <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} style={{ minHeight: 120 }} />
        </Field>
      </div>
      <div className="nav-row">
        <span />
        <button type="submit" className="btn btn-primary"><Send size={16} />{t({ en: "Send enquiry", ar: "أرسل الطلب" })}</button>
      </div>
    </form>
  );
}

/* ── Certificate ───────────────────────────────────────── */

export function CertificateView() {
  const t = useT();
  const locale = useLocale();
  const [code, setCode] = useState("");
  const [reg, setReg] = useState<Registration | null>(null);
  const [miss, setMiss] = useState(false);
  const find = () => { const r = findRegistration(code); setReg(r ?? null); setMiss(!r); };
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div className="panel no-print" style={{ display: "grid", gap: 14 }}>
        <p className="q" style={{ marginBottom: 0 }}>{t({ en: "Enter your ticket code", ar: "اكتب كود التذكرة" })}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input dir="ltr" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DZ5-XXXXXX"
            className="field" style={{ flex: "1 1 220px", minWidth: 0, width: "100%", minHeight: 50, padding: "12px 16px", borderRadius: 14, border: 0, background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px var(--line2)", color: "var(--text-c)", font: "inherit", letterSpacing: ".08em" }} />
          <button type="button" className="btn btn-primary" onClick={find}>{t({ en: "Find my certificate", ar: "اعرض شهادتي" })}</button>
        </div>
        {miss && <p className="note"><CircleAlert size={16} />{t({ en: "No ticket with this code on this device. Certificates are issued to registered attendees after the conference.", ar: "لا توجد تذكرة بهذا الكود على هذا الجهاز. تُصدر الشهادات للمسجلين بعد المؤتمر." })}</p>}
      </div>
      {reg && (
        <>
          <div className="cert" id="cert" dir={locale === "ar" ? "rtl" : "ltr"}>
            <div className="cert-in">
              <Wordmark />
              <p className="cert-k">{t({ en: "Certificate of attendance", ar: "شهادة حضور" })}</p>
              <p className="cert-l">{t({ en: "This certifies that", ar: "نشهد بأن" })}</p>
              <p className="cert-name">{reg.name}</p>
              <p className="cert-l">{t({ en: `attended DZAC 5, the ${EVENT.full.en}, on ${EVENT.date.en} at the ${EVENT.venue.en}.`, ar: `قد حضر DZAC 5، ${EVENT.full.ar}، يوم ${EVENT.date.ar} في ${EVENT.venue.ar}.` })}</p>
              <p className="cert-l" style={{ opacity: 0.7 }}>{t(PASSES.find((p) => p.id === reg.pass)!.name)} · <span dir="ltr">{reg.code}</span></p>
              <div className="cert-sign">
                {[LEADERS[0], LEADERS[2]].map((l, i) => (
                  <div key={i}><i /><b>{t(l.name)}</b><small>{t(l.role)}</small></div>
                ))}
              </div>
            </div>
          </div>
          <div className="done-actions no-print">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer size={16} />{t({ en: "Print or save as PDF", ar: "اطبع أو احفظ PDF" })}</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Staff check-in ────────────────────────────────────── */

type Result = { kind: "ok" | "again" | "miss"; reg?: Registration; code: string };

export function CheckInView() {
  const t = useT();
  const locale = useLocale();
  const [code, setCode] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [list, setList] = useState<Registration[]>([]);
  const [scanning, setScanning] = useState(false);
  const [canScan, setCanScan] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const refresh = () => setList(registrations());
  useEffect(() => { refresh(); setCanScan(typeof window !== "undefined" && "BarcodeDetector" in window && !!navigator.mediaDevices); }, []);

  const run = (raw: string) => {
    const m = raw.match(/DZ5-[A-Z0-9]{6}/i);
    const c = (m ? m[0] : raw).trim().toUpperCase();
    if (!c) return;
    const r = checkIn(c);
    setRes({ kind: !r.reg ? "miss" : r.already ? "again" : "ok", reg: r.reg, code: c });
    setCode("");
    refresh();
  };

  /* Camera scanning where the browser has BarcodeDetector; manual entry always works. */
  useEffect(() => {
    if (!scanning) return;
    let stop = false;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!video.current) return;
        video.current.srcObject = stream;
        await video.current.play();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const det = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        const tick = async () => {
          if (stop || !video.current) return;
          const found = await det.detect(video.current).catch(() => []);
          if (found[0]?.rawValue) { run(found[0].rawValue); setScanning(false); return; }
          requestAnimationFrame(tick);
        };
        tick();
      } catch { setScanning(false); }
    })();
    return () => { stop = true; stream?.getTracks().forEach((x) => x.stop()); };
  }, [scanning]);

  const demo = () => {
    const names = ["Dr. Karim Adel", "Dr. Sara Nabil", "Dr. Omar Fathy"];
    names.forEach((n, i) => saveRegistration({ pass: (["conference", "bundle", "masterclass"] as const)[i], category: "specialist", name: n, email: `demo${i}@example.com`, phone: "+20 100 000 000" + i, country: "Egypt", specialty: "Urology", institution: "Demo Hospital" }));
    refresh();
  };

  const inCount = list.filter((r) => r.checkedInAt).length;
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="panel" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input dir="ltr" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === "Enter") run(code); }}
            placeholder="DZ5-XXXXXX" aria-label={t({ en: "Ticket code", ar: "كود التذكرة" })}
            style={{ flex: "1 1 220px", minWidth: 0, width: "100%", minHeight: 54, padding: "12px 16px", borderRadius: 14, border: 0, background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px var(--line2)", color: "var(--text-c)", font: "inherit", fontSize: 18, letterSpacing: ".1em" }} />
          <button type="button" className="btn btn-primary" onClick={() => run(code)}><UserCheck size={17} />{t({ en: "Check in", ar: "تسجيل دخول" })}</button>
          {canScan && <button type="button" className="btn btn-ghost" onClick={() => setScanning((s) => !s)}><Camera size={17} />{scanning ? t({ en: "Stop camera", ar: "أوقف الكاميرا" }) : t({ en: "Scan QR", ar: "امسح QR" })}</button>}
        </div>
        {scanning && <video ref={video} muted playsInline style={{ width: "100%", maxWidth: 420, borderRadius: 16, background: "#000" }} />}
        {res && (
          <motion.div key={res.code + res.kind} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="note" style={{
              fontSize: 16, padding: 18,
              background: res.kind === "ok" ? "rgba(40,200,140,.12)" : res.kind === "again" ? "rgba(217,178,95,.12)" : "rgba(255,90,90,.12)",
              boxShadow: `inset 0 0 0 1px ${res.kind === "ok" ? "rgba(40,200,140,.5)" : res.kind === "again" ? "rgba(217,178,95,.5)" : "rgba(255,90,90,.5)"}`,
            }}>
            {res.kind === "ok" ? <Check size={20} /> : <CircleAlert size={20} />}
            <span>
              <b>{res.kind === "ok" ? t({ en: "Welcome in", ar: "أهلًا بك" }) : res.kind === "again" ? t({ en: "Already checked in", ar: "دخل من قبل" }) : t({ en: "No ticket with this code", ar: "لا توجد تذكرة بهذا الكود" })}</b>
              {res.reg && <> · {res.reg.name} · {t(PASSES.find((p) => p.id === res.reg!.pass)!.name)}</>}
              {res.kind === "again" && res.reg?.checkedInAt && <> · {new Date(res.reg.checkedInAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-GB")}</>}
            </span>
          </motion.div>
        )}
      </div>
      <div className="panel" style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 500 }}><Users size={18} />{t({ en: "Arrived", ar: "الحضور" })}: <span className="u-tnum gold-text" style={{ fontSize: 30, fontFamily: "var(--num)", fontWeight: 300 }}>{inCount} / {list.length}</span></p>
          {list.length === 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={demo}><ScanLine size={15} />{t({ en: "Add 3 demo tickets", ar: "أضف 3 تذاكر تجريبية" })}</button>}
        </div>
        <dl className="summary">
          {list.slice().reverse().slice(0, 12).map((r) => (
            <div key={r.code}><dt dir="ltr" style={{ fontFamily: "ui-monospace, monospace" }}>{r.code}</dt><dd>{r.name} {r.checkedInAt ? "✓" : ""}</dd></div>
          ))}
          {list.length === 0 && <div><dt>{t({ en: "No registrations on this device yet.", ar: "لا توجد تسجيلات على هذا الجهاز بعد." })}</dt><dd /></div>}
        </dl>
        <p className="note"><Info size={16} />{t({ en: "Preview: check-in reads registrations made on this device. At launch it reads the live registration list.", ar: "نسخة تجريبية: يقرأ التسجيلات المحفوظة على هذا الجهاز. عند الإطلاق يقرأ قائمة التسجيل الحية." })}</p>
      </div>
    </div>
  );
}
