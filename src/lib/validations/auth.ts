import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email tidak valid").toLowerCase(),
    password: z.string().min(6, "Password minimal 6 karakter"),
    rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
    email: z.string().email("Email tidak valid").toLowerCase(),
    password: z
        .string()
        .min(12, "Password minimal 12 karakter")
        .regex(/[a-z]/, "Password harus mengandung huruf kecil")
        .regex(/[A-Z]/, "Password harus mengandung huruf besar")
        .regex(/[0-9]/, "Password harus mengandung angka")
        .regex(/[^a-zA-Z0-9]/, "Password harus mengandung karakter spesial (!@#$%^&*)"),
    name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").optional(),
    email: z.string().email("Email tidak valid").optional(),
    avatar: z.string().url("URL avatar tidak valid").optional().nullable(),
    isActive: z.boolean().optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email tidak valid").toLowerCase(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token tidak valid"),
    password: z
        .string()
        .min(12, "Password minimal 12 karakter")
        .regex(/[a-z]/, "Password harus mengandung huruf kecil")
        .regex(/[A-Z]/, "Password harus mengandung huruf besar")
        .regex(/[0-9]/, "Password harus mengandung angka")
        .regex(/[^a-zA-Z0-9]/, "Password harus mengandung karakter spesial (!@#$%^&*)"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
