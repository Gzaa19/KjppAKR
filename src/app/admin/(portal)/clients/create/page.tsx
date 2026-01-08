"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/actions/client";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

export default function CreateClientPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        category: "BANK_BUMN_SWASTA" as "BANK_BUMN_SWASTA" | "NON_BANK",
        isPublished: true,
        sortOrder: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createClient(formData);

            if (result.success) {
                toast.success("Klien berhasil ditambahkan");
                router.push("/admin/clients");
                router.refresh();
            } else {
                toast.error(result.error || "Terjadi kesalahan");
            }
        });
    };

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Tambah Klien Baru</h2>
                    <p className="text-sm text-muted-foreground">
                        Tambahkan klien baru ke daftar klien KJPP AKR
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Klien</CardTitle>
                        <CardDescription>Masukkan detail klien yang akan ditambahkan</CardDescription>
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
                                value={formData.category}
                                onValueChange={(value: "BANK_BUMN_SWASTA" | "NON_BANK") =>
                                    setFormData({ ...formData, category: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BANK_BUMN_SWASTA">Bank BUMN/Swasta</SelectItem>
                                    <SelectItem value="NON_BANK">Non Bank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Urutan Tampilan</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground">
                                Angka lebih kecil akan ditampilkan lebih dulu
                            </p>
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
                        {isPending ? "Menyimpan..." : "Simpan Klien"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
