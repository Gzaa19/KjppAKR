import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const client = await prisma.clientContact.findUnique({
            where: { id },
        });

        if (!client) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch client" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, type, address, picName, phone, email } = body;

        const existingClient = await prisma.clientContact.findUnique({
            where: { id },
        });

        if (!existingClient) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        const client = await prisma.clientContact.update({
            where: { id },
            data: {
                name,
                type: type.toUpperCase(),
                address,
                picName,
                phone,
                email,
            },
        });

        return NextResponse.json({
            success: true,
            data: client,
            message: "Client updated successfully",
        });
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update client" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existingClient = await prisma.clientContact.findUnique({
            where: { id },
        });

        if (!existingClient) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        await prisma.clientContact.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete client" },
            { status: 500 }
        );
    }
}
