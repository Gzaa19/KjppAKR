import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Redirect /admin to /admin/login
    if (request.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
}

export const config = {
    matcher: '/admin',
}
