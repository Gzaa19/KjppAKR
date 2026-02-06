import { cookies } from "next/headers";

export type AdminSession = {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
    avatar: string | null;
};

export async function getSession(): Promise<AdminSession | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("admin_session");

        if (!sessionCookie) {
            return null;
        }

        return JSON.parse(sessionCookie.value) as AdminSession;
    } catch {
        return null;
    }
}

export async function requireSession(): Promise<AdminSession> {
    const session = await getSession();
    if (!session) {
        throw new Error("Not authenticated");
    }
    return session;
}
