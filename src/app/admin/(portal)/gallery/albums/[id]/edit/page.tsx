"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateAlbum, getAlbumById } from "@/actions/gallery";
import { toast } from "sonner";

interface EditAlbumPageProps {
    params: Promise<{ id: string }>;
}

export default function EditAlbumPage({ params }: EditAlbumPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [albumId, setAlbumId] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        sortOrder: 1,
        isActive: true,
    });

    useEffect(() => {
        async function loadAlbum() {
            const resolvedParams = await params;
            setAlbumId(resolvedParams.id);

            const result = await getAlbumById(resolvedParams.id);
            if (result.success && result.data) {
                const album = result.data.album;
                setFormData({
                    name: album.name,
                    slug: album.slug,
                    description: album.description || "",
                    sortOrder: album.sortOrder ?? 1,
                    isActive: album.isActive,
                });
            } else {
                toast.error("Gagal memuat data album");
            }
            setLoading(false);
        }

        loadAlbum();
    }, [params]);

    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        setFormData({ ...formData, name, slug });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await updateAlbum(albumId, {
                ...formData,
                description: formData.description || null,
                coverImage: null,
            });

            if (result.success) {
                toast.success("Album berhasil diupdate");
                router.push("/admin/gallery/albums");
                router.refresh();
            } else {
                toast.error(result.error || "Terjadi kesalahan");
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/gallery/albums">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Edit Album</h2>
                    <p className="text-sm text-muted-foreground">
                        Update informasi album
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Album</CardTitle>
                        <CardDescription>Update detail album</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Album *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Contoh: Kegiatan 2024"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="kegiatan-2024"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly identifier
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi singkat tentang album ini..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Urutan Tampilan</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                min="1"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: Math.max(1, parseInt(e.target.value) || 1) })}
                                placeholder="1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Angka lebih kecil akan ditampilkan lebih dulu (minimal 1)
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isActive">Aktifkan Album</Label>
                                <p className="text-xs text-muted-foreground">
                                    Album aktif akan muncul di halaman galeri publik
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                    <Link href="/admin/gallery/albums">
                        <Button type="button" variant="outline" disabled={isPending}>
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
