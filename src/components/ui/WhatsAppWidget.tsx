"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = "628777200070";
    const message = "Halo, saya ingin bertanya mengenai layanan KJPP Anas Karim Rivai & Rekan.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-5 w-80 border border-gray-100"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <FaWhatsapp className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">KJPP AKR</h3>
                                    <p className="text-xs text-gray-500">Biasanya membalas dalam beberapa menit</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    👋 Halo! Ada yang bisa kami bantu?
                                    <br />
                                    <br />
                                    Silakan hubungi kami untuk konsultasi dan informasi lebih lanjut mengenai:
                                </p>
                                <ul className="text-xs text-gray-600 mt-2 space-y-1 ml-4">
                                    <li>• Jasa Penilaian Properti</li>
                                    <li>• Konsultasi Bisnis</li>
                                    <li>• Layanan lainnya</li>
                                </ul>
                            </div>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                Chat via WhatsApp
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 group"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-7 h-7" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaWhatsapp className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-green-400 -z-10"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </motion.div>
        </>
    );
}
