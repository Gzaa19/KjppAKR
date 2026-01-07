import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect /admin to /admin/login
    if (pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if accessing protected admin routes (not login page)
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
        const sessionCookie = request.cookies.get('admin_session');

        // If no session, redirect to login
        if (!sessionCookie) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Validate session cookie is valid JSON
            JSON.parse(sessionCookie.value);
        } catch {
            // Invalid session, redirect to login
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }

    // If logged in user tries to access login page, redirect to dashboard
    if (pathname === '/admin/login') {
        const sessionCookie = request.cookies.get('admin_session');
        if (sessionCookie) {
            try {
                JSON.parse(sessionCookie.value);
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } catch {
                // Invalid session, let them login
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}
