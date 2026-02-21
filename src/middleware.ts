import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware v4 — 2026-02-22
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kjpp-secure-2026";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const hasAccess = request.cookies.get("admin_access_granted");
        const hasSession = request.cookies.get("admin_session");
        const keyParam = searchParams.get("key");

        // ─── Khusus halaman login ──────────────────────────────────────────
        if (pathname === "/admin/login") {
            if (hasSession) {
                return NextResponse.redirect(new URL("/admin/portal-selection", request.url));
            }

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

            const blockedRes = NextResponse.redirect(new URL("/", request.url));
            blockedRes.headers.set("Cache-Control", "no-store, no-cache");
            return blockedRes;
        }
        if (hasSession) {
            return NextResponse.next();
        }

        const noAccessRes = NextResponse.redirect(new URL("/", request.url));
        noAccessRes.headers.set("Cache-Control", "no-store, no-cache");
        return noAccessRes;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
