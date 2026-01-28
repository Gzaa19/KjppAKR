"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/action-response";

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

export async function requestPasswordReset(email: string): Promise<ActionResponse<{ message: string }>> {
    try {
        console.log('[Password Reset] Starting password reset request for:', email);

        const { forgotPasswordSchema } = await import("@/lib/validations/auth");
        const validated = forgotPasswordSchema.safeParse({ email });

        if (!validated.success) {
            console.log('[Password Reset] Validation failed:', validated.error.issues[0].message);
            return { success: false, error: validated.error.issues[0].message };
        }

        const user = await prisma.user.findUnique({
            where: { email: validated.data.email },
        });

        if (!user) {
            console.log('[Password Reset] User not found for email:', email);
            return {
                success: true,
                data: { message: "Jika email terdaftar, link reset password akan dikirim" }
            };
        }

        console.log('[Password Reset] User found:', user.name);

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

        await prisma.passwordResetToken.deleteMany({
            where: { email: validated.data.email },
        });

        await prisma.passwordResetToken.create({
            data: {
                email: validated.data.email,
                token,
                expiresAt,
            },
        });

        console.log('[Password Reset] Token created successfully');

        const { sendEmail, generatePasswordResetEmail } = await import("@/lib/email");
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

        console.log('[Password Reset] Attempting to send email to:', validated.data.email);
        const emailResult = await sendEmail({
            to: validated.data.email,
            subject: "Reset Password - KJPP AKR",
            html: generatePasswordResetEmail(resetLink, user.name),
        });

        if (!emailResult.success) {
            console.error('[Password Reset] Email sending failed:', emailResult.error);
            return { success: false, error: "Gagal mengirim email. Silakan coba lagi." };
        }

        console.log('[Password Reset] Email sent successfully');

        return {
            success: true,
            data: { message: "Link reset password telah dikirim ke email Anda" }
        };
    } catch (error) {
        console.error("[Password Reset] Unexpected error:", error);
        return { success: false, error: "Gagal memproses permintaan reset password" };
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResponse<{ message: string }>> {
    try {
        const { resetPasswordSchema } = await import("@/lib/validations/auth");
        const validated = resetPasswordSchema.safeParse({
            token,
            password: newPassword,
            confirmPassword: newPassword
        });

        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: validated.data.token },
        });

        if (!resetToken) {
            return { success: false, error: "Token tidak valid atau sudah digunakan" };
        }

        // Check if token expired
        if (resetToken.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({
                where: { token: validated.data.token },
            });
            return { success: false, error: "Token sudah kadaluarsa. Silakan request reset password lagi" };
        }

        const hashedPassword = await bcrypt.hash(validated.data.password, 12);

        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        await prisma.passwordResetToken.delete({
            where: { token: validated.data.token },
        });

        revalidatePath("/admin");

        return {
            success: true,
            data: { message: "Password berhasil direset. Silakan login dengan password baru" }
        };
    } catch (error) {
        console.error("Reset password error:", error);
        return { success: false, error: "Gagal mereset password" };
    }
}

export async function verifyResetToken(token: string): Promise<ActionResponse<{ valid: boolean }>> {
    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return { success: false, error: "Token tidak valid" };
        }

        if (resetToken.expiresAt < new Date()) {
            return { success: false, error: "Token sudah kadaluarsa" };
        }

        return { success: true, data: { valid: true } };
    } catch (error) {
        console.error("Verify token error:", error);
        return { success: false, error: "Gagal memverifikasi token" };
    }
}
