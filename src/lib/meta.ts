import type { Metadata } from "next";
import type { L } from "@/content/site";
import { isLocale } from "./paths";

/** A page's <title>, in its language. */
export const meta = (title: L) => async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
  const { locale } = await params;
  return { title: title[isLocale(locale) ? locale : "en"] };
};
