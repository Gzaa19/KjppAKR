"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SekapurSirihFormProps {
    onSuccess?: () => void;
    hasActiveManagingPartner: boolean;
    hasActiveTeamPhoto: boolean;
    initialData?: {
        id: string;
        imageType: string;
        imageUrl: string;
        altText: string;
        caption: string | null;
        managingPartnerName: string | null;
        managingPartnerTitle: string | null;
        isActive: boolean;
    } | null;
}

export function SekapurSirihForm({
    onSuccess,
    hasActiveManagingPartner,
    hasActiveTeamPhoto,
    initialData
}: SekapurSirihFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const [imageType, setImageType] = useState<string>(initialData?.imageType || "MANAGING_PARTNER");
    const [altText, setAltText] = useState(initialData?.altText || "");
    const [caption, setCaption] = useState(initialData?.caption || "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [managingPartnerName, setManagingPartnerName] = useState(initialData?.managingPartnerName || "");
    const [managingPartnerTitle, setManagingPartnerTitle] = useState(initialData?.managingPartnerTitle || "");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isEditMode = !!initialData;

    // Check if we can activate based on image type
    const hasExistingActive = imageType === "MANAGING_PARTNER" ? hasActiveManagingPartner : hasActiveTeamPhoto;
    const canActivate = isEditMode ? (initialData.isActive || !hasExistingActive) : !hasExistingActive;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Auto-generate alt text based on image type
            if (!isEditMode) {
                const autoAltText = imageType === "MANAGING_PARTNER"
                    ? "Foto Managing Partner KJPP AKR"
                    : "Foto Tim KJPP AKR";
                setAltText(autoAltText);
            }
        } else {
            if (isEditMode && initialData) {
                setPreview(initialData.imageUrl);
            } else {
                setPreview(null);
            }
        }
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (isEditMode && initialData) {
            setPreview(initialData.imageUrl);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasFile = fileInputRef.current?.files?.[0];

        if (!isEditMode && !hasFile) {
            toast.error("Pilih gambar terlebih dahulu");
            return;
        }

        if (!altText.trim()) {
            toast.error("Alt text harus diisi");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();

        if (hasFile) {
            formData.append("file", hasFile);
        }
        formData.append("imageType", imageType);
        formData.append("altText", altText.trim());
        formData.append("caption", caption.trim());
        if (imageType === "MANAGING_PARTNER") {
            formData.append("managingPartnerName", managingPartnerName.trim());
            formData.append("managingPartnerTitle", managingPartnerTitle.trim());
        }
        formData.append("isActive", String(isActive));

        try {
            const url = isEditMode
                ? `/api/admin/sekapur-sirih/${initialData.id}`
                : "/api/admin/sekapur-sirih";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal menyimpan data");
            }

            toast.success(isEditMode ? "Gambar berhasil diperbarui" : "Gambar berhasil diupload");

            if (!isEditMode) {
                // Reset form
                handleClear();
                setAltText("");
                setCaption("");
                setImageType("MANAGING_PARTNER");
            }

            router.refresh();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat simpan data");
        } finally {
            setIsUploading(false);
        }
    };

    // Auto-generate alt text based on image type when type changes
    const handleImageTypeChange = (newType: string) => {
        setImageType(newType);
        if (!isEditMode && !altText) {
            setAltText(newType === "MANAGING_PARTNER" ? "Foto Managing Partner KJPP AKR" : "Foto Tim KJPP AKR");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Simple 2-column grid for type and upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="imageType">Tipe Gambar</Label>
                    <Select
                        value={imageType}
                        onValueChange={handleImageTypeChange}
                        disabled={isUploading || isEditMode}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MANAGING_PARTNER">Managing Partner</SelectItem>
                            <SelectItem value="TEAM_PHOTO">Foto Tim</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Pilih Gambar</Label>
                    <Input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Hidden alt text field - auto-generated */}
            <input type="hidden" value={altText} />

            {/* Managing Partner Info - only show for MANAGING_PARTNER type */}
            {imageType === "MANAGING_PARTNER" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="managingPartnerName">Nama Managing Partner</Label>
                        <Input
                            id="managingPartnerName"
                            type="text"
                            value={managingPartnerName}
                            onChange={(e) => setManagingPartnerName(e.target.value)}
                            disabled={isUploading}
                            placeholder="Ir. H. Anas Karim Rivai, MAPPI (Cert)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="managingPartnerTitle">Jabatan</Label>
                        <Input
                            id="managingPartnerTitle"
                            type="text"
                            value={managingPartnerTitle}
                            onChange={(e) => setManagingPartnerTitle(e.target.value)}
                            disabled={isUploading}
                            placeholder="Managing Partner"
                        />
                    </div>
                </div>
            )}

            {/* Image preview */}
            {preview && (
                <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border bg-muted">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleClear}
                        disabled={isUploading}
                    >
                        <X className="h-4 w-4 mr-1" />
                        Hapus
                    </Button>
                </div>
            )}

            {/* Submit button */}
            <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isUploading || (!isEditMode && !preview)}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {isEditMode ? "Menyimpan..." : "Mengupload..."}
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-5 w-5" />
                        {isEditMode ? "Simpan Perubahan" : "Upload Gambar"}
                    </>
                )}
            </Button>
        </form>
    );
}
