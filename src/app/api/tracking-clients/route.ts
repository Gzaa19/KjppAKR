import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const type = searchParams.get("type") || "";

        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { picName: { contains: search, mode: "insensitive" } },
            ];
        }

        if (type && type !== "all") {
            where.type = type.toUpperCase();
        }

        const total = await prisma.clientContact.count({ where });

        const clients = await prisma.clientContact.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: clients,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch clients" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, type, address, picName, phone, email } = body;

        console.log("Received client data:", { name, type, address, picName, phone, email });

        if (!name || !type || !address || !picName || !phone || !email) {
            console.log("Validation failed - missing fields");
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        const client = await prisma.clientContact.create({
            data: {
                name,
                type: type.toUpperCase(),
                address,
                picName,
                phone,
                email,
            },
        });

        console.log("Client created successfully:", client.id);

        return NextResponse.json({
            success: true,
            data: client,
            message: "Client created successfully",
        });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create client" },
            { status: 500 }
        );
    }
}
