import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch client" },
            { status: 500 }
        );
    }
}
