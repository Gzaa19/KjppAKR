import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            company,
            position,
            phone,
            fax,
            mobile,
            email,
            website,
            valuationCategory,
            objectDescription,
            objectAddress,
            valuationPurpose,
            additionalNotes
        } = body;

        // Basic validation
        if (!name || !company || !email) {
            return NextResponse.json(
                { error: "Nama, Perusahaan, dan Email harus diisi" },
                { status: 400 }
            );
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "fauzanhadi097@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email content
        const mailOptions = {
            from: email,
            to: "fauzanhadi097@gmail.com",
            subject: `[Permohonan Penilaian] ${valuationCategory || 'Umum'} - ${company}`,
            html: `
                <h3>Permohonan Penilaian Baru</h3>
                <hr />
                <h4>A. Identitas</h4>
                <p><strong>Nama:</strong> ${name}</p>
                <p><strong>Perusahaan:</strong> ${company}</p>
                <p><strong>Jabatan:</strong> ${position || '-'}</p>
                <p><strong>No. Telp:</strong> ${phone || '-'}</p>
                <p><strong>No. Fax:</strong> ${fax || '-'}</p>
                <p><strong>Mobile/HP:</strong> ${mobile || '-'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Website:</strong> ${website || '-'}</p>
                
                <hr />
                <h4>B. Kategori Penilaian</h4>
                <p>${valuationCategory || '-'}</p>
                
                <hr />
                <h4>C. Objek Penilaian</h4>
                <p>${objectDescription ? objectDescription.replace(/\n/g, "<br>") : '-'}</p>
                
                <hr />
                <h4>D. Alamat Objek</h4>
                <p>${objectAddress ? objectAddress.replace(/\n/g, "<br>") : '-'}</p>
                
                <hr />
                <h4>E. Tujuan Penilaian</h4>
                <p>${valuationPurpose ? valuationPurpose.replace(/\n/g, "<br>") : '-'}</p>
                
                <hr />
                <h4>F. Catatan Tambahan</h4>
                <p>${additionalNotes ? additionalNotes.replace(/\n/g, "<br>") : '-'}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: "Permohonan berhasil dikirim" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { error: "Gagal mengirim email", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
