import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
    const cookieStore = await cookies();
    const hasAccess = cookieStore.get("admin_access_granted");
    const hasSession = cookieStore.get("admin_session");

    // Jika sudah login, redirect ke portal-selection
    if (hasSession) {
        redirect("/admin/portal-selection");
    }

    // Jika tidak punya cookie admin_access_granted, block akses
    // Cookie ini hanya di-set oleh middleware ketika URL mengandung secret key
    if (!hasAccess) {
        redirect("/");
    }

    return <LoginForm />;
}
