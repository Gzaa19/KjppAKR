import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const heroImages = await prisma.heroImage.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });

        return NextResponse.json(heroImages);
    } catch (error) {
        console.error("Error fetching hero images:", error);
        return NextResponse.json(
            { error: "Failed to fetch hero images" },
            { status: 500 }
        );
    }
}
