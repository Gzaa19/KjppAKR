export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.redirect(
        new URL("/", process.env.NEXT_PUBLIC_APP_URL || "https://kjpp-akr.co.id")
    );

    response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    response.cookies.set("admin_access_granted", "", { maxAge: 0, path: "/" });

    return response;
}

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    response.cookies.set("admin_access_granted", "", { maxAge: 0, path: "/" });

    return response;
}
