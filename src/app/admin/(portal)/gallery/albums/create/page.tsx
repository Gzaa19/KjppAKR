"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAlbum } from "@/actions/gallery";
import type { CreateAlbumInput } from "@/lib/validations";
import { generateSlug } from "@/lib/helpers";
import { toast } from "sonner";

export default function CreateAlbumPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        sortOrder: 1,
        isActive: true,
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        startTransition(async () => {
            const input: CreateAlbumInput = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || null,
                coverImage: null,
                sortOrder: formData.sortOrder,
                isActive: formData.isActive,
            };

            const result = await createAlbum(input);

            if (result.success) {
                toast.success("Album berhasil dibuat");
                router.push("/admin/gallery/albums");
                router.refresh();
            } else {
                toast.error(result.error || "Gagal membuat album");
            }
        });
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
                    <h1 className="text-2xl font-bold tracking-tight">Buat Album Baru</h1>
                    <p className="text-sm text-muted-foreground">Buat album baru untuk mengelompokkan foto kegiatan.</p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Album</CardTitle>
                        <CardDescription>Detail informasi mengenai album foto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Album *</Label>
                            <Input
                                id="name"
                                placeholder="Contoh: Rapat Kerja 2024"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL) *</Label>
                            <Input
                                id="slug"
                                placeholder="rapat-kerja-2024"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Slug akan dibuat otomatis dari nama album. Ubah jika diperlukan.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                placeholder="Deskripsi singkat mengenai isi album ini..."
                                className="h-24"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Urutan Tampilan</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                min="1"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Math.max(1, parseInt(e.target.value) || 1) }))}
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
                                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                    <Link href="/admin/gallery/albums">
                        <Button variant="outline" type="button" disabled={isPending}>
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Menyimpan..." : "Simpan Album"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
