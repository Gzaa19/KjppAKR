/**
 * Data Access Layer (DAL) for Publikasi (News)
 *
 * This file contains functions that directly access the database
 * for publikasi/news-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export interface Publikasi {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    isPublished: boolean;
    publishedAt: Date | null;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    author?: {
        id: string;
        name: string;
    } | null;
}

export interface PublikasiPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PublikasiListResult {
    publikasi: Publikasi[];
    pagination: PublikasiPagination;
}

// ============================================
// PUBLIKASI DATA ACCESS
// ============================================

/**
 * Fetch all publikasi with optional filtering and pagination
 * Returns empty result on error
 */
export async function getPublikasi(options?: {
    published?: boolean;
    limit?: number;
    page?: number;
    authorId?: string;
}): Promise<PublikasiListResult> {
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

/**
 * Fetch a single publikasi by slug
 * Returns null if not found or on error
 */
export async function getPublikasiBySlug(slug: string): Promise<Publikasi | null> {
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

/**
 * Fetch a single publikasi by ID
 * Returns null if not found or on error
 */
export async function getPublikasiById(id: string): Promise<Publikasi | null> {
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

/**
 * Fetch published publikasi for public display
 * Returns empty array on error
 */
export async function getPublishedPublikasi(limit?: number): Promise<Publikasi[]> {
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

/**
 * Fetch latest publikasi
 * Returns empty array on error
 */
export async function getLatestPublikasi(count: number = 5): Promise<Publikasi[]> {
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

/**
 * Fetch related publikasi (excluding current one)
 * Returns empty array on error
 */
export async function getRelatedPublikasi(
    currentSlug: string,
    limit: number = 3
): Promise<Publikasi[]> {
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

/**
 * Get publikasi statistics
 * Returns default values on error
 */
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

/**
 * Search publikasi by title or content
 * Returns empty array on error
 */
export async function searchPublikasi(
    query: string,
    publishedOnly: boolean = true
): Promise<Publikasi[]> {
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
