import { meta } from "@/lib/meta";
import { CertificatePage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Certificate", ar: "الشهادة" });
export default function Page() { return <CertificatePage />; }
