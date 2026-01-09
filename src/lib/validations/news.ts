import { z } from "zod";

export const createNewsSchema = z.object({
    title: z.string().min(5, "Judul minimal 5 karakter").max(200, "Judul maksimal 200 karakter"),
    slug: z
        .string()
        .min(3, "Slug minimal 3 karakter")
        .max(100, "Slug maksimal 100 karakter")
        .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
    excerpt: z.string().max(500, "Ringkasan maksimal 500 karakter").optional(),
    content: z.string().min(10, "Konten minimal 10 karakter"),
    coverImage: z.string().url("URL gambar tidak valid").optional().nullable(),
    category: z.enum(["ARTIKEL", "BERITA", "KEGIATAN", "PENGUMUMAN"], {
        message: "Kategori harus dipilih",
    }),
    isPublished: z.boolean().default(false),
    publishedAt: z.date().optional().nullable(),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
