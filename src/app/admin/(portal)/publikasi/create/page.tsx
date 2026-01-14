"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/helpers";
import type { CreateNewsInput } from "@/lib/validations";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createPublikasi } from "@/actions/publikasi";

export default function CreatePublikasiPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "" as "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN" | "",
        coverImage: "",
        isPublished: false,
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    const handleGenerateSlug = () => {
        setFormData((prev) => ({
            ...prev,
            slug: generateSlug(prev.title),
        }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.category) {
            toast.error("Pilih kategori terlebih dahulu");
            return;
        }

        startTransition(async () => {
            const input: CreateNewsInput = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt || undefined,
                content: formData.content,
                category: formData.category as "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN",
                coverImage: formData.coverImage || undefined,
                isPublished: formData.isPublished,
            };

            const result = await createPublikasi(input);

            if (result.success) {
                toast.success("Publikasi berhasil dibuat!");
                router.push("/admin/publikasi");
                router.refresh();
            } else {
                toast.error(result.error || "Gagal membuat publikasi");
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/publikasi">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Tambah Publikasi Baru</h1>
                    <p className="text-muted-foreground">Buat artikel, berita, kegiatan, atau pengumuman baru.</p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Publikasi</CardTitle>
                            <CardDescription>Informasi utama publikasi yang akan ditampilkan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Publikasi</Label>
                                <Input
                                    id="title"
                                    placeholder="Masukkan judul publikasi yang menarik"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="slug"
                                        placeholder="judul-publikasi-url-friendly"
                                        value={formData.slug}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                        required
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateSlug}
                                    >
                                        Generate
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">URL: /publikasi/{formData.slug || "slug-publikasi"}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                category: e.target.value as typeof formData.category,
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="ARTIKEL">Artikel</option>
                                        <option value="BERITA">Berita</option>
                                        <option value="KEGIATAN">Kegiatan</option>
                                        <option value="PENGUMUMAN">Pengumuman</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <ImageUpload
                                    value={formData.coverImage}
                                    onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                                    disabled={isPending}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Ringkasan singkat untuk tampilan kartu..."
                                    className="h-20"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Akan ditampilkan pada preview publikasi di halaman depan.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Isi Publikasi</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Tulis isi publikasi lengkap di sini..."
                                    className="min-h-[300px]"
                                    value={formData.content}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Publikasi</CardTitle>
                            <CardDescription>Atur status publikasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="published">Status Publikasi</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.isPublished
                                            ? "Publikasi akan ditampilkan di halaman publik"
                                            : "Publikasi disimpan sebagai draft dan tidak akan ditampilkan"}
                                    </p>
                                </div>
                                <Switch
                                    id="published"
                                    checked={formData.isPublished}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, isPublished: checked }))
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/publikasi">
                            <Button variant="ghost" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Publikasi
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
