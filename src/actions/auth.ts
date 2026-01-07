"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "./index";

export async function login(input: LoginInput): Promise<ActionResponse<{ id: string; email: string; name: string }>> {
    try {
        const validated = loginSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const user = await prisma.user.findUnique({
            where: { email: validated.data.email },
        });

        if (!user) {
            return { success: false, error: "Email atau password salah" };
        }

        if (!user.isActive) {
            return { success: false, error: "Akun tidak aktif" };
        }

        const isValidPassword = await bcrypt.compare(validated.data.password, user.password);
        if (!isValidPassword) {
            return { success: false, error: "Email atau password salah" };
        }

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Terjadi kesalahan saat login" };
    }
}

export async function register(input: RegisterInput): Promise<ActionResponse<{ id: string; email: string }>> {
    try {
        const validated = registerSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: validated.data.email },
        });

        if (existingUser) {
            return { success: false, error: "Email sudah terdaftar" };
        }

        const hashedPassword = await bcrypt.hash(validated.data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: validated.data.email,
                password: hashedPassword,
                name: validated.data.name,
                role: validated.data.role || "ADMIN",
            },
        });

        revalidatePath("/admin");

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
            },
        };
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, error: "Terjadi kesalahan saat registrasi" };
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: users };
    } catch (error) {
        console.error("Get users error:", error);
        return { success: false, error: "Gagal mengambil data users" };
    }
}
