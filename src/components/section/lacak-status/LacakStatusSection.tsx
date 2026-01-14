"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle2,
    FileText,
    MapPin,
    Calendar,
    Clock,
    Image as ImageIcon,
    FileCheck,
    Send,
    Info,
    MessageSquare,
} from "lucide-react";

const progressSteps = [
    { id: 1, name: "Pembuatan Penilaian", status: "completed", date: "01/12/24" },
    { id: 2, name: "Proposal Penilaian", status: "completed", date: "02/12/24" },
    { id: 3, name: "Verifikasi Dokumen", status: "in-progress", date: "SEDANG DIPROSES" },
    { id: 4, name: "Penjadwalan Inspeksi", status: "pending", date: "MENUNGGU" },
    { id: 5, name: "Proses Penilaian", status: "pending", date: "MENUNGGU" },
    { id: 6, name: "Proses Review Internal", status: "pending", date: "MENUNGGU" },
    { id: 7, name: "Resuma Nilai", status: "pending", date: "MENUNGGU" },
    { id: 8, name: "Laporan Final", status: "pending", date: "MENUNGGU" },
];

const documents = [
    { name: "Sertifikat Tanah (SHM/HGB)", checked: true },
    { name: "IMB / PBB", checked: true },
    { name: "PBB Tahun Terkini (Belum Ada)", checked: true },
    { name: "Denah / Layout Bangunan", checked: true },
];

export function LacakStatusSection() {
    const [projectId, setProjectId] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const getStepIcon = (index: number) => {
        const icons = [
            CheckCircle2,
            FileText,
            FileCheck,
            Calendar,
            Clock,
            ImageIcon,
            FileText,
            CheckCircle2,
        ];
        const Icon = icons[index];
        return <Icon className="w-6 h-6" />;
    };

    const getStepColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500 text-white border-green-500";
            case "in-progress":
                return "bg-red-500 text-white border-red-500";
            default:
                return "bg-gray-200 text-gray-400 border-gray-300";
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                        Lacak Proyek Anda
                    </h1>
                </div>
                <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed mb-8">
                    Masukkan ID Proyek atau Nomor Proposal Anda untuk memantau
                    perkembangan proses penilaian properti secara real-time.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 max-w-2xl">
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Masukkan ID Proyek (Contoh: PRJ-2023-001)"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="flex-1 bg-white"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-8"
                        >
                            {isLoading ? "Mencari..." : "Cari"}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1 h-6 bg-kjpp-red rounded-full"></div>
                        Progress Penilaian
                    </h2>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">
                        STATUS: ON PROGRESS
                    </span>
                </div>
                <div className="relative">
                    <div className="flex justify-between items-start">
                        {progressSteps.map((step, index) => (
                            <div key={step.id} className="flex items-start flex-1">
                                <div className="flex flex-col items-center text-center flex-1">
                                    <div
                                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2 relative z-10 ${getStepColor(
                                            step.status
                                        )}`}
                                    >
                                        {getStepIcon(index)}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 mb-1 leading-tight px-1">
                                        {step.name}
                                    </p>
                                    <p
                                        className={`text-xs ${step.status === "in-progress"
                                            ? "text-red-600 font-semibold"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {step.date}
                                    </p>
                                </div>
                                {index < progressSteps.length - 1 && (
                                    <div className="flex items-center" style={{ marginTop: "32px" }}>
                                        <div className="w-full h-0 border-t-2 border-dotted border-gray-300 min-w-[20px]"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-4">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                            Catatan Status Terkini:
                        </p>
                        <p className="text-sm text-blue-800">
                            Dokumen lengkap & penurunan proses penilaian sedang
                            dilakukan oleh tim admin kami.
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-kjpp-red rounded-full"></div>
                            Project Summary
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase">
                                    No. Proposal
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    PROP/AKR/2023/X/045
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase">
                                    Order Dari Klien
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    Bangunan Kantor & Tanah (Ruko)
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase">
                                    Nama Klien
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    PT. Bank Mandiri (Persero) Tbk.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase">Alamat</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    Jl. Kebayoran Lama No. 12, Kebayoran Baru, Jakarta
                                    Selatan, DKI Jakarta 12120
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 mb-1 uppercase">
                                    Tujuan Penilaian
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    Penjaminan Hutang / Kredit Bank
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-kjpp-red text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
                        <p className="text-sm mb-4 text-white/90 leading-relaxed">
                            Jika Anda memiliki pertanyaan mengenai status proyek penilaian
                            Anda, silakan hubungi Customer Service kami.
                        </p>
                        <Button className="w-full bg-white hover:bg-gray-100 text-kjpp-red font-semibold rounded-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Hubungi via WhatsApp
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4">
                            Dokumen yang Dibutuhkan
                        </h3>
                        <div className="space-y-3">
                            {documents.map((doc, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{doc.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
