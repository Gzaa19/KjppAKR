"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientStats } from "./ClientStats";

interface Client {
    id: string;
    name: string;
    logo: string;
    category: string;
}

interface ClientListSectionProps {
    allClients: Client[];
    bankClients: Client[];
    nonBankClients: Client[];
}

export function ClientListSection({ allClients, bankClients, nonBankClients }: ClientListSectionProps) {
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
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Badge className="bg-kjpp-red hover:bg-kjpp-red text-white border-none py-1.5 px-4 text-xs font-bold uppercase tracking-wider">
                            Bank BUMN/Swasta
                        </Badge>
                        <Separator className="flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bankClients.map((client) => (
                            <div
                                key={client.id}
                                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-kjpp-dark/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-video mb-6 flex items-center justify-center">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-center text-lg font-bold text-kjpp-dark group-hover:text-kjpp-dark/80 transition-colors uppercase tracking-tight">
                                    {client.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <Badge className="bg-kjpp-dark hover:bg-kjpp-dark text-white border-none py-1.5 px-4 text-xs font-bold uppercase tracking-wider">
                            Non Bank
                        </Badge>
                        <Separator className="flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {nonBankClients.map((client) => (
                            <div
                                key={client.id}
                                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-kjpp-dark/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative w-full aspect-video mb-6 flex items-center justify-center">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-center text-lg font-bold text-kjpp-dark group-hover:text-kjpp-dark/80 transition-colors uppercase tracking-tight">
                                    {client.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Summary */}
                <ClientStats
                    totalClients={allClients.length}
                    bankClients={bankClients.length}
                    nonBankClients={nonBankClients.length}
                />
            </div>
        </main>
    );
}
