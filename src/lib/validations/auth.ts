import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    name: z.string().min(2, "Nama minimal 2 karakter"),
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
