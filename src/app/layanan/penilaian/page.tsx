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
            "tanah kosong untuk permukiman paling luas 5.000 (lima ribu) meter persegi yang diperuntukkan untuk 1 (satu) unit rumah tinggal. ",
            "1 (satu) unit apartemen, rumah tinggal, rumah toko, rumah kantor, atau kios. ",
            "peralatan dan perlengkapan bangunan yang merupakan bagian yang terikat pada apartemen, rumah tinggal, rumah toko, rumah kantor, atau kios;",
            "1 (satu) unit mesin individual yang digunakan pada rumah tinggal, rumah toko, atau rumah kantor, termasuk pembangkit tenaga listrik (genset) dan pompa air;",
            "1 (satu) unit alat transportasi dengan klasifikasi mobil penumpang, mobil beban, dan sepeda motor, yang bukan merupakan suatu armada angkutan; dan",
            "1 (satu) unit gudang tunggal dengan luas tanah dan bangunan masing-masing paling luas 500 (lima ratus) meter persegi.",
        ],
    },
    {
        id: 2,
        icon: Building2,
        title: "Penilaian Properti",
        borderColor: "border-l-kjpp-red",
        bgColor: "bg-red-50",
        items: [
            "tanah dan bangunan beserta kelengkapannya, serta pengembangan lainnya atas tanah;",
            "mesin dan peralatan termasuk instalasinya yang dirangkai dalam satu kesatuan dan/atau berdiri sendiri yang digunakan dalam proses produksi;",
            "alat transportasi, alat berat, alat komunikasi, alat kesehatan, alat laboratorium dan utilitas, peralatan dan perabotan kantor, dan peralatan militer;",
            "perangkat telekomunikasi termasuk peralatan pemancar dan penerima jaringan, satelit, dan stasiun bumi;",
            "pertanian, perkebunan, peternakan, perikanan, dan kehutanan; dan",
            "pertambangan.",
        ],
    },
    {
        id: 3,
        icon: PieChart,
        title: "Penilaian Bisnis",
        borderColor: "border-l-kjpp-red",
        bgColor: "bg-red-50",
        items: [
            "entitas bisnis.",
            "penyertaan.",
            "surat berharga termasuk derivasinya.",
            "hak dan kewajiban perusahaan.",
            "hak kekayaan intelektual dan aset takberwujud.",
            "kerugian ekonomis yang diakibatkan oleh suatu kegiatan atau peristiwa tertentu untuk mendukung berbagai tindakan korporasi atau atas transaksi material.",
            "opini kewajaran.",
            "instrumen keuangan.",
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
            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-48 min-h-screen">
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

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-12">
                        {valuationServices.map((service) => {
                            const IconComponent = service.icon;
                            return (
                                <div
                                    key={service.id}
                                    className={`bg-white rounded-2xl border-l-4 ${service.borderColor} shadow-md hover:shadow-xl transition-shadow duration-300 p-8`}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`${service.bgColor} p-3 rounded-lg`}>
                                            <IconComponent className="w-6 h-6 text-kjpp-dark" />
                                        </div>
                                        <h2 className="text-xl font-bold text-kjpp-dark">{service.title}</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {service.items.map((item, index) => (
                                            <li key={index} className="flex gap-3 text-slate-700 items-start">
                                                <span className="mt-1.5 shrink-0 text-xs text-kjpp-red">
                                                    ▸
                                                </span>
                                                <span className="text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div >
    );
}
