"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative w-full py-16 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-bg-green-5 rounded-full flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-text-green-6 font-semibold text-base">Profesional & Terpercaya</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                            KANTOR JASA PENILAI PUBLIK
                            <br />
                            <span className="text-kjpp-red">ANAS KARIM RIVAI</span>
                            <br />
                            & REKAN
                        </h1>
                    </div>
                    <div className="lg:col-span-4 flex justify-center">
                        <div className="w-full max-w-[350px] space-y-2">
                            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <Image
                                    src="/image/hero/hero1.jpg"
                                    alt="KJPP AKR Team"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <Image
                                    src="/image/hero/hero2.png"
                                    alt="KJPP AKR Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <Image
                                    src="/image/hero/hero3.jpg"
                                    alt="KJPP AKR Team"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                        <div className="inline-block">
                            <span className="text-sm font-bold text-kjpp-red uppercase tracking-wider">
                                MITRA STRATEGIS ANDA
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                            Solusi Penilaian Aset yang Komprehensif
                        </h2>
                        <p className="text-base md:text-lg text-text-slate-3 leading-relaxed">
                            Lebih dari sekadar angka, kami memberikan wawasan strategis untuk mendukung pengambilan keputusan bisnis Anda. Mulai dari penilaian properti, studi kelayakan, hingga konsultasi pengembangan aset di seluruh Indonesia.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
