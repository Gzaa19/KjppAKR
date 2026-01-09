"use client";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { deleteNews, togglePublishNews } from "@/actions/news";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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


export function NewsActionMenu({ id, slug, isPublished }: { id: string; slug: string; isPublished: boolean }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/news/${id}/edit`}>Edit Post</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/news/${slug}`} target="_blank">
                        View Live
                    </Link>
                </DropdownMenuItem>
                <TogglePublishButton id={id} isPublished={isPublished} />
                <DropdownMenuSeparator />
                <DeleteNewsButton id={id} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
