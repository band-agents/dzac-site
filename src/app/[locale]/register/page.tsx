import { Suspense } from "react";
import { meta } from "@/lib/meta";
import { RegisterPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Register", ar: "التسجيل" });
export default function Page() { return <Suspense><RegisterPage /></Suspense>; }
