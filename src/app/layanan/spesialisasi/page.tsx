import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export const metadata: Metadata = {
    title: "Spesialisasi | KJPP AKR",
    description: "Spesialisasi layanan KJPP AKR meliputi pembebasan lahan, penilaian bidang perminyakan, dan inventaris aset daerah.",
};

const specializations = [
    "Pembebasan lahan",
    "Penilaian Bidang Perminyakan",
    "Inventaris Aset Daerah (OTDA)",
];

export default function SpesialisasiPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="Specialization Background"
            />

            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-20 min-h-screen">
                {/* Header */}
                <div className="container mx-auto px-4 mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            Spesialisasi
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed">
                        KJPP AKR mempunyai spesialisasi :
                    </p>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl border-l-4 border-l-kjpp-red shadow-lg p-8 md:p-12 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col gap-6">
                            {specializations.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="transform rotate-45 w-2 h-2 bg-kjpp-red shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                    <span className="text-lg text-slate-700 font-medium group-hover:text-kjpp-dark transition-colors duration-300">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div>
    );
}
