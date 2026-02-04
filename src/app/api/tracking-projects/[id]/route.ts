import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const project = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
            include: {
                client: true,
                projectProgresses: {
                    orderBy: [
                        { stageId: 'asc' },
                        { subStepId: 'asc' }
                    ]
                }
            },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Proyek tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data proyek" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // ✅ Authorization check
        const { requireAuth, canCreate } = await import("@/lib/auth-helpers");
        const session = await requireAuth();

        if (!canCreate(session)) {
            return NextResponse.json(
                { success: false, error: "Forbidden: Tidak memiliki akses untuk mengupdate proyek" },
                { status: 403 }
            );
        }

        const existingProject = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!existingProject) {
            return NextResponse.json(
                { success: false, error: "Proyek tidak ditemukan" },
                { status: 404 }
            );
        }

        const statusProgressMap: Record<string, number> = {
            VERIFIKASI_DOKUMEN: 25,
            INSPEKSI_LAPANGAN: 50,
            PROSES_REVIEW: 75,
            LAPORAN_FINAL: 90,
            SELESAI: 100,
        };

        const updateData: any = {};

        if (body.proposalNo) updateData.proposalNo = body.proposalNo;
        if (body.clientId) updateData.clientId = body.clientId;
        if (body.objectType) updateData.objectType = body.objectType;
        if (body.objective) updateData.objective = body.objective;
        if (body.address) updateData.address = body.address;
        if (body.initialMessage !== undefined)
            updateData.initialMessage = body.initialMessage;

        if (body.status) {
            updateData.status = body.status;
            updateData.progress = statusProgressMap[body.status] || body.progress || 0;

            if (body.status === "SELESAI") {
                updateData.completedAt = new Date();
            } else {
                updateData.completedAt = null;
            }
        }

        if (body.progress !== undefined && !body.status) {
            updateData.progress = body.progress;
        }

        const project = await prisma.trackingProject.update({
            where: { id: existingProject.id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: project,
            message: "Proyek berhasil diupdate",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.error("Error updating project:", error instanceof Error ? error.message : 'Unknown');
        return NextResponse.json(
            { success: false, error: "Gagal mengupdate proyek" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // ✅ Authorization check - only SUPER_ADMIN can delete
        const { requireAuth, canDelete } = await import("@/lib/auth-helpers");
        const session = await requireAuth();

        if (!canDelete(session)) {
            return NextResponse.json(
                { success: false, error: "Forbidden: Hanya SUPER_ADMIN yang dapat menghapus proyek" },
                { status: 403 }
            );
        }

        const existingProject = await prisma.trackingProject.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!existingProject) {
            return NextResponse.json(
                { success: false, error: "Proyek tidak ditemukan" },
                { status: 404 }
            );
        }

        await prisma.trackingProject.delete({
            where: { id: existingProject.id },
        });

        return NextResponse.json({
            success: true,
            message: "Proyek berhasil dihapus",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.error("Error deleting project:", error instanceof Error ? error.message : 'Unknown');
        return NextResponse.json(
            { success: false, error: "Gagal menghapus proyek" },
            { status: 500 }
        );
    }
}
