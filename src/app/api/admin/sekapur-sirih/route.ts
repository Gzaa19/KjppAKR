import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SekapurSirihImageType } from "@/generated/prisma";
import { uploadImage } from "@/lib/uploadImage";

export async function GET() {
    try {
        const images = await prisma.sekapurSirihImage.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(images);
    } catch (error) {
        console.error("Error fetching Sekapur Sirih images:", error);
        return NextResponse.json(
            { error: "Failed to fetch Sekapur Sirih images" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const imageType = formData.get("imageType") as SekapurSirihImageType | null;
        const altText = formData.get("altText") as string | null;
        const caption = formData.get("caption") as string | null;
        const managingPartnerName = formData.get("managingPartnerName") as string | null;
        const managingPartnerTitle = formData.get("managingPartnerTitle") as string | null;
        const isActive = formData.get("isActive") === "true";

        console.log("POST /api/admin/sekapur-sirih - Received data:", {
            hasFile: !!file,
            imageType,
            altText,
            managingPartnerName,
            managingPartnerTitle,
            isActive
        });

        if (!file || !imageType || !altText) {
            console.log("Validation failed:", { hasFile: !!file, imageType, altText });
            return NextResponse.json(
                { error: "File, Image Type, and Alt Text are required" },
                { status: 400 }
            );
        }

        // Auto-deactivate other images of the same type if this one is active
        if (isActive) {
            console.log("Deactivating other active images of type:", imageType);
            await prisma.sekapurSirihImage.updateMany({
                where: {
                    imageType: imageType,
                    isActive: true,
                },
                data: {
                    isActive: false,
                },
            });
        }

        // Upload image
        console.log("Uploading image to Cloudinary...");
        const uploadResult: any = await uploadImage(file, "sekapur-sirih");
        const imageUrl = uploadResult.secure_url;
        console.log("Image uploaded:", imageUrl);

        const newImage = await prisma.sekapurSirihImage.create({
            data: {
                imageUrl,
                imageType,
                altText,
                caption: caption || null,
                managingPartnerName: imageType === "MANAGING_PARTNER" ? (managingPartnerName || null) : null,
                managingPartnerTitle: imageType === "MANAGING_PARTNER" ? (managingPartnerTitle || null) : null,
                isActive,
            },
        });
        console.log("Image saved to database:", newImage.id);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("Error creating Sekapur Sirih image:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            { error: "Failed to create Sekapur Sirih image" },
            { status: 500 }
        );
    }
}
