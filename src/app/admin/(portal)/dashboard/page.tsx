"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ImageIcon, NewspaperIcon, LayoutDashboardIcon, UsersIcon, BarChartIcon } from "lucide-react"

export default function DashboardPage() {
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
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
                    <p className="text-muted-foreground">
                        Selamat datang di panel admin KJPP AKR
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
                        <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+3 dari bulan lalu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gallery</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+12 gambar baru</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Admin aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengunjung</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">Bulan ini</p>
                    </CardContent>
                </Card>
            </div>

            {/* Features Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Menu Fitur</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Link key={feature.title} href={feature.href}>
                            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className={`p-3 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform`}>
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
    )
}
