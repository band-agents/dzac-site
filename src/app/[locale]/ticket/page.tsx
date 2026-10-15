import { Suspense } from "react";
import { meta } from "@/lib/meta";
import { TicketPage } from "@/components/views/Pages";

export const generateMetadata = meta({ en: "Your ticket", ar: "تذكرتك" });
export default function Page() { return <Suspense><TicketPage /></Suspense>; }
