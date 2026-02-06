import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("admin_session");

        if (!sessionCookie) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const session = JSON.parse(sessionCookie.value);

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json(
            { success: false, error: "Invalid session" },
            { status: 401 }
        );
    }
}
