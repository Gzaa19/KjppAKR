import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/uploadImage";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;


        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Check if limit reached
        const currentCount = await prisma.heroImage.count();
        if (currentCount >= 3) {
            return NextResponse.json(
                { error: "Maksimal 3 gambar hero diperbolehkan. Hapus gambar lama terlebih dahulu." },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const uploadResult: any = await uploadImage(file, "hero-images");

        // Get current max sort order
        const maxSortOrder = await prisma.heroImage.findFirst({
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true }
        });

        const nextSortOrder = (maxSortOrder?.sortOrder || 0) + 1;

        // Save to database
        const heroImage = await prisma.heroImage.create({
            data: {
                imageUrl: uploadResult.secure_url,
                altText: "Hero Image", // Default or you could send this from client
                sortOrder: nextSortOrder,
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, data: heroImage });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
