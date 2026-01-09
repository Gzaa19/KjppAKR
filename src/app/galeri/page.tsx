import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { GallerySection } from "@/components/gallery/GallerySection";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

export const metadata: Metadata = {
    title: "Galeri Aktivitas | KJPP AKR",
    description: "Melihat lebih dekat dedikasi dan profesionalisme tim kami dalam setiap langkah.",
};

const INITIAL_ITEMS = 6;

export default async function GalleryPage() {
    const albums = await prisma.album.findMany({
        where: {
            isActive: true,
            galleries: {
                some: { isPublished: true },
            },
        },
        include: {
            galleries: {
                where: { isPublished: true },
                orderBy: { sortOrder: "asc" },
                take: INITIAL_ITEMS,
            },
            _count: {
                select: {
                    galleries: {
                        where: { isPublished: true },
                    },
                },
            },
        },
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
<<<<<<< Updated upstream

            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Gallery Background"
            />

            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-40 min-h-screen">
                {/* Header */}
=======
            <div className="fixed inset-x-0 top-24 h-[60vh] z-0">
                <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                    alt="Gallery Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <main className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-20 min-h-screen">
>>>>>>> Stashed changes
                <div className="container mx-auto px-4 mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            GALERI
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                        Melihat lebih dekat dedikasi dan profesionalisme tim kami dalam setiap langkah.
                    </p>
                </div>

                <div className="container mx-auto px-4">
                    {albums.map((album) => (
                        <GallerySection
                            key={album.id}
                            albumId={album.id}
                            albumName={album.name}
                            initialItems={album.galleries.map((g) => ({
                                id: g.id,
                                title: g.title,
                                description: g.description,
                                imageUrl: g.imageUrl,
                                eventDate: g.eventDate,
                            }))}
                            totalCount={album._count.galleries}
                        />
                    ))}

                    {albums.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500">Belum ada galeri yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </main>

            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div>
    );
}
