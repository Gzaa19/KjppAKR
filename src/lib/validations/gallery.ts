import { z } from "zod";

export const createAlbumSchema = z.object({
    name: z.string().min(2, "Nama album minimal 2 karakter"),
    slug: z
        .string()
        .min(2, "Slug minimal 2 karakter")
        .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
    description: z.string().optional().nullable(),
    coverImage: z.string().url("URL gambar tidak valid").optional().nullable(),
    isActive: z.boolean().default(true),
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const createGallerySchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    description: z.string().optional().nullable(),
    imageUrl: z.string().url("URL gambar tidak valid"),
    thumbnailUrl: z.string().url("URL thumbnail tidak valid").optional().nullable(),
    eventDate: z.date().optional().nullable(),
    albumId: z.string().optional().nullable(),
    isPublished: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
});

export const updateGallerySchema = createGallerySchema.partial();

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
