import type { ReactNode } from "react";

export const metadata = { title: "DZAC 5", robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050914", color: "#EAF0FA", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
