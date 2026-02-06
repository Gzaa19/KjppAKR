import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SekapurSirihImageType } from "@/generated/prisma";
import { uploadImage } from "@/lib/uploadImage";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const imageType = formData.get("imageType") as SekapurSirihImageType | null;
        const altText = formData.get("altText") as string | null;
        const caption = formData.get("caption") as string | null;
        const managingPartnerName = formData.get("managingPartnerName") as string | null;
        const managingPartnerTitle = formData.get("managingPartnerTitle") as string | null;
        const isActive = formData.get("isActive") === "true";

        if (!imageType || !altText) {
            return NextResponse.json(
                { error: "Image Type and Alt Text are required" },
                { status: 400 }
            );
        }

        const existingImage = await prisma.sekapur_sirih_images.findUnique({
            where: { id },
        });

        if (!existingImage) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        // Auto-deactivate other images of the same type if this one is being set to active
        if (isActive && !existingImage.isActive) {
            console.log("Deactivating other active images of type:", imageType);
            await prisma.sekapur_sirih_images.updateMany({
                where: {
                    imageType: imageType,
                    isActive: true,
                    id: { not: id },
                },
                data: {
                    isActive: false,
                },
            });
        }

        let imageUrl = existingImage.imageUrl;

        // If new file uploaded, upload it
        if (file) {
            const uploadResult: any = await uploadImage(file, "sekapur-sirih");
            imageUrl = uploadResult.secure_url;
        }

        const updatedImage = await prisma.sekapur_sirih_images.update({
            where: { id },
            data: {
                imageUrl,
                imageType,
                altText,
                caption: caption || null,
                managingPartnerName: imageType === "MANAGING_PARTNER" ? (managingPartnerName || null) : null,
                managingPartnerTitle: imageType === "MANAGING_PARTNER" ? (managingPartnerTitle || null) : null,
                isActive,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedImage);
    } catch (error) {
        console.error("Error updating Sekapur Sirih image:", error);
        return NextResponse.json(
            { error: "Failed to update Sekapur Sirih image" },
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
        await prisma.sekapur_sirih_images.delete({ where: { id } });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting Sekapur Sirih image:", error);
        console.error("ID attempted:", id);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: "Failed to delete Sekapur Sirih image" },
            { status: 500 }
        );
    }
}
