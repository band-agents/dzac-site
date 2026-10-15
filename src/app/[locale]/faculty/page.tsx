import { meta } from "@/lib/meta";
import { FacultyView } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Faculty", ar: "المحاضرون" });
export default function Page() { return <FacultyView />; }
