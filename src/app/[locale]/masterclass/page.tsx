import { meta } from "@/lib/meta";
import { MasterclassView } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Masterclass", ar: "الماستر كلاس" });
export default function Page() { return <MasterclassView />; }
