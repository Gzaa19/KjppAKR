"use client";

import React from 'react';
import Image from 'next/image';

const WhatsAppWidget = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <a
                href="https://wa.me/6287809446266?text=Halo%20Pandawa%20Konveksi,%20saya%20ingin%20bertanya%20tentang%20produk%20konveksi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white rounded-full w-16 h-16 shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                title="Chat via WhatsApp"
            >
                <Image
                    src="https://img.icons8.com/color/48/whatsapp--v1.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                />
            </a>
        </div>
    );
};

export default WhatsAppWidget;
