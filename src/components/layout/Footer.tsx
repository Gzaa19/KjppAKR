"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, ArrowRight, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative w-full">
            <div className="relative w-full mb-0">
                <div className="relative w-full overflow-hidden rounded-t-[5rem] md:rounded-t-[6rem] bg-bg-primary2">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center lg:items-start">
                            <div className="flex flex-col items-center lg:items-start space-y-8 flex-1">
                                <div className="relative w-full max-w-[380px] h-[190px]">
                                    <Image
                                        src="/image/logoFooter.png"
                                        alt="KJPP AKR Logo"
                                        fill
                                        className="object-contain object-center lg:object-left"
                                        priority
                                    />
                                </div>
                                <div className="space-y-2 text-center lg:text-left">
                                    <p className="text-base md:text-lg font-bold text-white">
                                        Anas Karim Rivai & Rekan
                                    </p>
                                    <p className="text-sm md:text-base text-white/90">
                                        Kantor Jasa Penilai Publik
                                    </p>
                                    <div className="space-y-1 text-xs md:text-sm text-white/80">
                                        <p>Kep. Menkeu No. 395/KM.1/2009</p>
                                        <p>No. Izin 2.09.0030</p>
                                        <p>Wilayah Kerja Republik Indonesia</p>
                                    </div>
                                </div>
                                <div className="w-full max-w-[300px] h-px bg-white/30 mx-auto lg:mx-0"></div>
                                <div className="space-y-2 text-sm md:text-base text-white/90 text-center lg:text-left">
                                    <p className="font-semibold text-white">Alamat Kantor</p>
                                    <div className="flex items-start justify-center lg:justify-start gap-2">
                                        <MapPin className="w-5 h-5 text-kjpp-red flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1 text-left">
                                            <p>Permata Kebayoran Plaza Blok A-12A</p>
                                            <p>Jl. Raya Kebayoran Lama No. 225</p>
                                            <p>Jakarta 12220, Indonesia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:block w-px bg-white/30 self-stretch min-h-full"></div>
                            <div className="space-y-8 text-center lg:text-left flex-1 flex flex-col items-center lg:items-start">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                                        Terhubung
                                        <br />
                                        dengan Kami
                                    </h2>
                                    <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                        Jadilah bagian dari komunitas kami yang bersemangat dan saling terhubung dalam visi masa depan yang berkelanjutan.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                    <Link
                                        href="https://www.instagram.com/kjppakr?igsh=YmJsOXhwc245dTdj"
                                        target="_blank"
                                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-kjpp-red hover:scale-110 transition-all duration-300 group"
                                    >
                                        <Instagram className="w-5 h-5 text-bg-primary2 group-hover:text-white transition-colors" />
                                    </Link>
                                    <Link
                                        href="https://linkedin.com"
                                        target="_blank"
                                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-kjpp-red hover:scale-110 transition-all duration-300 group"
                                    >
                                        <Linkedin className="w-5 h-5 text-bg-primary2 group-hover:text-white transition-colors" />
                                    </Link>
                                </div>
                                <div className="pt-4">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-white text-bg-primary2 hover:bg-kjpp-red hover:text-white px-8 py-6 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                                    >
                                        <Link href="/hubungi-kami" className="flex items-center gap-2">
                                            Kontak Kami
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
