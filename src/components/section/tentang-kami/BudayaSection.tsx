"use client";

import Image from "next/image";
import { Clock, UserCheck, Lightbulb, TrendingUp } from "lucide-react";

export function BudayaSection() {
    return (
        <section className="bg-slate-50 text-slate-900 py-24 relative overflow-hidden z-10 mb-0">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/image/tentang-kami/sekapursirih.png"
                    alt="Background Budaya Perusahaan"
                    fill
                    className="object-cover opacity-5 grayscale" 
                />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-red-600/20 bg-red-50 text-red-700 text-xs md:text-sm font-semibold tracking-wider uppercase">
                        Nilai-Nilai Kami
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Budaya Perusahaan
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">Disiplin</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Konsisten dan patuh terhadap standar kerja.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                            <UserCheck className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">Kerja Keras</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Berdedikasi tinggi untuk hasil maksimal.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">Kreatif</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Selalu mencari solusi baru yang efektif.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">Inovatif</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Terus berkembang mengikuti zaman.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}