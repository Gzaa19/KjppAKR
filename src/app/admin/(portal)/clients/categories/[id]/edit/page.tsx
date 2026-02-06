"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateClientCategory, getClientCategory } from "@/actions/client-category";
import { toast } from "sonner";

interface EditClientCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default function EditClientCategoryPage({ params }: EditClientCategoryPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        sortOrder: 1,
        isActive: true,
    });

    useEffect(() => {
        async function loadCategory() {
            const resolvedParams = await params;
            setCategoryId(resolvedParams.id);

            const result = await getClientCategory(resolvedParams.id);
            if (result.success && result.data) {
                const category = result.data.category;
                setFormData({
                    name: category.name,
                    slug: category.slug,
                    sortOrder: category.sortOrder,
                    isActive: category.isActive,
                });
            } else {
                toast.error("Gagal memuat data kategori");
            }
            setLoading(false);
        }

        loadCategory();
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
            const result = await updateClientCategory(categoryId, formData);

            if (result.success) {
                toast.success("Kategori berhasil diupdate");
                router.push("/admin/clients/categories");
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
                <Link href="/admin/clients/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Edit Kategori Klien</h2>
                    <p className="text-sm text-muted-foreground">
                        Update informasi kategori
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kategori</CardTitle>
                        <CardDescription>Update detail kategori</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Kategori *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Contoh: Bank BUMN/Swasta"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="bank-bumn-swasta"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly identifier
                            </p>
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
                                <Label htmlFor="isActive">Aktifkan Kategori</Label>
                                <p className="text-xs text-muted-foreground">
                                    Kategori aktif akan muncul di dropdown saat menambah klien
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
                    <Link href="/admin/clients/categories">
                        <Button type="button" variant="outline" disabled={isPending}>
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Menyimpan..." : "Update Kategori"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
