"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateNewsPage() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/news">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tulis Berita Baru</h1>
                    <p className="text-muted-foreground">
                        Buat postingan artikel, berita, atau pengumuman baru.
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-8">
                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Berita</CardTitle>
                            <CardDescription>
                                Informasi utama berita yang akan ditampilkan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input id="title" placeholder="Masukkan judul berita yang menarik" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="artikel">Artikel</option>
                                        <option value="berita">Berita</option>
                                        <option value="kegiatan">Kegiatan</option>
                                        <option value="pengumuman">Pengumuman</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal Publish</Label>
                                    <Input id="date" type="date" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Ringkasan singkat untuk tampilan kartu..."
                                    className="h-20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Akan ditampilkan pada preview berita di halaman depan.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Isi Berita</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Tulis isi berita lengkap di sini..."
                                    className="min-h-[300px]"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Media & Cover</CardTitle>
                            <CardDescription>
                                Gambar utama yang akan menjadi cover berita.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">Upload Gambar Cover</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Drag & drop gambar di sini atau klik untuk memilih
                                            </p>
                                        </div>
                                        <Input id="image" type="file" className="hidden" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/news">
                            <Button variant="ghost" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>Menyimpan...</>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Publikasikan Berita
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
