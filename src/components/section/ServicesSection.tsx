"use client";

import * as React from "react";
import Link from "next/link";
import {
    Building,
    TrendingUp,
    Leaf,
    ShieldCheck,
    FileText,
    Calculator,
    Home,
    Database,
    Key,
    ArrowRight,
    ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/services";

const iconMap: Record<string, React.ElementType> = {
    building: Building,
    "trending-up": TrendingUp,
    leaf: Leaf,
    "shield-check": ShieldCheck,
    "file-text": FileText,
    calculator: Calculator,
    home: Home,
    database: Database,
    key: Key,
};

export function ServicesSection() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                    <div className="space-y-4 max-w-3xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-primary2 leading-tight">
                            Solusi Penilaian <span className="text-red-600">Terintegrasi</span>
                        </h2>
                        <p className="text-text-slate-3 text-lg leading-relaxed">
                            Layanan penilaian aset profesional yang memadukan standar SPI,
                            analisis data mendalam, dan teknologi modern.
                        </p>
                    </div>

                    <Link
                        href="/layanan"
                        className="hidden md:flex group items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold hover:border-slate-400 hover:shadow-md transition-all duration-300"
                    >
                        Lihat Semua Layanan
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = iconMap[service.icon];
                        return (
                            <Card
                                key={service.id}
                                className="group relative bg-bg-1 rounded-2xl p-1 border border-border-primary hover:border-border-hover shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2"
                            >
                                <CardContent className="h-full p-7 rounded-xl bg-bg-1 flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 rounded-xl bg-bg-2 group-hover:bg-bg-primary2 flex items-center justify-center mb-6 transition-colors duration-300">
                                            <Icon className="w-7 h-7 text-text-slate-3 group-hover:text-white transition-colors duration-300" />
                                        </div>

                                        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-text-primary2 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-text-slate-2 leading-relaxed text-sm mb-6">
                                            {service.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="mt-12 md:hidden flex justify-center">
                    <Link
                        href="/layanan"
                        className="flex items-center gap-2 text-slate-600 font-semibold"
                    >
                        Lihat Semua Layanan
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}