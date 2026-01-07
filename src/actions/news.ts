"use server";

import prisma from "@/lib/prisma";
import { createNewsSchema, updateNewsSchema, type CreateNewsInput, type UpdateNewsInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "./index";


// ============================================
// CREATE
// ============================================
export async function createNews(
    input: CreateNewsInput,
    authorId: string
): Promise<ActionResponse<{ id: string; slug: string }>> {
    try {
        const validated = createNewsSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existingSlug = await prisma.news.findUnique({
            where: { slug: validated.data.slug },
        });

        if (existingSlug) {
            return { success: false, error: "Slug sudah digunakan" };
        }

        const news = await prisma.news.create({
            data: {
                ...validated.data,
                authorId,
                publishedAt: validated.data.isPublished ? new Date() : null,
            },
        });

        revalidatePath("/admin/news");
        return { success: true, data: { id: news.id, slug: news.slug } };
    } catch (error) {
        console.error("Create news error:", error);
        return { success: false, error: "Gagal membuat berita" };
    }
}

// ============================================
// READ
// ============================================
export async function getNews(options?: {
    published?: boolean;
    category?: "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN";
    limit?: number;
    page?: number;
}) {
    try {
        const { published, category, limit = 10, page = 1 } = options || {};
        const skip = (page - 1) * limit;

        const where = {
            ...(published !== undefined && { isPublished: published }),
            ...(category && { category }),
        };

        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where,
                include: {
                    author: {
                        select: { id: true, name: true, avatar: true },
                    },
                    _count: { select: { comments: true } },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.news.count({ where }),
        ]);

        return {
            success: true,
            data: {
                news,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Get news error:", error);
        return { success: false, error: "Gagal mengambil data berita" };
    }
}

export async function getNewsById(id: string) {
    try {
        const news = await prisma.news.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                comments: {
                    where: { isApproved: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!news) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        return { success: true, data: news };
    } catch (error) {
        console.error("Get news by id error:", error);
        return { success: false, error: "Gagal mengambil data berita" };
    }
}

export async function getNewsBySlug(slug: string) {
    try {
        const news = await prisma.news.findUnique({
            where: { slug },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                comments: {
                    where: { isApproved: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!news) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        // Increment views
        await prisma.news.update({
            where: { id: news.id },
            data: { views: { increment: 1 } },
        });

        return { success: true, data: news };
    } catch (error) {
        console.error("Get news by slug error:", error);
        return { success: false, error: "Gagal mengambil data berita" };
    }
}

// ============================================
// UPDATE
// ============================================
export async function updateNews(
    id: string,
    input: UpdateNewsInput
): Promise<ActionResponse<{ id: string; slug: string }>> {
    try {
        const validated = updateNewsSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existing = await prisma.news.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        if (validated.data.slug && validated.data.slug !== existing.slug) {
            const slugExists = await prisma.news.findUnique({
                where: { slug: validated.data.slug },
            });
            if (slugExists) {
                return { success: false, error: "Slug sudah digunakan" };
            }
        }

        const updateData = {
            ...validated.data,
            ...(validated.data.isPublished && !existing.publishedAt && { publishedAt: new Date() }),
        };

        const news = await prisma.news.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/news");
        revalidatePath(`/news/${news.slug}`);
        return { success: true, data: { id: news.id, slug: news.slug } };
    } catch (error) {
        console.error("Update news error:", error);
        return { success: false, error: "Gagal mengupdate berita" };
    }
}

// ============================================
// DELETE
// ============================================
export async function deleteNews(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.news.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        await prisma.news.delete({ where: { id } });

        revalidatePath("/admin/news");
        return { success: true };
    } catch (error) {
        console.error("Delete news error:", error);
        return { success: false, error: "Gagal menghapus berita" };
    }
}

// ============================================
// TOGGLE PUBLISH
// ============================================
export async function togglePublishNews(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.news.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        await prisma.news.update({
            where: { id },
            data: {
                isPublished: !existing.isPublished,
                publishedAt: !existing.isPublished ? new Date() : existing.publishedAt,
            },
        });

        revalidatePath("/admin/news");
        return { success: true };
    } catch (error) {
        console.error("Toggle publish error:", error);
        return { success: false, error: "Gagal mengubah status publikasi" };
    }
}
