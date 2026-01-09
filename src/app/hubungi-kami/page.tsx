import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { ContactFormSection } from "@/components/section/contact/ContactFormSection";
import { ContactInfoSection } from "@/components/section/contact/ContactInfoSection";

export const metadata: Metadata = {
    title: "Hubungi Kami | KJPP AKR",
    description: "Hubungi KJPP Amin, Nirwan, Alfiantori & Rekan untuk konsultasi jasa penilaian dan konsultansi properti terpercaya.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="Contact Background"
            />

            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-0 min-h-screen">
                <ContactFormSection />
                <ContactInfoSection />
                <div className="relative z-10">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
