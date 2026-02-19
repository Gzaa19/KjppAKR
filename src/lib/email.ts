import { Resend } from 'resend';

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'KJPP AKR <onboarding@resend.dev>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error: 'Gagal mengirim email' };
        }

        console.log('Email sent successfully:', data?.id);
        return { success: true, data: { id: data?.id } };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: 'Gagal mengirim email' };
    }
}

export function generatePasswordResetEmail(resetLink: string, userName: string) {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - KJPP AKR</title>
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
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Reset Password</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 15px; font-weight: 500;">KJPP AKR - Kantor Jasa Penilai Publik</p>
                        </td>
                    </tr>
                    
                    <!-- Red Accent Bar -->
                    <tr>
                        <td style="background-color: #ED1C24; height: 6px; padding: 0;"></td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Halo <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 32px; color: #374151; font-size: 16px; line-height: 1.6;">
                                Kami menerima permintaan untuk mereset password akun admin Anda. Jika ini benar Anda, silakan klik tombol di bawah ini untuk membuat password baru:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="width: 100%; margin-bottom: 32px;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; background-color: #2C4157; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(44, 65, 87, 0.2); transition: all 0.3s ease;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Alternative plain text link -->
                            <p style="margin: 0 0 24px; color: #6b7280; font-size: 13px; line-height: 1.6; word-break: break-all;">
                                Jika tombol di atas tidak berfungsi, copy dan paste link berikut ke browser Anda:<br/>
                                <a href="${resetLink}" style="color: #2C4157; text-decoration: underline; word-break: break-all;">${resetLink}</a>
                            </p>
                            
                            <!-- Warning -->
                            <div style="padding: 20px; background-color: #fef2f2; border-left: 4px solid #ED1C24; border-radius: 6px; margin-top: 32px;">
                                <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px; font-weight: 700;">
                                    ⚠️ Penting:
                                </p>
                                <p style="margin: 0; color: #b91c1c; font-size: 14px; line-height: 1.6;">
                                    Link ini hanya berlaku selama <strong>15 menit</strong> dan hanya bisa digunakan sekali. Jika Anda tidak merasa meminta reset password, abaikan email ini dan amankan akun Anda.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background: linear-gradient(135deg, #2C4157 0%, #3d5a73 100%); text-align: center;">
                            <p style="margin: 0 0 8px; color: #e0e7ff; font-size: 13px; font-weight: 500;">Email ini dikirim secara otomatis untuk keamanan akun Anda</p>
                            <p style="margin: 0; color: #cbd5e1; font-size: 12px;">© ${new Date().getFullYear()} KJPP AKR. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

export function generateContactFormEmail(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}) {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Baru dari Website - KJPP AKR</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">KJPP AKR</h1>
                            <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 14px;">Pesan Baru dari Website</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 24px; color: #1e293b; font-size: 24px; font-weight: 600;">${data.subject}</h2>
                            
                            <!-- Contact Info -->
                            <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 12px; background-color: #f8fafc; border-radius: 8px;">
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 100px;">Nama:</td>
                                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.name}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
                                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                                                    <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a>
                                                </td>
                                            </tr>
                                            ${data.phone ? `
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Telepon:</td>
                                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.phone}</td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message -->
                            <div style="margin: 24px 0;">
                                <p style="margin: 0 0 12px; color: #64748b; font-size: 14px; font-weight: 600;">Pesan:</p>
                                <div style="padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 6px;">
                                    <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                                </div>
                            </div>
                            
                            <!-- Action Button -->
                            <table role="presentation" style="margin: 32px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; padding: 14px 28px; background-color: #1e293b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                                            Balas Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; text-align: center;">
                                Email ini dikirim dari formulir kontak website KJPP AKR
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} KJPP Anas Karim Rivai & Rekan. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
