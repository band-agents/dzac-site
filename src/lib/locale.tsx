"use client";

/**
 * The page's language, for client components. Server components take the
 * locale from the route params instead and call `pick` directly.
 */

import { createContext, useContext, type ReactNode } from "react";
import type { L, Locale } from "@/content/site";

const Ctx = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}

/** `t(x)` picks the current language from an `{ en, ar }` pair. */
export function useT() {
  const locale = useContext(Ctx);
  return (x: L) => x[locale];
}
