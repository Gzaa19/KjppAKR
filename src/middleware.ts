import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const hasAccess = request.cookies.get("admin_access_granted");

        if (hasAccess) {
            return NextResponse.next();
        }

        if (pathname === "/admin/login") {
            const secretKey = process.env.ADMIN_SECRET_KEY;
            const keyParam = searchParams.get("key");

            if (keyParam === secretKey) {
                const response = NextResponse.redirect(new URL("/admin/login", request.url));
                response.cookies.set("admin_access_granted", "true", {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 8, 
                });
                return response;
            }
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
