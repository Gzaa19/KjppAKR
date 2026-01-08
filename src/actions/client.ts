"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";


// Validation schema
const clientSchema = z.object({
    name: z.string().min(1, "Nama klien harus diisi"),
    logo: z.string().url("Logo harus berupa URL yang valid"),
    category: z.enum(["BANK_BUMN_SWASTA", "NON_BANK"]),
    isPublished: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
});

type ClientInput = z.infer<typeof clientSchema>;

// Get all clients
export async function getClients() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });

        return { success: true, data: { clients } };
    } catch (error) {
        console.error("Error fetching clients:", error);
        return { success: false, error: "Gagal mengambil data klien" };
    }
}

// Get published clients for public view
export async function getPublishedClients() {
    try {
        const clients = await prisma.client.findMany({
            where: { isPublished: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });

        const bankClients = clients.filter((c) => c.category === "BANK_BUMN_SWASTA");
        const nonBankClients = clients.filter((c) => c.category === "NON_BANK");

        return {
            success: true,
            data: {
                allClients: clients,
                bankClients,
                nonBankClients,
            },
        };
    } catch (error) {
        console.error("Error fetching published clients:", error);
        return { success: false, error: "Gagal mengambil data klien" };
    }
}

// Create client
export async function createClient(data: ClientInput) {
    try {
        const validated = clientSchema.parse(data);

        const client = await prisma.client.create({
            data: validated,
        });

        revalidatePath("/admin/clients");
        revalidatePath("/klien");

        return { success: true, data: { client } };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: (error as z.ZodError).issues[0].message };
        }
        console.error("Error creating client:", error);
        return { success: false, error: "Gagal membuat klien baru" };
    }
}

// Update client
export async function updateClient(id: string, data: Partial<ClientInput>) {
    try {
        const client = await prisma.client.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/clients");
        revalidatePath("/klien");

        return { success: true, data: { client } };
    } catch (error) {
        console.error("Error updating client:", error);
        return { success: false, error: "Gagal mengupdate klien" };
    }
}

// Delete client
export async function deleteClient(id: string) {
    try {
        await prisma.client.delete({
            where: { id },
        });

        revalidatePath("/admin/clients");
        revalidatePath("/klien");

        return { success: true };
    } catch (error) {
        console.error("Error deleting client:", error);
        return { success: false, error: "Gagal menghapus klien" };
    }
}

// Toggle publish status
export async function togglePublishClient(id: string, isPublished: boolean) {
    try {
        const client = await prisma.client.update({
            where: { id },
            data: { isPublished },
        });

        revalidatePath("/admin/clients");
        revalidatePath("/klien");

        return { success: true, data: { client } };
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return { success: false, error: "Gagal mengubah status publikasi" };
    }
}
