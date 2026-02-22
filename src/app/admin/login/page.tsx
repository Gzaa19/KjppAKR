import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kjpp-secure-2026";

export default async function AdminLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const cookieStore = await cookies();
    const hasSession = cookieStore.get("admin_session");
    const hasAccess = cookieStore.get("admin_access_granted");
    const params = await searchParams;
    const keyParam = params.key;

    if (hasSession) {
        redirect("/admin/portal-selection");
    }

    const hasValidKey = keyParam === ADMIN_SECRET_KEY;

    if (!hasAccess && !hasValidKey) {
        redirect("/");
    }

    return <LoginForm />;
}
