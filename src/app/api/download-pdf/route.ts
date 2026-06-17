export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");
        const filename = searchParams.get("filename") || "Company-Profile-KJPP-AKR.pdf";

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Validate it's a Cloudinary URL for security
        const parsedUrl = new URL(url);
        if (!parsedUrl.hostname.endsWith("cloudinary.com")) {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        // Fetch the PDF from Cloudinary server-side
        const response = await fetch(url, {
            headers: {
                "Accept": "application/pdf,*/*",
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: "Failed to fetch PDF from storage" },
                { status: response.status }
            );
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": buffer.byteLength.toString(),
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Download PDF proxy error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
