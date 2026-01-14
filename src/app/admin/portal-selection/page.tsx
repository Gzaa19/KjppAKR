"use client";

import { LayoutDashboard, Truck, ArrowRight, LogOut } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="Office Background"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10 space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20 shadow-xl">
                        <Image
                            src="/image/logoAKR.png"
                            alt="Logo"
                            width={160}
                            height={60}
                            className="h-12 w-auto object-contain brightness-0 invert"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Selamat Datang, Admin
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Silakan pilih dashboard yang ingin Anda akses hari ini
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <Link
                        href="/admin/dashboard"
                        className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center text-center group"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                            <LayoutDashboard className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            Dashboard Utama
                        </h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Akses modul manajemen CMS, user, dan pengaturan umum website.
                        </p>
                        <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center text-blue-400 text-sm font-semibold tracking-wide uppercase">
                            Masuk Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    </Link>
                    <Link
                        href="/admin/tracking"
                        className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col items-center text-center group"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
                            <Truck className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            Tracking System
                        </h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Logistik, manajemen klien, lacak status proyek, dan operasional lapangan.
                        </p>
                        <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center text-emerald-400 text-sm font-semibold tracking-wide uppercase">
                            Buka Tracking System <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                    </Link>
                </div>

                <div className="mt-12 text-center">
                    <Button variant="ghost" className="text-slate-500 hover:text-white" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout / Ganti Akun
                    </Button>
                </div>
            </div>
        </div>
    );
}
