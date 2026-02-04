import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Filter semua route yang diawali /admin
    if (pathname.startsWith("/admin")) {
        // Cek apakah user sudah punya "tiket masuk" (cookie)
        const hasAccess = request.cookies.get("admin_access_granted");

        // Jika sudah punya tiket, silakan lanjut (nanti urusan login user ditangani page masing-masing)
        if (hasAccess) {
            return NextResponse.next();
        }

        // Jika belum punya tiket, dan ini adalah halaman login, cek apakah dia bawa kunci?
        if (pathname === "/admin/login") {
            const secretKey = process.env.ADMIN_SECRET_KEY;
            const keyParam = searchParams.get("key");

            if (keyParam === secretKey) {
                const response = NextResponse.redirect(new URL("/admin/login", request.url));
                response.cookies.set("admin_access_granted", "true", {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24, // 1 hari
                });
                return response;
            }
        }

        // Jika mencoba akses /admin/* (dashboard, tracking, dll) TAPI tidak punya tiket -> TENDANG KELUAR
        // Ini menjawab kenapa tadi masih bisa akses dashboard: karena sebelumnya belum dicegat.
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Matcher sekarang menangkap semua route di bawah /admin
    matcher: ["/admin/:path*"],
};
