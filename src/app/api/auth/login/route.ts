import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { cookies } from "next/headers";

import { loginRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
        const identifier = `login:${ip}`;

        const { success: rateLimitSuccess } = await checkRateLimit(loginRateLimit, identifier);

        if (!rateLimitSuccess) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Terlalu banyak percobaan login. Silakan tunggu 15 menit dan coba lagi.",
                },
                { status: 429 }
            );
        }

        const body = await request.json();

        const validated = loginSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { success: false, error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        const user = await prisma.users.findUnique({
            where: { email: validated.data.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Email atau password salah" },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { success: false, error: "Akun tidak aktif" },
                { status: 403 }
            );
        }

        const isValidPassword = await bcrypt.compare(validated.data.password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: "Email atau password salah" },
                { status: 401 }
            );
        }

        const sessionData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
        };
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        const baseCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict" as const,
            path: "/",
        };

        if (validated.data.rememberMe) {
            cookieStore.set("admin_session", JSON.stringify(sessionData), {
                ...baseCookieOptions,
                maxAge: 60 * 60 * 4,
            });
        } else {
            cookieStore.set("admin_session", JSON.stringify(sessionData), {
                ...baseCookieOptions,
            });
        }
        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error instanceof Error ? error.message : 'Unknown');
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan saat login" },
            { status: 500 }
        );
    }
}
