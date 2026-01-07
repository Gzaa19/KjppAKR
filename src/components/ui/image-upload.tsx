"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    className?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    className,
    disabled = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                onChange(result.data.url);
            } else {
                setError(result.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleUpload(file);
        } else {
            setError("Please drop an image file");
        }
    };

    const handleRemove = () => {
        onChange("");
        onRemove?.();
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    if (value) {
        return (
            <div className={cn("relative group", className)}>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                        src={value}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Hapus Gambar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed transition-colors cursor-pointer",
                    dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !disabled && !isUploading && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled || isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <p className="text-sm">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
                        <div className="rounded-full bg-muted p-4">
                            <ImageIcon className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">
                                Klik atau drag & drop gambar di sini
                            </p>
                            <p className="text-xs mt-1">
                                PNG, JPG, WebP, GIF (Max. 5MB)
                            </p>
                        </div>
                        <Button type="button" variant="secondary" size="sm" className="mt-2">
                            <Upload className="h-4 w-4 mr-2" />
                            Pilih Gambar
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
            )}
        </div>
    );
}
