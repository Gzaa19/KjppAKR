import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { LacakStatusSection } from "@/components/section/lacak-status/LacakStatusSection";

export const metadata: Metadata = {
    title: "Lacak Status | KJPP AKR",
    description: "Lacak status permohonan penilaian properti di KJPP AKR.",
};

export default function LacakStatusPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="Contact Background"
            />

            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-0 min-h-screen">
                <LacakStatusSection />

                <div className="relative z-10">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
