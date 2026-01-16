"use server";

import prisma from "@/lib/prisma";
import {
    createProjectSchema,
    updateProjectSchema,
    updateProjectProgressSchema,
    projectFilterSchema,
    type CreateProjectInput,
    type UpdateProjectInput,
    type UpdateProjectProgressInput,
    type ProjectFilterInput,
    type ProjectStatus,
} from "@/lib/validations/projects";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/action-response";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique Project ID dengan format PRJ-YYYY-XXX
 */
async function generateProjectId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.trackingProject.count({
        where: {
            projectId: {
                startsWith: `PRJ-${year}`,
            },
        },
    });
    const nextNumber = (count + 1).toString().padStart(3, "0");
    return `PRJ-${year}-${nextNumber}`;
}

/**
 * Generate unique Tracking Code untuk public tracking (format: AKR-XXXXXX)
 */
async function generateTrackingCode(): Promise<string> {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars like 0, O, 1, I
    let isUnique = false;

    while (!isUnique) {
        // Generate 6 random characters
        let randomPart = "";
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const trackingCode = `AKR-${randomPart}`;

        // Check if unique
        const existing = await prisma.trackingProject.findUnique({
            where: { trackingCode },
        });

        if (!existing) {
            isUnique = true;
            return trackingCode;
        }
    }

    // Fallback (should not reach here)
    return `AKR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/**
 * Mapping status ke progress percentage
 */
const statusProgressMap: Record<ProjectStatus, number> = {
    VERIFIKASI_DOKUMEN: 25,
    INSPEKSI_LAPANGAN: 50,
    PROSES_REVIEW: 75,
    LAPORAN_FINAL: 90,
    SELESAI: 100,
};

// ============================================
// PROJECT CRUD ACTIONS
// ============================================

/**
 * Membuat proyek tracking baru
 */
export async function createProject(
    input: CreateProjectInput
): Promise<ActionResponse<{ id: string; projectId: string; trackingCode: string }>> {
    try {
        const validated = createProjectSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        // Check if client exists
        const clientExists = await prisma.clientContact.findUnique({
            where: { id: validated.data.clientId },
        });

        if (!clientExists) {
            return { success: false, error: "Client tidak ditemukan" };
        }

        // Generate unique IDs
        const projectId = await generateProjectId();
        const trackingCode = await generateTrackingCode();

        // Create project
        const project = await prisma.trackingProject.create({
            data: {
                projectId,
                proposalNo: validated.data.proposalNo,
                trackingCode,
                clientId: validated.data.clientId,
                objectType: validated.data.objectType,
                objective: validated.data.objective,
                address: validated.data.address,
                initialMessage: validated.data.initialMessage || null,
                status: "VERIFIKASI_DOKUMEN",
                progress: 0,
            },
        });

        revalidatePath("/admin/tracking/projects");
        return {
            success: true,
            data: {
                id: project.id,
                projectId: project.projectId,
                trackingCode: project.trackingCode,
            },
        };
    } catch (error) {
        console.error("Create project error:", error);
        return { success: false, error: "Gagal membuat proyek" };
    }
}

/**
 * Mengambil daftar proyek dengan pagination, search, dan filter
 */
export async function getProjects(options?: Partial<ProjectFilterInput>) {
    try {
        const validated = projectFilterSchema.safeParse(options || {});
        const { page = 1, limit = 10, search, status, objectType } = validated.success
            ? validated.data
            : { page: 1, limit: 10, search: undefined, status: undefined, objectType: undefined };

        const skip = (page - 1) * limit;

        // Build where clause
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (search) {
            where.OR = [
                { projectId: { contains: search, mode: "insensitive" } },
                { proposalNo: { contains: search, mode: "insensitive" } },
                { trackingCode: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { client: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        if (status && status !== "all") {
            where.status = status;
        }

        if (objectType && objectType !== "all") {
            where.objectType = objectType;
        }

        // Get total count
        const total = await prisma.trackingProject.count({ where });

        // Get projects with client info
        const projects = await prisma.trackingProject.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        type: true,
                    },
                },
            },
        });

        return {
            success: true,
            data: {
                projects,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Get projects error:", error);
        return { success: false, error: "Gagal mengambil data proyek" };
    }
}

/**
 * Mengambil detail proyek berdasarkan ID
 */
export async function getProjectById(id: string) {
    try {
        const project = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }, { trackingCode: id }],
            },
            include: {
                client: true,
                projectProgresses: {
                    orderBy: [{ stageId: "asc" }, { subStepId: "asc" }],
                },
            },
        });

        if (!project) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        return { success: true, data: project };
    } catch (error) {
        console.error("Get project by id error:", error);
        return { success: false, error: "Gagal mengambil data proyek" };
    }
}

/**
 * Mengambil proyek berdasarkan tracking code (untuk public tracking)
 */
export async function getProjectByTrackingCode(trackingCode: string) {
    try {
        const project = await prisma.trackingProject.findUnique({
            where: { trackingCode },
            include: {
                client: {
                    select: {
                        name: true,
                        type: true,
                    },
                },
                projectProgresses: {
                    orderBy: [{ stageId: "asc" }, { subStepId: "asc" }],
                },
            },
        });

        if (!project) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        return { success: true, data: project };
    } catch (error) {
        console.error("Get project by tracking code error:", error);
        return { success: false, error: "Gagal mengambil data proyek" };
    }
}

/**
 * Mengupdate data proyek
 */
export async function updateProject(
    id: string,
    input: UpdateProjectInput
): Promise<ActionResponse<{ id: string; projectId: string }>> {
    try {
        const validated = updateProjectSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const existing = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!existing) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        // Build update data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};

        if (validated.data.proposalNo) updateData.proposalNo = validated.data.proposalNo;
        if (validated.data.clientId) {
            // Check if new client exists
            const clientExists = await prisma.clientContact.findUnique({
                where: { id: validated.data.clientId },
            });
            if (!clientExists) {
                return { success: false, error: "Client tidak ditemukan" };
            }
            updateData.clientId = validated.data.clientId;
        }
        if (validated.data.objectType) updateData.objectType = validated.data.objectType;
        if (validated.data.objective) updateData.objective = validated.data.objective;
        if (validated.data.address) updateData.address = validated.data.address;
        if (validated.data.initialMessage !== undefined)
            updateData.initialMessage = validated.data.initialMessage;

        // Handle status update
        if (validated.data.status) {
            updateData.status = validated.data.status;
            updateData.progress = statusProgressMap[validated.data.status];

            if (validated.data.status === "SELESAI") {
                updateData.completedAt = new Date();
            } else {
                updateData.completedAt = null;
            }
        }

        // Handle progress update (only if status is not being updated)
        if (validated.data.progress !== undefined && !validated.data.status) {
            updateData.progress = validated.data.progress;
        }

        const project = await prisma.trackingProject.update({
            where: { id: existing.id },
            data: updateData,
        });

        revalidatePath("/admin/tracking/projects");
        revalidatePath(`/admin/tracking/projects/${id}`);
        return {
            success: true,
            data: { id: project.id, projectId: project.projectId },
        };
    } catch (error) {
        console.error("Update project error:", error);
        return { success: false, error: "Gagal mengupdate proyek" };
    }
}

/**
 * Menghapus proyek
 */
export async function deleteProject(id: string): Promise<ActionResponse> {
    try {
        const existing = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!existing) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        // Delete project (cascade will delete related progress)
        await prisma.trackingProject.delete({
            where: { id: existing.id },
        });

        revalidatePath("/admin/tracking/projects");
        return { success: true };
    } catch (error) {
        console.error("Delete project error:", error);
        return { success: false, error: "Gagal menghapus proyek" };
    }
}

// ============================================
// PROJECT STATUS & PROGRESS ACTIONS
// ============================================

/**
 * Mengupdate status proyek
 */
export async function updateProjectStatus(
    id: string,
    status: ProjectStatus
): Promise<ActionResponse<{ id: string; status: string; progress: number }>> {
    try {
        const existing = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!existing) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        const progress = statusProgressMap[status];
        const completedAt = status === "SELESAI" ? new Date() : null;

        const project = await prisma.trackingProject.update({
            where: { id: existing.id },
            data: {
                status,
                progress,
                completedAt,
            },
        });

        revalidatePath("/admin/tracking/projects");
        revalidatePath(`/admin/tracking/projects/${id}`);
        return {
            success: true,
            data: {
                id: project.id,
                status: project.status,
                progress: project.progress,
            },
        };
    } catch (error) {
        console.error("Update project status error:", error);
        return { success: false, error: "Gagal mengupdate status proyek" };
    }
}

/**
 * Membuat atau mengupdate progress step proyek
 */
export async function upsertProjectProgress(
    projectId: string,
    input: UpdateProjectProgressInput
): Promise<ActionResponse<{ id: string }>> {
    try {
        const validated = updateProjectProgressSchema.safeParse(input);
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0].message };
        }

        const project = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id: projectId }, { projectId: projectId }],
            },
        });

        if (!project) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        // Upsert progress
        const progress = await prisma.projectProgress.upsert({
            where: {
                projectId_subStepId: {
                    projectId: project.id,
                    subStepId: validated.data.subStepId,
                },
            },
            update: {
                status: validated.data.status,
                startDate: validated.data.startDate,
                endDate: validated.data.endDate,
            },
            create: {
                projectId: project.id,
                stageId: validated.data.stageId,
                stageName: validated.data.stageName,
                subStepId: validated.data.subStepId,
                subStepName: validated.data.subStepName,
                status: validated.data.status,
                startDate: validated.data.startDate,
                endDate: validated.data.endDate,
            },
        });

        revalidatePath(`/admin/tracking/projects/${projectId}`);
        return { success: true, data: { id: progress.id } };
    } catch (error) {
        console.error("Upsert project progress error:", error);
        return { success: false, error: "Gagal mengupdate progress proyek" };
    }
}

/**
 * Mengambil semua progress steps dari proyek
 */
export async function getProjectProgress(projectId: string) {
    try {
        const project = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id: projectId }, { projectId: projectId }],
            },
        });

        if (!project) {
            return { success: false, error: "Proyek tidak ditemukan" };
        }

        const progresses = await prisma.projectProgress.findMany({
            where: { projectId: project.id },
            orderBy: [{ stageId: "asc" }, { subStepId: "asc" }],
        });

        return { success: true, data: progresses };
    } catch (error) {
        console.error("Get project progress error:", error);
        return { success: false, error: "Gagal mengambil data progress" };
    }
}

// ============================================
// PROJECT STATISTICS ACTIONS
// ============================================

/**
 * Mengambil statistik proyek
 */
export async function getProjectStats() {
    try {
        const total = await prisma.trackingProject.count();

        const totalActive = await prisma.trackingProject.count({
            where: { status: { not: "SELESAI" } },
        });

        const totalCompleted = await prisma.trackingProject.count({
            where: { status: "SELESAI" },
        });

        const byStatus = await prisma.trackingProject.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        const byObjectType = await prisma.trackingProject.groupBy({
            by: ["objectType"],
            _count: {
                objectType: true,
            },
        });

        // Get this month's projects
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthProjects = await prisma.trackingProject.count({
            where: {
                createdAt: { gte: startOfMonth },
            },
        });

        const thisMonthCompleted = await prisma.trackingProject.count({
            where: {
                completedAt: { gte: startOfMonth },
            },
        });

        return {
            success: true,
            data: {
                total,
                totalActive,
                totalCompleted,
                thisMonthProjects,
                thisMonthCompleted,
                byStatus,
                byObjectType,
            },
        };
    } catch (error) {
        console.error("Get project stats error:", error);
        return { success: false, error: "Gagal mengambil statistik proyek" };
    }
}
