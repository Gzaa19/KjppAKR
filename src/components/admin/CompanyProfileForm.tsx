"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface CompanyProfileFormProps {
    onSuccess?: () => void;
    initialData?: {
        id: string;
        title: string;
        fileUrl: string;
        isActive: boolean;
    } | null;
}

export function CompanyProfileForm({
    onSuccess,
    initialData
}: CompanyProfileFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isEditMode = !!initialData;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("File harus berformat PDF");
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedFileName(null);
                return;
            }
            setSelectedFileName(file.name);
            if (!title && !isEditMode) {
                // Auto fill title if empty
                setTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
        } else {
            setSelectedFileName(null);
        }
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setSelectedFileName(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];

        if (!isEditMode && !file) {
            toast.error("Pilih file PDF terlebih dahulu");
            return;
        }

        if (!title.trim()) {
            toast.error("Judul harus diisi");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();

        if (file) {
            formData.append("file", file);
        }
        formData.append("title", title.trim());
        formData.append("isActive", String(isActive));

        try {
            const url = isEditMode
                ? `/api/admin/company-profile/${initialData.id}`
                : "/api/admin/company-profile";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal menyimpan data");
            }

            toast.success(isEditMode ? "Company Profile berhasil diperbarui" : "Company Profile berhasil diupload");

            if (!isEditMode) {
                handleClear();
                setTitle("");
                setIsActive(true);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Judul Dokumen</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isUploading}
                        placeholder="Company Profile KJPP AKR 2026"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pdf-file">Pilih File PDF {isEditMode && "(Opsional)"}</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            ref={fileInputRef}
                            id="pdf-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="cursor-pointer flex-1"
                        />
                        {selectedFileName && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleClear}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {isEditMode && initialData && !selectedFileName && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            File aktif saat ini: <a href={initialData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate max-w-xs">{initialData.title}.pdf</a>
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                        disabled={isUploading}
                    />
                    <Label htmlFor="isActive">Set sebagai aktif (ditampilkan di website utama)</Label>
                </div>
            </div>

            <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isUploading || (!isEditMode && !selectedFileName)}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {isEditMode ? "Menyimpan..." : "Mengupload..."}
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-5 w-5" />
                        {isEditMode ? "Simpan Perubahan" : "Upload PDF"}
                    </>
                )}
            </Button>
        </form>
    );
}
