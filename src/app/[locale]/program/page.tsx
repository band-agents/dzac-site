import { meta } from "@/lib/meta";
import { ProgramView } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Program", ar: "البرنامج" });
export default function Page() { return <ProgramView />; }
