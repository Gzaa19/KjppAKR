"use client";

import { Eye, Rocket, Clock, UserCheck, Lightbulb, TrendingUp } from "lucide-react";

export function VisiMisiSection() {
    return (
        <main className="relative z-10 mt-[35vh] md:mt-[50vh] bg-bg-2 rounded-t-[3rem] shadow-2xl pt-24 pb-24 scroll-mt-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            VISI DAN MISI
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl ml-6">
                        Landasan utama dan tujuan jangka panjang yang memandu setiap langkah kami dalam memberikan layanan terbaik dengan integritas tinggi.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="bg-white rounded-[2rem] p-10 md:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-8 h-8 text-kjpp-red" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-kjpp-dark mb-4">
                            Visi Perusahaan
                        </h2>
                        <div className="w-12 h-1 bg-kjpp-red rounded-full mb-6" />
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            "Menjadi Perusahaan yang Kuat dan Tumbuh dalam Industri Penilaian di Tingkat Nasional Maupun Internasional"
                        </p>
                    </div>
                    <div className="bg-bg-1 rounded-[2rem] p-10 md:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Rocket className="w-8 h-8 text-kjpp-red" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-kjpp-dark mb-4">
                            Misi Perusahaan
                        </h2>
                        <div className="w-12 h-1 bg-kjpp-red rounded-full mb-6" />
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            "Menjalankan Usaha Penilaian dengan Mengedepankan Prinsip Integritas, Objektivitas, Kompetensi, Kerahasiaan dan Perilaku Profesional"
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
