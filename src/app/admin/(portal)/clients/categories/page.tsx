import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getClientCategories } from "@/actions/client-category";
import { ClientCategoryActionButtons } from "@/components/admin/client-category-action-buttons";

export default async function ClientCategoriesPage() {
    const result = await getClientCategories();
    const categories = result.success ? result.data?.categories || [] : [];

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Kategori Klien</h1>
                <p className="text-gray-600">
                    Kelola kategori klien KJPP AKR. Kategori ini akan muncul saat menambah klien baru.
                </p>
            </div>

            <div className="flex justify-between items-center">
                <Link href="/admin/clients">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Klien
                    </Button>
                </Link>
                <Link href="/admin/clients/categories/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Kategori Klien
                    </Button>
                </Link>
            </div>

            {categories.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        Belum ada kategori. Mulai dengan menambahkan kategori baru.
                    </p>
                    <Link href="/admin/clients/categories/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kategori Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <Card>
                    <div className="divide-y">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <Badge variant={category.isActive ? "default" : "secondary"}>
                                            {category.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                        <Badge variant="outline">
                                            {category._count.clients} klien
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Slug: {category.slug} • Urutan: {category.sortOrder}
                                    </p>
                                </div>

                                <ClientCategoryActionButtons
                                    id={category.id}
                                    isActive={category.isActive}
                                    clientCount={category._count.clients}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}