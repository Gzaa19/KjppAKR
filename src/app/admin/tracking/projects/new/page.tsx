"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Building2,
    FolderOpen,
    MessageSquareText,
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

export default function NewProjectPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
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
                                <BreadcrumbPage>Tambah Proyek Baru</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Buat Proyek Penilaian</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-900">
                        <Link href="/admin/tracking/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">

                {/* Card 1: Informasi Administrasi */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <FolderOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Informasi Administrasi</h2>
                            <p className="text-sm text-gray-500">Detail proposal dan identitas klien</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="proposal_no" className="text-xs font-bold text-gray-500 uppercase tracking-wider">No. Proposal</Label>
                            <Input
                                id="proposal_no"
                                placeholder="Contoh: PROP/AKR/2023/X/045"
                                className="h-11 bg-gray-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Client</Label>
                            <Select>
                                <SelectTrigger className="h-11 bg-gray-50/50">
                                    <SelectValue placeholder="Pilih Client..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client1">PT. Bank Mandiri (Persero) Tbk.</SelectItem>
                                    <SelectItem value="client2">BCA (Kantor Wilayah XII)</SelectItem>
                                    <SelectItem value="client3">PT. Alam Sutera Realty Tbk.</SelectItem>
                                    <SelectItem value="client4">BCA Syariah</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Card 2: Detail Objek Penilaian */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Detail Objek Penilaian</h2>
                            <p className="text-sm text-gray-500">Spesifikasi aset dan tujuan pekerjaan</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="object_type" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Objek</Label>
                                <Select>
                                    <SelectTrigger className="h-11 bg-gray-50/50">
                                        <SelectValue placeholder="Pilih Jenis Objek..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="house">Rumah Tinggal</SelectItem>
                                        <SelectItem value="office">Ruko / Kantor</SelectItem>
                                        <SelectItem value="land">Tanah Kosong</SelectItem>
                                        <SelectItem value="warehouse">Gudang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="objective" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tujuan Penilaian</Label>
                                <Input
                                    id="objective"
                                    placeholder="Contoh: Penjaminan Hutang / Kredit Bank"
                                    className="h-11 bg-gray-50/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</Label>
                            <Textarea
                                id="address"
                                placeholder="Masukkan alamat lengkap lokasi properti..."
                                className="min-h-[132px] bg-gray-50/50 resize-none p-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Card 3: Diskusi Proyek */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <MessageSquareText className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Diskusi Proyek</h2>
                            <p className="text-sm text-gray-500">Mulai diskusi atau berikan instruksi awal kepada klien</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                            <p className="text-sm italic text-gray-500">
                                Belum ada diskusi dimulai. Anda dapat mengirimkan pesan pembuka di bawah ini.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pesan Pembuka (Opsional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Contoh: Selamat pagi, kami telah menerima aplikasi Anda. Mohon lengkapi dokumen berikut..."
                                className="min-h-[100px] bg-gray-50/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button variant="outline" size="lg" className="h-12 w-32">
                        Batal
                    </Button>
                    <Button size="lg" className="h-12 w-48 bg-blue-950 text-white hover:bg-blue-900">
                        <Save className="mr-2 h-4 w-4" />
                        Buat Proyek
                    </Button>
                </div>
            </div>
        </div>
    )
}
