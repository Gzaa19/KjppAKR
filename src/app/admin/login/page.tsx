"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, Eye, EyeOff, Building2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (result.success) {
                    toast.success("Login berhasil! Semangat bekerja! 🚀", {
                        description: "Selamat datang kembali di dashboard admin KJPP AKR"
                    });
                    router.push("/admin/dashboard");
                    router.refresh();
                } else {
                    setError(result.error || "Login gagal");
                }
            } catch {
                setError("Terjadi kesalahan. Silakan coba lagi.");
            }
        });
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1696820955952-1976baeb4eea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Modern Building"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-slate-900/70" />
                </div>
                <div className="relative z-10 flex flex-col items-start space-y-16">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-50 h-25 bg-white rounded-lg p-2 flex items-center justify-center">
                            <Image
                                src="/image/logoAKR.png"
                                alt="KJPP AKR Logo"
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Penilaian Properti & Manajemen Aset Profesional
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                            Portal khusus untuk administrator KJPP AKR dalam mengelola penilaian, laporan klien, dan operasional perusahaan dengan presisi dan keamanan.
                        </p>
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-slate-400">
                        © 2026 KJPP AKR. All rights reserved. Professional Property Services.
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bg-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-50 h-50 bg-bg-1 rounded-lg p-2 flex items-center justify-center">
                                <Image
                                    src="/image/logoAKR.png"
                                    alt="KJPP AKR Logo"
                                    width={150}
                                    height={150}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center lg:text-left space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4">
                            <Lock className="w-6 h-6 text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Login Admin
                        </h2>
                        <p className="text-slate-600">
                            Masukkan kredensial untuk mengakses dashboard
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Alamat Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@kjppakr.com"
                                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Kata Sandi
                                </Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk ke Dashboard"
                            )}
                        </Button>
                        <p className="text-center text-sm text-slate-500">
                            KJPP AKR - Admin Dashboard Management System v2.0
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
