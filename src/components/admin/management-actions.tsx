"use client";

import { useState, useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { deleteManagementTeam } from "@/actions/management";
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
import { toast } from "sonner";

export function DeleteManagementButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteManagementTeam(id);
            if (result.success) {
                setShowDialog(false);
                toast.success("Data berhasil dihapus");
                router.refresh();
            } else {
                toast.error(result.error);
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
                        <AlertDialogTitle>Hapus Data Tim</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
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
