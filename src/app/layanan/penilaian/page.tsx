import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home, Building2, PieChart, Wrench } from "lucide-react";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export const metadata: Metadata = {
    title: "Jasa Penilaian Properti | KJPP AKR",
    description: "Layanan penilaian properti profesional untuk berbagai jenis aset properti, bisnis, dan personal properti.",
};

const valuationServices = [
    {
        id: 1,
        icon: Home,
        title: "Penilaian Properti Sederhana",
        borderColor: "border-l-kjpp-red",
        bgColor: "bg-red-50",
        items: [
            "Tanah kosong untuk permukiman paling luas 5.000 m² untuk 1 unit rumah tinggal.",
            "1 unit apartemen, rumah tinggal, rumah toko, rumah kantor, atau kios.",
            "Peralatan dan perlengkapan bangunan yang terikat pada bangunan tersebut.",
            "1 unit mesin individual (termasuk genset dan pompa air).",
            "1 unit alat transportasi (mobil penumpang, mobil beban, sepeda motor) non-armada.",
        ],
    },
    {
        id: 2,
        icon: Building2,
        title: "Penilaian Properti",
        borderColor: "border-l-blue-600",
        bgColor: "bg-blue-50",
        items: [
            "Tanah dan bangunan beserta kelengkapannya, serta pengembangan lainnya.",
            "Mesin dan peralatan (satu kesatuan atau berdiri sendiri) dalam proses produksi.",
            "Alat transportasi, alat berat, komunikasi, kesehatan, laboratorium, utilitas, dan lainnya.",
            "Perangkat telekomunikasi, satelit, dan stasiun bumi.",
            "Sektor pertanian, perkebunan, peternakan, perikanan, kehutanan, dan pertambangan.",
        ],
    },
    {
        id: 3,
        icon: PieChart,
        title: "Penilaian Bisnis",
        borderColor: "border-l-blue-600",
        bgColor: "bg-blue-50",
        items: [
            "Entitas bisnis",
            "Surat berharga & derivatif",
            "Aset tak berwujud",
            "Opini kewajaran",
            "Instrumen keuangan",
            "Penyertaan",
            "Hak & kewajiban perusahaan",
            "Analisis kerugian ekonomis",
            "Studi kelayakan usaha",
            "Pengawasan proyek",
        ],
    },
    {
        id: 4,
        icon: Wrench,
        title: "Penilaian Personal Properti",
        borderColor: "border-l-kjpp-red",
        bgColor: "bg-red-50",
        items: [
            "Pabrik termasuk instalasinya yang merupakan satu kesatuan.",
            "Mesin dan peralatan (instalasi terpadu atau mandiri) dalam proses produksi.",
            "Alat transportasi, alat berat, komunikasi, kesehatan, laboratorium, militer & perabotan.",
            "Perangkat telekomunikasi termasuk pemancar, penerima jaringan, satelit, dan stasiun bumi.",
        ],
    },
];

export default function PenilaianPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
                alt="Property Valuation Background"
            />
            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-40 min-h-screen">
                {/* Header */}
                <div className="container mx-auto px-4 mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            JASA PENILAIAN
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                        Kami menyediakan layanan penilaian properti yang profesional dan komprehensif untuk berbagai
                        jenis aset, mulai dari properti sederhana hingga bisnis kompleks.
                    </p>
                </div>

                {/* Valuation Services Grid */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {valuationServices.map((service) => {
                            const IconComponent = service.icon;
                            return (
                                <div
                                    key={service.id}
                                    className={`bg-white rounded-2xl border-l-4 ${service.borderColor} shadow-md hover:shadow-xl transition-shadow duration-300 p-8`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`${service.bgColor} p-3 rounded-lg`}>
                                            <IconComponent className="w-6 h-6 text-kjpp-dark" />
                                        </div>
                                        <h2 className="text-xl font-bold text-kjpp-dark">{service.title}</h2>
                                    </div>

                                    {/* Items */}
                                    {service.id === 3 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                            {service.items.map((item, index) => (
                                                <div key={index} className="flex gap-3 text-slate-700 items-start">
                                                    <span className="text-blue-900 mt-1.5 shrink-0 text-xs">▸</span>
                                                    <span className="text-sm leading-relaxed">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="space-y-3">
                                            {service.items.map((item, index) => (
                                                <li key={index} className="flex gap-3 text-slate-700 items-start">
                                                    <span className={`mt-1.5 shrink-0 text-xs ${(service.id === 2) ? 'text-blue-900' : 'text-kjpp-red'}`}>
                                                        ▸
                                                    </span>
                                                    <span className="text-sm leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div>
    );
}
