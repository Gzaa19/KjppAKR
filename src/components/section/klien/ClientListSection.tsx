"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Client {
    id: string;
    name: string;
    logo: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
}

interface CategoryGroup {
    category: Category;
    clients: Client[];
}

interface ClientListSectionProps {
    allClients: Client[];
    groupedByCategory: Record<string, CategoryGroup>;
}

// Badge colors for different categories
const CATEGORY_COLORS: Record<string, string> = {
    "bank-bumn-swasta": "bg-kjpp-red hover:bg-kjpp-red",
    "non-bank": "bg-kjpp-dark hover:bg-kjpp-dark",
    "instansi-pemerintah": "bg-blue-600 hover:bg-blue-600",
    "perusahaan-swasta": "bg-green-600 hover:bg-green-600",
    "bumn": "bg-orange-600 hover:bg-orange-600",
    "perorangan": "bg-purple-600 hover:bg-purple-600",
};

const INITIAL_DISPLAY_COUNT = 8;
const TRIGGER_COUNT = 9; // Show "Lihat Lebih Banyak" button when count >= 9

function CategorySection({ group }: { group: CategoryGroup }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const totalClients = group.clients.length;
    const shouldShowButton = totalClients >= TRIGGER_COUNT;
    const displayedClients = shouldShowButton && !isExpanded
        ? group.clients.slice(0, INITIAL_DISPLAY_COUNT)
        : group.clients;

    // If expanded and has many items, use smaller grid
    const gridClass = isExpanded && totalClients >= TRIGGER_COUNT
        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Badge className={`${CATEGORY_COLORS[group.category.slug] || "bg-slate-600 hover:bg-slate-600"} text-white border-none py-1.5 px-4 text-xs font-bold uppercase tracking-wider`}>
                    {group.category.name}
                </Badge>
                <Separator className="flex-1 bg-slate-200" />
            </div>

            <div className={gridClass}>
                {displayedClients.map((client) => (
                    <div
                        key={client.id}
                        className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-kjpp-dark/30 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative w-full aspect-video mb-4 flex items-center justify-center">
                            <Image
                                src={client.logo}
                                alt={client.name}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="text-center text-sm md:text-base font-bold text-kjpp-dark group-hover:text-kjpp-dark/80 transition-colors uppercase tracking-tight">
                            {client.name}
                        </h3>
                    </div>
                ))}
            </div>

            {shouldShowButton && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="outline"
                        className="group border-kjpp-dark/20 hover:border-kjpp-dark hover:bg-kjpp-dark hover:text-white transition-all duration-300"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-2" />
                                Lihat Lebih Sedikit
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-2" />
                                Lihat Lebih Banyak ({totalClients - INITIAL_DISPLAY_COUNT} lainnya)
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

export function ClientListSection({ allClients, groupedByCategory }: ClientListSectionProps) {
    // Convert grouped object to array and sort by sortOrder
    const categoryGroups = Object.values(groupedByCategory).sort((a, b) => {
        // Primary sort by sortOrder
        const diff = a.category.sortOrder - b.category.sortOrder;
        if (diff !== 0) return diff;
        // Fallback to name if sortOrder is equal
        return a.category.name.localeCompare(b.category.name);
    });

    return (
        <main
            id="client-content"
            className="relative z-10 mt-[50vh] bg-bg-1 rounded-t-[3rem] shadow-2xl pt-24 pb-32 scroll-mt-24"
        >
            <div className="container mx-auto px-4">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            KLIEN KAMI
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                        Dipercaya oleh berbagai institusi terkemuka di Indonesia untuk memberikan layanan penilai profesional dan berkualitas tinggi.
                    </p>
                </div>

                {/* Dynamic category sections */}
                {categoryGroups.map((group, index) => (
                    <div key={group.category.id} className={index > 0 ? "mt-20" : ""}>
                        <CategorySection group={group} />
                    </div>
                ))}
            </div>
        </main>
    );
}
