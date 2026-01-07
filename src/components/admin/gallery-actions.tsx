"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteGallery } from "@/actions/gallery";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DeleteGalleryProps {
    id: string;
    className?: string; // Allow custom styling from page.tsx
}

export function DeleteGalleryButton({ id, className }: DeleteGalleryProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;

        startTransition(async () => {
            const result = await deleteGallery(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    return (
        <Button
            size="icon"
            variant="destructive"
            className={cn("h-6 w-6", className)}
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-3 w-3" />
        </Button>
    );
}
