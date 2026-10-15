"use client";

/**
 * Registration: pass → category → details → review, then the e-ticket.
 *
 * The masterclass is for urologists and andrologists, so choosing it skips
 * the category step. Payment connects at launch; the preview says so and
 * issues the ticket straight away. Every step is in the DOM as soon as it is
 * reached; no step waits on an exit animation.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, Info, Printer, Ticket } from "lucide-react";
import { CATEGORIES, EVENT, PASSES, UI, type Category, type L, type PassId } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { page } from "@/lib/paths";
import { findRegistration, icsFile, isEmail, isPhone, saveRegistration, takePrefill, ticketUrl, type Registration } from "@/lib/store";
import { Wordmark } from "../brand";

const COUNTRIES: L[] = [
  { en: "Egypt", ar: "مصر" }, { en: "Saudi Arabia", ar: "السعودية" }, { en: "United Arab Emirates", ar: "الإمارات" },
  { en: "Kuwait", ar: "الكويت" }, { en: "Qatar", ar: "قطر" }, { en: "Bahrain", ar: "البحرين" }, { en: "Oman", ar: "عُمان" },
  { en: "Jordan", ar: "الأردن" }, { en: "Libya", ar: "ليبيا" }, { en: "Iraq", ar: "العراق" }, { en: "Sudan", ar: "السودان" },
  { en: "Lebanon", ar: "لبنان" }, { en: "Italy", ar: "إيطاليا" }, { en: "Other", ar: "دولة أخرى" },
];

const SPECIALTIES: L[] = [
  { en: "Urology", ar: "المسالك البولية" }, { en: "Andrology", ar: "طب الذكورة" }, { en: "Pediatric urology", ar: "مسالك الأطفال" },
  { en: "Endocrinology", ar: "الغدد الصماء" }, { en: "Psychiatry / sexual medicine", ar: "الطب النفسي والجنسي" },
  { en: "Plastic surgery", ar: "الجراحة التجميلية" }, { en: "Reproductive medicine", ar: "طب الإنجاب" }, { en: "Other", ar: "تخصص آخر" },
];

const STEPS: L[] = [
  { en: "Pass", ar: "التذكرة" }, { en: "Category", ar: "الفئة" }, { en: "Your details", ar: "بياناتك" }, { en: "Review", ar: "المراجعة" },
];

const passOf = (id: PassId) => PASSES.find((p) => p.id === id)!;

export function RegisterView() {
  const t = useT();
  const locale = useLocale();
  const params = useSearchParams();
  const initial = params.get("pass");
  const [pass, setPass] = useState<PassId | null>(initial === "conference" || initial === "masterclass" || initial === "bundle" ? initial : null);
  const [category, setCategory] = useState<Category | null>(null);
  const [step, setStep] = useState(pass ? 1 : 0);
  const [f, setF] = useState({ name: "", email: "", phone: "", country: "", specialty: "", institution: "" });
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<Registration | null>(null);

  /* Arriving from the application form: its answers are waiting on this device. */
  useEffect(() => {
    const p = takePrefill();
    if (!p || p.kind !== "register") return;
    setF({ name: p.name ?? "", email: p.email ?? "", phone: p.phone ?? "", country: p.country ?? "", specialty: p.specialty ?? "", institution: p.institution ?? "" });
    if (p.category === "specialist" || p.category === "resident" || p.category === "student") setCategory(p.category);
    setStep(2);
  }, []);

  const isMaster = pass === "masterclass";
  useEffect(() => { if (isMaster) setCategory("specialist"); }, [isMaster]);
  /* The category step does not exist for the masterclass: jump over it both ways. */
  useEffect(() => { if (step === 1 && isMaster) setStep(2); }, [step, isMaster]);

  const bad = {
    name: f.name.trim().length < 3, email: !isEmail(f.email), phone: !isPhone(f.phone),
    country: !f.country, specialty: !f.specialty, institution: f.institution.trim().length < 2,
  };
  const detailsOk = !Object.values(bad).some(Boolean);
  const canNext = [!!pass, !!category, detailsOk, agree][step];

  const next = () => {
    if (step === 2 && !detailsOk) { setTried(true); return; }
    if (step === 3) {
      if (!agree) { setTried(true); return; }
      setDone(saveRegistration({ pass: pass!, category: category!, ...f }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTried(false);
    setStep(step + 1);
  };
  const back = () => setStep(step === 2 && isMaster ? 0 : step - 1);

  if (done) return <Done reg={done} />;

  const Fwd = locale === "ar" ? ArrowLeft : ArrowRight;
  const Bk = locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="panel">
      <ol className="steps" aria-label={t({ en: "Registration steps", ar: "خطوات التسجيل" })}>
        {STEPS.map((s, i) => (
          <li key={i} className={`step${i === step ? " is-on" : i < step ? " is-done" : ""}`} aria-current={i === step ? "step" : undefined}>
            <i /><span>{String(i + 1).padStart(2, "0")} · {t(s)}</span>
          </li>
        ))}
      </ol>

      <motion.div key={step} initial={{ opacity: 0, x: locale === "ar" ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        {step === 0 && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="q">{t({ en: "Which pass?", ar: "أي تذكرة؟" })}</legend>
            <div className="opts">
              {PASSES.map((p) => (
                <label key={p.id} className={`opt${pass === p.id ? " is-on" : ""}${p.featured ? " is-gold" : ""}`}>
                  <input type="radio" name="pass" checked={pass === p.id} onChange={() => setPass(p.id)} />
                  <b>{t(p.name)}</b>
                  <span className="opt-price">{t(p.price)}</span>
                  {p.note && <small>{t(p.note)}</small>}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && !isMaster && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="q">{t({ en: "You are registering as", ar: "تسجّل بصفتك" })}</legend>
            <div className="opts">
              {CATEGORIES.map((c) => (
                <label key={c.id} className={`opt${category === c.id ? " is-on" : ""}`}>
                  <input type="radio" name="cat" checked={category === c.id} onChange={() => setCategory(c.id)} />
                  <b>{t(c.label)}</b>
                  <small>{t(c.hint)}</small>
                </label>
              ))}
            </div>
            <p className="note" style={{ marginTop: 18 }}><Info size={16} />{t({ en: "Early-bird prices for each category are announced soon.", ar: "أسعار الحجز المبكر لكل فئة تُعلن قريبًا." })}</p>
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <p className="q">{t({ en: "Your details", ar: "بياناتك" })}</p>
            {isMaster && <p className="note" style={{ marginBottom: 18 }}><Info size={16} />{t({ en: "The masterclass is for urologists and andrologists. Seats are limited.", ar: "الماستر كلاس لأطباء المسالك البولية والذكورة. المقاعد محدودة." })}</p>}
            <div className="form">
              <Field label={t({ en: "Full name, as it should appear on your certificate", ar: "الاسم بالكامل كما يظهر في الشهادة" })} bad={tried && bad.name} err={t({ en: "Please enter your full name", ar: "اكتب اسمك بالكامل" })} full>
                <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
              </Field>
              <Field label={t({ en: "Email", ar: "البريد الإلكتروني" })} bad={tried && bad.email} err={t({ en: "Check the email address", ar: "راجع البريد الإلكتروني" })}>
                <input type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
              </Field>
              <Field label={t({ en: "Mobile, with country code", ar: "الموبايل مع كود الدولة" })} bad={tried && bad.phone} err={t({ en: "Check the number", ar: "راجع الرقم" })}>
                <input type="tel" dir="ltr" placeholder="+20 1X XXXX XXXX" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />
              </Field>
              <Field label={t({ en: "Country", ar: "الدولة" })} bad={tried && bad.country} err={t({ en: "Choose a country", ar: "اختر الدولة" })}>
                <select value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}>
                  <option value="">{t({ en: "Choose", ar: "اختر" })}</option>
                  {COUNTRIES.map((c) => <option key={c.en} value={c.en}>{t(c)}</option>)}
                </select>
              </Field>
              <Field label={t({ en: "Specialty", ar: "التخصص" })} bad={tried && bad.specialty} err={t({ en: "Choose a specialty", ar: "اختر التخصص" })}>
                <select value={f.specialty} onChange={(e) => setF({ ...f, specialty: e.target.value })}>
                  <option value="">{t({ en: "Choose", ar: "اختر" })}</option>
                  {SPECIALTIES.map((c) => <option key={c.en} value={c.en}>{t(c)}</option>)}
                </select>
              </Field>
              <Field label={t({ en: "Hospital, university or clinic", ar: "المستشفى أو الجامعة أو العيادة" })} bad={tried && bad.institution} err={t({ en: "Please fill this in", ar: "اكتب جهة العمل" })} full>
                <input value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} autoComplete="organization" />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && pass && category && (
          <div style={{ display: "grid", gap: 18 }}>
            <p className="q">{t({ en: "Check and confirm", ar: "راجع وأكّد" })}</p>
            <dl className="summary">
              <div><dt>{t({ en: "Pass", ar: "التذكرة" })}</dt><dd>{t(passOf(pass).name)}</dd></div>
              <div><dt>{t({ en: "Category", ar: "الفئة" })}</dt><dd>{t(CATEGORIES.find((c) => c.id === category)!.label)}</dd></div>
              <div><dt>{t({ en: "Name", ar: "الاسم" })}</dt><dd>{f.name}</dd></div>
              <div><dt>{t({ en: "Email", ar: "البريد" })}</dt><dd dir="ltr">{f.email}</dd></div>
              <div><dt>{t({ en: "Mobile", ar: "الموبايل" })}</dt><dd dir="ltr">{f.phone}</dd></div>
              <div><dt>{t({ en: "Fee", ar: "الرسوم" })}</dt><dd>{pass === "masterclass" ? `${t(passOf(pass).price)} · ${t(UI.provisional)}` : t(UI.tba)}</dd></div>
            </dl>
            <p className="note"><Info size={16} />{t(UI.demo)}</p>
            <label className={`field${tried && !agree ? " is-bad" : ""}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 20, minHeight: 20, marginTop: 3 }} />
              <span style={{ fontWeight: 400, color: "var(--text-c)" }}>{t({ en: "I confirm these details are correct and agree to be contacted about DZAC 5.", ar: "أؤكد صحة البيانات وأوافق على التواصل معي بخصوص DZAC 5." })}</span>
            </label>
          </div>
        )}
      </motion.div>

      <div className="nav-row">
        {step > 0 ? <button type="button" className="btn btn-ghost" onClick={back}><Bk size={16} />{t({ en: "Back", ar: "رجوع" })}</button> : <span />}
        <button type="button" className={`btn ${step === 3 ? "btn-primary" : "btn-ghost"}`} onClick={next} disabled={step < 2 && !canNext}
          style={step < 2 && !canNext ? { opacity: 0.4, cursor: "not-allowed" } : undefined}>
          {step === 3 ? <><Ticket size={16} />{t({ en: "Confirm registration", ar: "تأكيد التسجيل" })}</> : <>{t({ en: "Continue", ar: "متابعة" })}<Fwd size={16} /></>}
        </button>
      </div>
    </div>
  );
}

function Field({ label, bad, err, full, children }: { label: string; bad?: boolean; err?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field${bad ? " is-bad" : ""}${full ? " full" : ""}`}>
      <span>{label}</span>
      {children}
      {bad && err && <em>{err}</em>}
    </label>
  );
}

/* ── The e-ticket ──────────────────────────────────────── */

export function TicketCard({ reg }: { reg: Registration }) {
  const t = useT();
  const locale = useLocale();
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(ticketUrl(reg.code, locale), { margin: 1, width: 360, color: { dark: "#050914", light: "#FFFFFF" } }).then(setQr);
  }, [reg.code, locale]);
  const cat = CATEGORIES.find((c) => c.id === reg.category);
  return (
    <article className="ticket">
      <div className="ticket-main">
        <Wordmark />
        <div className="ticket-who">
          <b>{reg.name}</b>
          <span>{reg.specialty} · {reg.institution}</span>
        </div>
        <div className="ticket-meta">
          <div><small>{t({ en: "Pass", ar: "التذكرة" })}</small><b>{t(passOf(reg.pass).name)}</b></div>
          <div><small>{t({ en: "Category", ar: "الفئة" })}</small><b>{cat ? t(cat.label) : ""}</b></div>
          <div><small>{t({ en: "Date", ar: "التاريخ" })}</small><b>{t(EVENT.date)}</b></div>
          <div><small>{t({ en: "Venue", ar: "المكان" })}</small><b>{t(EVENT.venue)}</b></div>
        </div>
      </div>
      <div className="ticket-qr">
        {qr ? <img src={qr} alt={t({ en: `QR code for ticket ${reg.code}`, ar: `رمز QR للتذكرة ${reg.code}` })} /> : <div style={{ width: 180, height: 180 }} />}
        <code>{reg.code}</code>
      </div>
    </article>
  );
}

function Done({ reg }: { reg: Registration }) {
  const t = useT();
  const locale = useLocale();
  const ics = useMemo(() => icsFile(`DZAC 5 · ${EVENT.full.en}`, EVENT.venue.en), []);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gap: 10 }}>
        <p className="kicker"><Check size={14} /> {t({ en: "You're registered", ar: "تم تسجيلك" })}</p>
        <h2 className="h2">{t({ en: "See you on 14 January.", ar: "نراك يوم 14 يناير." })}</h2>
        <p className="lead">{t({ en: "Show this QR code at the door. We have also kept it on this page so you can come back to it.", ar: "اعرض رمز QR عند الدخول. حفظناه في هذه الصفحة لتعود إليه في أي وقت." })}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} style={{ perspective: 1200 }}>
        <TicketCard reg={reg} />
      </motion.div>
      <p className="note"><Info size={16} />{t(UI.demo)}</p>
      <div className="done-actions no-print">
        <Link className="btn btn-primary" href={`${page(locale, "ticket")}?c=${reg.code}`}><Ticket size={16} />{t({ en: "Open my ticket", ar: "افتح تذكرتي" })}</Link>
        <a className="btn btn-ghost" href={ics} download="DZAC5.ics"><CalendarPlus size={16} />{t({ en: "Add to calendar", ar: "أضف للتقويم" })}</a>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} />{t({ en: "Print", ar: "اطبع" })}</button>
      </div>
    </div>
  );
}

export function TicketView() {
  const t = useT();
  const locale = useLocale();
  const params = useSearchParams();
  const code = params.get("c") ?? "";
  const [reg, setReg] = useState<Registration | null | undefined>(undefined);
  useEffect(() => { setReg(code ? findRegistration(code) ?? null : null); }, [code]);
  if (reg === undefined) return <div className="panel" style={{ minHeight: 280 }} />;
  if (!reg) {
    return (
      <div className="panel" style={{ display: "grid", gap: 16 }}>
        <p className="q">{t({ en: "We can't find this ticket here", ar: "لا نجد هذه التذكرة هنا" })}</p>
        <p className="lead">{t({ en: "In this preview, tickets are kept on the device you registered from. At launch every ticket will open anywhere.", ar: "في هذه النسخة التجريبية تُحفظ التذاكر على الجهاز الذي سجّلت منه. عند الإطلاق ستفتح كل تذكرة من أي مكان." })}</p>
        <Link className="btn btn-primary" style={{ justifySelf: "start" }} href={page(locale, "register")}>{t(UI.register)}</Link>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <TicketCard reg={reg} />
      {reg.checkedInAt && <p className="note"><Check size={16} />{t({ en: "Checked in at", ar: "تم الدخول في" })} {new Date(reg.checkedInAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB")}</p>}
      <div className="done-actions no-print">
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} />{t({ en: "Print", ar: "اطبع" })}</button>
      </div>
    </div>
  );
}

