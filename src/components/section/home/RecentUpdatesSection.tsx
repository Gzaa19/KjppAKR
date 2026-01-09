"use client";

import { BrandOutlineButton } from "@/components/ui/brand-outline-button";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Type definition matching the API response
interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string;
    publishedAt: string | null;
    createdAt: string;
    coverImage: string | null;
}

export function RecentUpdatesSection() {
    const [news, setNews] = React.useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("/api/news/recent");
                const result = await response.json();
                if (result.success) {
                    setNews(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch recent news:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (!isLoading && news.length === 0) {
        return null;
    }

    const featuredNews = news[0];
    const otherNews = news.slice(1);

    return (
        <section id="recent-updates" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-3xl">
                        <span className="text-kjpp-dark font-bold tracking-widest text-xs uppercase mb-3 block">
                            MEDIA INFORMASI
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-kjpp-dark leading-tight mb-6">
                            KJPP AKR <span className="text-kjpp-red">Ruang Berita</span>
                        </h2>
                        <p className="text-kjpp-dark text-lg leading-relaxed max-w-2xl">
                            Sebagai konsultan jasa penilai publik terkemuka, KJPP AKR berkomitmen menyediakan informasi terpercaya mengenai perkembangan bisnis, inovasi, serta kontribusi perusahaan dalam keamanan energi dan pembangunan berkelanjutan.
                        </p>
                    </div>

                    <div className="shrink-0 mb-2">
                        <Link
                            href="/berita"
                            className="hidden md:flex group items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold hover:border-slate-400 hover:shadow-md transition-all duration-300"
                        >
                            Lihat Semua
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
                    {isLoading ? (
                        <div className="col-span-1 lg:col-span-2 h-96 flex items-center justify-center bg-slate-50 rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                        </div>
                    ) : (
                        <>
                            {/* Featured (Left) */}
                            {featuredNews && (
                                <NewsCard item={featuredNews} className="h-[400px] lg:h-full" />
                            )}

                            {/* Grid Right */}
                            {otherNews.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                    {otherNews.map((item) => (
                                        <NewsCard key={item.id} item={item} className="h-[300px] lg:h-auto" />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function NewsCard({ item, className }: { item: NewsItem; className?: string }) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <Link
            href={`/berita/${item.slug}?from=home`}
            className={cn("block group h-full", className)}
        >
            <Card className="relative h-full w-full overflow-hidden border-none rounded-xl bg-slate-900 shadow-none">
                {/* Background Image */}
                {item.coverImage ? (
                    <img
                        src={item.coverImage}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-75"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <Newspaper className="h-16 w-16 text-slate-700" />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <CardContent className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                    <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                        {/* Category - Plain text as requested */}
                        <span className="inline-block text-xs font-bold tracking-wider text-kjpp-red/90 uppercase mb-2">
                            {item.category}
                        </span>

                        <h3 className="text-lg md:text-1xl font-bold text-white mb-4 leading-tight line-clamp-3">
                            {item.title}
                        </h3>

                        <div className="flex items-center text-white/80 text-sm font-medium">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(item.publishedAt || item.createdAt)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

