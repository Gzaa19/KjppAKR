import { getSession } from "./session";

/**
 * Require authentication for API routes
 * Throws error if not authenticated
 */
export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}

/**
 * Check if user has required role
 */
export function hasRole(session: any, allowedRoles: string[]) {
    return allowedRoles.includes(session.role);
}

/**
 * Check if user can access/modify a resource
 * SUPER_ADMIN can access everything
 */
export async function canAccessResource(
    session: any,
    resourceOwnerId?: string
): Promise<boolean> {
    // SUPER_ADMIN has full access
    if (session.role === "SUPER_ADMIN") {
        return true;
    }

    // If no owner specified, only SUPER_ADMIN can access
    if (!resourceOwnerId) {
        return false;
    }

    // User can only access their own resources
    return session.id === resourceOwnerId;
}

/**
 * Check if user can delete resource
 * Only SUPER_ADMIN can delete
 */
export function canDelete(session: any): boolean {
    return session.role === "SUPER_ADMIN";
}

/**
 * Check if user can create resource
 * ADMIN and above can create
 */
export function canCreate(session: any): boolean {
    const allowedRoles = ["SUPER_ADMIN", "ADMIN"];
    return allowedRoles.includes(session.role);
}
