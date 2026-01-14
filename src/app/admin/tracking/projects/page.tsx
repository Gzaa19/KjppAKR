"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    Pencil,
    Plus,
    Search
} from "lucide-react"
import Link from "next/link"

// Mock Data
const projects = [
    {
        id: "PRJ-2023-001",
        proposalNo: "PROP/AKR/2023/X/045",
        clientName: "PT. Bank Mandiri (Persero) Tbk.",
        clientLocation: "Kebayoran Baru, Jakarta Selatan",
        type: "RUKO / KANTOR",
        status: "Verifikasi Dokumen",
        progress: 30,
        progressColor: "bg-red-500",
    },
    {
        id: "PRJ-2023-002",
        proposalNo: "PROP/AKR/2023/X/046",
        clientName: "BCA (Kantor Wilayah XII)",
        clientLocation: "BSD City, Tangerang",
        type: "TANAH KOSONG",
        status: "Inspeksi Lapangan",
        progress: 50,
        progressColor: "bg-blue-600",
    },
    {
        id: "PRJ-2023-003",
        proposalNo: "PROP/AKR/2023/X/047",
        clientName: "PT. Alam Sutera Realty Tbk.",
        clientLocation: "Alam Sutera, Tangerang",
        type: "GUDANG",
        status: "Proses Review",
        progress: 85,
        progressColor: "bg-orange-500",
    },
    {
        id: "PRJ-2023-004",
        proposalNo: "PROP/AKR/2023/X/048",
        clientName: "BCA Syariah",
        clientLocation: "Jakarta Pusat",
        type: "RUMAH TINGGAL",
        status: "Laporan Final",
        progress: 100,
        progressColor: "bg-green-500",
    },
]

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight">Daftar Proyek Aktif</h1>
                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">Semua Status</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-type">
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-type">Semua Tipe</SelectItem>
                            <SelectItem value="house">Rumah Tinggal</SelectItem>
                            <SelectItem value="office">Ruko / Kantor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button asChild className="ml-2 bg-blue-950 text-white hover:bg-blue-900">
                        <Link href="/admin/tracking/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambahkan Proyek Baru
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border text-card-foreground shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[250px] font-semibold text-xs tracking-wider text-gray-500 uppercase">ID / PROPOSAL NO.</TableHead>
                            <TableHead className="w-[300px] font-semibold text-xs tracking-wider text-gray-500 uppercase">CLIENT / PEMOHON</TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase">TIPE OBJEK</TableHead>
                            <TableHead className="w-[200px] font-semibold text-xs tracking-wider text-gray-500 uppercase">PROGRESS</TableHead>
                            <TableHead className="text-right font-semibold text-xs tracking-wider text-gray-500 uppercase">AKSI</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id} className="hover:bg-gray-50">
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{project.id}</span>
                                        <span className="text-xs text-gray-500">{project.proposalNo}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{project.clientName}</span>
                                        <span className="text-xs text-gray-500">{project.clientLocation}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <Badge variant="secondary" className="rounded-md font-normal text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase">
                                        {project.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className={`font-semibold ${project.progressColor.replace('bg-', 'text-')}`}>
                                                {project.status}
                                            </span>
                                            <span className="text-gray-500">{project.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${project.progressColor}`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top text-right py-4">
                                    <Button asChild size="sm" className="bg-[#1e293b] hover:bg-[#0f172a] text-white">
                                        <Link href={`/admin/tracking/projects/${project.id}/update`}>
                                            <Pencil className="mr-2 h-3.5 w-3.5" />
                                            Update Proyek
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-gray-500">
                        Menampilkan 1 - 4 dari 45 proyek aktif
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon" className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white">
                            1
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            2
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            3
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
