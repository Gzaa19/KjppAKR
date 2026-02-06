"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { SekapurSirihForm } from "./SekapurSirihForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SekapurSirihImage {
    id: string;
    imageType: string;
    imageUrl: string;
    altText: string;
    caption: string | null;
    managingPartnerName: string | null;
    managingPartnerTitle: string | null;
    isActive: boolean;
}

interface SekapurSirihActionMenuProps {
    image: SekapurSirihImage;
    hasActiveManagingPartner: boolean;
    hasActiveTeamPhoto: boolean;
}

export function SekapurSirihActionMenu({
    image,
    hasActiveManagingPartner,
    hasActiveTeamPhoto
}: SekapurSirihActionMenuProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/sekapur-sirih/${image.id}`, {
                method: "DELETE",
            });

            // 204 No Content is success but has no body
            if (response.status === 204) {
                toast.success("Gambar berhasil dihapus");
                router.refresh();
                setIsDeleteOpen(false);
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal menghapus gambar");
            }

            toast.success("Gambar berhasil dihapus");
            router.refresh();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Gambar</DialogTitle>
                        <DialogDescription>
                            Update gambar {image.imageType === "MANAGING_PARTNER" ? "Managing Partner" : "Tim"}
                        </DialogDescription>
                    </DialogHeader>
                    <SekapurSirihForm
                        initialData={image}
                        hasActiveManagingPartner={hasActiveManagingPartner}
                        hasActiveTeamPhoto={hasActiveTeamPhoto}
                        onSuccess={() => setIsEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Gambar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
