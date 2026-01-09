"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
    // A. Identitas
    name: z.string().min(2, { message: "Nama harus diisi." }),
    company: z.string().min(2, { message: "Nama perusahaan harus diisi." }),
    position: z.string().min(2, { message: "Jabatan harus diisi." }),
    phone: z.string().min(5, { message: "Nomor telepon harus diisi." }),
    fax: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().email({ message: "Email tidak valid." }),
    website: z.string().optional(),
    valuationCategory: z.enum(["Penilaian Properti/Aset", "Penilaian Bisnis"]),
    objectDescription: z.string().optional(),
    objectAddress: z.string().optional(),
    valuationPurpose: z.string().optional(),
    additionalNotes: z.string().optional(),
});

export function ContactFormSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            company: "",
            position: "",
            phone: "",
            fax: "",
            mobile: "",
            email: "",
            website: "",
            valuationCategory: "Penilaian Properti/Aset",
            objectDescription: "",
            objectAddress: "",
            valuationPurpose: "",
            additionalNotes: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Gagal mengirim pesan");
            }

            toast.success("Permohonan berhasil dikirim!", {
                description: "Tim kami akan segera meninjau permintaan Anda."
            });
            form.reset();
        } catch (error) {
            toast.error("Gagal mengirim permohonan", {
                description: "Silakan coba lagi beberapa saat lagi."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            Hubungi Kami
                        </h1>
                    </div>
                    <p className="text-kjpp-dark text-lg md:text-xl max-w-3xl leading-relaxed text-justify md:text-left">
                        Kami siap membantu kebutuhan penilaian aset dan konsultasi properti Anda. Hubungi kami melalui formulir di bawah ini atau kunjungi kantor kami.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">A. Identitas</h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama <span className="text-kjpp-red">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Perusahaan <span className="text-kjpp-red">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jabatan <span className="text-kjpp-red">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>No. Telp <span className="text-kjpp-red">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="fax"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>No. Fax</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="http://www.example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">B. Kategori Penilaian</h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="valuationCategory"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col md:flex-row gap-8"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50 rounded-lg w-full">
                                                        <FormControl>
                                                            <RadioGroupItem value="Penilaian Properti/Aset" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            Penilaian Properti/Aset
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 bg-slate-50 rounded-lg w-full">
                                                        <FormControl>
                                                            <RadioGroupItem value="Penilaian Bisnis" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            Penilaian Bisnis
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">C. Object Penilaian</h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="objectDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Objek Penilaian</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Deskripsikan objek penilaian disini..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">D. Alamat Objek / Asset yang akan di nilai <span className="text-sm font-normal text-slate-500">(Alamat Properti)</span></h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="objectAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alamat Properti</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Masukkan alamat lengkap properti..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">E. Tujuan Penilaian</h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="valuationPurpose"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tujuan Penilaian</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Sebutkan tujuan dari penilaian ini..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-b pb-2">
                                    <h3 className="text-xl font-bold text-kjpp-dark">F. Catatan Tambahan</h3>
                                    <div className="w-16 h-1 bg-kjpp-red mt-2" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="additionalNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Catatan Tambahan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tambahkan catatan lainnya jika ada..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Permohonan
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
}
