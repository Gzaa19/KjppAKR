"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import map component to avoid SSR window error
const LeafletMap = dynamic(
    () => import("./LeafletMap"),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="h-[600px] rounded-xl overflow-hidden bg-slate-100 animate-pulse flex items-center justify-center">
                    <p className="text-slate-400">Loading map...</p>
                </div>
            </div>
        )
    }
);

export function OfficeMapSection() {
    const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

    const offices = [
        {
            name: "Kantor Pusat: Jakarta",
            shortName: "Jakarta",
            address: "Permata Kebayoran Plaza Blok A-12A",
            fullAddress: "Permata Kebayoran Plaza Blok A-12A Jl. Raya Kebayoran Lama No. 225 Jakarta 12220, Indonesia",
            phone: "(021) 7268181",
            email: "admin@kjpp-akr.com",
            position: [-6.1754, 106.8272] as [number, number], // Monas Jakarta
            isHeadOffice: true
        },
        {
            name: "Kantor Cabang: Surabaya",
            shortName: "Surabaya",
            address: "Perumahan Sidosermo Indah Jalan Sidosermo Indah IV No. 17",
            fullAddress: "Perumahan Sidosermo Indah Jalan Sidosermo Indah IV No. 17, Kelurahan Sidosermo, Kecamatan Wonocolo, Kota Surabaya, Provinsi Jawa Timur, Kode Pos 60239",
            phone: "(031) 58284711",
            email: "akrsurabaya@gmail.com",
            position: [-7.2459, 112.7378] as [number, number], // Patung Suro dan Boyo
            isHeadOffice: false
        },
        {
            name: "Kantor Cabang: Bandung",
            shortName: "Bandung",
            address: "Jl. Alam Nirwana No. 18, Kav. 32",
            fullAddress: "Jl. Alam Nirwana No. 18, Kav. 32, Cluster Graha Nirwana, Resort Dago Bandung - 40191",
            phone: "(022) 82522822",
            email: "akr.bandung@kjpp-akr.com",
            position: [-6.9215, 107.6069] as [number, number], // Alun-alun Bandung
            isHeadOffice: false
        },
        {
            name: "Kantor Cabang: Palembang",
            shortName: "Palembang",
            address: "Komplek Pusri Sako, Jl. Kelapa 2 Blok E 26",
            fullAddress: "Komplek Pusri Sako, Jl. Kelapa 2 Blok E 26, Kel. Sako, Kec. Sako, Palembang - 30163",
            phone: "(0711) 5702927",
            email: "kjpp.akr_palembang@yahoo.com",
            position: [-2.9880, 104.7619] as [number, number], // Jembatan Ampera
            isHeadOffice: false
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-kjpp-dark mb-6">
                                Daftar Kantor Kami
                            </h2>

                            <div className="space-y-4">
                                {offices.map((office, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-xl border-2 transition-all ${office.isHeadOffice
                                            ? "border-kjpp-red bg-kjpp-red/5"
                                            : "border-slate-200"
                                            }`}
                                    >
                                        <h3 className={`font-bold mb-2 ${office.isHeadOffice ? "text-kjpp-red" : "text-kjpp-dark"}`}>
                                            {office.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-3">
                                            {office.address}
                                        </p>
                                        <Button
                                            onClick={() => {
                                                const newIndex = selectedOffice === index ? null : index;
                                                setSelectedOffice(newIndex);
                                            }}
                                            className="w-full bg-kjpp-red hover:bg-kjpp-red/90 text-white font-semibold"
                                        >
                                            Lihat Detail
                                        </Button>
                                        {selectedOffice === index && (
                                            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                                                <p className="text-sm">
                                                    <span className="font-semibold">Alamat:</span> {office.fullAddress}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Phone:</span>{" "}
                                                    <a href={`tel:${office.phone}`} className="text-kjpp-red hover:underline">
                                                        {office.phone}
                                                    </a>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Email:</span>{" "}
                                                    <a href={`mailto:${office.email}`} className="text-kjpp-red hover:underline break-all">
                                                        {office.email}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leaflet Map */}
                    <div className="lg:col-span-2">
                        <LeafletMap
                            offices={offices}
                            selectedOffice={selectedOffice}
                            setSelectedOffice={setSelectedOffice}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
