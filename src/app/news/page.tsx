import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsListingPage({ searchParams }: PageProps) {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const itemsPerPage = 3;

    // Get total count for pagination
    const totalCount = await prisma.news.count({
        where: { isPublished: true },
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const articles = await prisma.news.findMany({
        where: {
            isPublished: true,
        },
        orderBy: {
            publishedAt: "desc",
        },
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Parallax Background Image */}
            <div className="fixed inset-x-0 top-24 h-[60vh] z-0">
                <Image
                    src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="News Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <main id="news-content" className="relative z-10 mt-[50vh] bg-white rounded-t-[3rem] shadow-2xl pt-24 pb-20 min-h-screen scroll-mt-24">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                            <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                                BERITA
                            </h1>
                        </div>
                        <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                            Informasi terkini mengenai kegiatan, pengumuman, dan wawasan terbaru dari KJPP AKR.
                        </p>
                    </div>

                    {/* News List */}
                    <div className="space-y-0">
                        <Separator className="bg-slate-100" />
                        {articles.map((article) => (
                            <div key={article.id}>
                                <Link
                                    href={`/news/${article.slug}`}
                                    className="group block py-10 hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        {/* Thumbnail */}
                                        <div className="relative w-full md:w-64 aspect-4/3 rounded-xl overflow-hidden shrink-0 shadow-sm transition-shadow group-hover:shadow-md">
                                            {article.coverImage ? (
                                                <Image
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                    <span className="text-slate-300 text-xs uppercase tracking-widest font-bold">No Image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-kjpp-red/90 hover:bg-kjpp-red text-white border-none py-0.5 px-3 text-[10px] font-bold uppercase tracking-wider">
                                                    {article.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-3 pt-1">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-kjpp-dark uppercase tracking-[0.15em]">
                                                <div className="flex items-center gap-1.5">
                                                    <span>
                                                        {article.publishedAt
                                                            ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                                                                weekday: "long",
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            })
                                                            : "DRAFT"}
                                                    </span>
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-kjpp-dark hidden md:block" />
                                                <span>Oleh {article.author.name}</span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-kjpp-dark group-hover:text-kjpp-red transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                                                {article.title}
                                            </h3>

                                            <p className="text-kjpp-dark text-sm leading-relaxed max-w-3xl whitespace-pre-line">
                                                {article.excerpt || "Klik untuk membaca selengkapnya mengenai perkembangan terbaru dan wawasan mendalam dari KJPP AKR..."}
                                            </p>

                                            <div className="pt-2 flex items-center text-kjpp-red font-bold text-[11px] uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                Selengkapnya
                                                <ChevronRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Separator className="bg-slate-100" />
                            </div>
                        ))}
                    </div>

                    {articles.length === 0 ? (
                        <div className="py-24 text-center">
                            <h3 className="text-xl font-bold text-kjpp-dark mb-2">Belum ada konten</h3>
                            <p className="text-slate-500">Silakan kembali lagi nanti untuk update terbaru.</p>
                        </div>
                    ) : (
                        // Pagination Controls
                        totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-3">
                                {/* Previous Button */}
                                <Link
                                    href={`/news?page=${currentPage - 1}#news-content`}
                                    className={currentPage <= 1 ? "pointer-events-none" : ""}
                                    aria-disabled={currentPage <= 1}
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-white border border-slate-200 rounded-full w-12 h-12 text-slate-700 hover:bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentPage <= 1}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                </Link>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-2 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <Link
                                            key={pageNum}
                                            href={`/news?page=${pageNum}#news-content`}
                                        >
                                            <Button
                                                variant={currentPage === pageNum ? "default" : "ghost"}
                                                size="icon"
                                                className={`
                                                    rounded-full w-10 h-10 font-bold text-sm transition-all duration-300
                                                    ${currentPage === pageNum
                                                        ? "bg-kjpp-dark text-white hover:bg-kjpp-dark/90 shadow-lg scale-110"
                                                        : "text-slate-500 hover:bg-slate-100 hover:text-kjpp-dark"}
                                                `}
                                            >
                                                {pageNum}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <Link
                                    href={`/news?page=${currentPage + 1}#news-content`}
                                    className={currentPage >= totalPages ? "pointer-events-none" : ""}
                                    aria-disabled={currentPage >= totalPages}
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-white border border-slate-200 rounded-full w-12 h-12 text-slate-700 hover:bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentPage >= totalPages}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
