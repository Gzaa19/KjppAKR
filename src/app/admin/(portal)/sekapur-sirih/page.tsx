import { SekapurSirihForm } from "@/components/admin/SekapurSirihForm";
import { SekapurSirihActionMenu } from "@/components/admin/sekapur-sirih-actions";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function SekapurSirihPage() {
    const images = await prisma.sekapurSirihImage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const managingPartnerImages = images.filter(img => img.imageType === "MANAGING_PARTNER");
    const teamPhotoImages = images.filter(img => img.imageType === "TEAM_PHOTO");

    const hasActiveManagingPartner = managingPartnerImages.some(img => img.isActive);
    const hasActiveTeamPhoto = teamPhotoImages.some(img => img.isActive);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Gambar Sekapur Sirih</h1>
                <p className="text-gray-600">
                    Kelola foto Managing Partner dan foto tim yang ditampilkan di halaman Sekapur Sirih.
                </p>
            </div>

            {/* Upload Form */}
            <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>Upload Gambar Baru</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <SekapurSirihForm
                        hasActiveManagingPartner={hasActiveManagingPartner}
                        hasActiveTeamPhoto={hasActiveTeamPhoto}
                    />
                </CardContent>
            </Card>

            {/* Managing Partner Images */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Gambar Managing Partner</h2>
                    <Badge variant="outline">
                        {managingPartnerImages.length} gambar
                    </Badge>
                </div>

                {managingPartnerImages.length === 0 ? (
                    <Card className="p-8">
                        <p className="text-center text-muted-foreground">
                            Belum ada gambar Managing Partner. Silakan upload gambar baru menggunakan form di atas.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {managingPartnerImages.map((image) => (
                            <Card key={image.id} className="overflow-hidden">
                                <div className="relative aspect-video">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.altText}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {image.altText}
                                                </p>
                                                {image.caption && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {image.caption}
                                                    </p>
                                                )}
                                            </div>
                                            <SekapurSirihActionMenu
                                                image={image}
                                                hasActiveManagingPartner={hasActiveManagingPartner}
                                                hasActiveTeamPhoto={hasActiveTeamPhoto}
                                            />
                                        </div>
                                        <Badge variant={image.isActive ? "default" : "secondary"}>
                                            {image.isActive ? "Aktif" : "Tidak Aktif"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Team Photo Images */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Foto Tim</h2>
                    <Badge variant="outline">
                        {teamPhotoImages.length} gambar
                    </Badge>
                </div>

                {teamPhotoImages.length === 0 ? (
                    <Card className="p-8">
                        <p className="text-center text-muted-foreground">
                            Belum ada foto tim. Silakan upload gambar baru menggunakan form di atas.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamPhotoImages.map((image) => (
                            <Card key={image.id} className="overflow-hidden">
                                <div className="relative aspect-video">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.altText}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {image.altText}
                                                </p>
                                                {image.caption && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {image.caption}
                                                    </p>
                                                )}
                                            </div>
                                            <SekapurSirihActionMenu
                                                image={image}
                                                hasActiveManagingPartner={hasActiveManagingPartner}
                                                hasActiveTeamPhoto={hasActiveTeamPhoto}
                                            />
                                        </div>
                                        <Badge variant={image.isActive ? "default" : "secondary"}>
                                            {image.isActive ? "Aktif" : "Tidak Aktif"}
                                        </Badge>
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
