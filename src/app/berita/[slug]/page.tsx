import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Facebook, Twitter, Instagram, Mail, Share2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma"; // Adjust path if necessary based on your project structure

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsDetailPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { from } = await searchParams;

    const backLink = from === 'home' ? '/#recent-updates' : '/berita';
    const backLabel = "Kembali Ke Semua Berita";
    const article = await prisma.news.findUnique({
        where: {
            slug: slug,
            isPublished: true,
        },
        include: {
            author: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
        },
    });

    if (!article) {
        notFound();
    }

    const formattedDate = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short", // e.g. "Feb"
            year: "numeric",
        }).toUpperCase()
        : "";

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Image with Diagonal Cut */}
            <div className="relative w-full h-[60vh] md:h-[75vh]">
                {article.coverImage ? (
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }} />
                )}
                {/* Overlay for subtle darkening if needed, can adhere to same clip-path */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }} />
            </div>

            <main className="container mx-auto px-4 pb-24 -mt-10 md:mt-0 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 md:pt-16">

                    {/* LEFT: Navigation / Back Link (Desktop) */}
                    <div className="hidden lg:block lg:col-span-2">
                        <Link
                            href={backLink}
                            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-kjpp-red transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            {from === 'home' ? 'Kembali Ke Beranda' : 'Kembali Ke Semua Berita'}
                        </Link>
                    </div>

                    {/* CENTER: Main Content */}
                    <div className="lg:col-span-12 md:col-span-12 xl:col-span-7">
                        {/* Mobile Back Link */}
                        <div className="mb-8 lg:hidden">
                            <Link
                                href={backLink}
                                className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-kjpp-red transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                {from === 'home' ? 'Kembali Ke Beranda' : 'Kembali Ke Semua Berita'}
                            </Link>
                        </div>

                        <article>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-kjpp-dark leading-tight tracking-tight mb-6">
                                {article.title}
                            </h1>

                            {/* Social Share - Below Title */}
                            <div className="flex items-center gap-4 mb-10">
                                <span className="text-slate-600 font-semibold text-lg">Bagikan:</span>
                                <div className="flex gap-3">
                                    <SocialLink icon={MessageCircle} href="#" label="WhatsApp" />
                                    <SocialLink icon={Mail} href="#" label="Email" />
                                    <SocialLink icon={Twitter} href="#" label="Twitter" />
                                    <SocialLink icon={Facebook} href="#" label="Facebook" />
                                </div>
                            </div>

                            {/* Main Body */}
                            <div
                                className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-bold prose-headings:text-kjpp-dark 
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-justify
                                prose-li:text-slate-700 prose-a:text-kjpp-red prose-a:no-underline hover:prose-a:underline
                                whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </article>
                    </div>

                    {/* RIGHT: Sticky Metadata Sidebar */}
                    <div className="lg:col-span-12 md:col-span-12 xl:col-span-3 xl:col-start-10">
                        <div className="sticky top-32 space-y-12 border-t pt-8 xl:border-t-0 xl:pt-0 border-slate-200">

                            {/* Metadata Block */}
                            <div>
                                <div className="text-kjpp-red font-bold text-lg mb-2">
                                    {article.category}
                                </div>
                                <div className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">
                                    {formattedDate}
                                </div>
                                <div className="text-slate-400 text-xs tracking-wider">
                                    Diterbitkan oleh {article.author.name}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function SocialLink({ icon: Icon, href, label }: { icon: any; href: string; label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-kjpp-dark hover:text-white hover:border-kjpp-dark transition-all duration-300"
        >
            <Icon className="w-4 h-4" />
        </a>
    );
}
