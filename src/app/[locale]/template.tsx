"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Every page arrives with a short rise. Content is in the DOM from the first frame. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
