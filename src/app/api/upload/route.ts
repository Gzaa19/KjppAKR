export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        // ✅ Authorization check
        const { requireAuth, canCreate } = await import("@/lib/auth-helpers");
        const session = await requireAuth();

        if (!canCreate(session)) {
            return NextResponse.json(
                { success: false, error: "Forbidden: Tidak memiliki akses upload" },
                { status: 403 }
            );
        }

        // ✅ Rate limiting check
        const { apiRateLimit, checkRateLimit } = await import("@/lib/rate-limit");
        const identifier = `upload:${session.id}`;
        const { success: rateLimitSuccess } = await checkRateLimit(apiRateLimit, identifier);

        if (!rateLimitSuccess) {
            return NextResponse.json(
                { success: false, error: "Terlalu banyak upload. Silakan tunggu beberapa saat." },
                { status: 429 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file uploaded" },
                { status: 400 }
            );
        }

        // ✅ Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ Validate magic bytes (actual file content)
        const magicBytes = buffer.slice(0, 4);
        const isValidImage =
            (magicBytes[0] === 0xFF && magicBytes[1] === 0xD8) || // JPEG
            (magicBytes[0] === 0x89 && magicBytes[1] === 0x50) || // PNG
            (buffer.slice(0, 6).toString() === 'GIF87a' || buffer.slice(0, 6).toString() === 'GIF89a') || // GIF
            (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP'); // WebP

        if (!isValidImage) {
            return NextResponse.json(
                { success: false, error: "Invalid image file. File content does not match expected format." },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await new Promise<{
            secure_url: string;
            public_id: string;
            format: string;
            bytes: number;
        }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "kjppakr",
                        resource_type: "image",
                        // ✅ Add transformations for security
                        transformation: [
                            { quality: "auto:good" },
                            { fetch_format: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("No result from Cloudinary"));
                        }
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                filename: file.name,
                size: file.size,
                type: file.type,
            },
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.error("Upload error:", error instanceof Error ? error.message : 'Unknown');
        return NextResponse.json(
            { success: false, error: "Failed to upload file to Cloudinary" },
            { status: 500 }
        );
    }
}
