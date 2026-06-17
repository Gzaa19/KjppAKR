export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadImage";

export async function GET() {
    try {
        const profiles = await prisma.company_profiles.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(profiles);
    } catch (error) {
        console.error("Error fetching company profiles:", error);
        return NextResponse.json(
            { error: "Failed to fetch company profiles" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const isActive = formData.get("isActive") === "true";

        if (!file || !title) {
            return NextResponse.json(
                { error: "File and Title are required" },
                { status: 400 }
            );
        }

        // Auto-deactivate other profiles if this one is active
        if (isActive) {
            await prisma.company_profiles.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }

        // Upload PDF to Cloudinary
        const uploadResult: any = await uploadImage(file, "documents");
        const fileUrl = uploadResult.secure_url;

        const newProfile = await prisma.company_profiles.create({
            data: {
                id: crypto.randomUUID(),
                title: title.trim(),
                fileUrl,
                isActive,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(newProfile, { status: 201 });
    } catch (error) {
        console.error("Error creating company profile:", error);
        return NextResponse.json(
            { error: "Failed to create company profile" },
            { status: 500 }
        );
    }
}
