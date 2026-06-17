export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ExternalLink } from "lucide-react";
import { CompanyProfileForm } from "@/components/admin/CompanyProfileForm";
import { CompanyProfileActions } from "@/components/admin/company-profile-actions";

export default async function CompanyProfileAdminPage() {
    const profiles = await prisma.company_profiles.findMany({
        orderBy: { createdAt: "desc" },
    });

    const activeProfile = profiles.find((p) => p.isActive);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Company Profile</h1>
                <p className="text-gray-600">
                    Unggah, ubah, dan kelola dokumen PDF Company Profile yang dapat diunduh di website utama.
                </p>
            </div>

            {/* Upload Form Card */}
            <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>Upload Company Profile Baru (PDF)</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <CompanyProfileForm />
                </CardContent>
            </Card>

            {/* List of Profiles */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Daftar Dokumen</h2>
                    <Badge variant="outline">
                        {profiles.length} dokumen
                    </Badge>
                </div>

                {profiles.length === 0 ? (
                    <Card className="p-8">
                        <p className="text-center text-muted-foreground">
                            Belum ada dokumen Company Profile yang diupload. Silakan gunakan form di atas untuk mengunggah file PDF.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profiles.map((profile) => (
                            <Card key={profile.id} className="overflow-hidden flex flex-col justify-between border hover:shadow-md transition-shadow">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-red-50 text-red-500 border border-red-100">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 text-sm md:text-base truncate max-w-[180px]" title={profile.title}>
                                                    {profile.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <CompanyProfileActions profile={profile} />
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <Badge variant={profile.isActive ? "default" : "secondary"}>
                                            {profile.isActive ? "Aktif di Website" : "Draf"}
                                        </Badge>
                                        <a
                                            href={profile.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                        >
                                            Buka PDF
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
