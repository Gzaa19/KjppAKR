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
    TrendingDown,
    Plus,
    ArrowRight,
    Loader2,
} from "lucide-react";
import Link from "next/link";

// Types
interface StatsData {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalClients: number;
    projectChange: number;
    statusDistribution: {
        status: string;
        label: string;
        color: string;
        count: number;
        percentage: number;
    }[];
    recentProjects: {
        id: string;
        client: string;
        status: string;
        progress: number;
        color: string;
    }[];
}

export default function TrackingDashboard() {
    const [stats, setStats] = React.useState<StatsData | null>(null);
    const [loading, setLoading] = React.useState(true);

    // Fetch dashboard stats
    React.useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/tracking-projects/stats");
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const statsCards = [
        {
            title: "Total Proyek Aktif",
            value: stats?.activeProjects.toString() || "0",
            change: stats?.projectChange ? `${stats.projectChange > 0 ? "+" : ""}${stats.projectChange}%` : "0%",
            trend: (stats?.projectChange || 0) >= 0 ? "up" : "down",
            icon: FolderKanban,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Total Klien",
            value: stats?.totalClients.toString() || "0",
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Proyek Selesai",
            value: stats?.completedProjects.toString() || "0",
            change: "+15%",
            trend: "up",
            icon: CheckCircle2,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Total Proyek",
            value: stats?.totalProjects.toString() || "0",
            change: `${stats?.projectChange ? (stats.projectChange > 0 ? "+" : "") + stats.projectChange : "0"}%`,
            trend: (stats?.projectChange || 0) >= 0 ? "up" : "down",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Appraisal Tracker
                </h1>
                <p className="text-gray-600">
                    Pantau dan kelola seluruh proyek penilaian properti secara real-time
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => {
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
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Progres Proyek</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {stats?.recentProjects && stats.recentProjects.length > 0 ? (
                            stats.recentProjects.map((project) => (
                                <div key={project.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{project.client}</span>
                                            <span className="text-xs text-gray-500 capitalize">{project.status.toLowerCase().replace(/_/g, " ")}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${project.color} rounded-full`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Belum ada data proyek terbaru
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
