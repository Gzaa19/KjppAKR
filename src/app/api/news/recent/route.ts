import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            where: {
                isPublished: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                category: true,
                publishedAt: true,
                createdAt: true,
                coverImage: true,
            }
        });

        return NextResponse.json({ success: true, data: news });
    } catch (error) {
        console.error("API News Recent Error:", error);
        return NextResponse.json(
            { success: false, error: "Gagal mengambil berita terbaru" },
            { status: 500 }
        );
    }
}
