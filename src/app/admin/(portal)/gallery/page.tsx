
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Search, Image as ImageIcon, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function GalleryPage() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Galeri Foto</h2>
                    <p className="text-sm text-muted-foreground">
                        Dokumentasi kegiatan perusahaan seperti rapat dan survei lapangan.
                    </p>
                </div>
                <Link href="/admin/gallery/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Foto
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari album atau foto..."
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Semua</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">Rapat Kerja</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">Survei Lapangan</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary/10">Kegiatan Lain</Badge>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="group relative aspect-square bg-muted rounded-lg overflow-hidden border">
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                            <ImageIcon className="h-10 w-10 opacity-20" />
                        </div>

                        {/* Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                            <p className="text-white text-xs font-medium truncate">Dokumentasi Kegiatan {i}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-gray-300">12 Jan 2025</span>
                                <Button size="icon" variant="destructive" className="h-6 w-6">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Upload Placeholder */}
                <Link href="/admin/gallery/create" className="contents">
                    <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Upload Baru</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}
