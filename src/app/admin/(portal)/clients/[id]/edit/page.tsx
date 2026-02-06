"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateClient } from "@/actions/client";
import { getActiveClientCategories } from "@/actions/client-category";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

interface Client {
    id: string;
    name: string;
    logo: string;
    categoryId: string;
    isPublished: boolean;
    sortOrder: number;
}

interface EditClientPageProps {
    params: Promise<{ id: string }>;
}

export default function EditClientPage({ params }: EditClientPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState<string>("");
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        categoryId: "",
        isPublished: true,
        sortOrder: 1,
    });

    useEffect(() => {
        async function loadClient() {
            const resolvedParams = await params;
            setClientId(resolvedParams.id);

            const [clientResult, categoriesResult] = await Promise.all([
                fetch(`/api/clients/${resolvedParams.id}`).then(r => r.json()),
                getActiveClientCategories(),
            ]);

            if (categoriesResult.success && categoriesResult.data) {
                setCategories(categoriesResult.data.categories);
            }

            if (clientResult.success && clientResult.data) {
                const client = clientResult.data;
                setFormData({
                    name: client.name,
                    logo: client.logo,
                    categoryId: client.categoryId,
                    isPublished: client.isPublished,
                    sortOrder: client.sortOrder,
                });
            } else {
                toast.error("Gagal memuat data klien");
            }
            setLoading(false);
        }

        loadClient();
    }, [params]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await updateClient(clientId, formData);

            if (result.success) {
                toast.success("Klien berhasil diupdate");
                router.push("/admin/clients");
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
                <Link href="/admin/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Edit Klien</h2>
                    <p className="text-sm text-muted-foreground">
                        Update informasi klien
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Klien</CardTitle>
                        <CardDescription>Update detail klien</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Klien *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Bank Mandiri"
                                required
                            />
                        </div>

                        <ImageUpload
                            value={formData.logo}
                            onChange={(url) => setFormData({ ...formData, logo: url })}
                            label="Logo Klien"
                            required
                        />

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="isPublished">Publikasikan</Label>
                                <p className="text-xs text-muted-foreground">
                                    Tampilkan klien ini di halaman publik
                                </p>
                            </div>
                            <Switch
                                id="isPublished"
                                checked={formData.isPublished}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                    <Link href="/admin/clients">
                        <Button type="button" variant="outline" disabled={isPending}>
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Menyimpan..." : "Update Klien"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
