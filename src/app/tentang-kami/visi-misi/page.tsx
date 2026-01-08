import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { VisiMisiSection } from "@/components/section/tentang-kami/VisiMisiSection";
import { BudayaSection } from "@/components/section/tentang-kami/BudayaSection";

export const metadata = {
    title: "Visi Misi - KJPP AKR",
    description: "Visi, Misi, dan Budaya Perusahaan KJPP Anas Karim Rivai & Rekan.",
};

export default function VisiMisiPage() {
    return (
        <div className="min-h-screen bg-bg-1">
            <Navbar />
            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                alt="Visi Misi Background"
            />

            <div className="overflow-x-hidden">
                <VisiMisiSection />
                <BudayaSection />
                <div className="relative z-10 -mt-20">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
