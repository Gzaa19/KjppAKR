import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kjpp-secure-2026";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const hasAccess = request.cookies.get("admin_access_granted");
        const hasSession = request.cookies.get("admin_session");
        const keyParam = searchParams.get("key");

        // Jika sudah login (punya session), redirect dari halaman login ke dashboard
        if (pathname === "/admin/login" && hasSession) {
            return NextResponse.redirect(new URL("/admin/portal-selection", request.url));
        }

        // Jika akses /admin/login dengan key yang benar → set cookie & bersihkan URL
        if (pathname === "/admin/login" && keyParam === ADMIN_SECRET_KEY) {
            const response = NextResponse.redirect(new URL("/admin/login", request.url));
            response.cookies.set("admin_access_granted", "true", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 8, // 8 jam
            });
            return response;
        }

        // Jika sudah punya cookie akses → izinkan masuk
        if (hasAccess) {
            return NextResponse.next();
        }

        // Tidak ada cookie & tidak ada key yang valid → blokir semua route /admin/*
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
