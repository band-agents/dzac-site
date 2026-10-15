import { meta } from "@/lib/meta";
import { GalleryPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Gallery", ar: "الصور" });
export default function Page() { return <GalleryPage />; }
