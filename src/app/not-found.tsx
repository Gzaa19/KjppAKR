import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search, FileText, Info } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Halaman Tidak Ditemukan | KJPP AKR",
    description: "Halaman yang Anda cari tidak ditemukan.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-kjpp-red blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8">

                    <div className="mx-auto w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-lg flex items-center justify-center transform rotate-3 border border-slate-100 mb-8">
                        <Search className="w-16 h-16 md:w-24 md:h-24 text-kjpp-red opacity-80" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-kjpp-dark tracking-tight">
                            Oops! Sepertinya Anda <span className="text-kjpp-red">Tersesat.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Kami tidak dapat menemukan halaman ini. Sebagai firma penilai profesional, kami biasanya ahli dalam navigasi, tapi halaman ini benar-benar hilang dari radar kami.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/">
                            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-kjpp-red hover:bg-red-700">
                                <Home className="mr-2 h-5 w-5" />
                                Beranda
                            </Button>
                        </Link>
                        <Link href="/hubungi-kami">
                            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold bg-white hover:bg-slate-50 border-slate-200 text-kjpp-dark">
                                <FileText className="mr-2 h-5 w-5" />
                                Hubungi Kami
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
