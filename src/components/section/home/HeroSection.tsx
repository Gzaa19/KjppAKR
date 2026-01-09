"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";

interface HeroImage {
    id: string;
    imageUrl: string;
    altText: string;
    sortOrder: number;
}

export default function HeroSection() {
    const [heroImages, setHeroImages] = React.useState<HeroImage[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchHeroImages();
    }, []);

    const fetchHeroImages = async () => {
        try {
            const response = await fetch("/api/hero-images");
            if (!response.ok) throw new Error("Failed to fetch hero images");
            const data = await response.json();
            setHeroImages(data.slice(0, 3)); // Only take first 3 images
        } catch (error) {
            console.error("Error fetching hero images:", error);
            // Fallback to default images if API fails
            setHeroImages([
                {
                    id: "1",
                    imageUrl: "/image/hero/hero1.png",
                    altText: "KJPP AKR Team",
                    sortOrder: 1,
                },
                {
                    id: "2",
                    imageUrl: "/image/hero/hero2.png",
                    altText: "KJPP AKR Logo",
                    sortOrder: 2,
                },
                {
                    id: "3",
                    imageUrl: "/image/hero/hero3.jpg",
                    altText: "KJPP AKR Team",
                    sortOrder: 3,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

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
                            {loading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-full h-[180px] rounded-2xl bg-muted animate-pulse"
                                        />
                                    ))}
                                </>
                            ) : (
                                heroImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.altText}
                                            fill
                                            className="object-cover"
                                            priority={image.sortOrder === 1}
                                        />
                                    </div>
                                ))
                            )}
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
