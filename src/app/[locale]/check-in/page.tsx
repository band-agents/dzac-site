import { meta } from "@/lib/meta";
import { CheckInPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Check-in", ar: "تسجيل الدخول" });
export default function Page() { return <CheckInPage />; }
