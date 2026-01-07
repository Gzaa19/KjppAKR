"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface GalleryItem {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    eventDate: Date | null;
}

interface GallerySectionProps {
    albumName: string;
    albumId: string;
    initialItems: GalleryItem[];
    totalCount: number;
}

const ITEMS_PER_PAGE = 6;

export function GallerySection({ albumName, albumId, initialItems, totalCount }: GallerySectionProps) {
    const [items, setItems] = useState<GalleryItem[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const hasMore = items.length < totalCount;

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(
                `/api/gallery?albumId=${albumId}&published=true&page=${nextPage}&limit=${ITEMS_PER_PAGE}`
            );
            const data = await res.json();

            if (data.success && data.data?.galleries) {
                setItems((prev) => [...prev, ...data.data.galleries]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mb-20">
            {/* Section Header - Centered */}
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-kjpp-dark mb-3">
                    {albumName}
                </h2>
                <div className="w-12 h-1 bg-kjpp-red mx-auto rounded-full" />
            </div>

            {/* Gallery Grid - 4 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <GalleryCard key={item.id} item={item} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={loadMore}
                        disabled={isLoading}
                        className="group px-8 py-6 rounded-full border-slate-300 hover:border-kjpp-red hover:text-kjpp-red transition-all"
                    >
                        {isLoading ? (
                            "Memuat..."
                        ) : (
                            <>
                                Lihat Selengkapnya
                                <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
}

// Gallery Card Component - Text below image
function GalleryCard({ item }: { item: GalleryItem }) {
    return (
        <div className="group cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-sm">
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Text Content - Below Image */}
            <div className="px-1">
                <h3 className="font-bold text-kjpp-dark text-base md:text-lg leading-tight line-clamp-2 group-hover:text-kjpp-red transition-colors">
                    {item.title}
                </h3>
                {item.description && (
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                        {item.description}
                    </p>
                )}
            </div>
        </div>
    );
}
