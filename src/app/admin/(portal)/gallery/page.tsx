import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { getGalleries, getAlbums } from "@/actions/gallery";
import { formatDateShort } from "@/lib/helpers";
import { GalleryActionMenu } from "@/components/admin/gallery-actions";
import Image from "next/image";

// Define local types to fix implicit any errors
type Album = {
    id: string;
    name: string;
};

type Gallery = {
    id: string;
    title: string;
    imageUrl: string;
    albumId: string | null;
    isPublished: boolean;
    eventDate: Date | null;
    createdAt: Date;
};

export default async function GalleryPage() {
    const [galleriesResult, albumsResult] = await Promise.all([getGalleries(), getAlbums()]);

    const galleries = galleriesResult.success ? galleriesResult.data?.galleries || [] : [];
    const albums = albumsResult.success ? albumsResult.data || [] : [];

    const galleriesByAlbum = albums.map((album: Album) => ({
        album,
        items: galleries.filter((g: Gallery) => g.albumId === album.id)
    })).filter((group: { items: Gallery[] }) => group.items.length > 0);

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Galeri Foto</h1>
                <p className="text-gray-600">
                    Dokumentasi kegiatan perusahaan seperti rapat dan survei lapangan.
                </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                <div className="flex gap-2">
                    <Link href="/admin/gallery/albums">
                        <Button variant="outline">
                            Kelola Album
                        </Button>
                    </Link>
                    <Link href="/admin/gallery/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Foto
                        </Button>
                    </Link>
                </div>
            </div>

            {albums.length === 0 ? (
                <Card className="p-12 text-center bg-white">
                    <div className="max-w-md mx-auto">
                        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Belum Ada Album</h3>
                        <p className="text-muted-foreground mb-6">
                            Anda belum membuat album untuk mengelompokkan foto. Buat album terlebih dahulu sebelum mengupload foto.
                        </p>
                        <Link href="/admin/gallery/albums">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Album Pertama
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : galleries.length === 0 ? (
                <Card className="p-12 text-center bg-white">
                    <div className="max-w-md mx-auto">
                        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Belum Ada Foto</h3>
                        <p className="text-muted-foreground mb-6">
                            Galeri foto masih kosong. Mulai dokumentasikan kegiatan perusahaan dengan mengupload foto pertama Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/admin/gallery/albums">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Kelola Album
                                </Button>
                            </Link>
                            <Link href="/admin/gallery/create">
                                <Button className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload Foto Pertama
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : galleriesByAlbum.length === 0 ? (
                <Card className="p-12 text-center bg-white">
                    <div className="max-w-md mx-auto">
                        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Album Belum Memiliki Foto</h3>
                        <p className="text-muted-foreground mb-6">
                            Album sudah tersedia, tetapi belum ada foto yang diupload. Silakan upload foto ke album yang sudah ada.
                        </p>
                        <Link href="/admin/gallery/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Upload Foto
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="space-y-8">
                    {galleriesByAlbum.map(({ album, items }) => (
                        <div key={album.id}>
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="h-5 w-5 text-kjpp-red" />
                                <h3 className="text-lg font-bold">{album.name}</h3>
                                <Badge variant="secondary">{items.length} foto</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {items.map((gallery: Gallery) => (
                                    <Card key={gallery.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative aspect-square bg-muted">
                                            {gallery.imageUrl ? (
                                                <Image
                                                    src={gallery.imageUrl}
                                                    alt={gallery.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                                                    <ImageIcon className="h-10 w-10 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={gallery.isPublished ? "default" : "secondary"} className="text-xs">
                                                        {gallery.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <GalleryActionMenu id={gallery.id} />
                                                </div>
                                                <h4 className="font-bold text-sm line-clamp-2">{gallery.title}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {gallery.eventDate ? formatDateShort(gallery.eventDate) : formatDateShort(gallery.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
