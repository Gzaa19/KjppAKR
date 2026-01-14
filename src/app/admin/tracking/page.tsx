"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FolderKanban,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    Plus,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data for dashboard
const stats = [
    {
        title: "Total Proyek Aktif",
        value: "45",
        change: "+12%",
        trend: "up",
        icon: FolderKanban,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Total Klien",
        value: "124",
        change: "+8%",
        trend: "up",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Proyek Selesai",
        value: "28",
        change: "+15%",
        trend: "up",
        icon: CheckCircle2,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Dalam Progress",
        value: "17",
        change: "-5%",
        trend: "down",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const recentProjects = [
    {
        id: "PRJ-2023-001",
        client: "PT. Bank Mandiri (Persero) Tbk.",
        status: "Verifikasi Dokumen",
        progress: 30,
        color: "bg-red-500",
    },
    {
        id: "PRJ-2023-002",
        client: "BCA (Kantor Wilayah XII)",
        status: "Inspeksi Lapangan",
        progress: 50,
        color: "bg-blue-600",
    },
    {
        id: "PRJ-2023-003",
        client: "PT. Alam Sutera Realty Tbk.",
        status: "Proses Review",
        progress: 85,
        color: "bg-orange-500",
    },
];

export default function TrackingDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Tracking System
                </h1>
                <p className="text-gray-600">
                    Pantau dan kelola seluruh proyek penilaian properti secara real-time
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp
                                        className={`h-4 w-4 ${stat.trend === "up"
                                                ? "text-green-600"
                                                : "text-red-600 rotate-180"
                                            }`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${stat.trend === "up"
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        dari bulan lalu
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            asChild
                            className="w-full justify-start bg-blue-950 hover:bg-blue-900 text-white"
                        >
                            <Link href="/admin/tracking/projects/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Proyek Baru
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/admin/tracking/clients/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Klien Baru
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/admin/tracking/projects">
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Lihat Semua Proyek
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/admin/tracking/clients">
                                <Users className="mr-2 h-4 w-4" />
                                Lihat Semua Klien
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Proyek Terbaru</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/tracking/projects">
                                Lihat Semua
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="space-y-2 pb-4 border-b last:border-0 last:pb-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900">
                                            {project.id}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {project.client}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {project.progress}%
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-700">
                                        {project.status}
                                    </p>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${project.color}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Status Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Status Proyek Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Verifikasi Dokumen
                                </span>
                                <span className="text-sm font-bold text-gray-900">8</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full w-[40%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Inspeksi Lapangan
                                </span>
                                <span className="text-sm font-bold text-gray-900">12</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full w-[60%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Proses Review</span>
                                <span className="text-sm font-bold text-gray-900">15</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full w-[75%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Laporan Final</span>
                                <span className="text-sm font-bold text-gray-900">10</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full w-[50%]" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
