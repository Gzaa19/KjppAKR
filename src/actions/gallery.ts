"use server";

import prisma from "@/lib/prisma";
import {
    createAlbumSchema,
    updateAlbumSchema,
    createGallerySchema,
    updateGallerySchema,
    type CreateAlbumInput,
    type UpdateAlbumInput,
    type CreateGalleryInput,
    type UpdateGalleryInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/action-response";


// ============================================
// ALBUM ACTIONS
// ============================================

export async function createAlbum(input: CreateAlbumInput): Promise<ActionResponse<{ id: string; slug: string }>> {
    try {
        const validated = createAlbumSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existingSlug = await prisma.album.findUnique({
            where: { slug: validated.data.slug },
        });

        if (existingSlug) {
            return { success: false, error: "Slug album sudah digunakan" };
        }

        const album = await prisma.album.create({
            data: validated.data,
        });

        revalidatePath("/admin/gallery");
        return { success: true, data: { id: album.id, slug: album.slug } };
    } catch (error) {
        console.error("Create album error:", error);
        return { success: false, error: "Gagal membuat album" };
    }
}

export async function getAlbums(activeOnly: boolean = false) {
    try {
        const albums = await prisma.album.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            include: {
                _count: { select: { galleries: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: albums };
    } catch (error) {
        console.error("Get albums error:", error);
        return { success: false, error: "Gagal mengambil data album" };
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

        if (!album) {
            return { success: false, error: "Album tidak ditemukan" };
        }

        return { success: true, data: album };
    } catch (error) {
        console.error("Get album by slug error:", error);
        return { success: false, error: "Gagal mengambil data album" };
    }
}

export async function updateAlbum(
    id: string,
    input: UpdateAlbumInput
): Promise<ActionResponse<{ id: string; slug: string }>> {
    try {
        const validated = updateAlbumSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existing = await prisma.album.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Album tidak ditemukan" };
        }

        if (validated.data.slug && validated.data.slug !== existing.slug) {
            const slugExists = await prisma.album.findUnique({
                where: { slug: validated.data.slug },
            });
            if (slugExists) {
                return { success: false, error: "Slug sudah digunakan" };
            }
        }

        const album = await prisma.album.update({
            where: { id },
            data: validated.data,
        });

        revalidatePath("/admin/gallery");
        return { success: true, data: { id: album.id, slug: album.slug } };
    } catch (error) {
        console.error("Update album error:", error);
        return { success: false, error: "Gagal mengupdate album" };
    }
}

export async function deleteAlbum(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.album.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Album tidak ditemukan" };
        }

        await prisma.album.delete({ where: { id } });

        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error) {
        console.error("Delete album error:", error);
        return { success: false, error: "Gagal menghapus album" };
    }
}

// ============================================
// GALLERY ACTIONS
// ============================================

export async function createGallery(
    input: CreateGalleryInput,
    uploadedById: string
): Promise<ActionResponse<{ id: string }>> {
    try {
        const validated = createGallerySchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const gallery = await prisma.gallery.create({
            data: {
                ...validated.data,
                uploadedById,
            },
        });

        revalidatePath("/admin/gallery");
        return { success: true, data: { id: gallery.id } };
    } catch (error) {
        console.error("Create gallery error:", error);
        return { success: false, error: "Gagal menambahkan foto" };
    }
}

export async function getGalleries(options?: {
    published?: boolean;
    albumId?: string;
    limit?: number;
    page?: number;
}) {
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
            success: true,
            data: {
                galleries,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Get galleries error:", error);
        return { success: false, error: "Gagal mengambil data galeri" };
    }
}

export async function getGalleryById(id: string) {
    try {
        const gallery = await prisma.gallery.findUnique({
            where: { id },
            include: {
                album: true,
                uploadedBy: { select: { id: true, name: true } },
            },
        });

        if (!gallery) {
            return { success: false, error: "Foto tidak ditemukan" };
        }

        return { success: true, data: gallery };
    } catch (error) {
        console.error("Get gallery by id error:", error);
        return { success: false, error: "Gagal mengambil data foto" };
    }
}

export async function updateGallery(id: string, input: UpdateGalleryInput): Promise<ActionResponse<{ id: string }>> {
    try {
        const validated = updateGallerySchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existing = await prisma.gallery.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Foto tidak ditemukan" };
        }

        const gallery = await prisma.gallery.update({
            where: { id },
            data: validated.data,
        });

        revalidatePath("/admin/gallery");
        return { success: true, data: { id: gallery.id } };
    } catch (error) {
        console.error("Update gallery error:", error);
        return { success: false, error: "Gagal mengupdate foto" };
    }
}

export async function deleteGallery(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.gallery.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Foto tidak ditemukan" };
        }

        await prisma.gallery.delete({ where: { id } });

        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error) {
        console.error("Delete gallery error:", error);
        return { success: false, error: "Gagal menghapus foto" };
    }
}

export async function togglePublishGallery(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.gallery.findUnique({ where: { id } });
        if (!existing) {
            return { success: false, error: "Foto tidak ditemukan" };
        }

        await prisma.gallery.update({
            where: { id },
            data: { isPublished: !existing.isPublished },
        });

        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error) {
        console.error("Toggle publish gallery error:", error);
        return { success: false, error: "Gagal mengubah status publikasi" };
    }
}

export async function reorderGalleries(items: { id: string; sortOrder: number }[]): Promise<ActionResponse> {
    try {
        await Promise.all(
            items.map((item) =>
                prisma.gallery.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder },
                })
            )
        );

        revalidatePath("/admin/gallery");
        return { success: true };
    } catch (error) {
        console.error("Reorder galleries error:", error);
        return { success: false, error: "Gagal mengubah urutan foto" };
    }
}
