import { HeroImageForm } from "@/components/admin/HeroImageForm";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { HeroImageActionMenu } from "@/components/admin/hero-image-actions";

export default async function HeroImagesPage() {
    const heroImages = await prisma.heroImage.findMany({
        orderBy: { sortOrder: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Cover Depan</h1>
                <p className="text-gray-600">
                    Kelola gambar slide show di halaman depan. (Maksimal 3 gambar)
                </p>
            </div>

            <Card className="p-6">
                <HeroImageForm currentCount={heroImages.length} />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                        <div className="relative aspect-video">
                            <Image
                                src={image.imageUrl}
                                alt={image.altText}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-4 flex items-center justify-between gap-2">
                            <Badge variant={image.isActive ? "default" : "secondary"}>
                                {image.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <div className="flex gap-2">
                                <HeroImageActionMenu image={image} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}