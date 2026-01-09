import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, LineChart, Building2, Users } from "lucide-react";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export const metadata: Metadata = {
    title: "Jasa Konsultansi | KJPP AKR",
    description: "Layanan konsultansi profesional untuk pengembangan properti, manajemen aset, dan studi kelayakan bisnis.",
};

const consultancyServices = [
    "Konsultansi Pengembangan Properti",
    "Desain Sistem Informasi Aset",
    "Manajemen Properti",
    "Studi Kelayakan Usaha",
    "Jasa Agen Properti",
    "Pengawasan Pembiayaan Proyek",
    "Studi Penentuan Sisa Umur Ekonomis",
    "Studi Penggunaan Tertinggi dan Terbaik (Highest and Best Use)",
    "Studi Optimalisasi Aset",
];

export default function KonsultansiPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Consultancy Background"
            />
            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-20 min-h-screen">
                {/* Header */}
                <div className="container mx-auto px-4 mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            JASA KONSULTANSI
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                        Kami memberikan solusi konsultansi strategis untuk memaksimalkan nilai aset dan potensi bisnis Anda, didukung oleh analisis mendalam dan tim ahli berpengalaman.
                    </p>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl border-l-4 border-l-kjpp-red shadow-lg p-8 md:p-12 hover:shadow-xl transition-shadow duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {consultancyServices.map((service, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="transform rotate-45 w-2 h-2 bg-kjpp-red shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                    <span className="text-lg text-slate-700 font-medium group-hover:text-kjpp-dark transition-colors duration-300">
                                        {service}
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
