import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { NewsListSection } from "@/components/section/news/NewsListSection";
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
            <ParallaxBackground
                imageUrl="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="News Background"
            />

            <NewsListSection
                articles={articles}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div>
    );
}
