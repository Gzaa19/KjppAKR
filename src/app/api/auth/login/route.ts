import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validated = loginSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                { success: false, error: validated.error.issues[0].message },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: validated.data.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Email atau password salah" },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { success: false, error: "Akun tidak aktif" },
                { status: 403 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validated.data.password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: "Email atau password salah" },
                { status: 401 }
            );
        }

        // Create session data
        const sessionData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
        };

        // Set session cookie (expires in 7 days)
        const cookieStore = await cookies();
        cookieStore.set("admin_session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

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
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan saat login" },
            { status: 500 }
        );
    }
}
