/**
 * Data Access Layer (DAL) for Gallery
 *
 * This file contains functions that directly access the database
 * for gallery-related data. Use these in Server Components.
 */

import prisma from "@/lib/prisma";

export interface Album {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        galleries: number;
    };
}

export interface Gallery {
    id: string;
    imageUrl: string;
    thumbnailUrl: string | null;
    title: string | null;
    caption: string | null;
    location: string | null;
    takenAt: Date | null;
    sortOrder: number;
    isPublished: boolean;
    albumId: string | null;
    uploadedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    album?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    uploadedBy?: {
        id: string;
        name: string;
    } | null;
}

export interface GalleryPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GalleryListResult {
    galleries: Gallery[];
    pagination: GalleryPagination;
}

// ============================================
// ALBUM DATA ACCESS
// ============================================

/**
 * Fetch all albums from the database
 * Returns empty array on error
 */
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

/**
 * Fetch a single album by slug
 * Returns null if not found or on error
 */
export async function getAlbumBySlug(slug: string): Promise<(Album & { galleries: Gallery[] }) | null> {
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

/**
 * Fetch a single album by ID
 * Returns null if not found or on error
 */
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

// ============================================
// GALLERY DATA ACCESS
// ============================================

/**
 * Fetch galleries with optional filtering and pagination
 * Returns empty result on error
 */
export async function getGalleries(options?: {
    published?: boolean;
    albumId?: string;
    limit?: number;
    page?: number;
}): Promise<GalleryListResult> {
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

/**
 * Fetch a single gallery by ID
 * Returns null if not found or on error
 */
export async function getGalleryById(id: string): Promise<Gallery | null> {
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

/**
 * Fetch published galleries for public display
 * Returns empty array on error
 */
export async function getPublishedGalleries(limit?: number): Promise<Gallery[]> {
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

/**
 * Fetch galleries by album ID
 * Returns empty array on error
 */
export async function getGalleriesByAlbumId(
    albumId: string,
    publishedOnly: boolean = true
): Promise<Gallery[]> {
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

/**
 * Get gallery statistics
 * Returns default values on error
 */
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
