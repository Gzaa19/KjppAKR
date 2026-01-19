import prisma from "@/lib/prisma";
import type { Album, Gallery, GalleryListResult } from "@/types";

export async function getAlbums(activeOnly: boolean = false): Promise<Album[]> {
    try {
        const albums = await prisma.album.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            include: {
                _count: { select: { galleries: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return albums;
    } catch (error) {
        console.error("Error fetching albums:", error);
        return [];
    }
}

export async function getAlbumBySlug(slug: string) {
    try {
        const album = await prisma.album.findUnique({
            where: { slug },
            include: {
                galleries: {
                    where: { isPublished: true },
                    orderBy: { sortOrder: "asc" },
                },
            },
        });

        return album;
    } catch (error) {
        console.error("Error fetching album by slug:", error);
        return null;
    }
}

export async function getAlbumById(id: string): Promise<Album | null> {
    try {
        const album = await prisma.album.findUnique({
            where: { id },
            include: {
                _count: { select: { galleries: true } },
            },
        });

        return album;
    } catch (error) {
        console.error("Error fetching album by id:", error);
        return null;
    }
}

export async function getGalleries(options?: {
    published?: boolean;
    albumId?: string;
    limit?: number;
    page?: number;
}) {
    const defaultResult: GalleryListResult = {
        galleries: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };

    try {
        const { published, albumId, limit = 20, page = 1 } = options || {};
        const skip = (page - 1) * limit;

        const where = {
            ...(published !== undefined && { isPublished: published }),
            ...(albumId && { albumId }),
        };

        const [galleries, total] = await Promise.all([
            prisma.gallery.findMany({
                where,
                include: {
                    album: { select: { id: true, name: true, slug: true } },
                    uploadedBy: { select: { id: true, name: true } },
                },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
                take: limit,
                skip,
            }),
            prisma.gallery.count({ where }),
        ]);

        return {
            galleries,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Error fetching galleries:", error);
        return defaultResult;
    }
}

export async function getGalleryById(id: string) {
    try {
        const gallery = await prisma.gallery.findUnique({
            where: { id },
            include: {
                album: { select: { id: true, name: true, slug: true } },
                uploadedBy: { select: { id: true, name: true } },
            },
        });

        return gallery;
    } catch (error) {
        console.error("Error fetching gallery by id:", error);
        return null;
    }
}

export async function getPublishedGalleries(limit?: number) {
    try {
        const galleries = await prisma.gallery.findMany({
            where: { isPublished: true },
            include: {
                album: { select: { id: true, name: true, slug: true } },
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            take: limit,
        });

        return galleries;
    } catch (error) {
        console.error("Error fetching published galleries:", error);
        return [];
    }
}

export async function getGalleriesByAlbumId(
    albumId: string,
    publishedOnly: boolean = true
) {
    try {
        const galleries = await prisma.gallery.findMany({
            where: {
                albumId,
                ...(publishedOnly && { isPublished: true }),
            },
            include: {
                album: { select: { id: true, name: true, slug: true } },
                uploadedBy: { select: { id: true, name: true } },
            },
            orderBy: { sortOrder: "asc" },
        });

        return galleries;
    } catch (error) {
        console.error("Error fetching galleries by album:", error);
        return [];
    }
}

export async function getGalleryStats(): Promise<{
    totalAlbums: number;
    totalGalleries: number;
    publishedGalleries: number;
}> {
    try {
        const [totalAlbums, totalGalleries, publishedGalleries] = await Promise.all([
            prisma.album.count(),
            prisma.gallery.count(),
            prisma.gallery.count({ where: { isPublished: true } }),
        ]);

        return {
            totalAlbums,
            totalGalleries,
            publishedGalleries,
        };
    } catch (error) {
        console.error("Error fetching gallery stats:", error);
        return {
            totalAlbums: 0,
            totalGalleries: 0,
            publishedGalleries: 0,
        };
    }
}
