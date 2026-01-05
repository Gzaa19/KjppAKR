"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateGalleryPage() {
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
                <Link href="/admin/gallery">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Upload Foto Baru</h1>
                    <p className="text-muted-foreground">
                        Tambahkan dokumentasi foto kegiatan baru ke galeri.
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-8">
                    {/* Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>File Foto</CardTitle>
                            <CardDescription>
                                Pilih foto yang ingin diupload (Max 5MB per file).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 cursor-pointer transition-colors group">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Pilih Foto untuk Diupload</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Format yang didukung: JPG, PNG, WEBP
                                        </p>
                                    </div>
                                    <Button variant="secondary" className="mt-4">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Pilih File
                                    </Button>
                                    <Input id="image" type="file" className="hidden" accept="image/*" multiple />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Informasi</CardTitle>
                            <CardDescription>
                                Informasi detail mengenai foto kegiatan ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Kegiatan / Foto</Label>
                                <Input id="title" placeholder="Contoh: Survei Lapangan Proyek A" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Tanggal Kegiatan</Label>
                                    <Input id="date" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="album">Album (Opsional)</Label>
                                    <select
                                        id="album"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Pilih Album...</option>
                                        <option value="rapat">Rapat Kerja</option>
                                        <option value="survei">Survei Lapangan</option>
                                        <option value="gathering">Gathering</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi / Keterangan</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tulis keterangan singkat mengenai foto ini..."
                                    className="h-24"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4">
                        <Link href="/admin/gallery">
                            <Button variant="ghost" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>Menyimpan...</>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan ke Galeri
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
