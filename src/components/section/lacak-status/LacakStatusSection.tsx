"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CheckCircle2,
    FileText,
    MapPin,
    Eye,
    FileCheck,
    Flag,
    MessageSquare,
    Loader2,
    Search,
    AlertCircle,
    Clock,
    Copy,
    Check,
    ArrowLeft,
    Info,
    Shield,
    X,
} from "lucide-react";

const stageIcons: Record<number, React.ElementType> = {
    1: FileText,
    2: MapPin,
    3: Eye,
    4: FileCheck,
    5: Flag,
};

interface SubStep {
    id: string;
    name: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    startDate: string | null;
    endDate: string | null;
}

interface Stage {
    id: number;
    name: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    completedCount: number;
    totalCount: number;
    currentSubStep: string | null;
    startDate: string | null;
    endDate: string | null;
    subSteps: SubStep[];
}

interface ProjectData {
    trackingCode: string;
    projectId: string;
    clientName: string;
    objectType: string;
    objective: string;
    location: string;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    adminMessage: string | null;
    stages: Stage[];
}

export function LacakStatusSection() {
    const [trackingCode, setTrackingCode] = useState("");
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [copied, setCopied] = useState(false);

    // Verification modal state
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [phoneHint, setPhoneHint] = useState("");
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Step 1: Check if tracking code exists
    const handleSearch = async () => {
        if (!trackingCode.trim()) {
            setError("Silakan masukkan kode tracking");
            return;
        }

        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const [response] = await Promise.all([
                fetch(`/api/public/tracking/${trackingCode.trim()}`),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);

            const data = await response.json();

            if (data.success && data.requiresVerification) {
                // Show verification modal
                setPhoneHint(data.hint || "****");
                setShowVerificationModal(true);
                setVerificationCode(["", "", "", ""]);
                setVerificationError(null);
                // Focus first input after modal opens
                setTimeout(() => inputRefs[0].current?.focus(), 100);
            } else if (!data.success) {
                setError(data.error || "Proyek tidak ditemukan");
            }
        } catch (err) {
            console.error("Error checking tracking:", err);
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify phone number and get data
    const handleVerify = async (codeOverride?: string[]) => {
        const codeToUse = codeOverride || verificationCode;
        const last4Phone = codeToUse.join("");

        if (last4Phone.length !== 4) {
            setVerificationError("Masukkan 4 digit lengkap");
            return;
        }

        setIsVerifying(true);
        setVerificationError(null);

        try {
            const [response] = await Promise.all([
                fetch(`/api/public/tracking/${trackingCode.trim()}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ last4Phone }),
                }),
                new Promise(resolve => setTimeout(resolve, 800))
            ]);

            const data = await response.json();

            if (data.success) {
                setProjectData(data.data);
                setShowVerificationModal(false);
            } else {
                setVerificationError(data.error || "Verifikasi gagal");
                // Clear inputs on error
                setVerificationCode(["", "", "", ""]);
                inputRefs[0].current?.focus();
            }
        } catch (err) {
            console.error("Error verifying:", err);
            setVerificationError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        if (verificationError) {
            setVerificationError(null);
        }

        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1);
        setVerificationCode(newCode);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        if (value && index === 3 && newCode.every(d => d !== "")) {
            setTimeout(() => handleVerify(newCode), 200);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (pastedData.length > 0) {
            const newCode = ["", "", "", ""];
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
            }
            setVerificationCode(newCode);
            if (pastedData.length === 4) {
                setTimeout(() => handleVerify(), 200);
            } else {
                inputRefs[pastedData.length]?.current?.focus();
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleBack = () => {
        setProjectData(null);
        setHasSearched(false);
        setError(null);
    };

    const handleCloseModal = () => {
        setShowVerificationModal(false);
        setVerificationCode(["", "", "", ""]);
        setVerificationError(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const calculateDuration = (startDate: string | null, endDate: string | null): string => {
        if (!startDate || !endDate) return "";

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffTime = end.getTime() - start.getTime();
        if (diffTime < 0) return "";

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "hari ini";
        if (diffDays === 1) return "1 hari";

        if (diffDays >= 7) {
            const weeks = Math.floor(diffDays / 7);
            const remainingDays = diffDays % 7;

            if (remainingDays === 0) {
                return `${weeks} minggu`;
            } else {
                return `${weeks} minggu ${remainingDays} hari`;
            }
        }

        return `${diffDays} hari`;
    };

    const getEstimatedDate = () => {
        if (!projectData?.createdAt) return "-";
        const created = new Date(projectData.createdAt);
        const estimated = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
        return formatDate(estimated.toISOString());
    };

    const getScheduleStatus = () => {
        if (projectData?.status === "SELESAI") return { label: "Selesai", color: "bg-green-100 text-green-700" };
        if (!projectData?.createdAt) return { label: "On Schedule", color: "bg-green-100 text-green-700" };

        const created = new Date(projectData.createdAt);
        const estimated = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
        const now = new Date();

        if (now > estimated) {
            return { label: "Terlambat", color: "bg-red-100 text-red-700" };
        }
        return { label: "On Schedule", color: "bg-green-100 text-green-700" };
    };

    return (
        <>
            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Verifikasi Nomor HP
                        </h2>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            Masukkan 4 digit terakhir nomor HP yang terdaftar
                        </p>

                        {/* OTP-style input */}
                        <div className="flex justify-center gap-3 mb-6">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-14 h-16 text-2xl font-bold text-center border-2 rounded-xl transition-all duration-200 outline-none
                                        ${verificationError
                                            ? "border-red-300 bg-red-50 text-red-600"
                                            : digit
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white"
                                        }`}
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>

                        {verificationError && (
                            <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-4">
                                <AlertCircle className="w-4 h-4" />
                                <span>{verificationError}</span>
                            </div>
                        )}

                        <Button
                            onClick={() => handleVerify()}
                            disabled={isVerifying || verificationCode.some(d => d === "")}
                            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Memverifikasi...
                                </>
                            ) : (
                                "Verifikasi"
                            )}
                        </Button>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Gunakan 4 digit terakhir nomor HP pemesan jasa penilaian
                        </p>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center pt-24 pb-48 px-4">
                <div className="w-full max-w-5xl">
                    {!projectData && !isLoading && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto text-center">
                            <div className="w-16 h-1 bg-kjpp-red mx-auto mb-6"></div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-wide">
                                Lacak Proyek Anda
                            </h1>

                            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                Masukkan Kode Tracking yang Anda terima untuk memantau perkembangan proses penilaian properti secara real-time.
                            </p>

                            {/* Search Box */}
                            <div className="flex gap-3 max-w-xl mx-auto mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Masukkan Kode Tracking"
                                        value={trackingCode}
                                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                        onKeyPress={handleKeyPress}
                                        className="pl-12 h-14 text-lg border-gray-200 rounded-xl bg-gray-50 focus:bg-white uppercase"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-14 rounded-xl font-semibold"
                                >
                                    Lacak
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Info className="w-4 h-4" />
                                <span>Kode tracking diberikan saat proyek penilaian Anda dibuat.</span>
                            </div>
                            {error && hasSearched && (
                                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-red-800">{error}</p>
                                            <p className="text-sm text-red-600 mt-1">
                                                Pastikan kode tracking yang Anda masukkan benar.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {isLoading && (
                        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl mx-auto text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                                    <div className="w-16 h-16 border-4 border-kjpp-red border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                                    Mencari Proyek...
                                </h3>
                                <p className="text-gray-500">
                                    Mohon tunggu sebentar, kami sedang memeriksa data proyek Anda.
                                </p>
                            </div>
                        </div>
                    )}
                    {projectData && !isLoading && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-5xl mx-auto">
                            <div className="w-16 h-1 bg-kjpp-red mx-auto mb-6"></div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-wide text-center">
                                Status Pelacakan Proyek
                            </h1>
                            <div className="mb-8 w-full overflow-hidden">
                                <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar scroll-smooth">
                                    <div className="flex items-start justify-start md:justify-center min-w-max md:min-w-0 mx-auto w-fit md:w-full pt-4">
                                        {projectData.stages.map((stage, index) => {
                                            const Icon = stageIcons[stage.id] || FileText;
                                            const isCompleted = stage.status === "COMPLETED";
                                            const isActive = stage.status === "IN_PROGRESS";
                                            return (
                                                <div key={stage.id} className="flex items-start flex-1 last:flex-none">
                                                    <div className="flex flex-col items-center relative z-10 w-24 md:w-32 group">
                                                        <div
                                                            className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${isCompleted
                                                                ? "bg-green-500 border-green-500 text-white shadow-green-200"
                                                                : isActive
                                                                    ? "bg-amber-500 border-amber-500 text-white shadow-amber-200 scale-110"
                                                                    : "bg-white border-gray-300 text-gray-300"
                                                                }`}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" />
                                                            ) : (
                                                                <Icon className={`w-4 h-4 md:w-6 md:h-6 ${!isActive && "opacity-50"}`} />
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-[10px] md:text-sm mt-3 text-center font-medium leading-tight px-1 transition-colors duration-300 ${isCompleted
                                                                ? "text-green-600"
                                                                : isActive
                                                                    ? "text-amber-600 font-bold"
                                                                    : "text-gray-400"
                                                                }`}
                                                        >
                                                            {stage.name}
                                                        </span>
                                                    </div>
                                                    {index < projectData.stages.length - 1 && (
                                                        <div className="flex-none md:flex-1 w-8 md:w-auto mt-[19px] md:mt-[27px] mx-1 md:mx-4">
                                                            <div
                                                                className={`h-0.5 w-full rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-gray-300"
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                                <div className="lg:col-span-3">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-green-600" />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">Detail Proyek</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Tracking Code</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 font-mono">
                                                        {projectData.trackingCode}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(projectData.trackingCode)}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        {copied ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Project ID</p>
                                                <span className="font-bold text-gray-900">{projectData.projectId}</span>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-xs text-gray-500 mb-1">Nama Klien</p>
                                            <span className="font-bold text-gray-900">{projectData.clientName}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Lokasi Aset</p>
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 break-all">{projectData.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {projectData.adminMessage && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 mb-2">Pesan untuk Klien</p>
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <p className="text-amber-800 text-sm whitespace-pre-wrap">
                                                        {projectData.adminMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-5">
                                            <Clock className="w-5 h-5 text-gray-600" />
                                            <h2 className="text-lg font-bold text-gray-900">Progress Proyek</h2>
                                        </div>

                                        <div className="text-center mb-6">
                                            <span className="text-4xl font-bold text-blue-600">{projectData.progress}%</span>
                                            <p className="text-sm text-gray-500 mt-1">Selesai</p>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                                            <div
                                                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${projectData.progress}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex flex-col items-center gap-3">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getScheduleStatus().color}`}>
                                                {getScheduleStatus().label}
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                Estimasi Selesai: <span className="font-medium text-gray-900">{getEstimatedDate()}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-kjpp-red rounded-xl p-6 text-white">
                                        <h3 className="text-xl font-bold mb-2">Butuh Bantuan?</h3>
                                        <p className="text-white/90 text-sm mb-4">
                                            Tim support kami siap membantu kendala pelacakan Anda.
                                        </p>
                                        <Button
                                            className="w-full bg-white hover:bg-gray-100 text-kjpp-red font-semibold rounded-lg"
                                            asChild
                                        >
                                            <a href="https://wa.me/6287777200070" target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Hubungi WhatsApp
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileCheck className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Rincian Aktivitas</h2>
                                </div>
                                <div className="space-y-0">
                                    {projectData.stages.flatMap((stage) =>
                                        stage.subSteps.filter(s => s.status !== "PENDING").map((subStep) => (
                                            <div
                                                key={subStep.id}
                                                className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0"
                                            >
                                                <div className={`w-3 h-3 rounded-full shrink-0 ${subStep.status === "COMPLETED"
                                                    ? "bg-green-500"
                                                    : "bg-amber-500 animate-pulse"
                                                    }`} />
                                                <div className="flex-1">
                                                    <span className={`${subStep.status === "COMPLETED"
                                                        ? "text-gray-700"
                                                        : "text-amber-700 font-medium"
                                                        }`}>
                                                        {subStep.name}
                                                    </span>
                                                    {subStep.status === "COMPLETED" && (subStep.startDate || subStep.endDate) && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            Selesai: {subStep.endDate ? formatDate(subStep.endDate) : formatDate(subStep.startDate)}
                                                        </p>
                                                    )}
                                                    {subStep.status === "IN_PROGRESS" && subStep.startDate && (
                                                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                                            <p className="text-xs text-amber-600">
                                                                Dimulai: {formatDate(subStep.startDate)}
                                                            </p>
                                                            {subStep.endDate && (
                                                                <>
                                                                    <span className="text-xs text-gray-400">•</span>
                                                                    <p className="text-xs text-blue-600">
                                                                        Est: {formatDate(subStep.endDate)}
                                                                    </p>
                                                                    {calculateDuration(subStep.startDate, subStep.endDate) && (
                                                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium ml-1">
                                                                            {calculateDuration(subStep.startDate, subStep.endDate)}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {subStep.status === "COMPLETED" ? (
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 border-2 border-amber-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                    {(() => {
                                        const allSubSteps = projectData.stages.flatMap(s => s.subSteps);
                                        const firstPending = allSubSteps.find(s => s.status === "PENDING");
                                        if (firstPending && allSubSteps.some(s => s.status !== "PENDING")) {
                                            return (
                                                <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0">
                                                    <div className="w-3 h-3 rounded-full shrink-0 bg-gray-300" />
                                                    <span className="flex-1 text-gray-400">
                                                        {firstPending.name}
                                                    </span>
                                                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={handleBack}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali ke Pencarian</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
