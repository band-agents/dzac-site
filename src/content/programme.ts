/**
 * The draft scientific programme, from the client's deck (DZAC5_Presentation,
 * programme page): three talks and a discussion per track. Session titles are
 * kept in English, as they will be presented; a blank speaker is still to be
 * confirmed. The design file carries the same list.
 */

import type { L } from "./site";

export type Session = { title: string; speaker: string };

export const SESSIONS: Record<string, Session[]> = {
  "01": [
    { title: "Complications of Neonatal Circumcision: Advanced Reconstructive Surgery for Iatrogenic Penile Injuries", speaker: "Prof. Dr. Galal El-Shorbagy" },
    { title: "Idiopathic Hypogonadotropic Hypogonadism (IHH) in Children: Early Diagnostic Markers Before the Age of Puberty", speaker: "Prof. Dr. Salah Nagla" },
    { title: "Precocious vs. Delayed Puberty: Modern Endocrine Workup and Impact on Final Adult Height and Fertility", speaker: "Prof. Dr. Yasmeen Ashraf" },
  ],
  "02": [
    { title: "Testosterone and the Brain: The Impact of Hypogonadism on Cognitive Decline and Mood Disorders in Aging Men", speaker: "" },
    { title: "Selective Estrogen Receptor Modulators (SERMs) vs. HCG: Optimizing Medical Therapy for Hypogonadotropic Hypogonadism", speaker: "" },
    { title: "Digital Detox and Sexual Health: Addressing Porn-Induced Erectile Dysfunction (PIED) in Gen Z", speaker: "" },
  ],
  "03": [
    { title: "Penile Size Preservation Protocols: Combining Vacuum Devices, Traction, and Aggressive Sizing to Prevent Post-Implant Shortening", speaker: "Prof. Dr. David Ralph" },
    { title: "Penile Prosthesis Combined with Grafting for Severe Peyronie's Disease: One-Stage Correction of Curvature and ED", speaker: "Prof. Dr. Paul Perito" },
    { title: "Ectopic Reservoir Placement in Inflatable Penile Prosthesis (IPP): Avoiding Vascular and Visceral Injuries in the High-Submuscular Space", speaker: "Prof. Dr. Gabriele Antonini" },
  ],
  "04": [
    { title: "The \"Non-Responder\" in Micro-TESE: Advanced Testicular Mapping Protocols Before a Second Rescue Attempt", speaker: "Prof. Dr. Yasser Mesbah" },
    { title: "Subclinical Varicocele: To Operate or Not to Operate in the Era of Assisted Reproductive Technology (ART)?", speaker: "Prof. Dr. Ayman Rashed" },
    { title: "Early vs. Delayed Varicocelectomy in Adolescents: Global Consensus from the Arab and Asian Associations", speaker: "Prof. Dr. Majed Ragab" },
  ],
  "05": [
    { title: "The Epigenetic Impact of Male Obesity: How Paternal Weight Affects the Health of Future Generations", speaker: "" },
    { title: "Regenerative Medicine in Erectile Dysfunction: Stem Cells, Exosomes, and PRP under the Microscope of Global Societies", speaker: "Prof. Dr. Mohammed ElHefnawy" },
    { title: "The Resurgence of Topical and Non-Invasive Therapies for Early-Stage Peyronie's Disease", speaker: "Prof. Dr. Ahmed ElAssemy" },
  ],
  "06": [
    { title: "Navigating the challenges: Complications associated with flexible ureteroscopy", speaker: "Prof. Dr. Ahmed Yehia" },
    { title: "AEEP: from surgical alternative to surgical standard", speaker: "Prof. Dr. Ismail Fattouh Rady" },
    { title: "Rethinking LUTS: when the pelvic floor matters", speaker: "Prof. Dr. Samuel Ibrahim" },
  ],
};

export const P = {
  talks: { en: "3 talks + discussion", ar: "3 محاضرات ونقاش" } as L,
  discussion: { en: "Discussion", ar: "نقاش" } as L,
  tbc: { en: "Speaker to be confirmed", ar: "المحاضر قيد التأكيد" } as L,
};
