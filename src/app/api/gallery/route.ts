
import { NextResponse } from "next/server";
import {
    createGallery,
    getGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery
} from "@/actions/gallery";
import { getSession } from "@/lib/session";
import type { CreateGalleryInput, UpdateGalleryInput } from "@/lib/validations";

// GET /api/gallery - Get all galleries or a specific one by ID
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const albumId = searchParams.get("albumId") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
    const published = searchParams.get("published") === "true";

    if (id) {
        const result = await getGalleryById(id);
        if (!result.success) {
            return NextResponse.json(result, { status: 404 });
        }
        return NextResponse.json(result);
    }

    const result = await getGalleries({ published, albumId, limit, page });
    return NextResponse.json(result);
}

// POST /api/gallery - Create a new gallery
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const input: CreateGalleryInput = body;

        const result = await createGallery(input, session.id);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Gallery API POST error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT /api/gallery - Update a gallery
export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing gallery ID" },
                { status: 400 }
            );
        }

        const input: UpdateGalleryInput = data;
        const result = await updateGallery(id, input);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Gallery API PUT error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/gallery - Delete a gallery
export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing gallery ID" },
                { status: 400 }
            );
        }

        const result = await deleteGallery(id);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Gallery API DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
