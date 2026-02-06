"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { deleteClientCategory, toggleActiveClientCategory } from "@/actions/client-category";
import { toast } from "sonner";

interface ClientCategoryActionButtonsProps {
    id: string;
    isActive: boolean;
    clientCount: number;
}

export function ClientCategoryActionButtons({ id, isActive, clientCount }: ClientCategoryActionButtonsProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleActive = async () => {
        setIsLoading(true);
        const result = await toggleActiveClientCategory(id, !isActive);

        if (result.success) {
            toast.success(isActive ? "Kategori dinonaktifkan" : "Kategori diaktifkan");
            router.refresh();
        } else {
            toast.error(result.error || "Terjadi kesalahan");
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const result = await deleteClientCategory(id);

        if (result.success) {
            toast.success("Kategori berhasil dihapus");
            router.refresh();
        } else {
            toast.error(result.error || "Terjadi kesalahan");
        }
        setIsLoading(false);
        setShowDeleteDialog(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/clients/categories/${id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleActive}>
                        {isActive ? (
                            <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Nonaktifkan
                            </>
                        ) : (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                Aktifkan
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                        disabled={clientCount > 0}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
