import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STAGE_CONFIG = [
    { id: 1, name: "Persiapan & Legalitas", subStepIds: ["1a", "1b", "1c"] },
    { id: 2, name: "Inspeksi Lapangan", subStepIds: ["2a", "2b"] },
    { id: 3, name: "Analisis & Penilaian", subStepIds: ["3a", "3b"] },
    { id: 4, name: "Draft & Konfirmasi", subStepIds: ["4a", "4b"] },
    { id: 5, name: "Laporan Final", subStepIds: ["5a", "5b"] },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json(
                { success: false, error: "Kode tracking diperlukan" },
                { status: 400 }
            );
        }

        const project = await prisma.trackingProject.findUnique({
            where: { trackingCode: code.toUpperCase() },
            select: {
                projectId: true,
                trackingCode: true,
                objectType: true,
                objective: true,
                address: true,
                status: true,
                progress: true,
                createdAt: true,
                updatedAt: true,
                completedAt: true,
                initialMessage: true,
                client: {
                    select: {
                        name: true,
                    },
                },
                projectProgresses: {
                    orderBy: [
                        { stageId: 'asc' },
                        { subStepId: 'asc' }
                    ]
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Proyek tidak ditemukan. Pastikan kode tracking yang Anda masukkan benar.",
                },
                { status: 404 }
            );
        }
        const stages = STAGE_CONFIG.map(config => {
            const subSteps = project.projectProgresses.filter(p =>
                config.subStepIds.includes(p.subStepId)
            );

            const completedCount = subSteps.filter(s => s.status === "COMPLETED").length;
            const inProgressStep = subSteps.find(s => s.status === "IN_PROGRESS");
            const allCompleted = subSteps.length > 0 && completedCount === subSteps.length;
            const anyInProgress = subSteps.some(s => s.status === "IN_PROGRESS");
            const anyCompleted = subSteps.some(s => s.status === "COMPLETED");

            let stageStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" = "PENDING";
            if (allCompleted) {
                stageStatus = "COMPLETED";
            } else if (anyInProgress || anyCompleted) {
                stageStatus = "IN_PROGRESS";
            }

            const startDates = subSteps
                .filter(s => s.startDate)
                .map(s => new Date(s.startDate!).getTime());
            const endDates = subSteps
                .filter(s => s.endDate)
                .map(s => new Date(s.endDate!).getTime());

            const stageStartDate = startDates.length > 0 ? new Date(Math.min(...startDates)) : null;
            const stageEndDate = endDates.length > 0 ? new Date(Math.max(...endDates)) : null;

            return {
                id: config.id,
                name: config.name,
                status: stageStatus,
                completedCount,
                totalCount: subSteps.length,
                currentSubStep: inProgressStep?.subStepName || (anyCompleted && !allCompleted ? subSteps.find(s => s.status === "PENDING")?.subStepName : null),
                startDate: stageStartDate,
                endDate: stageEndDate,
                subSteps: subSteps.map(s => ({
                    id: s.subStepId,
                    name: s.subStepName,
                    status: s.status,
                    startDate: s.startDate,
                    endDate: s.endDate,
                }))
            };
        });

        const publicData = {
            trackingCode: project.trackingCode,
            projectId: project.projectId,
            clientName: project.client.name,
            objectType: project.objectType,
            objective: project.objective,
            location: project.address,
            status: project.status,
            progress: project.progress,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            completedAt: project.completedAt,
            adminMessage: project.initialMessage,
            stages: stages,
        };

        return NextResponse.json({
            success: true,
            data: publicData,
        });
    } catch (error) {
        console.error("Error tracking project:", error);
        return NextResponse.json(
            { success: false, error: "Gagal melacak proyek" },
            { status: 500 }
        );
    }
}
