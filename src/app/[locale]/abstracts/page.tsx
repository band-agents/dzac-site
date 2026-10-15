import { meta } from "@/lib/meta";
import { AbstractsView } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Submit an abstract", ar: "قدّم ملخصًا" });
export default function Page() { return <AbstractsView />; }
