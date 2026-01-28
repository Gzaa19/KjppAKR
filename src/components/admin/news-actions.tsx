"use client";

import { useState, useTransition, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { deleteNews, togglePublishNews } from "@/actions/news";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function NewsActionMenu({ id, slug, isPublished }: { id: string; slug: string; isPublished: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteNews(id);
            if (result.success) {
                setShowDeleteDialog(false);
                toast.success("Publikasi berhasil dihapus");
                router.refresh();
            } else {
                toast.error(result.error || "Gagal menghapus publikasi");
            }
        });
    };

    const handleTogglePublish = () => {
        startTransition(async () => {
            const result = await togglePublishNews(id);
            if (result.success) {
                toast.success(isPublished ? "Publikasi disembunyikan" : "Publikasi diterbitkan");
                router.refresh();
            } else {
                toast.error(result.error || "Gagal mengubah status publikasi");
            }
        });
    };

    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/publikasi/${id}/edit`} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/publikasi/${slug}`} target="_blank" className="cursor-pointer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Lihat Live
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            handleTogglePublish();
                        }}
                        disabled={isPending}
                        className="cursor-pointer"
                    >
                        {isPublished ? (
                            <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Sembunyikan
                            </>
                        ) : (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                Publikasikan
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowDeleteDialog(true);
                        }}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Publikasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus publikasi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isPending ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function DeleteNewsButton() { return null; }
export function TogglePublishButton() { return null; }
