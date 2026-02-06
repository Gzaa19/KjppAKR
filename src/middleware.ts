import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hardcode the secret key for Edge Runtime compatibility
// Edge Runtime may not have access to process.env in some cases
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kjpp-secure-2026";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Debug logging
    console.log('[Middleware] Path:', pathname);
    console.log('[Middleware] Has admin_access_granted cookie:', !!request.cookies.get("admin_access_granted"));

    if (pathname.startsWith("/admin")) {
        const hasAccess = request.cookies.get("admin_access_granted");
        const keyParam = searchParams.get("key");

        console.log('[Middleware] Key param:', keyParam);
        console.log('[Middleware] Expected key:', ADMIN_SECRET_KEY);

        // Check if this is a login page access with secret key
        if (pathname === "/admin/login" && keyParam && keyParam === ADMIN_SECRET_KEY) {
            // Valid secret key provided - set cookie and redirect to clean URL
            console.log('[Middleware] Valid key provided, setting cookie');
            const response = NextResponse.redirect(new URL("/admin/login", request.url));
            response.cookies.set("admin_access_granted", "true", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 8, // 8 hours
            });
            return response;
        }

        // If user already has access cookie, allow them through
        if (hasAccess) {
            console.log('[Middleware] Has access cookie, allowing');
            return NextResponse.next();
        }

        // No access cookie and no valid secret key - block access
        console.log('[Middleware] No access, redirecting to home');
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
