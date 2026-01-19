"use server";

import { createNews, updateNews, deleteNews, togglePublishNews } from "./news";
import type { CreateNewsInput, UpdateNewsInput } from "@/lib/validations";
import type { ActionResponse } from "@/types/types";
import { cookies } from "next/headers";

// Wrapper untuk createNews yang menangani session
export async function createPublikasi(
    input: CreateNewsInput
): Promise<ActionResponse<{ id: string; slug: string }>> {
    try {
        // Get session from cookies
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("admin_session");

        if (!sessionCookie) {
            return { success: false, error: "Anda harus login terlebih dahulu" };
        }

        const session = JSON.parse(sessionCookie.value);
        if (!session || !session.id) {
            return { success: false, error: "Session tidak valid" };
        }

        return await createNews(input, session.id);
    } catch (error) {
        console.error("Create publikasi error:", error);
        return { success: false, error: "Gagal membuat publikasi" };
    }
}

// Re-export fungsi lain dengan nama yang sama
export async function updatePublikasi(
    id: string,
    input: UpdateNewsInput
): Promise<ActionResponse<{ id: string; slug: string }>> {
    return await updateNews(id, input);
}

export async function deletePublikasi(id: string): Promise<ActionResponse> {
    return await deleteNews(id);
}

export async function togglePublishPublikasi(id: string): Promise<ActionResponse> {
    return await togglePublishNews(id);
}
