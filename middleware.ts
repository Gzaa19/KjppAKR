import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const publicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password', '/_next', '/api/auth/login', '/api/auth/logout', '/favicon.ico', '/image'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    if (isPublicPath) return NextResponse.next();
    if (pathname.startsWith('/admin')) {
        const sessionCookie = request.cookies.get('admin_session');
        if (!sessionCookie) return NextResponse.redirect(new URL('/admin/login', request.url));
        try {
            const session = JSON.parse(sessionCookie.value);
            if (!session.id || !session.email) {
                const response = NextResponse.redirect(new URL('/admin/login', request.url));
                response.cookies.delete('admin_session');
                return response;
            }
        } catch {
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
