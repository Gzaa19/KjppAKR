"use client";

import { useEffect, useState } from "react";
import { initializeDefaultCategories } from "@/actions/client-category";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function InitializeCategoriesPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleInitialize = async () => {
        setLoading(true);
        setMessage("");

        const result = await initializeDefaultCategories();

        if (result.success) {
            setMessage("✅ Kategori default berhasil diinisialisasi!");
        } else {
            setMessage(`❌ ${result.error}`);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="p-8 max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Initialize Categories</h1>
                <p className="text-muted-foreground mb-6">
                    Klik tombol di bawah untuk menginisialisasi kategori klien default.
                </p>
                <Button onClick={handleInitialize} disabled={loading}>
                    {loading ? "Initializing..." : "Initialize Default Categories"}
                </Button>
                {message && (
                    <p className="mt-4 text-sm">{message}</p>
                )}
            </Card>
        </div>
    );
}
