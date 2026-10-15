/**
 * The application form: who is applying, for what, and the questions each
 * path asks. The engine in components/views/Apply.tsx decides which steps to
 * show from the answers so far; nothing here is shown to every applicant.
 */

import type { L } from "./site";

export type Intent = "attend" | "masterclass" | "speak" | "partner" | "media";

export type Option = { id: string; label: L; hint?: L; icon?: string };

export const INTENTS: Option[] = [
  { id: "attend", icon: "Ticket", label: { en: "Attend the conference", ar: "حضور المؤتمر" }, hint: { en: "Doctors, residents and students", ar: "الأطباء والمقيمون والطلاب" } },
  { id: "masterclass", icon: "Stethoscope", label: { en: "A seat in the masterclass", ar: "مقعد في الماستر كلاس" }, hint: { en: "Live implant surgery, limited seats", ar: "جراحات زراعة حية، مقاعد محدودة" } },
  { id: "speak", icon: "Mic", label: { en: "Present or speak", ar: "تقديم بحث أو محاضرة" }, hint: { en: "Oral, poster or surgical video", ar: "عرض شفهي أو بوستر أو فيديو جراحي" } },
  { id: "partner", icon: "Gem", label: { en: "Partner or exhibit", ar: "شراكة أو عرض" }, hint: { en: "Companies, pharma and universities", ar: "الشركات والأدوية والجامعات" } },
  { id: "media", icon: "Camera", label: { en: "Press and media", ar: "الصحافة والإعلام" }, hint: { en: "Coverage and interviews", ar: "التغطية واللقاءات" } },
];

export const ROLES: Option[] = [
  { id: "specialist", label: { en: "Consultant or specialist", ar: "استشاري أو أخصائي" } },
  { id: "resident", label: { en: "Resident", ar: "طبيب مقيم" } },
  { id: "student", label: { en: "Medical student", ar: "طالب طب" } },
];

export const SPECIALTIES: Option[] = [
  { id: "urology", label: { en: "Urology", ar: "المسالك البولية" } },
  { id: "andrology", label: { en: "Andrology", ar: "طب الذكورة" } },
  { id: "pediatric", label: { en: "Pediatric urology", ar: "مسالك الأطفال" } },
  { id: "endocrinology", label: { en: "Endocrinology", ar: "الغدد الصماء" } },
  { id: "psychiatry", label: { en: "Psychiatry and sexual medicine", ar: "الطب النفسي والجنسي" } },
  { id: "reproductive", label: { en: "Reproductive medicine", ar: "طب الإنجاب" } },
  { id: "plastic", label: { en: "Plastic surgery", ar: "الجراحة التجميلية" } },
  { id: "family", label: { en: "Family or general medicine", ar: "طب الأسرة أو الممارس العام" } },
  { id: "other", label: { en: "Other", ar: "تخصص آخر" } },
];

/** The masterclass is for these specialties. */
export const SURGICAL = ["urology", "andrology"];

export const INTERESTS: Option[] = [
  { id: "pediatrics", label: { en: "Pediatrics", ar: "ذكورة الأطفال" } },
  { id: "endo", label: { en: "Endocrinology and psychosexual medicine", ar: "الغدد والطب النفسي الجنسي" } },
  { id: "andrology", label: { en: "Andrology", ar: "طب الذكورة" } },
  { id: "infertility", label: { en: "Debates in infertility", ar: "جدل العقم" } },
  { id: "genetics", label: { en: "Genetics and regenerative medicine", ar: "الجينات والطب التجديدي" } },
  { id: "urology", label: { en: "Urology", ar: "المسالك البولية" } },
  { id: "wellness", label: { en: "Wellness and lifestyle", ar: "العافية ونمط الحياة" } },
  { id: "aesthetic", label: { en: "Plastic and aesthetic surgery", ar: "الجراحة التجميلية" } },
  { id: "sport", label: { en: "Sports medicine", ar: "الطب الرياضي" } },
  { id: "nutrition", label: { en: "Nutrition and metabolism", ar: "التغذية والتمثيل الغذائي" } },
  { id: "tech", label: { en: "AI and digital tools", ar: "الذكاء الاصطناعي والأدوات الرقمية" } },
];

export const YESNO: Option[] = [
  { id: "yes", label: { en: "Yes, I'd like a seat", ar: "نعم، أريد مقعدًا" } },
  { id: "maybe", label: { en: "Tell me more first", ar: "أريد معرفة المزيد أولًا" } },
  { id: "no", label: { en: "Not this time", ar: "ليس هذه المرة" } },
];

export const YEARS: Option[] = [
  { id: "lt5", label: { en: "Under 5 years", ar: "أقل من 5 سنوات" } },
  { id: "5-10", label: { en: "5 to 10 years", ar: "من 5 إلى 10 سنوات" } },
  { id: "10-20", label: { en: "10 to 20 years", ar: "من 10 إلى 20 سنة" } },
  { id: "20+", label: { en: "Over 20 years", ar: "أكثر من 20 سنة" } },
];

export const IMPLANTS: Option[] = [
  { id: "0", label: { en: "None yet", ar: "لم أُجرِ أي عملية بعد" }, hint: { en: "You want to start", ar: "تريد أن تبدأ" } },
  { id: "1-10", label: { en: "1 to 10", ar: "من 1 إلى 10" }, hint: { en: "Early experience", ar: "خبرة أولى" } },
  { id: "11-50", label: { en: "11 to 50", ar: "من 11 إلى 50" }, hint: { en: "Regular practice", ar: "ممارسة منتظمة" } },
  { id: "50+", label: { en: "More than 50", ar: "أكثر من 50" }, hint: { en: "High volume", ar: "حجم كبير" } },
];

export const APPROACHES: Option[] = [
  { id: "penoscrotal", label: { en: "Peno-scrotal", ar: "المدخل الصفني القضيبي" } },
  { id: "infrapubic", label: { en: "Infrapubic", ar: "المدخل فوق العانة" } },
  { id: "both", label: { en: "Both", ar: "الاثنان" } },
];

export const TRACK_OPTIONS: Option[] = INTERESTS.slice(0, 6);

export const FORMATS: Option[] = [
  { id: "oral", label: { en: "Oral presentation", ar: "عرض شفهي" } },
  { id: "poster", label: { en: "Poster", ar: "بوستر" } },
  { id: "video", label: { en: "Surgical video", ar: "فيديو جراحي" } },
];

export const ORG_TYPES: Option[] = [
  { id: "device", label: { en: "Prosthesis or stent company", ar: "شركة دعامات أو أطراف تعويضية" } },
  { id: "pharma", label: { en: "Pharma", ar: "شركة أدوية" }, hint: { en: "Hormones, injections, medications", ar: "الهرمونات والحقن والعلاجات" } },
  { id: "university", label: { en: "University or academic body", ar: "جامعة أو جهة أكاديمية" } },
  { id: "clinic", label: { en: "Hospital or clinic", ar: "مستشفى أو عيادة" } },
  { id: "other", label: { en: "Something else", ar: "جهة أخرى" } },
];

export const GOALS: Option[] = [
  { id: "visibility", label: { en: "Brand visibility", ar: "ظهور العلامة" } },
  { id: "booth", label: { en: "An exhibition booth", ar: "جناح في المعرض" } },
  { id: "stage", label: { en: "A talk on stage", ar: "كلمة على المنصة" } },
  { id: "screen", label: { en: "A video on the screens", ar: "فيديو على الشاشات" } },
  { id: "meet", label: { en: "Meeting surgeons", ar: "لقاء الجراحين" } },
  { id: "recruit", label: { en: "Recruiting students", ar: "استقطاب الطلاب" } },
  { id: "posters", label: { en: "Showing research posters", ar: "عرض بوسترات بحثية" } },
];

export const PRESENCE: Option[] = [
  { id: "flagship", label: { en: "Flagship", ar: "حضور رئيسي" }, hint: { en: "The most visible partner in the room", ar: "الشريك الأبرز في القاعة" } },
  { id: "standard", label: { en: "Standard", ar: "حضور قياسي" }, hint: { en: "A clear, steady presence", ar: "حضور واضح وثابت" } },
  { id: "focused", label: { en: "Focused", ar: "حضور مركّز" }, hint: { en: "One or two things done well", ar: "شيء أو اثنان بإتقان" } },
];

export const OUTLETS: Option[] = [
  { id: "tv", label: { en: "TV or health program", ar: "برنامج تلفزيوني أو صحي" } },
  { id: "digital", label: { en: "Digital publication", ar: "منصة رقمية" } },
  { id: "creator", label: { en: "Creator or influencer", ar: "صانع محتوى أو مؤثر" } },
  { id: "print", label: { en: "Magazine or newspaper", ar: "مجلة أو صحيفة" } },
];

export const AUDIENCE: Option[] = [
  { id: "lt50k", label: { en: "Under 50,000", ar: "أقل من 50,000" } },
  { id: "50-500k", label: { en: "50,000 to 500,000", ar: "من 50,000 إلى 500,000" } },
  { id: "500k+", label: { en: "Over 500,000", ar: "أكثر من 500,000" } },
];

export const COVERAGE: Option[] = [
  { id: "interviews", label: { en: "Interviews with the faculty", ar: "لقاءات مع المحاضرين" } },
  { id: "lounge", label: { en: "Men's Lounge Talks", ar: "حوارات Men's Lounge" } },
  { id: "masterclass", label: { en: "The masterclass", ar: "الماستر كلاس" } },
  { id: "press", label: { en: "The press conference", ar: "المؤتمر الصحفي" } },
  { id: "recaps", label: { en: "Daily recaps", ar: "ملخصات يومية" } },
];

export const COUNTRIES: { id: string; dial: string; label: L }[] = [
  { id: "EG", dial: "+20", label: { en: "Egypt", ar: "مصر" } },
  { id: "SA", dial: "+966", label: { en: "Saudi Arabia", ar: "السعودية" } },
  { id: "AE", dial: "+971", label: { en: "United Arab Emirates", ar: "الإمارات" } },
  { id: "KW", dial: "+965", label: { en: "Kuwait", ar: "الكويت" } },
  { id: "QA", dial: "+974", label: { en: "Qatar", ar: "قطر" } },
  { id: "BH", dial: "+973", label: { en: "Bahrain", ar: "البحرين" } },
  { id: "OM", dial: "+968", label: { en: "Oman", ar: "عُمان" } },
  { id: "JO", dial: "+962", label: { en: "Jordan", ar: "الأردن" } },
  { id: "LY", dial: "+218", label: { en: "Libya", ar: "ليبيا" } },
  { id: "IQ", dial: "+964", label: { en: "Iraq", ar: "العراق" } },
  { id: "SD", dial: "+249", label: { en: "Sudan", ar: "السودان" } },
  { id: "LB", dial: "+961", label: { en: "Lebanon", ar: "لبنان" } },
  { id: "IT", dial: "+39", label: { en: "Italy", ar: "إيطاليا" } },
  { id: "GB", dial: "+44", label: { en: "United Kingdom", ar: "المملكة المتحدة" } },
  { id: "XX", dial: "+", label: { en: "Another country", ar: "دولة أخرى" } },
];

/** Step titles, in the applicant's words. */
export const Q = {
  intent: { en: "What would you like to apply for?", ar: "ما الذي تريد التقديم عليه؟" },
  role: { en: "Where are you in your career?", ar: "أين أنت في مسيرتك المهنية؟" },
  specialty: { en: "Your specialty", ar: "تخصصك" },
  interests: { en: "Which sessions matter most to you?", ar: "أي الجلسات تهمك أكثر؟" },
  interestsHint: { en: "Choose as many as you like. We'll build your agenda from them.", ar: "اختر ما تشاء، وسنبني برنامجك منها." },
  masterclassToo: { en: "Would you also like a seat in the live-surgery masterclass?", ar: "هل تريد أيضًا مقعدًا في ماستر كلاس الجراحات الحية؟" },
  years: { en: "How long have you been in practice?", ar: "منذ متى تمارس المهنة؟" },
  implants: { en: "How many penile implants have you performed?", ar: "كم عملية زراعة دعامة أجريت حتى الآن؟" },
  approach: { en: "Which approach do you want to train in?", ar: "أي مدخل جراحي تريد التدرب عليه؟" },
  goal: { en: "What would make this masterclass worth it for you?", ar: "ما الذي يجعل هذا الماستر كلاس مفيدًا لك؟" },
  goalHint: { en: "Optional. One or two lines help the faculty plan the cases.", ar: "اختياري. سطر أو اثنان يساعدان المحاضرين على تخطيط الحالات." },
  track: { en: "Which track is your work in?", ar: "في أي مسار يقع عملك؟" },
  format: { en: "How would you like to present it?", ar: "كيف تريد عرضه؟" },
  pitch: { en: "Tell us about it", ar: "حدّثنا عنه" },
  orgType: { en: "What kind of organisation are you?", ar: "ما نوع جهتك؟" },
  goals: { en: "What do you want from DZAC 5?", ar: "ماذا تريد من DZAC 5؟" },
  presence: { en: "How big a presence are you planning?", ar: "ما حجم الحضور الذي تخطط له؟" },
  outlet: { en: "Who are you reporting for?", ar: "لأي جهة تغطي؟" },
  audience: { en: "Your outlet and its audience", ar: "جهتك وحجم جمهورها" },
  coverage: { en: "What would you like to cover?", ar: "ماذا تريد أن تغطي؟" },
  details: { en: "And finally, how do we reach you?", ar: "وأخيرًا، كيف نتواصل معك؟" },
  review: { en: "Review your application", ar: "راجع طلبك" },
};
