import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_STAGES = [
    {
        id: 1,
        name: "Persiapan & Legalitas",
        subSteps: [
            { id: "1a", name: "Permohonan masuk" },
            { id: "1b", name: "Proposal disetujui" },
            { id: "1c", name: "Verifikasi dokumen legalitas" },
        ]
    },
    {
        id: 2,
        name: "Inspeksi Lapangan",
        subSteps: [
            { id: "2a", name: "Penjadwalan dengan PIC" },
            { id: "2b", name: "Proses inspeksi/survey lokasi" },
        ]
    },
    {
        id: 3,
        name: "Analisis & Penilaian",
        subSteps: [
            { id: "3a", name: "Proses penilaian (hitung)" },
            { id: "3b", name: "Proses review internal" },
        ]
    },
    {
        id: 4,
        name: "Draft & Konfirmasi",
        subSteps: [
            { id: "4a", name: "Resume Nilai dikirim ke Client" },
            { id: "4b", name: "Menunggu persetujuan/revisi dari Client" },
        ]
    },
    {
        id: 5,
        name: "Laporan Final",
        subSteps: [
            { id: "5a", name: "Laporan final dicetak/dikirim" },
            { id: "5b", name: "Project Selesai" },
        ]
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const project = await prisma.tracking_projects.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
            include: {
                client_contacts: true,
                project_progress: {
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

        if (project.project_progress.length === 0) {
            const progressData = DEFAULT_STAGES.flatMap(stage =>
                stage.subSteps.map(subStep => ({
                    projectId: project.id,
                    stageId: stage.id,
                    stageName: stage.name,
                    subStepId: subStep.id,
                    subStepName: subStep.name,
                    status: "PENDING" as const,
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                }))
            );

            await prisma.project_progress.createMany({
                data: progressData,
            });

            const updatedProject = await prisma.tracking_projects.findUnique({
                where: { id: project.id },
                include: {
                    client_contacts: true,
                    project_progress: {
                        orderBy: [
                            { stageId: 'asc' },
                            { subStepId: 'asc' }
                        ]
                    }
                },
            });

            return NextResponse.json({
                success: true,
                data: updatedProject,
            });
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error("Error fetching project progress:", error);
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data progress" },
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

        const project = await prisma.tracking_projects.findFirst({
            where: {
                OR: [{ id }, { projectId: id }],
            },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Proyek tidak ditemukan" },
                { status: 404 }
            );
        }

        const updates = body.progress as Array<{
            subStepId: string;
            status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
            startDate: string | null;
            endDate: string | null;
        }>;

        for (const update of updates) {
            await prisma.project_progress.upsert({
                where: {
                    projectId_subStepId: {
                        projectId: project.id,
                        subStepId: update.subStepId,
                    }
                },
                update: {
                    status: update.status,
                    startDate: update.startDate ? new Date(update.startDate) : null,
                    endDate: update.endDate ? new Date(update.endDate) : null,
                    updatedAt: new Date(),
                },
                create: {
                    projectId: project.id,
                    stageId: parseInt(update.subStepId.charAt(0)),
                    stageName: DEFAULT_STAGES.find(s => s.id === parseInt(update.subStepId.charAt(0)))?.name || "",
                    subStepId: update.subStepId,
                    subStepName: DEFAULT_STAGES.flatMap(s => s.subSteps).find(ss => ss.id === update.subStepId)?.name || "",
                    status: update.status,
                    startDate: update.startDate ? new Date(update.startDate) : null,
                    endDate: update.endDate ? new Date(update.endDate) : null,
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                }
            });
        }

        const allProgress = await prisma.project_progress.findMany({
            where: { projectId: project.id }
        });

        const completedCount = allProgress.filter(p => p.status === "COMPLETED").length;
        const totalCount = allProgress.length;
        const progressPercent = Math.round((completedCount / totalCount) * 100);

        let newStatus = project.status;
        if (progressPercent === 100) {
            newStatus = "SELESAI";
        } else if (progressPercent >= 75) {
            newStatus = "LAPORAN_FINAL";
        } else if (progressPercent >= 50) {
            newStatus = "PROSES_REVIEW";
        } else if (progressPercent >= 25) {
            newStatus = "INSPEKSI_LAPANGAN";
        } else {
            newStatus = "VERIFIKASI_DOKUMEN";
        }

        await prisma.tracking_projects.update({
            where: { id: project.id },
            data: {
                progress: progressPercent,
                status: newStatus,
                completedAt: newStatus === "SELESAI" ? new Date() : null,
                initialMessage: body.notes || project.initialMessage,
                updatedAt: new Date(),
            }
        });

        const updatedProject = await prisma.tracking_projects.findUnique({
            where: { id: project.id },
            include: {
                client_contacts: true,
                project_progress: {
                    orderBy: [
                        { stageId: 'asc' },
                        { subStepId: 'asc' }
                    ]
                }
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedProject,
            message: "Progress berhasil diupdate",
        });
    } catch (error) {
        console.error("Error updating project progress:", error);
        return NextResponse.json(
            { success: false, error: "Gagal mengupdate progress" },
            { status: 500 }
        );
    }
}
