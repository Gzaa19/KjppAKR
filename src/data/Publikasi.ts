import prisma from "@/lib/prisma";
import type { Publikasi, PublikasiListResult } from "@/types/types";

export async function getPublikasi(options?: {
    published?: boolean;
    limit?: number;
    page?: number;
    authorId?: string;
}) {
    const defaultResult: PublikasiListResult = {
        publikasi: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };

    try {
        const { published, limit = 20, page = 1, authorId } = options || {};
        const skip = (page - 1) * limit;

        const where = {
            ...(published !== undefined && { isPublished: published }),
            ...(authorId && { authorId }),
        };

        const [publikasi, total] = await Promise.all([
            prisma.news.findMany({
                where,
                include: {
                    author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.news.count({ where }),
        ]);

        return {
            publikasi,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Error fetching publikasi:", error);
        return defaultResult;
    }
}

export async function getPublikasiBySlug(slug: string) {
    try {
        const publikasi = await prisma.news.findUnique({
            where: { slug },
            include: {
                author: { select: { id: true, name: true } },
            },
        });

        return publikasi;
    } catch (error) {
        console.error("Error fetching publikasi by slug:", error);
        return null;
    }
}

export async function getPublikasiById(id: string) {
    try {
        const publikasi = await prisma.news.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true } },
            },
        });

        return publikasi;
    } catch (error) {
        console.error("Error fetching publikasi by id:", error);
        return null;
    }
}

export async function getPublishedPublikasi(limit?: number) {
    try {
        const publikasi = await prisma.news.findMany({
            where: { isPublished: true },
            include: {
                author: { select: { id: true, name: true } },
            },
            orderBy: { publishedAt: "desc" },
            take: limit,
        });

        return publikasi;
    } catch (error) {
        console.error("Error fetching published publikasi:", error);
        return [];
    }
}

export async function getLatestPublikasi(count: number = 5) {
    try {
        const publikasi = await prisma.news.findMany({
            where: { isPublished: true },
            include: {
                author: { select: { id: true, name: true } },
            },
            orderBy: { publishedAt: "desc" },
            take: count,
        });

        return publikasi;
    } catch (error) {
        console.error("Error fetching latest publikasi:", error);
        return [];
    }
}

export async function getRelatedPublikasi(
    currentSlug: string,
    limit: number = 3
) {
    try {
        const publikasi = await prisma.news.findMany({
            where: {
                isPublished: true,
                slug: { not: currentSlug },
            },
            include: {
                author: { select: { id: true, name: true } },
            },
            orderBy: { publishedAt: "desc" },
            take: limit,
        });

        return publikasi;
    } catch (error) {
        console.error("Error fetching related publikasi:", error);
        return [];
    }
}

export async function getPublikasiStats(): Promise<{
    totalPublikasi: number;
    publishedPublikasi: number;
    draftPublikasi: number;
}> {
    try {
        const [totalPublikasi, publishedPublikasi] = await Promise.all([
            prisma.news.count(),
            prisma.news.count({ where: { isPublished: true } }),
        ]);

        return {
            totalPublikasi,
            publishedPublikasi,
            draftPublikasi: totalPublikasi - publishedPublikasi,
        };
    } catch (error) {
        console.error("Error fetching publikasi stats:", error);
        return {
            totalPublikasi: 0,
            publishedPublikasi: 0,
            draftPublikasi: 0,
        };
    }
}

export async function searchPublikasi(
    query: string,
    publishedOnly: boolean = true
) {
    try {
        const publikasi = await prisma.news.findMany({
            where: {
                AND: [
                    publishedOnly ? { isPublished: true } : {},
                    {
                        OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            { excerpt: { contains: query, mode: "insensitive" } },
                            { content: { contains: query, mode: "insensitive" } },
                        ],
                    },
                ],
            },
            include: {
                author: { select: { id: true, name: true } },
            },
            orderBy: { publishedAt: "desc" },
        });

        return publikasi;
    } catch (error) {
        console.error("Error searching publikasi:", error);
        return [];
    }
}
