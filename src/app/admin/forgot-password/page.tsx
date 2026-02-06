"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const result = await requestPasswordReset(email);

                if (result.success) {
                    setSuccess(true);
                } else {
                    setError(result.error || "Gagal memproses permintaan");
                }
            } catch {
                setError("Terjadi kesalahan. Silakan coba lagi.");
            }
        });
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-bg-1">
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

                    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Email Terkirim!
                            </h2>
                            <p className="text-slate-600">
                                Kami telah mengirim link reset password ke:
                            </p>
                            <p className="font-semibold text-slate-900">{email}</p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                            <p className="text-sm text-blue-900">
                                <strong>Langkah selanjutnya:</strong>
                            </p>
                            <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                                <li>Cek inbox email Anda</li>
                                <li>Klik link reset password</li>
                                <li>Buat password baru</li>
                            </ol>
                            <p className="text-xs text-blue-700 mt-3">
                                Link berlaku selama 15 menit. Jika tidak menerima email, cek folder spam.
                            </p>
                        </div>

                        <Link href="/admin/login">
                            <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Kembali ke Login
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
                            Lupa Password?
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                            Tidak masalah! Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
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
                            <Mail className="w-6 h-6 text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Reset Password
                        </h2>
                        <p className="text-slate-600">
                            Masukkan email Anda untuk menerima link reset password
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
                                    placeholder="Masukkan Email KJPP AKR"
                                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isPending}
                                />
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
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim Link Reset Password"
                            )}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/admin/login"
                                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
