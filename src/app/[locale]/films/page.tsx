import { meta } from "@/lib/meta";
import { FilmsPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Films", ar: "الأفلام" });
export default function Page() { return <FilmsPage />; }
