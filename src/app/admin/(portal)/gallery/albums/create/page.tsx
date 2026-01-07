"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAlbum } from "@/actions/gallery";
import type { CreateAlbumInput } from "@/lib/validations";
import { generateSlug } from "@/lib/helpers";

export default function CreateAlbumPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        coverImage: "",
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
        setError(null);

        startTransition(async () => {
            const input: CreateAlbumInput = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || null,
                coverImage: formData.coverImage || null,
                isActive: true,
            };

            const result = await createAlbum(input);

            if (result.success) {
                router.push("/admin/gallery");
                router.refresh();
            } else {
                setError(result.error || "Gagal membuat album");
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
                    <h1 className="text-2xl font-bold tracking-tight">Buat Album Baru</h1>
                    <p className="text-muted-foreground">Buat album baru untuk mengelompokkan foto kegiatan.</p>
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
                            <CardTitle>Informasi Album</CardTitle>
                            <CardDescription>Detail informasi mengenai album foto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Album</Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Rapat Kerja 2024"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
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
                                <Label htmlFor="coverImage">URL Foto Cover (Opsional)</Label>
                                <Input
                                    id="coverImage"
                                    type="url"
                                    placeholder="https://example.com/cover.jpg"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                                />
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
                                    Simpan Album
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
