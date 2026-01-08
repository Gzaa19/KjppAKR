"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createGallery, getAlbums } from "@/actions/gallery";
import type { CreateGalleryInput } from "@/lib/validations";
import { ImageUpload } from "@/components/ui/image-upload";

type Album = {
    id: string;
    name: string;
    slug: string;
};

export default function CreateGalleryPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        eventDate: "",
        albumId: "",
    });

    // Fetch user session and albums
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch session
                const sessionRes = await fetch("/api/auth/session");
                const sessionData = await sessionRes.json();
                if (sessionData.success) {
                    setUserId(sessionData.data.id);
                }

                // Fetch albums
                const albumResult = await getAlbums(true);
                if (albumResult.success && albumResult.data) {
                    setAlbums(albumResult.data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!formData.imageUrl) {
            setError("URL gambar wajib diisi");
            return;
        }

        if (!userId) {
            setError("Session tidak valid. Silakan login ulang.");
            return;
        }

        startTransition(async () => {
            const input: CreateGalleryInput = {
                title: formData.title,
                description: formData.description || null,
                imageUrl: formData.imageUrl,
                eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
                albumId: formData.albumId || null,
                isPublished: true,
                sortOrder: 0,
            };

            const result = await createGallery(input, userId);

            if (result.success) {
                router.push("/admin/gallery");
                router.refresh();
            } else {
                setError(result.error || "Gagal menambahkan foto");
            }
        });
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/gallery">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Upload Foto Baru</h1>
                    <p className="text-muted-foreground">Tambahkan dokumentasi foto kegiatan baru ke galeri.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit}>
                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>URL Foto</CardTitle>
                            <CardDescription>Masukkan URL gambar yang ingin ditambahkan ke galeri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Foto</Label>
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                                    onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                                    disabled={isPending}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Informasi</CardTitle>
                            <CardDescription>Informasi detail mengenai foto kegiatan ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Kegiatan / Foto</Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Survei Lapangan Proyek A"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="eventDate">Tanggal Kegiatan</Label>
                                    <Input
                                        id="eventDate"
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="album">Album (Opsional)</Label>
                                    <select
                                        id="album"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.albumId}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, albumId: e.target.value }))}
                                    >
                                        <option value="">Pilih Album...</option>
                                        {albums.map((album) => (
                                            <option key={album.id} value={album.id}>
                                                {album.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi / Keterangan</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tulis keterangan singkat mengenai foto ini..."
                                    className="h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/gallery">
                            <Button variant="ghost" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Menyimpan..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan ke Galeri
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
