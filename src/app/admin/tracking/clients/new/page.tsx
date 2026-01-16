"use client";

import { createTrackingClient } from "@/actions/tracking-clients";
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

export default function NewClientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        type: "CORPORATE",
        address: "",
        picName: "",
        phone: "",
        email: "",
    });

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
            const result = await createTrackingClient(formData as any);

            if (result.success) {
                toast.success("Klien berhasil ditambahkan");
                router.push("/admin/tracking/clients");
            } else {
                toast.error(result.error || "Gagal menambahkan klien");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Terjadi kesalahan saat menghubungi server");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-4xl space-y-6 px-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Tambah Data Klien
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
                            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
