import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

        if (!name || !company || !email) {
            return NextResponse.json(
                { error: "Nama, Perusahaan, dan Email harus diisi" },
                { status: 400 }
            );
        }

        const emailHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permohonan Penilaian Baru</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2C4157 0%, #3d5a73 100%); padding: 40px 30px; text-align: center;">
                            <img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/image/logoAKR.png" alt="KJPP AKR Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; background-color: white; padding: 12px; border-radius: 8px;" />
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Permohonan Penilaian Baru</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 15px; font-weight: 500;">Kantor Jasa Penilai Publik</p>
                        </td>
                    </tr>
                    
                    <!-- Red Accent Bar -->
                    <tr>
                        <td style="background-color: #ED1C24; height: 6px; padding: 0;"></td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0;">
                            <!-- Section A: Identitas -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 30px 30px 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 20px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">A. Identitas Pemohon</h2>
                                        </div>
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; padding: 16px;">
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; width: 140px; vertical-align: top;">Nama</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px; font-weight: 500;">: ${name}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">Perusahaan</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px; font-weight: 500;">: ${company}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">Jabatan</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px;">: ${position || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">No. Telepon</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px;">: ${phone || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">No. Fax</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px;">: ${fax || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">Mobile/HP</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px;">: ${mobile || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">Email</td>
                                                <td style="padding: 10px 16px;"><a href="mailto:${email}" style="color: #ED1C24; text-decoration: none; font-size: 14px; font-weight: 500;">: ${email}</a></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 600; vertical-align: top;">Website</td>
                                                <td style="padding: 10px 16px; color: #1f2937; font-size: 14px;">: ${website || '-'}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Section B: Kategori -->
                                <tr>
                                    <td style="padding: 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">B. Kategori Penilaian</h2>
                                        </div>
                                        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #ED1C24; padding: 16px 20px; border-radius: 6px;">
                                            <p style="margin: 0; color: #991b1b; font-size: 15px; font-weight: 600;">${valuationCategory || '-'}</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Section C: Objek Penilaian -->
                                <tr>
                                    <td style="padding: 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">C. Objek Penilaian</h2>
                                        </div>
                                        <div style="background-color: #f9fafb; padding: 16px 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7;">${objectDescription ? objectDescription.replace(/\n/g, "<br>") : '-'}</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Section D: Alamat Objek -->
                                <tr>
                                    <td style="padding: 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">D. Alamat Objek</h2>
                                        </div>
                                        <div style="background-color: #f9fafb; padding: 16px 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7;">${objectAddress ? objectAddress.replace(/\n/g, "<br>") : '-'}</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Section E: Tujuan Penilaian -->
                                <tr>
                                    <td style="padding: 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">E. Tujuan Penilaian</h2>
                                        </div>
                                        <div style="background-color: #f9fafb; padding: 16px 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7;">${valuationPurpose ? valuationPurpose.replace(/\n/g, "<br>") : '-'}</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Section F: Catatan Tambahan -->
                                ${additionalNotes ? `
                                <tr>
                                    <td style="padding: 24px 30px; border-bottom: 2px solid #f3f4f6;">
                                        <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                            <div style="width: 4px; height: 24px; background-color: #ED1C24; margin-right: 12px; border-radius: 2px;"></div>
                                            <h2 style="margin: 0; color: #2C4157; font-size: 19px; font-weight: 700;">F. Catatan Tambahan</h2>
                                        </div>
                                        <div style="background-color: #f9fafb; padding: 16px 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7;">${additionalNotes.replace(/\n/g, "<br>")}</p>
                                        </div>
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background: linear-gradient(135deg, #2C4157 0%, #3d5a73 100%); text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #e0e7ff; font-size: 13px; font-weight: 500;">Email ini dikirim secara otomatis dari website KJPP AKR</p>
                            <p style="margin: 0; color: #cbd5e1; font-size: 12px;">© ${new Date().getFullYear()} KJPP AKR. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'KJPP AKR <onboarding@resend.dev>',
            to: 'admin@kjpp-akr.com',
            replyTo: email,
            subject: `[Permohonan Penilaian] ${valuationCategory || 'Umum'} - ${company}`,
            html: emailHtml,
        });

        if (error) {
            console.error("Error sending email:", error);
            return NextResponse.json(
                { error: "Gagal mengirim email", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Permohonan berhasil dikirim", id: data?.id },
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
