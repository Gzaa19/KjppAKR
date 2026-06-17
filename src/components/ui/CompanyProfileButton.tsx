"use client";

import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

interface CompanyProfileButtonProps {
    variant?: "hero" | "card" | "footer";
    className?: string;
    label?: string;
}

const VARIANT_LABELS: Record<string, string> = {
    hero: "COMPANY PROFILE",
    card: "Download PDF",
    footer: "Company Profile",
};

export function CompanyProfileButton({ variant = "card", className, label }: CompanyProfileButtonProps) {
    const { downloadUrl, loading } = useCompanyProfile();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (!downloadUrl) {
            e.preventDefault();
            toast.error("Maaf, dokumen sedang tidak tersedia", {
                description: "Company Profile belum tersedia saat ini. Silakan coba lagi nanti.",
                duration: 4000,
            });
        }
    };

    const variantStyles: Record<string, string> = {
        hero: "h-16 px-14 text-base font-bold bg-kjpp-red text-white hover:bg-kjpp-red/90 transition-all duration-300 shadow-xl hover:shadow-2xl",
        card: "bg-white text-kjpp-dark hover:bg-white/95 px-8 py-6 text-base font-semibold rounded-full shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group shrink-0",
        footer: "bg-kjpp-red text-white px-8 py-6 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group",
    };

    const buttonClass = className || variantStyles[variant];
    const buttonLabel = label || VARIANT_LABELS[variant];

    if (loading) return null;

    if (downloadUrl) {
        return (
            <Button asChild size="lg" className={buttonClass}>
                <a href={downloadUrl} download="Company-Profile-KJPP-AKR.pdf" className="flex items-center gap-2.5">
                    <FileDown className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    {buttonLabel}
                </a>
            </Button>
        );
    }

    // No PDF uploaded — still show button but with click warning
    return (
        <Button size="lg" className={buttonClass} onClick={handleClick}>
            <FileDown className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-y-0.5" />
            {buttonLabel}
        </Button>
    );
}
