import { meta } from "@/lib/meta";
import { PartnersView } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Partners", ar: "الشركاء" });
export default function Page() { return <PartnersView />; }
