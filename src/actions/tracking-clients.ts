"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const trackingClientSchema = z.object({
    name: z.string().min(2, "Nama klien minimal 2 karakter"),
    type: z.enum(["CORPORATE", "PERORANGAN", "SME", "INSTANSI"], {
        message: "Tipe klien harus dipilih",
    }),
    address: z.string().min(5, "Alamat minimal 5 karakter"),
    picName: z.string().min(2, "Nama PIC minimal 2 karakter"),
    phone: z.string().min(9, "Nomor telepon tidak valid").max(15, "Nomor telepon terlalu panjang"),
    email: z.string().email("Email tidak valid"),
});

export type TrackingClientInput = z.infer<typeof trackingClientSchema>;

export async function getTrackingClients({
    page = 1,
    limit = 10,
    search = "",
    type = "all",
}: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
} = {}) {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { picName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (type && type !== "all") {
            where.type = type;
        }

        const [clients, total] = await Promise.all([
            prisma.clientContact.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.clientContact.count({ where }),
        ]);

        return {
            success: true,
            data: {
                clients,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Error fetching tracking clients:", error);
        return { success: false, error: "Gagal mengambil data klien tracking" };
    }
}

export async function getTrackingClientById(id: string) {
    try {
        const client = await prisma.clientContact.findUnique({
            where: { id },
        });

        if (!client) {
            return { success: false, error: "Klien tidak ditemukan" };
        }

        return { success: true, data: client };
    } catch (error) {
        console.error("Error fetching tracking client:", error);
        return { success: false, error: "Gagal mengambil detail klien" };
    }
}

export async function createTrackingClient(data: TrackingClientInput) {
    try {
        const validated = trackingClientSchema.parse(data);

        const client = await prisma.clientContact.create({
            data: validated,
        });

        revalidatePath("/admin/tracking/clients");
        return { success: true, data: { client } };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Error creating tracking client:", error);
        return { success: false, error: "Gagal membuat klien baru" };
    }
}

export async function updateTrackingClient(id: string, data: Partial<TrackingClientInput>) {
    try {
        const client = await prisma.clientContact.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/tracking/clients");
        revalidatePath(`/admin/tracking/clients/${id}`);

        return { success: true, data: { client } };
    } catch (error) {
        console.error("Error updating tracking client:", error);
        return { success: false, error: "Gagal mengupdate data klien" };
    }
}

export async function deleteTrackingClient(id: string) {
    try {
        await prisma.clientContact.delete({
            where: { id },
        });

        revalidatePath("/admin/tracking/clients");
        return { success: true };
    } catch (error) {
        console.error("Error deleting tracking client:", error);
        return { success: false, error: "Gagal menghapus klien" };
    }
}
