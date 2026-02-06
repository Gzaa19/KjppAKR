import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OfficeLocationsSection() {
    const offices = [
        {
            name: "Kantor Pusat Jakarta",
            city: "Jakarta",
            address: "Permata Kebayoran Plaza Blok A-12A, Jl. Raya Kebayoran Lama",
            phones: ["(021) 7268181"],
            email: "admin@kjpp-Akr.com",
            image: "https://plus.unsplash.com/premium_photo-1733288410888-6aa5d9e9e5b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            imageAlt: "Jakarta"
        },
        {
            name: "Kantor Cabang Bandung",
            city: "Bandung",
            address: "Jl. Alam Nirwana No. 18, Kav. 32, Cluster Graha Nirwana, Resort Dago Bandung - 40191",
            phones: ["(022) 82522822"],
            email: "akr.bandung@kjpp-akr.com",
            image: "https://images.unsplash.com/photo-1744343934350-aadc3388ca82?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFuZHVuZyUyMGljb258ZW58MHx8MHx8fDA%3D",
            imageAlt: "Bandung"
        },
        {
            name: "Kantor Cabang Surabaya",
            city: "Surabaya",
            address: "Perumahan Sidosermo Indah Jalan Sidosermo Indah IV No. 17, Kelurahan Sidosermo, Kecamatan Wonocolo, Kota Surabaya, Provinsi Jawa Timur, Kode Pos 60239",
            phones: ["(031) 58284711"],
            email: "akrsurabaya@gmail.com",
            image: "https://images.unsplash.com/photo-1566176553949-872b2a73e04e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyYWJheWF8ZW58MHx8MHx8fDA%3D",
            imageAlt: "Surabaya"
        },
        {
            name: "Kantor Cabang Palembang",
            city: "Palembang",
            address: "Komplek Pusri Sako, Jl. Kelapa 2 Blok E 26, Kel. Sako, Kec. Sako, Palembang - 30163",
            phones: ["(0711) 5702927"],
            email: "kjpp.akr_palembang@yahoo.com",
            image: "https://images.unsplash.com/photo-1598675551183-1b091d43f99f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFsZW1iYW5nfGVufDB8fDB8fHww",
            imageAlt: "Palembang"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-kjpp-dark mb-4">
                        Lokasi <span className="text-kjpp-red">Kantor Kami</span>
                    </h2>
                    <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        KJPP AKR hadir di berbagai kota di Indonesia untuk melayani kebutuhan penilaian properti dan manajemen aset Anda dengan profesional dan terpercaya.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {offices.map((office, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 group"
                        >
                            <div className="flex flex-col sm:flex-row h-full">
                                <div className="relative w-full sm:w-[45%] h-64 sm:h-auto overflow-hidden">
                                    <Image
                                        src={office.image}
                                        alt={office.imageAlt}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-kjpp-dark mb-1">
                                            {office.name}
                                        </h3>
                                        <p className="text-kjpp-red font-semibold text-base">
                                            {office.city}
                                        </p>
                                        <div className="w-full h-0.5 bg-kjpp-red mt-2"></div>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                {office.address}
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Phone className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                {office.phones.map((phone, phoneIndex) => (
                                                    <a
                                                        key={phoneIndex}
                                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                                        className="block text-xs text-slate-600 hover:text-kjpp-red transition-colors"
                                                    >
                                                        {phone}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>

                                        {office.email && (
                                            <div className="flex items-start gap-2">
                                                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                                <a
                                                    href={`mailto:${office.email}`}
                                                    className="text-xs text-slate-600 hover:text-kjpp-red transition-colors break-all"
                                                >
                                                    {office.email}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
