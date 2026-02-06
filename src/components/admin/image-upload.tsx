"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    required?: boolean;
}

export function ImageUpload({ value, onChange, label = "Upload Image", required = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Upload failed");
            }

            const imageUrl = result.data.url;

            setPreview(imageUrl);
            onChange(imageUrl);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onChange("");
    };

    return (
        <div className="space-y-2">
            <Label>{label} {required && "*"}</Label>

            {preview ? (
                <div className="relative w-full max-w-xs">
                    <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemove}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <Label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        {uploading ? "Uploading..." : "Choose Image"}
                    </Label>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
        </div>
    );
}
