"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateNews, getNewsById } from "@/actions/news";
import { generateSlug } from "@/lib/helpers";
import type { UpdateNewsInput } from "@/lib/validations";
import { Switch } from "@/components/ui/switch";

interface NewsData {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category: "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN";
    coverImage: string | null;
    isPublished: boolean;
}

export default function EditNewsPage() {
    const router = useRouter();
    const params = useParams();
    const newsId = params.id as string;

    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "" as "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN" | "",
        coverImage: "",
        isPublished: false,
    });

    // Fetch existing news data
    useEffect(() => {
        async function fetchNews() {
            try {
                setIsLoading(true);
                const result = await getNewsById(newsId);

                if (result.success && result.data) {
                    const news = result.data as NewsData;
                    setFormData({
                        title: news.title,
                        slug: news.slug,
                        excerpt: news.excerpt || "",
                        content: news.content,
                        category: news.category,
                        coverImage: news.coverImage || "",
                        isPublished: news.isPublished,
                    });
                } else {
                    setError(result.error || "Berita tidak ditemukan");
                }
            } catch (err) {
                console.error("Failed to fetch news:", err);
                setError("Gagal memuat data berita");
            } finally {
                setIsLoading(false);
            }
        }

        if (newsId) {
            fetchNews();
        }
    }, [newsId]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            // Only auto-generate slug if user hasn't manually edited it
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
        setError(null);
        setSuccess(null);

        if (!formData.category) {
            setError("Pilih kategori terlebih dahulu");
            return;
        }

        startTransition(async () => {
            const input: UpdateNewsInput = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt || undefined,
                content: formData.content,
                category: formData.category as "ARTIKEL" | "BERITA" | "KEGIATAN" | "PENGUMUMAN",
                coverImage: formData.coverImage || undefined,
                isPublished: formData.isPublished,
            };

            const result = await updateNews(newsId, input);

            if (result.success) {
                setSuccess("Berita berhasil diperbarui!");
                router.refresh();
                // Redirect after short delay to show success message
                setTimeout(() => {
                    router.push("/admin/news");
                }, 1000);
            } else {
                setError(result.error || "Gagal memperbarui berita");
            }
        });
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Memuat data berita...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/news">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Berita</h1>
                    <p className="text-muted-foreground">Perbarui konten berita yang sudah ada.</p>
                </div>
                <div className="flex items-center gap-2">
                    {formData.isPublished ? (
                        <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <Eye className="h-4 w-4" />
                            Published
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            <EyeOff className="h-4 w-4" />
                            Draft
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
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
                                <div className="flex gap-2">
                                    <Input
                                        id="slug"
                                        placeholder="judul-berita-url-friendly"
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
                                <p className="text-xs text-muted-foreground">URL: /berita/{formData.slug || "slug-berita"}</p>
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Publikasi</CardTitle>
                            <CardDescription>Atur status publikasi berita.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="published">Status Publikasi</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.isPublished
                                            ? "Berita akan ditampilkan di halaman publik"
                                            : "Berita disimpan sebagai draft dan tidak akan ditampilkan"}
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

                    <div className="flex items-center justify-between">
                        <Link href={`/berita/${formData.slug}`} target="_blank">
                            <Button variant="outline" type="button" disabled={!formData.slug}>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Preview
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/admin/news">
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
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
