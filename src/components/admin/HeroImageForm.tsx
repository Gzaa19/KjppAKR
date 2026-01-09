"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeroImageFormProps {
    onSuccess?: () => void;
    currentCount: number;
    initialData?: {
        id: string;
        imageUrl: string;
    } | null;
}

export function HeroImageForm({ onSuccess, currentCount, initialData }: HeroImageFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isEditMode = !!initialData;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // If in edit mode and file is cleared, revert to initial image
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

        if (isEditMode && !hasFile && preview === initialData?.imageUrl) {
            toast.info("Tidak ada perubahan gambar");
            if (onSuccess) onSuccess();
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        if (hasFile) {
            formData.append("image", hasFile);
        }

        try {
            const url = isEditMode
                ? `/api/admin/hero-images/${initialData.id}`
                : "/api/admin/hero-images";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal mengupload gambar");
            }

            toast.success(isEditMode ? "Gambar berhasil diperbarui" : "Gambar berhasil diupload");
            if (!isEditMode) handleClear(); 
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat upload gambar");
        } finally {
            setIsUploading(false);
        }
    };

    const isMaxReached = currentCount >= 3 && !isEditMode; // Only block create if max reached

    if (isMaxReached) {
        return (
            <div className="p-6 text-center border-2 border-dashed rounded-lg bg-slate-50">
                <p className="text-muted-foreground">
                    Maksimal 3 gambar telah tercapai. Hapus gambar yang ada untuk menambahkan yang baru.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image">
                    {isEditMode ? "Ganti Gambar Hero" : `Upload Gambar Hero Baru (${currentCount}/3)`}
                </Label>
                <div className="flex items-center gap-4">
                    <Input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="cursor-pointer"
                    />
                    {/* Only show clear button if we have a new file selected or non-initial preview */}
                    {preview && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleClear}
                            disabled={isUploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {preview && (
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <Button type="submit" disabled={isUploading || (!isEditMode && !preview)}>
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Menyimpan..." : "Mengupload..."}
                    </>
                ) : (
                    <>
                        {isEditMode ? (
                            "Simpan Perubahan"
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Gambar
                            </>
                        )}
                    </>
                )}
            </Button>
        </form>
    );
}
