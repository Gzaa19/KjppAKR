"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createManagementTeam } from "@/actions/management";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

export default function CreateManagementPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        image: "",
        description: "",
        isMappiCert: false,
        sortOrder: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await createManagementTeam(formData);

            if (result.success) {
                toast.success("Data tim berhasil ditambahkan");
                router.push("/admin/management");
                router.refresh();
            } else {
                toast.error(result.error || "Terjadi kesalahan");
            }
        });
    };

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/management">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Tambah Anggota Tim</h2>
                    <p className="text-sm text-muted-foreground">
                        Tambahkan anggota manajemen baru ke daftar KJPP AKR
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Anggota Tim</CardTitle>
                        <CardDescription>Masukkan detail anggota tim yang akan ditambahkan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Ir. H. Anas Karim Rivai"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Jabatan *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Pemimpin Rekan"
                                    required
                                />
                            </div>
                        </div>

                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            label="Foto Profil"
                        />

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi / Biografi *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Masukkan biografi lengkap..."
                                required
                                className="min-h-[150px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="flex items-center justify-between border rounded-lg p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isMappiCert">Sertifikasi MAPPI</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Menandakan anggota memiliki sertifikasi MAPPI
                                    </p>
                                </div>
                                <Switch
                                    id="isMappiCert"
                                    checked={formData.isMappiCert}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isMappiCert: checked })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                    <Link href="/admin/management">
                        <Button type="button" variant="outline" disabled={isPending}>
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Menyimpan..." : "Simpan Data"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
