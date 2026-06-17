export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadImage";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const isActive = formData.get("isActive") === "true";

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const existingProfile = await prisma.company_profiles.findUnique({
            where: { id },
        });

        if (!existingProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Auto-deactivate other profiles if this one is being set to active
        if (isActive && !existingProfile.isActive) {
            await prisma.company_profiles.updateMany({
                where: {
                    isActive: true,
                    id: { not: id },
                },
                data: {
                    isActive: false,
                },
            });
        }

        let fileUrl = existingProfile.fileUrl;

        // If new file uploaded, upload it to Cloudinary
        if (file) {
            const uploadResult: any = await uploadImage(file, "documents");
            fileUrl = uploadResult.secure_url;
        }

        const updatedProfile = await prisma.company_profiles.update({
            where: { id },
            data: {
                title: title.trim(),
                fileUrl,
                isActive,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error("Error updating company profile:", error);
        return NextResponse.json(
            { error: "Failed to update company profile" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await prisma.company_profiles.delete({ where: { id } });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting company profile:", error);
        return NextResponse.json(
            { error: "Failed to delete company profile" },
            { status: 500 }
        );
    }
}
