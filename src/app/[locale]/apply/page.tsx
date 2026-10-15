import { Suspense } from "react";
import { meta } from "@/lib/meta";
import { ApplyPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Apply", ar: "التقديم" });
export default function Page() { return <Suspense><ApplyPage /></Suspense>; }
