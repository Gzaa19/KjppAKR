import type { NewsCategory } from "@/generated/prisma";

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
