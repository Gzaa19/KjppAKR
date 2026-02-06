import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const format = searchParams.get("format") || "csv"; // csv or pdf
        const branch = searchParams.get("branch") || "";
        const objectType = searchParams.get("objectType") || "";
        const reportType = searchParams.get("reportType") || "";
        const status = searchParams.get("status") || "";

        const STANDARD_OBJECT_TYPES = [
            "RUMAH_TINGGAL",
            "RUKO_KANTOR",
            "TANAH_KOSONG",
            "GUDANG",
            "APARTEMEN",
            "PABRIK"
        ];

        const where: any = {};

        if (branch && branch !== "all") {
            where.branch = {
                equals: branch,
                mode: "insensitive"
            };
        }

        if (objectType && objectType !== "all") {
            if (objectType === "LAINNYA") {
                where.objectType = {
                    notIn: STANDARD_OBJECT_TYPES
                };
            } else {
                where.objectType = objectType;
            }
        }

        if (reportType && reportType !== "all") {
            where.reportType = reportType;
        }

        if (status && status !== "all") {
            where.status = status;
        }

        const projects = await prisma.trackingProject.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        type: true,
                    },
                },
            },
        });

        if (format === "csv") {
            return generateCSV(projects);
        } else if (format === "pdf") {
            return await generatePDF(projects);
        }

        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    } catch (error) {
        console.error("Error exporting projects:", error);
        return NextResponse.json(
            { success: false, error: "Failed to export projects" },
            { status: 500 }
        );
    }
}

function generateCSV(projects: any[]) {
    const objectTypeLabels: Record<string, string> = {
        RUMAH_TINGGAL: "Rumah Tinggal",
        RUKO_KANTOR: "Ruko / Kantor",
        TANAH_KOSONG: "Tanah Kosong",
        GUDANG: "Gudang",
        APARTEMEN: "Apartemen",
        PABRIK: "Pabrik",
    };

    const reportTypeLabels: Record<string, string> = {
        SHORT_REPORT: "Short Report",
        FULL_REPORT: "Full Report",
    };

    const statusLabels: Record<string, string> = {
        VERIFIKASI_DOKUMEN: "Verifikasi Dokumen",
        INSPEKSI_LAPANGAN: "Inspeksi Lapangan",
        PROSES_REVIEW: "Proses Review",
        LAPORAN_FINAL: "Laporan Final",
        SELESAI: "Selesai",
    };

    // CSV Header
    const headers = [
        "No",
        "Project ID",
        "No. Proposal",
        "Kode Tracking",
        "Klien",
        "Cabang",
        "Jenis Objek",
        "Jenis Laporan",
        "Lokasi",
        "Status",
        "Progress (%)",
        "Tanggal Dibuat",
        "Tanggal Update"
    ];

    // CSV Rows
    const rows = projects.map((project, index) => [
        index + 1,
        project.projectId,
        project.proposalNo,
        project.trackingCode,
        project.client.name,
        project.branch,
        objectTypeLabels[project.objectType] || project.objectType,
        reportTypeLabels[project.reportType] || project.reportType,
        project.address,
        statusLabels[project.status] || project.status,
        project.progress,
        new Date(project.createdAt).toLocaleDateString("id-ID"),
        new Date(project.updatedAt).toLocaleDateString("id-ID")
    ]);

    // Build CSV content
    const csvContent = [
        headers.join(","),
        ...rows.map(row =>
            row.map(cell =>
                // Escape quotes and wrap in quotes if contains comma
                typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
                    ? `"${cell.replace(/"/g, '""')}"`
                    : cell
            ).join(",")
        )
    ].join("\n");

    // Add BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename=tracking-projects-${new Date().toISOString().split('T')[0]}.csv`
        }
    });
}

async function generatePDF(projects: any[]) {
    const objectTypeLabels: Record<string, string> = {
        RUMAH_TINGGAL: "Rumah Tinggal",
        RUKO_KANTOR: "Ruko / Kantor",
        TANAH_KOSONG: "Tanah Kosong",
        GUDANG: "Gudang",
        APARTEMEN: "Apartemen",
        PABRIK: "Pabrik",
    };

    const reportTypeLabels: Record<string, string> = {
        SHORT_REPORT: "Short Report",
        FULL_REPORT: "Full Report",
    };

    const statusLabels: Record<string, string> = {
        VERIFIKASI_DOKUMEN: "Verifikasi Dokumen",
        INSPEKSI_LAPANGAN: "Inspeksi Lapangan",
        PROSES_REVIEW: "Proses Review",
        LAPORAN_FINAL: "Laporan Final",
        SELESAI: "Selesai",
    };

    // Create PDF with landscape orientation for better table visibility
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // Header
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.setTextColor(153, 27, 27); // Red color (#991b1b)
    doc.text("REKAP LAPORAN TRACKING PROYEK", pageWidth / 2, 15, { align: "center" });

    // Subtitle - Company Name
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("KJPP Anas Karim Rival & Rekan", pageWidth / 2, 22, { align: "center" });

    // Print Date
    doc.setFontSize(10);
    const printDate = new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    doc.text(`Tanggal Cetak: ${printDate}`, pageWidth / 2, 28, { align: "center" });

    // Table headers
    const headers = [
        ["No", "Project ID", "No. Proposal", "Tracking", "Klien", "Cabang", "Jenis Objek", "Jenis Laporan", "Status", "Progress", "Tgl Dibuat"]
    ];

    // Table body
    const body = projects.map((project, index) => [
        (index + 1).toString(),
        project.projectId,
        project.proposalNo,
        project.trackingCode,
        project.client.name,
        project.branch,
        objectTypeLabels[project.objectType] || project.objectType,
        reportTypeLabels[project.reportType] || project.reportType,
        statusLabels[project.status] || project.status,
        `${project.progress}%`,
        new Date(project.createdAt).toLocaleDateString("id-ID")
    ]);

    // Generate table using autoTable
    autoTable(doc, {
        head: headers,
        body: body,
        startY: 35,
        theme: "grid",
        styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
            halign: "left",
        },
        headStyles: {
            fillColor: [153, 27, 27], // Red color (#991b1b)
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        alternateRowStyles: {
            fillColor: [249, 249, 249],
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 10 }, // No
            1: { cellWidth: 22 }, // Project ID
            2: { cellWidth: 25 }, // No. Proposal
            3: { cellWidth: 22 }, // Tracking
            4: { cellWidth: 35 }, // Klien
            5: { cellWidth: 25 }, // Cabang
            6: { cellWidth: 25 }, // Jenis Objek
            7: { cellWidth: 22 }, // Jenis Laporan
            8: { cellWidth: 30 }, // Status
            9: { halign: "center", cellWidth: 18 }, // Progress
            10: { halign: "center", cellWidth: 22 }, // Tgl Dibuat
        },
        didDrawPage: (data) => {
            // Footer on each page
            const pageCount = doc.getNumberOfPages();
            const pageNumber = data.pageNumber;

            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
                `Halaman ${pageNumber} dari ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: "center" }
            );
        },
    });

    // Summary footer on last page
    const finalY = (doc as any).lastAutoTable?.finalY || 35;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Proyek: ${projects.length}`, 14, finalY + 10);
    doc.setFontSize(8);
    doc.text("Dokumen ini dibuat secara otomatis oleh sistem", 14, finalY + 15);

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=tracking-projects-${new Date().toISOString().split('T')[0]}.pdf`
        }
    });
}
