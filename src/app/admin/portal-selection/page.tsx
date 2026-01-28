"use client";

import { Layers, ClipboardClock, ArrowRight, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PortalSelectionPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            if (response.ok) {
                router.push("/admin/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F5F7FA]">
            <div className="relative z-10 w-full max-w-5xl px-4 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center justify-center px-6 py-2.5 bg-white/50 backdrop-blur-sm rounded-full mb-4 border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <Image
                            src="/image/logoAKR.png"
                            alt="Logo"
                            width={120}
                            height={40}
                            className="h-7 w-auto object-contain opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="w-px h-5 bg-slate-300 mx-4"></div>
                        <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                            Administrator Portal
                        </span>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                            KJPP Anas Karim Rivai & Rekan
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Pusat kontrol terpadu untuk pengelolaan website profile dan sistem tracking penilaian aset.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
                    <Link
                        href="/admin/dashboard"
                        className="group relative bg-white rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] border border-slate-100 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Layers className="w-10 h-10 text-white" />
                        </div>

                        <div className="relative space-y-2 mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase mb-2">
                                Company Profile
                            </span>
                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                Manajemen Website
                            </h3>
                        </div>

                        <p className="relative text-slate-500 mb-8 leading-relaxed text-sm max-w-xs mx-auto">
                            Kelola konten Publikasi, Update Galeri, Hero Banner, dan Portofolio Klien Perusahaan dengan mudah.
                        </p>

                        <div className="relative mt-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="inline-flex items-center text-blue-600 text-sm font-bold tracking-wide uppercase bg-blue-50/80 px-6 py-2.5 rounded-full hover:bg-blue-100 transition-colors">
                                Akses Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </Link>
                    <Link
                        href="/admin/tracking"
                        className="group relative bg-white rounded-[2rem] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] border border-slate-100 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                            <ClipboardClock className="w-10 h-10 text-white" />
                        </div>

                        <div className="relative space-y-2 mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wide uppercase mb-2">
                                Tracking System
                            </span>
                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                Aplikasi SI-MAPAN
                            </h3>
                        </div>

                        <p className="relative text-slate-500 mb-8 leading-relaxed text-sm max-w-xs mx-auto">
                            Sistem monitoring terpadu. Pantau status Verifikasi Dokumen, Jadwal Inspeksi Lapangan, Analisis, hingga Laporan Final secara realtime.
                        </p>

                        <div className="relative mt-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <span className="inline-flex items-center text-emerald-600 text-sm font-bold tracking-wide uppercase bg-emerald-50/80 px-6 py-2.5 rounded-full hover:bg-emerald-100 transition-colors">
                                Akses Aplikasi <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="mt-16 text-center">
                    <Button
                        variant="ghost"
                        className="bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-full px-8 py-6 transition-all duration-300"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout / Ganti Akun
                    </Button>
                </div>
            </div>
        </div>
    );
}
