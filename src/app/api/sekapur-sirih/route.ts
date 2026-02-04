import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const managingPartnerImage = await prisma.sekapurSirihImage.findFirst({
            where: {
                imageType: "MANAGING_PARTNER",
                isActive: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const teamPhotoImage = await prisma.sekapurSirihImage.findFirst({
            where: {
                imageType: "TEAM_PHOTO",
                isActive: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            managingPartner: managingPartnerImage,
            teamPhoto: teamPhotoImage,
        });
    } catch (error) {
        console.error("Error fetching Sekapur Sirih images:", error);
        return NextResponse.json(
            { error: "Failed to fetch Sekapur Sirih images" },
            { status: 500 }
        );
    }
}
