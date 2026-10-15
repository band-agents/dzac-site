/**
 * The footage each film is cut from, as paths inside public/. Each slot's
 * frame count is no longer than its clip, so no shot freezes on its last frame.
 */

import type { Clip } from "./films";

export const HERO_CLIPS: Clip[] = [
  { src: "media/video/r1-hotel.mp4", frames: 52 },
  { src: "media/video/r2-registration.mp4", frames: 58 },
  { src: "media/video/r3-hall.mp4", frames: 106 },
  { src: "media/video/r4-future.mp4", frames: 86 },
  { src: "media/video/r5-podium.mp4", frames: 116 },
  { src: "media/video/r6-awards.mp4", frames: 116 },
  { src: "media/video/r7-or.mp4", frames: 72 },
  { src: "media/video/r8-audience.mp4", frames: 82 },
  { src: "media/video/r9-group.mp4", frames: 118 },
];

export const OR_CLIPS = (rtl: boolean): Clip[] => [
  { src: "media/video/m2-or.mp4", frames: 88, caption: rtl ? "المدخل الصفني القضيبي" : "Peno-scrotal approach" },
  { src: "media/video/m3-or.mp4", frames: 72, caption: rtl ? "المدخل فوق العانة" : "Infrapubic approach" },
  { src: "media/video/m1-or.mp4", frames: 58, caption: rtl ? "دخول غرفة العمليات للجميع" : "Scrub-in for all participants" },
  { src: "media/video/m4-team.mp4", frames: 62, caption: rtl ? "محاضرون دوليون" : "International faculty" },
];

export const STING_TEXT = {
  en: { tagline: "The Future of Men's Health Starts Here", date: "14 January 2027" },
  ar: { tagline: "مستقبل صحة الرجل يبدأ من هنا", date: "14 يناير 2027" },
};
