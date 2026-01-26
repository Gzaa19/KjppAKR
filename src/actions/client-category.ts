"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema
const clientCategorySchema = z.object({
    name: z.string().min(2, "Nama kategori minimal 2 karakter").max(100, "Nama kategori maksimal 100 karakter"),
    slug: z.string().min(2, "Slug minimal 2 karakter").max(100, "Slug maksimal 100 karakter"),
    sortOrder: z.number().int().min(1, "Urutan tampilan minimal 1").default(1),
    isActive: z.boolean().default(true),
});

type ClientCategoryInput = z.infer<typeof clientCategorySchema>;

// Get all categories
export async function getClientCategories() {
    try {
        const categories = await prisma.clientCategory.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: {
                _count: {
                    select: { clients: true },
                },
            },
        });

        return { success: true, data: { categories } };
    } catch (error) {
        console.error("Error fetching client categories:", error);
        return { success: false, error: "Gagal mengambil data kategori" };
    }
}

// Get active categories for dropdown
export async function getActiveClientCategories() {
    try {
        const categories = await prisma.clientCategory.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }],
        });

        return { success: true, data: { categories } };
    } catch (error) {
        console.error("Error fetching active client categories:", error);
        return { success: false, error: "Gagal mengambil data kategori" };
    }
}

// Get single category
export async function getClientCategory(id: string) {
    try {
        const category = await prisma.clientCategory.findUnique({
            where: { id },
        });

        if (!category) {
            return { success: false, error: "Kategori tidak ditemukan" };
        }

        return { success: true, data: { category } };
    } catch (error) {
        console.error("Error fetching client category:", error);
        return { success: false, error: "Gagal mengambil data kategori" };
    }
}

// Create category
export async function createClientCategory(data: ClientCategoryInput) {
    try {
        const validated = clientCategorySchema.parse(data);

        // Check for duplicate sortOrder
        const existingSortOrder = await prisma.clientCategory.findFirst({
            where: { sortOrder: validated.sortOrder },
        });

        if (existingSortOrder) {
            return { success: false, error: `Urutan tampilan ${validated.sortOrder} sudah digunakan oleh kategori lain` };
        }

        const category = await prisma.clientCategory.create({
            data: validated,
        });

        revalidatePath("/admin/clients/categories");
        revalidatePath("/admin/clients");

        return { success: true, data: { category } };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }

        // Handle Prisma errors
        if (error && typeof error === 'object' && 'code' in error) {
            const prismaError = error as any;

            // P2002: Unique constraint violation
            if (prismaError.code === 'P2002') {
                const target = prismaError.meta?.target;
                if (target?.includes('name')) {
                    return { success: false, error: "Nama kategori sudah digunakan" };
                }
                if (target?.includes('slug')) {
                    return { success: false, error: "Slug kategori sudah digunakan" };
                }
                return { success: false, error: "Kategori dengan data tersebut sudah ada" };
            }
        }

        console.error("Error creating client category:", error);
        return { success: false, error: "Gagal membuat kategori baru. Silakan periksa console untuk detail error." };
    }
}

// Update category
export async function updateClientCategory(id: string, data: Partial<ClientCategoryInput>) {
    try {
        // Check for duplicate sortOrder if it's being updated
        if (data.sortOrder !== undefined) {
            const existingSortOrder = await prisma.clientCategory.findFirst({
                where: {
                    sortOrder: data.sortOrder,
                    NOT: { id }, // Exclude current category
                },
            });

            if (existingSortOrder) {
                return { success: false, error: `Urutan tampilan ${data.sortOrder} sudah digunakan oleh kategori lain` };
            }
        }

        const category = await prisma.clientCategory.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/clients/categories");
        revalidatePath("/admin/clients");

        return { success: true, data: { category } };
    } catch (error) {
        console.error("Error updating client category:", error);
        return { success: false, error: "Gagal mengupdate kategori" };
    }
}

// Delete category
export async function deleteClientCategory(id: string) {
    try {
        // Check if category has clients
        const clientCount = await prisma.client.count({
            where: { categoryId: id },
        });

        if (clientCount > 0) {
            return {
                success: false,
                error: `Tidak dapat menghapus kategori yang memiliki ${clientCount} klien`,
            };
        }

        await prisma.clientCategory.delete({
            where: { id },
        });

        revalidatePath("/admin/clients/categories");
        revalidatePath("/admin/clients");

        return { success: true };
    } catch (error) {
        console.error("Error deleting client category:", error);
        return { success: false, error: "Gagal menghapus kategori" };
    }
}

// Toggle active status
export async function toggleActiveClientCategory(id: string, isActive: boolean) {
    try {
        const category = await prisma.clientCategory.update({
            where: { id },
            data: { isActive },
        });

        revalidatePath("/admin/clients/categories");
        revalidatePath("/admin/clients");

        return { success: true, data: { category } };
    } catch (error) {
        console.error("Error toggling active status:", error);
        return { success: false, error: "Gagal mengubah status aktif" };
    }
}

// Reorder categories
export async function reorderClientCategories(categories: { id: string; sortOrder: number }[]) {
    try {
        await prisma.$transaction(
            categories.map((cat) =>
                prisma.clientCategory.update({
                    where: { id: cat.id },
                    data: { sortOrder: cat.sortOrder },
                })
            )
        );

        revalidatePath("/admin/clients/categories");
        revalidatePath("/admin/clients");

        return { success: true };
    } catch (error) {
        console.error("Error reordering categories:", error);
        return { success: false, error: "Gagal mengubah urutan kategori" };
    }
}

// Initialize default categories (for first-time setup)
export async function initializeDefaultCategories() {
    try {
        const defaultCategories = [
            { name: "Bank BUMN/Swasta", slug: "bank-bumn-swasta", sortOrder: 1 },
            { name: "Non Bank", slug: "non-bank", sortOrder: 2 },
            { name: "Instansi Pemerintah", slug: "instansi-pemerintah", sortOrder: 3 },
            { name: "Perusahaan Swasta", slug: "perusahaan-swasta", sortOrder: 4 },
            { name: "BUMN", slug: "bumn", sortOrder: 5 },
            { name: "Perorangan", slug: "perorangan", sortOrder: 6 },
        ];

        for (const category of defaultCategories) {
            await prisma.clientCategory.upsert({
                where: { slug: category.slug },
                update: {},
                create: category,
            });
        }

        revalidatePath("/admin/clients/categories");

        return { success: true };
    } catch (error) {
        console.error("Error initializing default categories:", error);
        return { success: false, error: "Gagal menginisialisasi kategori default" };
    }
}
