
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, MessageSquare, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NewsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Berita & Artikel</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola postingan berita, artikel, dan pengumuman.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tulis Berita
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari judul berita..."
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {[
                    {
                        title: "Dasar Pelaksanaan Pengadaan Tanah Bagi Pembangunan Untuk Kepentingan Umum",
                        category: "Artikel",
                        date: "March 1, 2015",
                        author: "IT DIVISION",
                        comments: 0,
                        excerpt: "Pedoman pelaksanaan pertanahan khususnya di Indonesia sudah di atur dari era terdahulu...",
                        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=200&h=150"
                    },
                    {
                        title: "Mulai Maret, Uang Muka KPR Cukup Satu Persen!",
                        category: "Berita",
                        date: "Feb 28, 2015",
                        author: "Admin",
                        comments: 2,
                        excerpt: "Kabar gembira bagi anda yang ingin memiliki rumah impian dengan DP ringan...",
                        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200&h=150"
                    },
                    {
                        title: "Rapat Kerja Tahunan 2024 KJPP AKR",
                        category: "Kegiatan",
                        date: "Jan 15, 2024",
                        author: "HRD",
                        comments: 5,
                        excerpt: "Evaluasi kinerja tahun lalu dan penetapan target untuk tahun 2024...",
                        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=200&h=150"
                    },
                ].map((news, i) => (
                    <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                            <div className="w-full sm:w-48 h-48 sm:h-auto bg-muted shrink-0">
                                {/* Placeholder Image */}
                                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs font-normal">{news.category}</Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" /> {news.date}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight hover:text-primary cursor-pointer">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {news.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center">Posted by: <span className="font-medium text-foreground ml-1">{news.author}</span></span>
                                        <span className="flex items-center">
                                            <MessageSquare className="h-3 w-3 mr-1" /> {news.comments} Comments
                                        </span>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Post</DropdownMenuItem>
                                            <DropdownMenuItem>View Live</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
