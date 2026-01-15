"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Building2, User, Save, X } from "lucide-react";
import { toast } from "sonner";

const clientTypes = [
    { value: "CORPORATE", label: "PT / Perusahaan" },
    { value: "PERORANGAN", label: "Perorangan" },
    { value: "SME", label: "SME" },
    { value: "INSTANSI", label: "Instansi Pemerintah" },
];

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [formData, setFormData] = React.useState({
        name: "",
        type: "CORPORATE",
        address: "",
        picName: "",
        phone: "",
        email: "",
    });

    React.useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(`/api/tracking-clients/${id}`);
                const data = await response.json();

                if (data.success) {
                    setFormData({
                        name: data.data.name,
                        type: data.data.type,
                        address: data.data.address,
                        picName: data.data.picName,
                        phone: data.data.phone,
                        email: data.data.email,
                    });
                } else {
                    toast.error("Gagal memuat data klien");
                    router.push("/admin/tracking/clients");
                }
            } catch (error) {
                console.error("Error fetching client:", error);
                toast.error("Gagal memuat data klien");
                router.push("/admin/tracking/clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/tracking-clients/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Klien berhasil diperbarui");
                router.push("/admin/tracking/clients");
            } else {
                toast.error(data.error || "Gagal memperbarui klien");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error updating client:", error);
            toast.error("Terjadi kesalahan saat menghubungi server");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Memuat data...</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-4xl space-y-6 px-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Edit Data Klien
                    </h1>
                    <p className="text-gray-600">
                        Silakan lengkapi informasi database klien di bawah ini secara akurat.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-lg border p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Identitas Klien
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nama Perusahaan / Individu
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: PT. Maju Bersama Sejahtera"
                                    className="mt-1.5"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="type" className="text-sm font-medium">
                                    Tipe Klien
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, type: value }))
                                    }
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Pilih tipe klien" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clientTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-sm font-medium">
                                    Alamat Lengkap
                                </Label>
                                <Textarea
                                    id="address"
                                    placeholder="Masukkan alamat operasional lengkap..."
                                    className="mt-1.5 min-h-[100px]"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kontak Person (PIC) Section */}
                    <div className="bg-white rounded-lg border p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Kontak Person (PIC)
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="picName" className="text-sm font-medium">
                                    Nama Lengkap PIC
                                </Label>
                                <Input
                                    id="picName"
                                    placeholder="Masukkan nama penanggung jawab"
                                    className="mt-1.5"
                                    value={formData.picName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium">
                                        Nomor WhatsApp / HP
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+62 812-3456-7890"
                                        className="mt-1.5"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Korespondensi
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama.pic@email.com"
                                        className="mt-1.5"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">i</span>
                        </div>
                        <p className="text-sm text-blue-900">
                            <strong>Pastikan Nomor WhatsApp dalam format aktif</strong> untuk
                            menerima notifikasi sistem secara otomatis. Data yang disimpan akan
                            langsung tersedia dalam daftar pencarian dan modul keuangan.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
