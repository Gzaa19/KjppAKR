"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Calendar,
    Folder,
    Lightbulb,
    ExternalLink,
    Save
} from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"

// Mock Steps Data
const steps = [
    { id: 1, name: "Permohonan Penilaian", status: "completed", date: "10/01/2023" },
    { id: 2, name: "Proposal Penawaran", status: "completed", date: "10/05/2023" },
    { id: 3, name: "Verifikasi Dokumen", status: "in-progress", date: "10/12/2023" },
    { id: 4, name: "Penjadwalan Inspeksi", status: "pending", date: "" },
    { id: 5, name: "Proses Penilaian", status: "pending", date: "" },
    { id: 6, name: "Proses Review", status: "pending", date: "" },
    { id: 7, name: "Resume Nilai", status: "pending", date: "" },
    { id: 8, name: "Laporan Final", status: "pending", date: "" },
]

export default function UpdateProgressPage() {
    const params = useParams()

    // Status Badge Helpers
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-white border-gray-200 text-gray-900 font-medium'
            case 'in-progress': return 'bg-red-50 border-red-200 text-red-600 font-medium'
            case 'pending': return 'bg-gray-50 border-gray-100 text-gray-400'
            default: return 'bg-white border-gray-200 text-gray-900'
        }
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/tracking/projects">Proyek</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Update Progress</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Update Progress Proyek</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-900">
                        <Link href="/admin/tracking/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke List
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Top Project Summary Card */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100/80 text-gray-600">
                            <Folder className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg text-gray-900">PROP/AKR/2023/X/045</span>
                            </div>
                            <p className="text-sm text-gray-500">PT. Bank Mandiri (Persero) Tbk. - Penilaian Ruko Kebayoran</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 border-l pl-8 border-gray-100">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status Saat Ini</p>
                            <Badge className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 font-semibold px-3 py-1 uppercase rounded-md shadow-none">
                                Verifikasi Dokumen
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Terakhir Update</p>
                            <p className="text-sm font-bold text-gray-900">13 Okt 2023, 14:00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Progress Steps */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Tahapan Progress</h2>

                        <div className="space-y-4">
                            {steps.map((step) => (
                                <div key={step.id} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <span className={`text-sm font-medium ${step.status === 'completed' ? 'text-gray-900' :
                                                step.status === 'in-progress' ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.id}. {step.name}
                                        </span>
                                    </div>
                                    <div className="col-span-4">
                                        <Select defaultValue={
                                            step.status === 'completed' ? 'completed' :
                                                step.status === 'in-progress' ? 'in-progress' : 'pending'
                                        }>
                                            <SelectTrigger className={`h-9 text-xs ${getStatusColor(step.status)}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                className={`h-9 pl-3 pr-9 text-xs ${step.status === 'pending' ? 'text-gray-400 bg-gray-50 border-gray-100' : 'text-gray-900 bg-white border-gray-200'
                                                    }`}
                                                defaultValue={step.date}
                                                placeholder="mm/dd/yyyy"
                                                readOnly={step.status === 'pending'}
                                            />
                                            <Calendar className={`absolute right-3 top-2.5 h-4 w-4 ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'
                                                }`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Discussion Section */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 border-l-4 border-blue-950 pl-3">
                                <h2 className="text-lg font-bold text-gray-900">Diskusi Proyek Terakhir</h2>
                            </div>
                            <Link href="#" className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                                Buka Semua Diskusi
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                                    CL
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900">Klien</span>
                                        <span className="text-[10px] text-gray-400">12 Okt 2023, 10:30</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Baik, sedang kami mintakan ke bagian keuangan. Akan segera kami kirimkan paling lambat sore ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Admin Tools */}
                <div className="space-y-6">
                    {/* Admin Notes */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <div className="h-0.5 w-3 bg-red-600 rounded-full"></div>
                            <div className="h-0.5 w-1.5 bg-red-600 rounded-full"></div>
                            <h2 className="text-sm font-bold text-gray-900 ml-1">Catatan Admin</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pesan Untuk Klien</Label>
                                <Textarea
                                    className="min-h-[120px] resize-none bg-white text-sm"
                                    placeholder="Tulis pesan untuk klien..."
                                    defaultValue="Dokumen legalitas & penunjang proses penilaian sedang diverifikasi oleh tim admin kami."
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <Switch id="notify" defaultChecked className="data-[state=checked]:bg-red-500" />
                                <Label htmlFor="notify" className="text-sm font-medium text-gray-700">Kirim Notifikasi ke Klien</Label>
                            </div>

                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-10 font-medium">
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </Button>

                            <Button variant="secondary" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 h-10 font-medium">
                                Batalkan
                            </Button>
                        </div>
                    </div>

                    {/* Admin Tips */}
                    <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5">
                        <div className="flex gap-3">
                            <div className="mt-0.5 text-blue-600">
                                <Lightbulb className="h-5 w-5 fill-current" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-blue-900">Tips Admin</h3>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Pastikan tanggal yang dipilih akurat untuk menjaga transparansi estimasi waktu pengerjaan kepada klien.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
