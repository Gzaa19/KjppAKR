import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAlbums } from "@/actions/gallery";
import { AlbumActionButtons } from "@/components/admin/album-action-buttons";

export default async function AlbumsPage() {
    const result = await getAlbums();
    const albums = result.success ? result.data || [] : [];

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Album</h1>
                <p className="text-gray-600">
                    Kelola album galeri KJPP AKR. Album ini akan muncul saat menambah foto baru.
                </p>
            </div>

            <div className="flex justify-between items-center">
                <Link href="/admin/gallery">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Galeri
                    </Button>
                </Link>
                <Link href="/admin/gallery/albums/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Album Baru
                    </Button>
                </Link>
            </div>

            {albums.length === 0 ? (
                <Card className="p-12 text-center">
                    <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                        Belum ada album. Mulai dengan menambahkan album baru.
                    </p>
                    <Link href="/admin/gallery/albums/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Album Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <Card>
                    <div className="divide-y">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{album.name}</h3>
                                        <Badge variant={album.isActive ? "default" : "secondary"}>
                                            {album.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                        <Badge variant="outline">
                                            {album._count.galleries} foto
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Slug: {album.slug} • Urutan: {album.sortOrder ?? "-"}
                                    </p>
                                    {album.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {album.description}
                                        </p>
                                    )}
                                </div>

                                <AlbumActionButtons
                                    id={album.id}
                                    isActive={album.isActive}
                                    galleryCount={album._count.galleries}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
