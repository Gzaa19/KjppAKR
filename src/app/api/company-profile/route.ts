export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const activeProfile = await prisma.company_profiles.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: "desc" },
        });
        
        return NextResponse.json({
            success: true,
            data: activeProfile || null
        });
    } catch (error) {
        console.error("Error fetching active company profile:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch active company profile" },
            { status: 500 }
        );
    }
}
