"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema (internal only)
const managementSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),
    title: z.string().min(1, "Jabatan harus diisi"),
    image: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Deskripsi harus diisi"),
    isMappiCert: z.boolean().default(false),
    sortOrder: z.coerce.number().int().default(0),
});

type ManagementInput = z.infer<typeof managementSchema>;

// Get all management team members
export async function getManagementTeams() {
    try {
        const teams = await prisma.managementTeam.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });

        return { success: true, data: { teams } };
    } catch (error) {
        console.error("Error fetching management teams:", error);
        return { success: false, error: "Gagal mengambil data tim manajemen" };
    }
}

// Get management team member by ID
export async function getManagementTeamById(id: string) {
    try {
        const team = await prisma.managementTeam.findUnique({
            where: { id },
        });

        if (!team) {
            return { success: false, error: "Data tim manajemen tidak ditemukan" };
        }

        return { success: true, data: { team } };
    } catch (error) {
        console.error("Error fetching management team:", error);
        return { success: false, error: "Gagal mengambil data tim manajemen" };
    }
}

// Create management team member
export async function createManagementTeam(data: ManagementInput) {
    try {
        const validated = managementSchema.parse(data);

        const team = await prisma.managementTeam.create({
            data: validated,
        });

        revalidatePath("/admin/management");
        revalidatePath("/tentang-kami/manajemen");

        return { success: true, data: { team } };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as z.ZodError).issues[0].message };
        }
        console.error("Error creating management team:", error);
        return { success: false, error: "Gagal menambahkan tim manajemen" };
    }
}

// Update management team member
export async function updateManagementTeam(id: string, data: Partial<ManagementInput>) {
    try {
        const team = await prisma.managementTeam.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/management");
        revalidatePath("/tentang-kami/manajemen");

        return { success: true, data: { team } };
    } catch (error) {
        console.error("Error updating management team:", error);
        return { success: false, error: "Gagal mengupdate data tim manajemen" };
    }
}

// Delete management team member
export async function deleteManagementTeam(id: string) {
    try {
        await prisma.managementTeam.delete({
            where: { id },
        });

        revalidatePath("/admin/management");
        revalidatePath("/tentang-kami/manajemen");

        return { success: true };
    } catch (error) {
        console.error("Error deleting management team:", error);
        return { success: false, error: "Gagal menghapus data tim manajemen" };
    }
}
