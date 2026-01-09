import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { ManajemenSection } from "@/components/section/tentang-kami/ManajemenSection";

export const metadata = {
    title: "Manajemen - KJPP AKR | Tim Profesional Berpengalaman",
    description: "Profil pimpinan dan tim manajemen KJPP AKR yang berpengalaman dalam industri penilaian properti dan aset di Indonesia.",
};

export default function ManajemenPage() {
    return (
        <div className="min-h-screen bg-bg-1">
            <Navbar />
            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop"
                alt="Manajemen Background"
            />
            <div className="overflow-x-hidden">
                <ManajemenSection />
                <div className="relative z-10 -mt-20">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
