import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getNews } from "@/actions/news";
import { NewsActionMenu } from "@/components/admin/news-actions";
import Image from "next/image";

export default async function PublikasiPage() {
    const result = await getNews();
    const publications = result.success ? result.data?.news || [] : [];

    const artikelPubs = publications.filter((p) => p.category === "ARTIKEL");
    const beritaPubs = publications.filter((p) => p.category === "BERITA");
    const kegiatanPubs = publications.filter((p) => p.category === "KEGIATAN");
    const pengumumanPubs = publications.filter((p) => p.category === "PENGUMUMAN");

    const categories = [
        { name: "Artikel", items: artikelPubs, color: "text-blue-600" },
        { name: "Berita", items: beritaPubs, color: "text-green-600" },
        { name: "Kegiatan", items: kegiatanPubs, color: "text-purple-600" },
        { name: "Pengumuman", items: pengumumanPubs, color: "text-orange-600" },
    ];

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Publikasi</h1>
                <p className="text-gray-600">
                    Kelola artikel, berita, kegiatan, dan pengumuman KJPP AKR.
                </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                <Link href="/admin/publikasi/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Publikasi
                    </Button>
                </Link>
            </div>

            {publications.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada publikasi. Mulai dengan menambahkan publikasi baru.</p>
                    <Link href="/admin/publikasi/create" className="mt-4 inline-block">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Publikasi Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-8">
                    {categories.map((category) => (
                        category.items.length > 0 && (
                            <div key={category.name}>
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className={`h-5 w-5 ${category.color}`} />
                                    <h3 className="text-lg font-bold">{category.name}</h3>
                                    <Badge variant="secondary">{category.items.length}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.items.map((pub) => (
                                        <Card key={pub.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                {pub.coverImage && (
                                                    <div className="relative w-full aspect-video mb-4 bg-slate-50 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={pub.coverImage}
                                                            alt={pub.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant={pub.isPublished ? "default" : "secondary"} className="text-xs">
                                                            {pub.isPublished ? "Published" : "Draft"}
                                                        </Badge>
                                                        <NewsActionMenu
                                                            id={pub.id}
                                                            slug={pub.slug}
                                                            isPublished={pub.isPublished}
                                                        />
                                                    </div>
                                                    <h4 className="font-bold text-sm line-clamp-2">{pub.title}</h4>
                                                    {pub.excerpt && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {pub.excerpt}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{new Date(pub.createdAt).toLocaleDateString('id-ID')}</span>
                                                        <span>•</span>
                                                        <span>{pub.views} views</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
