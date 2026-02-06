"use client";

import { usePathname } from "next/navigation";
import { WhatsAppWidget } from "./WhatsAppWidget";

export function ConditionalWhatsAppWidget() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <WhatsAppWidget />;
}
