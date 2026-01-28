"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { resetPassword, verifyResetToken } from "@/actions/auth";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            setError("Token tidak ditemukan");
            setIsVerifying(false);
        } else {
            setToken(tokenParam);
            verifyResetToken(tokenParam)
                .then((result) => {
                    if (!result.success) {
                        setError(result.error || "Token tidak valid");
                    }
                    setIsVerifying(false);
                })
                .catch(() => {
                    setError("Gagal memverifikasi token");
                    setIsVerifying(false);
                });
        }
    }, [searchParams]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token tidak valid");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        startTransition(async () => {
            try {
                const result = await resetPassword(token, formData.password);

                if (result.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push("/admin/login");
                    }, 3000);
                } else {
                    setError(result.error || "Gagal mereset password");
                }
            } catch {
                setError("Terjadi kesalahan. Silakan coba lagi.");
            }
        });
    }

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 8) return { strength: 1, label: "Lemah", color: "bg-red-500" };

        let strength = 1;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength: 1, label: "Lemah", color: "bg-red-500" };
        if (strength === 3) return { strength: 2, label: "Sedang", color: "bg-yellow-500" };
        return { strength: 3, label: "Kuat", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-bg-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="animate-pulse">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Memverifikasi Token...
                        </h2>
                        <p className="text-slate-600">
                            Mohon tunggu sebentar
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-bg-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Password Berhasil Direset!
                            </h2>
                            <p className="text-slate-600">
                                Password Anda telah berhasil diubah. Anda akan diarahkan ke halaman login...
                            </p>
                        </div>

                        <div className="animate-pulse">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!token || error && !success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-bg-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Link Tidak Valid
                            </h2>
                            <p className="text-slate-600">
                                Link reset password tidak valid atau sudah kadaluarsa.
                            </p>
                        </div>

                        <Link href="/admin/forgot-password">
                            <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800">
                                Request Reset Password Lagi
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1696820955952-1976baeb4eea?q=80&w=2070&auto=format&fit=crop"
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
                            Buat Password Baru
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                            Pastikan password baru Anda kuat dan mudah diingat. Gunakan kombinasi huruf, angka, dan simbol.
                        </p>
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-slate-400">
                        © 2026 KJPP AKR. All rights reserved.
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
                            Reset Password
                        </h2>
                        <p className="text-slate-600">
                            Masukkan password baru Anda
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && !error.includes("Token") && (
                            <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password Baru
                            </Label>
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
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : "bg-slate-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Kekuatan password: <span className="font-semibold">{passwordStrength.label}</span>
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-slate-500">
                                Minimal 8 karakter, mengandung huruf dan angka
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
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
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
