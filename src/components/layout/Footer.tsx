"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[var(--navbar-topbar)] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Image
                            src="/image/logoFooter.png"
                            alt="KJPP AKR Logo"
                            width={180}
                            height={90}
                            className="object-contain"
                        />
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Kantor Jasa Penilai Publik profesional yang terdaftar dan berizin resmi dari Kementerian Keuangan RI.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-kjpp-red flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-kjpp-red flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-kjpp-red flex items-center justify-center transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://youtube.com"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-kjpp-red flex items-center justify-center transition-colors"
                            >
                                <Youtube className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/tentang/profil" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Profil Perusahaan
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Jasa Layanan
                                </Link>
                            </li>
                            <li>
                                <Link href="/klien" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Klien Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Galeri
                                </Link>
                            </li>
                            <li>
                                <Link href="/tentang/karir" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Karir
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Layanan</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/layanan/penilaian" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Penilaian Properti
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan/konsultasi" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Konsultasi Aset
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan/audit" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Audit Properti
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan/riset" className="text-slate-300 hover:text-kjpp-red transition-colors text-sm">
                                    Riset Pasar
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-kjpp-red flex-shrink-0 mt-0.5" />
                                <span className="text-slate-300">
                                    Permata Kebayoran Plaza Blok A-11<br />
                                    Jl. Raya Kebayoran Lama No. 22<br />
                                    Jakarta 12220, Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="w-5 h-5 text-kjpp-red flex-shrink-0" />
                                <span className="text-slate-300">021-7268181 | 021-7227643</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="w-5 h-5 text-kjpp-red flex-shrink-0" />
                                <span className="text-slate-300">info@kjppakr.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <Clock className="w-5 h-5 text-kjpp-red flex-shrink-0 mt-0.5" />
                                <span className="text-slate-300">
                                    Senin - Jumat<br />
                                    08:00 - 17:00 WIB
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
                        <p>
                            © {new Date().getFullYear()} <span className="font-bold">KJPP-AKR</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-kjpp-red transition-colors">
                                Kebijakan Privasi
                            </Link>
                            <Link href="/terms" className="hover:text-kjpp-red transition-colors">
                                Syarat & Ketentuan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
