import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const totalProjects = await prisma.trackingProject.count();
        const activeProjects = await prisma.trackingProject.count({
            where: { status: { not: "SELESAI" } },
        });
        const completedProjects = await prisma.trackingProject.count({
            where: { status: "SELESAI" },
        });

        const totalClients = await prisma.clientContact.count();

        const projectsByStatus = await prisma.trackingProject.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        const recentProjects = await prisma.trackingProject.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const projectsLastMonth = await prisma.trackingProject.count({
            where: {
                createdAt: {
                    gte: lastMonth,
                    lt: thisMonthStart,
                },
            },
        });

        const projectsThisMonth = await prisma.trackingProject.count({
            where: {
                createdAt: {
                    gte: thisMonthStart,
                },
            },
        });

        const projectChange =
            projectsLastMonth > 0
                ? Math.round(
                    ((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100
                )
                : projectsThisMonth > 0
                    ? 100
                    : 0;

        const statusMap: Record<string, { label: string; color: string }> = {
            VERIFIKASI_DOKUMEN: { label: "Verifikasi Dokumen", color: "bg-red-500" },
            INSPEKSI_LAPANGAN: { label: "Inspeksi Lapangan", color: "bg-blue-600" },
            PROSES_REVIEW: { label: "Proses Review", color: "bg-orange-500" },
            LAPORAN_FINAL: { label: "Laporan Final", color: "bg-green-500" },
            SELESAI: { label: "Selesai", color: "bg-emerald-600" },
        };

        const statusDistribution = projectsByStatus.map((item) => ({
            status: item.status,
            label: statusMap[item.status]?.label || item.status,
            color: statusMap[item.status]?.color || "bg-gray-500",
            count: item._count.status,
            percentage:
                totalProjects > 0
                    ? Math.round((item._count.status / totalProjects) * 100)
                    : 0,
        }));

        return NextResponse.json({
            success: true,
            data: {
                totalProjects,
                activeProjects,
                completedProjects,
                totalClients,
                projectChange,
                statusDistribution,
                recentProjects: recentProjects.map((p) => ({
                    id: p.projectId,
                    client: p.client.name,
                    status: statusMap[p.status]?.label || p.status,
                    progress: p.progress,
                    color: statusMap[p.status]?.color || "bg-gray-500",
                })),
            },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
