import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kjpp-secure-2026";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const hasAccess = request.cookies.get("admin_access_granted");
        const hasSession = request.cookies.get("admin_session");
        const keyParam = searchParams.get("key");

        // ─── Khusus halaman login ──────────────────────────────────────────
        if (pathname === "/admin/login") {
            // Sudah login → langsung ke portal-selection
            if (hasSession) {
                return NextResponse.redirect(new URL("/admin/portal-selection", request.url));
            }

            // Kunci rahasia benar → izinkan & set cookie akses
            if (keyParam === ADMIN_SECRET_KEY) {
                const response = NextResponse.next();
                response.cookies.set("admin_access_granted", "true", {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 8, // 8 jam
                });
                return response;
            }

            // Tanpa kunci yang valid → blokir SELALU (walau ada cookie)
            return NextResponse.redirect(new URL("/", request.url));
        }

        // ─── Semua route /admin/* lainnya ─────────────────────────────────
        // Butuh session (sudah login) ATAU cookie akses
        if (hasSession || hasAccess) {
            return NextResponse.next();
        }

        // Tidak ada akses → redirect ke homepage
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
