import type { NewsCategory } from "@/generated/prisma";

export type ActionResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
};

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
    title: string;
    description: string | null;
    imageUrl: string;
    thumbnailUrl: string | null;
    eventDate: Date | null;
    isPublished: boolean;
    sortOrder: number;
    albumId: string | null;
    uploadedById: string;
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
    };
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

export interface Publikasi {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: NewsCategory;
    isPublished: boolean;
    publishedAt: Date | null;
    views: number;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author?: {
        id: string;
        name: string;
    };
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
