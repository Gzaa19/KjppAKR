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
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-full mb-6 border border-gray-100 shadow-sm">
                        <Image
                            src="/image/logoAKR.png"
                            alt="Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                        <div className="w-px h-6 bg-gray-200 mx-4"></div>
                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                            Anas Karim Rivai & Rekan
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                        Selamat Datang, Admin
                    </h1>
                    <p className="text-gray-500 text-lg font-light">
                        Silakan pilih dashboard yang ingin Anda akses hari ini
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Link
                        href="/admin/dashboard"
                        className="group relative bg-white rounded-3xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Layers className="w-10 h-10 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                            Content Manager
                        </h3>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-xs">
                            Pusat pengaturan konten publikasi, galeri, hero image, dan manajemen klien.
                        </p>

                        <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <span className="inline-flex items-center text-blue-600 text-sm font-bold tracking-wide uppercase bg-blue-50 px-4 py-2 rounded-full">
                                Masuk Content Manager <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/tracking"
                        className="group relative bg-white rounded-3xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 border border-gray-100 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <ClipboardClock className="w-10 h-10 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                            Appraisal Tracker
                        </h3>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-xs">
                            Pantau status legalitas, jadwal inspeksi lapangan, analisis, hingga laporan final.
                        </p>

                        <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <span className="inline-flex items-center text-emerald-600 text-sm font-bold tracking-wide uppercase bg-emerald-50 px-4 py-2 rounded-full">
                                Masuk Appraisal Tracker <ArrowRight className="ml-2 w-4 h-4" />
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
