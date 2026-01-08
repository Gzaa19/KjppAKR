"use client";

import * as React from "react";
import { LogoLoop } from "@/components/ui/LogoLoop";

interface Client {
    id: string;
    name: string;
    logo: string;
    category: string;
}

interface TrustedClientsSectionProps {
    bankClients: Client[];
    nonBankClients: Client[];
}

const convertToLogoItems = (clients: Client[]) => {
    return clients.map(client => ({
        src: client.logo,
        alt: client.name,
        title: client.name,
    }));
};

export function TrustedClientsSection({ bankClients, nonBankClients }: TrustedClientsSectionProps) {
    const bankLogos = convertToLogoItems(bankClients);
    const nonBankLogos = convertToLogoItems(nonBankClients);

    return (
        <section className="py-12 md:py-20 bg-bg-2 border-y border-border-primary2">
            <div className="container mx-auto px-4">
                {/* Two Column Layout: Header Left, Logos Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column - Header */}
                    <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary2">
                            Klien Kami
                        </h2>
                        <p className="text-text-slate-3 text-base md:text-lg leading-relaxed">
                            Dipercaya oleh berbagai institusi terkemuka di Indonesia
                        </p>
                    </div>

                    {/* Right Column - Logo Sections */}
                    <div className="lg:col-span-8 space-y-8 md:space-y-12">
                        {/* Bank BUMN/Swasta Section */}
                        <div>
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-text-primary2 mb-4 md:mb-6 text-center lg:text-left">
                                Bank BUMN/Swasta
                            </h3>
                            <LogoLoop
                                logos={bankLogos}
                                speed={50}
                                direction="left"
                                logoHeight={40}
                                gap={32}
                                pauseOnHover={true}
                                fadeOut={true}
                                scaleOnHover={true}
                                ariaLabel="Bank BUMN/Swasta clients"
                                className="md:logoHeight-[50px] md:gap-[48px]"
                            />
                        </div>

                        {/* Non Bank Section */}
                        <div>
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-text-primary2 mb-4 md:mb-6 text-center lg:text-left">
                                Non Bank
                            </h3>
                            <LogoLoop
                                logos={nonBankLogos}
                                speed={50}
                                direction="right"
                                logoHeight={40}
                                gap={32}
                                pauseOnHover={true}
                                fadeOut={true}
                                scaleOnHover={true}
                                ariaLabel="Non Bank clients"
                                className="md:logoHeight-[50px] md:gap-[48px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
