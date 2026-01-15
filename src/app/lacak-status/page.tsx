import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LacakStatusSection } from "@/components/section/lacak-status/LacakStatusSection";

export const metadata: Metadata = {
    title: "Lacak Status | KJPP AKR",
    description: "Lacak status permohonan penilaian properti di KJPP AKR.",
};

export default function LacakStatusPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat relative"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(30, 41, 59, 0.6), rgba(30, 41, 59, 0.7)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
                }}
            >
                <LacakStatusSection />
            </div>

            <div className="relative z-10 -mt-25">
                <Footer />
            </div>
        </div>
    );
}
