"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { HeroImageForm } from "./HeroImageForm";

interface EditHeroImageDialogProps {
    image: {
        id: string;
        imageUrl: string;
    };
}

export function EditHeroImageDialog({ image }: EditHeroImageDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Gambar Hero</DialogTitle>
                    <DialogDescription>
                        Ganti gambar slide show.
                    </DialogDescription>
                </DialogHeader>
                <HeroImageForm
                    currentCount={0} // Not relevant for edit mode
                    initialData={image}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
