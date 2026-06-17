"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, FileDown } from "lucide-react";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

export default function HeroSection() {
    const { downloadUrl } = useCompanyProfile();
    return (
        <section className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="https://plus.unsplash.com/premium_photo-1733317263454-e42736efe734?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="KJPP AKR Professional Office"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-black/30 to-black/50" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto text-center space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
                                    Penilaian Properti 
                                </h1>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl mb-3">
                                    dan Bisnis Profesional
                                </h1>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mt-2">
                                    yang <span className="text-kjpp-red drop-shadow-lg">Terpercaya</span>
                                </h1>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                                    dan Akurat
                                </h1>
                            </div>
                            <p className="text-white text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium mt-6">
                                Partner terpercaya Anda dalam penilaian properti, bisnis, dan aset industri dengan standar profesional tertinggi. Didukung sertifikasi resmi dan pengalaman lebih dari 30 tahun.
                            </p>
                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/hubungi-kami">
                                    <Button
                                        size="lg"
                                        className="h-16 px-14 text-base font-bold bg-kjpp-dark text-white hover:bg-kjpp-dark/90 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                    >
                                        MULAI KONSULTASI
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                {downloadUrl && (
                                    <a href={downloadUrl} download="Company-Profile-KJPP-AKR.pdf">
                                        <Button
                                            size="lg"
                                            className="h-16 px-14 text-base font-bold bg-kjpp-red text-white hover:bg-kjpp-red/90 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                        >
                                            <FileDown className="w-5 h-5 mr-2" />
                                            COMPANY PROFILE
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
