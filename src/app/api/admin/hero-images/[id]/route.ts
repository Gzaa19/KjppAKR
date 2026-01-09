import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        if (!id) {
            return NextResponse.json(
                { error: "Image ID is required" },
                { status: 400 }
            );
        }


        await prisma.heroImage.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}

import { uploadImage } from "@/lib/uploadImage";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const formData = await request.formData();
        const file = formData.get("image") as File | null;
        // const altText = formData.get("altText") as string; // If we add alt text editing later

        if (!id) {
            return NextResponse.json(
                { error: "Image ID is required" },
                { status: 400 }
            );
        }

        let imageUrl = undefined;
        if (file) {
            const uploadResult: any = await uploadImage(file, "hero-images");
            imageUrl = uploadResult.secure_url;
        }

        const updatedImage = await prisma.heroImage.update({
            where: { id },
            data: {
                ...(imageUrl && { imageUrl }),
                // ...(altText && { altText }),
            },
        });

        return NextResponse.json({ success: true, data: updatedImage });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: "Failed to update image" },
            { status: 500 }
        );
    }
}
