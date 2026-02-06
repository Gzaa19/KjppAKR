"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";

// Tipe data untuk statistik
interface StatItem {
    id: number;
    value: number;
    suffix: string;
    label: string;
    description: string;
}

const stats: StatItem[] = [
    {
        id: 1,
        value: 20,
        suffix: "+",
        label: "Tahun Pengalaman",
        description: "Dedikasi partner dalam industri penilaian profesional.",
    },
    {
        id: 2,
        value: 4,
        suffix: "",
        label: "Kantor Operasional",
        description: "Layanan mencakup seluruh wilayah strategis Indonesia.",
    },
    {
        id: 3,
        value: 100,
        suffix: "+",
        label: "Klien Korporasi",
        description: "Dipercaya oleh Perbankan, BUMN, dan Instansi Pemerintah.",
    },
    {
        id: 4,
        value: 50, 
        suffix: "T+",
        label: "Nilai Aset Dinilai",
        description: "Total akumulasi nilai aset yang telah divaluasi.",
    },
];

// Helper Component untuk Animasi Angka
function Counter({ value, duration = 2000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
            setCount(Math.floor(easeOut(progress) * value));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [isVisible, value, duration]);

    return <span ref={nodeRef}>{count}</span>;
}

export function StatsSection() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-border-primary">
                    {stats.map((stat) => (
                        <div key={stat.id} className="px-4 pt-8 lg:pt-0 flex flex-col items-center group">
                            <div className="text-5xl md:text-6xl font-extrabold text-text-primary mb-3 flex items-baseline tracking-tight">
                                <Counter value={stat.value} />
                                <span className="text-kjpp-red ml-1 text-4xl md:text-5xl">{stat.suffix}</span>
                            </div>
                            <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-widest">
                                {stat.label}
                            </h3>
                            <p className="text-text-slate-2 text-sm leading-relaxed max-w-[220px]">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}