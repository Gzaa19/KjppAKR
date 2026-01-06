"use client";

import * as React from "react";
import { trustedClients } from "@/data/clients";

export function TrustedClientsSection() {
    return (
        <section className="py-12 bg-bg-2 border-y border-border-primary2">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <p className="text-text-primary2 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold">
                        Dipercaya oleh berbagai instansi pemerintah dan swasta
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                    {trustedClients.map((client) => (
                        <div
                            key={client.id}
                            className="group cursor-default"
                        >
                            <div className="px-6 py-3 rounded-xl border border-transparent hover:border-border-hover hover:bg-white hover:shadow-sm hover:-translate-y-1 transition-all duration-300 ease-out">
                                <h3 className="text-lg md:text-xl font-bold text-text-slate-1 group-hover:text-text-primary transition-colors duration-300 whitespace-nowrap">
                                    {client.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}