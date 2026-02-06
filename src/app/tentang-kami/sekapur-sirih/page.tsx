import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { SekapurSirihSection } from "@/components/section/tentang-kami/SekapurSirihSection";

export const metadata = {
    title: "Sekapur Sirih - KJPP AKR | Sejarah & Profil Perusahaan",
    description: "Mengenal lebih dekat KJPP AKR, sejarah perjalanan, dan komitmen kami dalam memberikan layanan penilaian properti profesional sejak berdiri.",
};

export default function SekapurSirihPage() {
    return (
        <div className="min-h-screen bg-bg-1">
            <Navbar />
            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="Sekapur Sirih Background"
            />
            <div className="overflow-x-hidden">
                <SekapurSirihSection />
                <div className="relative z-10 -mt-20">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
