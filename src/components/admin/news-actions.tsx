"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteNews, togglePublishNews } from "@/actions/news";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
    id: string;
    className?: string; // Allow custom styling from page.tsx
}

interface TogglePublishProps extends ActionButtonProps {
    isPublished: boolean;
}

export function DeleteNewsButton({ id, className }: ActionButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

        startTransition(async () => {
            const result = await deleteNews(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            disabled={isPending}
            className={cn("text-destructive focus:text-destructive cursor-pointer", className)}
        >
            {isPending ? "Menghapus..." : "Delete"}
        </DropdownMenuItem>
    );
}

export function TogglePublishButton({ id, isPublished, className }: TogglePublishProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePublishNews(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    return (
        <DropdownMenuItem
            onClick={handleToggle}
            disabled={isPending}
            className={cn("cursor-pointer", className)}
        >
            {isPending ? "Processing..." : isPublished ? "Unpublish" : "Publish"}
        </DropdownMenuItem>
    );
}
