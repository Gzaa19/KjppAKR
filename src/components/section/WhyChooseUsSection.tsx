"use client";

import * as React from "react";
import { ShieldCheck, Users, Scale, MonitorCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        id: 1,
        title: "Berizin Resmi & Legal",
        description: "Memiliki Izin Usaha KJPP dari Menteri Keuangan No. 855/KM.1/2023 dan terdaftar di BPN & OJK.",
        icon: ShieldCheck,
    },
    {
        id: 2,
        title: "Tim Bersertifikat Ahli",
        description: "Didukung oleh Penilai Publik bersertifikat MAPPI (Masyarakat Profesi Penilai Indonesia) yang berpengalaman.",
        icon: Users,
    },
    {
        id: 3,
        title: "Standar Internasional",
        description: "Seluruh penilaian mengacu pada KEPI dan SPI (Standar Penilaian Indonesia) serta standar global.",
        icon: Scale,
    },
    {
        id: 4,
        title: "Akurasi Berbasis IT",
        description: "Mengintegrasikan analisis mendalam dengan Sistem Informasi Aset untuk validasi data yang presisi.",
        icon: MonitorCheck,
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="py-20 bg-bg-2">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary2 mb-4">
                        Mengapa Memilih <span className="text-red-600">KJPP AKR?</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Komitmen kami pada integritas, validitas data, dan profesionalisme untuk memberikan nilai terbaik bagi aset Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.id}
                                className="group relative bg-white rounded-2xl p-1 border border-border-primary hover:border-border-hover shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2"
                            >
                                <CardContent className="h-full p-7 rounded-xl bg-white flex flex-col">
                                    <div className="w-14 h-14 rounded-xl bg-bg-2 group-hover:bg-bg-primary2 flex items-center justify-center mb-6 transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-text-slate-3 group-hover:text-white transition-colors duration-300" />
                                    </div>

                                    <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-text-primary2 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}