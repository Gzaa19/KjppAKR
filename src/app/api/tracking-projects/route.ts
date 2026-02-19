export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Generate unique Project ID
async function generateProjectId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.tracking_projects.count({
        where: {
            projectId: {
                startsWith: `PRJ-${year}`,
            },
        },
    });
    const nextNumber = (count + 1).toString().padStart(3, "0");
    return `PRJ-${year}-${nextNumber}`;
}

// Generate unique Tracking Code for public tracking
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
        const existing = await prisma.tracking_projects.findUnique({
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

// GET: List all projects with pagination, search, and filter
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";
        const objectType = searchParams.get("objectType") || "";

        const reportType = searchParams.get("reportType") || "";
        const branch = searchParams.get("branch") || "";

        const skip = (page - 1) * limit;

        // Standard object types
        const STANDARD_OBJECT_TYPES = [
            "RUMAH_TINGGAL",
            "RUKO_KANTOR",
            "TANAH_KOSONG",
            "GUDANG",
            "APARTEMEN",
            "PABRIK"
        ];

        // Build where clause
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (search) {
            where.OR = [
                { projectId: { contains: search, mode: "insensitive" } },
                { proposalNo: { contains: search, mode: "insensitive" } },
                { trackingCode: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { client_contacts: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        if (status && status !== "all") {
            where.status = status;
        }

        if (objectType && objectType !== "all") {
            if (objectType === "LAINNYA") {
                // If "LAINNYA" is selected, find object types that are NOT in the standard list
                where.objectType = {
                    notIn: STANDARD_OBJECT_TYPES
                };
            } else {
                where.objectType = objectType;
            }
        }

        if (reportType && reportType !== "all") {
            where.reportType = reportType;
        }

        if (branch && branch !== "all") {
            where.branch = {
                equals: branch,
                mode: "insensitive"
            };
        }

        // Get total count
        const total = await prisma.tracking_projects.count({ where });

        // Get projects with client info
        const projects = await prisma.tracking_projects.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                client_contacts: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        type: true,
                    },
                },
            },
        });

        // Get stats
        const stats = await prisma.tracking_projects.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        const totalActive = await prisma.tracking_projects.count({
            where: { status: { not: "SELESAI" } },
        });

        const totalCompleted = await prisma.tracking_projects.count({
            where: { status: "SELESAI" },
        });

        return NextResponse.json({
            success: true,
            data: projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            stats: {
                total,
                totalActive,
                totalCompleted,
                byStatus: stats,
            },
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// POST: Create new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            proposalNo,
            clientId,
            objectType,
            reportType,
            branch,
            objective,
            address,
            initialMessage,
        } = body;

        // Validation
        if (!proposalNo || !clientId || !objectType || !reportType || !branch || !objective || !address) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Semua field wajib diisi (proposalNo, clientId, objectType, reportType, branch, objective, address)",
                },
                { status: 400 }
            );
        }

        // Check if client exists
        const clientExists = await prisma.client_contacts.findUnique({
            where: { id: clientId },
        });

        if (!clientExists) {
            return NextResponse.json(
                { success: false, error: "Client tidak ditemukan" },
                { status: 404 }
            );
        }

        // Generate unique project ID and tracking code
        const projectId = await generateProjectId();
        const trackingCode = await generateTrackingCode();

        // Create project
        const project = await prisma.tracking_projects.create({
            data: {
                id: crypto.randomUUID(),
                updatedAt: new Date(),
                projectId,
                proposalNo,
                trackingCode,
                clientId,
                objectType,
                reportType,
                branch,
                objective,
                address,
                initialMessage: initialMessage || null,
                status: "VERIFIKASI_DOKUMEN",
                progress: 0,
            },
            include: {
                client_contacts: {
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
            message: "Proyek berhasil dibuat",
            trackingCode: project.trackingCode,
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { success: false, error: "Gagal membuat proyek" },
            { status: 500 }
        );
    }
}
