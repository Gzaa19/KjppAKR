"use client";

import Image from "next/image";
import { Quote, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CompanyProfileButton } from "@/components/ui/CompanyProfileButton";

interface SekapurSirihImages {
    managingPartner: {
        imageUrl: string;
        altText: string;
        caption: string | null;
        managingPartnerName: string | null;
        managingPartnerTitle: string | null;
    } | null;
    teamPhoto: {
        imageUrl: string;
        altText: string;
        caption: string | null;
    } | null;
}

export function SekapurSirihSection() {
    const [images, setImages] = useState<SekapurSirihImages>({
        managingPartner: null,
        teamPhoto: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch("/api/sekapur-sirih");
            if (!response.ok) throw new Error("Failed to fetch images");
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error("Error fetching Sekapur Sirih images:", error);
        } finally {
            setLoading(false);
        }
    };

    const managingPartnerImage = images.managingPartner;
    const teamPhotoImage = images.teamPhoto;

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
                            {loading ? (
                                <div className="aspect-square bg-slate-200 animate-pulse" />
                            ) : managingPartnerImage ? (
                                <>
                                    <Image
                                        src={managingPartnerImage.imageUrl}
                                        alt={managingPartnerImage.altText}
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border-l-4 border-kjpp-red">
                                        <h3 className="font-bold text-kjpp-dark text-base md:text-lg leading-tight">
                                            {managingPartnerImage.managingPartnerName || "Managing Partner"}
                                        </h3>
                                        <p className="text-kjpp-red font-medium text-xs md:text-sm mt-1">
                                            {managingPartnerImage.managingPartnerTitle || "KJPP AKR"}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-300/50 flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium text-base mb-1">
                                            Foto Managing Partner
                                        </p>
                                        <p className="text-slate-400 text-xs">
                                            Belum diupload oleh admin
                                        </p>
                                    </div>
                                </div>
                            )}
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
                <div className="mb-2 text-muted-foreground leading-relaxed text-lg text-justify">
                    <p>
                        Secara umum KJPP Anas Karim Rivai & Rekan (AKR) didirikan dengan cita-cita yang luhur dari pendirinya, yang berkeinginan untuk mengembangkan kemampuan dan talenta setiap personil untuk aktif berperan serta dalam pembangunan terkait dengan Jasa Penilai dan Jasa Konsultansi. KJPP Anas Karim Rivai & Rekan selalu berusaha untuk menjadi perusahaan yang berintegritas tinggi serta menjunjung tinggi komitmen sebagai Perusahaan Penilai yang independen dan profesional. Dalam menjalankan bisnis serta layanan kami, kami didukung oleh tenaga ahli yang profesional, berdedikasi tinggi.
                    </p>
                </div>
                <div className="mt-12 mb-8 relative overflow-hidden rounded-2xl shadow-2xl">
                    {/* Background with refined gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a2f42] via-kjpp-dark to-[#3a5a73]" />

                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.04] rounded-full" />
                        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.03] rounded-full" />
                        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-kjpp-red/10 rounded-full blur-2xl" />
                        {/* Subtle accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kjpp-red/60 to-transparent" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Left: Icon + Text */}
                        <div className="flex items-start gap-5 text-center md:text-left">
                            <div className="hidden md:flex shrink-0 w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm items-center justify-center border border-white/10">
                                <FileDown className="w-7 h-7 text-white/90" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                    Company Profile
                                </h3>
                                <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
                                    Unduh Company Profile KJPP AKR untuk mengenal lebih dalam tentang layanan, portofolio, dan komitmen kami.
                                </p>
                            </div>
                        </div>

                        {/* Right: Download button */}
                        <CompanyProfileButton variant="card" />
                    </div>
                </div>
                <div className="mt-16 relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl group">
                    {loading ? (
                        <div className="w-full h-full bg-slate-200 animate-pulse" />
                    ) : teamPhotoImage ? (
                        <>
                            <Image
                                src={teamPhotoImage.imageUrl}
                                alt={teamPhotoImage.altText}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-300/50 flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium text-xl mb-2">
                                    Foto Tim KJPP AKR
                                </p>
                                <p className="text-slate-400 text-sm">
                                    Gambar belum diupload oleh admin
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
