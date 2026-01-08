"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Quote, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SekapurSirihSection() {
    return (
        <main
            className="relative z-10 mt-[35vh] md:mt-[50vh] bg-bg-1 rounded-t-[3rem] shadow-2xl pt-24 pb-32 scroll-mt-24"
        >
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            SEKAPUR SIRIH
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-2xl ml-6">
                        Sambutan hangat dan pandangan mendalam dari Managing Partner kami mengenai perjalanan, nilai, dan komitmen KJPP Anas Karim Rivai & Rekan.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
                    <div className="flex-1 space-y-8">
                        <div className="relative pl-8">
                            <Quote className="absolute -top-4 -left-2 w-8 h-8 text-kjpp-red/20 rotate-180" />
                            <h2 className="text-2xl md:text-3xl font-serif italic text-kjpp-dark leading-relaxed font-medium">
                                "Kantor Jasa Penilai Publik (KJPP) Anas Karim Rivai & Rekan
                                senantiasa bekerja keras membangun bangsa dengan
                                mengokohkan komitmen dalam bidang Jasa Penilai dan Jasa
                                Konsultansi yang mengedepankan Integritas, Objektivitas, Kompetensi,
                                Kerahasiaan, dan Perilaku Profesional."
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-md md:max-w-lg relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-500">
                            <Image
                                src="/image/tentang-kami/anas-karim-rivai.png"
                                alt="Ir. H. Anas Karim Rivai, MAPPI (Cert)"
                                width={0}
                                height={0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border-l-4 border-kjpp-red">
                                <h3 className="font-bold text-kjpp-dark text-base md:text-lg leading-tight">
                                    Ir. H. Anas Karim Rivai, MAPPI (Cert)
                                </h3>
                                <p className="text-kjpp-red font-medium text-xs md:text-sm mt-1">
                                    Managing Partner
                                </p>
                            </div>
                        </div>
                        <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-slate-100 rounded-3xl" />
                    </div>
                </div>

                <div className="mb-2 text-muted-foreground leading-relaxed text-lg text-justify">
                    <p>
                        Tonggak sejarah Kantor Jasa Penilai Publik (KJPP) Anas Karim Rivai &
                        Rekan diawali sekitar tahun 1990-an, dimana pada waktu itu didirikan
                        perusahaan yaitu PT. Indoprofita Konsultama. Seiring dengan regulasi
                        dari Pemerintah di Tahun 2009 maka PT. Indoprofita Konsultama
                        bertansformasi menjadi Kantor Jasa Penilai Publik (KJPP) Anas Karim
                        Rivai & Rekan. Kami bergerak di Bidang Jasa Penilaian dan Jasa Konsultansi.
                        Sesuai dengan Izin dari Kementerian Keuangan R.I Nomor 395/KM.1/2009
                        tentang Izin Usaha Kantor Jasa Penilai Publik (KJPP) Anas Karim Rivai
                        & Rekan.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-muted-foreground leading-relaxed text-lg text-justify">
                    <div>
                        <p>
                            Secara umum KJPP Anas Karim Rivai & Rekan (AKR) didirikan dengan cita-cita
                            yang luhur dari pendirinya, yang berkeinginan untuk mengembangkan
                            kemampuan dan talenta setiap personil untuk aktif berperan serta dalam
                            pembangunan terkait dengan Jasa Penilai dan Jasa Konsultansi.
                        </p>
                    </div>
                    <div>
                        <p>
                            KJPP Anas Karim Rivai & Rekan selalu berusaha untuk menjadi perusahaan
                            yang berintegritas tinggi serta menjunjung tinggi komitmen sebagai
                            Perusahaan Penilai yang independen dan profesional. Dalam menjalankan
                            bisnis serta layanan kami, kami didukung oleh tenaga ahli yang
                            profesional, berdedikasi tinggi.
                        </p>
                    </div>
                </div>
                <div className="mt-16 relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl group">
                    <Image
                        src="/image/tentang-kami/sekapursirih.png"
                        alt="Pengurus KJPP AKR"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                </div>
            </div>
        </main>
    );
}
