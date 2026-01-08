"use client";

import { useState, useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteClient, togglePublishClient } from "@/actions/client";
import { useRouter } from "next/navigation";
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

export function DeleteClientButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteClient(id);
            if (result.success) {
                setShowDialog(false);
                router.refresh();
            }
        });
    };

    return (
        <>
            <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                    e.preventDefault();
                    setShowDialog(true);
                }}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
            </DropdownMenuItem>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Klien</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus klien ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                            {isPending ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function TogglePublishButton({ id, isPublished }: { id: string; isPublished: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = () => {
        startTransition(async () => {
            await togglePublishClient(id, !isPublished);
            router.refresh();
        });
    };

    return (
        <DropdownMenuItem onSelect={handleToggle} disabled={isPending}>
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
    );
}
