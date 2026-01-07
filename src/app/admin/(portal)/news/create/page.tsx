"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createNews } from "@/actions/news";
import { generateSlug } from "@/lib/helpers";
import type { CreateNewsInput } from "@/lib/validations";

export default function CreateNewsPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "" as "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN" | "",
        coverImage: "",
    });

    // Fetch user session
    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/auth/session");
                const data = await res.json();
                if (data.success) {
                    setUserId(data.data.id);
                }
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        }
        fetchSession();
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!formData.category) {
            setError("Pilih kategori terlebih dahulu");
            return;
        }

        if (!userId) {
            setError("Session tidak valid. Silakan login ulang.");
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
                isPublished: false,
            };

            const result = await createNews(input, userId);

            if (result.success) {
                router.push("/admin/news");
                router.refresh();
            } else {
                setError(result.error || "Gagal membuat berita");
            }
        });
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/news">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tulis Berita Baru</h1>
                    <p className="text-muted-foreground">Buat postingan artikel, berita, atau pengumuman baru.</p>
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
                            <CardTitle>Konten Berita</CardTitle>
                            <CardDescription>Informasi utama berita yang akan ditampilkan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input
                                    id="title"
                                    placeholder="Masukkan judul berita yang menarik"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug URL</Label>
                                <Input
                                    id="slug"
                                    placeholder="judul-berita-url-friendly"
                                    value={formData.slug}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">URL: /news/{formData.slug || "slug-berita"}</p>
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
                                    Akan ditampilkan pada preview berita di halaman depan.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Isi Berita</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Tulis isi berita lengkap di sini..."
                                    className="min-h-[300px]"
                                    value={formData.content}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/news">
                            <Button variant="ghost" type="button">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Menyimpan..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan sebagai Draft
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
