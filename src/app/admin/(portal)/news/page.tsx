import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, MessageSquare, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getNews } from "@/actions/news";
import { formatDateShort } from "@/lib/helpers";
import { NewsActionMenu } from "@/components/admin/news-actions";


export default async function NewsPage() {
    const result = await getNews();
    const news = result.success ? result.data?.news || [] : [];

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Berita & Artikel</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola postingan berita, artikel, dan pengumuman.
                    </p>
                </div>
                <Link href="/admin/news/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tulis Berita
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari judul berita..." className="pl-8" />
                </div>
            </div>

            {news.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada berita. Mulai dengan membuat berita baru.</p>
                    <Link href="/admin/news/create" className="mt-4 inline-block">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tulis Berita Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row">
                                <div className="w-full sm:w-48 h-48 sm:h-auto bg-muted shrink-0">
                                    {item.coverImage ? (
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={item.isPublished ? "default" : "secondary"} className="text-xs font-normal">
                                                {item.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {item.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatDateShort(item.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight hover:text-primary cursor-pointer">
                                            {item.title}
                                        </h3>
                                        {item.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center">
                                                Posted by: <span className="font-medium text-foreground ml-1">{item.author.name}</span>
                                            </span>
                                            <span className="flex items-center">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                {item._count.comments} Comments
                                            </span>
                                        </div>

                                        <NewsActionMenu id={item.id} slug={item.slug} isPublished={item.isPublished} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
