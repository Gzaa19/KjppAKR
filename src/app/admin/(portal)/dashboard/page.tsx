import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ImageIcon, NewspaperIcon, UsersIcon, BarChartIcon, Building2 } from "lucide-react";
import prisma from "@/lib/prisma";

async function getDashboardStats() {
    const [newsCount, galleryCount, userCount, publishedNewsCount, managementCount, clientCount] = await Promise.all([
        prisma.news.count(),
        prisma.gallery.count(),
        prisma.user.count(),
        prisma.news.count({ where: { isPublished: true } }),
        prisma.managementTeam.count(),
        prisma.client.count(),
    ]);

    return {
        newsCount,
        galleryCount,
        userCount,
        publishedNewsCount,
        managementCount,
        clientCount,
    };
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    const features = [
        {
            title: "Gallery",
            description: "Kelola gambar dan aset media",
            href: "/admin/gallery",
            icon: ImageIcon,
            color: "bg-gradient-to-br from-green-500 to-emerald-600",
        },
        {
            title: "News",
            description: "Kelola berita dan artikel",
            href: "/admin/news",
            icon: NewspaperIcon,
            color: "bg-gradient-to-br from-blue-500 to-cyan-600",
        },
        {
            title: "Manajemen",
            description: "Kelola tim manajemen",
            href: "/admin/management",
            icon: UsersIcon,
            color: "bg-gradient-to-br from-purple-500 to-violet-600",
        },
        {
            title: "Klien",
            description: "Kelola daftar klien",
            href: "/admin/clients",
            icon: Building2,
            color: "bg-gradient-to-br from-orange-500 to-red-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Selamat datang di panel admin KJPP AKR</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
                        <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.newsCount}</div>
                        <p className="text-xs text-muted-foreground">{stats.publishedNewsCount} published</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gallery</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.galleryCount}</div>
                        <p className="text-xs text-muted-foreground">foto tersimpan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">Admin aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tim Manajemen</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.managementCount}</div>
                        <p className="text-xs text-muted-foreground">anggota tim</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Klien</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.clientCount}</div>
                        <p className="text-xs text-muted-foreground">klien terdaftar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.publishedNewsCount}</div>
                        <p className="text-xs text-muted-foreground">Berita dipublikasi</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Menu Fitur</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Link key={feature.title} href={feature.href}>
                            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform`}
                                    >
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
