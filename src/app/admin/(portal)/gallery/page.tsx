import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGalleries, getAlbums } from "@/actions/gallery";
import { formatDateShort } from "@/lib/helpers";
import { DeleteGalleryButton } from "@/components/admin/gallery-actions";
import Image from "next/image";

export default async function GalleryPage() {
    const [galleriesResult, albumsResult] = await Promise.all([getGalleries(), getAlbums()]);

    const galleries = galleriesResult.success ? galleriesResult.data?.galleries || [] : [];
    const albums = albumsResult.success ? albumsResult.data || [] : [];

    // Group galleries by album
    const galleriesByAlbum = albums.map(album => ({
        album,
        items: galleries.filter(g => g.albumId === album.id)
    })).filter(group => group.items.length > 0);

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Galeri Foto</h2>
                    <p className="text-sm text-muted-foreground">
                        Dokumentasi kegiatan perusahaan seperti rapat dan survei lapangan.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/gallery/albums/create">
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Album
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

            <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari foto..." className="pl-8" />
                </div>
            </div>

            {galleries.length === 0 ? (
                <Card className="p-12 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Belum ada foto. Mulai dengan mengupload foto baru.</p>
                    <Link href="/admin/gallery/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Foto Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-8">
                    {galleriesByAlbum.map(({ album, items }) => (
                        <div key={album.id}>
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="h-5 w-5 text-kjpp-red" />
                                <h3 className="text-lg font-bold">{album.name}</h3>
                                <Badge variant="secondary">{items.length}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {items.map((gallery) => (
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
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/gallery/${gallery.id}/edit`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DeleteGalleryButton id={gallery.id} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
