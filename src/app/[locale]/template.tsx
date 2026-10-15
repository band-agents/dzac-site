import type { ReactNode } from "react";

/** Pages render as they are: no page-wide fade, which cost a full-page layer on every load. */
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
