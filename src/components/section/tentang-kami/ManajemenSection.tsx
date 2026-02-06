"use client";

import { getManagementTeams } from "@/actions/management";
import Image from "next/image";
import { Users, X, Award } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ManagementTeam {
    id: string;
    name: string;
    title: string;
    image: string | null;
    description: string;
    branch: string | null;
    isMappiCert: boolean;
    sortOrder: number;
}

export const ManajemenSection = () => {
    const [managementTeams, setManagementTeams] = useState<ManagementTeam[]>([]);
    const [selectedMember, setSelectedMember] = useState<ManagementTeam | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const result = await getManagementTeams();
            if (result.success && result.data?.teams) {
                setManagementTeams(result.data.teams);
            }
        } catch (error) {
            console.error("Error fetching management teams:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (member: ManagementTeam) => {
        setSelectedMember(member);
        setIsOpen(true);
    };

    return (
        <>
            <main className="relative z-10 mt-[35vh] md:mt-[50vh] bg-bg-1 rounded-t-[3rem] shadow-2xl pt-24 pb-32">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                            <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                                Manajemen Team
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-3xl ml-6 text-justify">
                            Kantor Jasa Penilai Publik Anas Karim Rivai & Rekan (KJPP AKR) terdiri dari seorang
                            Pemimpin Rekan dan dua orang Rekan yang merupakan pendiri dari KJPP AKR. Adapun
                            Pemimpin Rekan dan Rekan tersebut adalah:
                        </p>
                    </div>

                    {loading ? (
                        <div className="space-y-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 animate-pulse">
                                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                        <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 rounded-full" />
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                                            <div className="h-1 bg-gray-200 rounded w-24" />
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {managementTeams.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="bg-white rounded-3xl p-6 md:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                                >
                                    <div
                                        className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                            } items-center gap-8 md:gap-12`}
                                    >
                                        <div className="relative shrink-0 w-48 h-48 md:w-64 md:h-64">
                                            <div className="absolute inset-4 rounded-full border-4 border-primary-2/20"></div>
                                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center">
                                                {member.image ? (
                                                    <Image
                                                        src={member.image}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 192px, 256px"
                                                    />
                                                ) : (
                                                    <Users className="w-20 h-20 text-gray-300" />
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex-1 text-center ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                            <h3 className="text-2xl md:text-3xl font-bold font-playfair text-primary-2 mb-2">
                                                {member.name}
                                            </h3>
                                            {member.branch && (
                                                <p className="text-lg font-medium text-gray-500 mb-2">
                                                    {member.branch}
                                                </p>
                                            )}
                                            <p className="text-xl font-medium text-kjpp-red mb-4">
                                                {member.title}
                                            </p>
                                            <div className={`h-1 w-24 bg-red-600 mb-6 mx-auto ${index % 2 === 0 ? "md:mx-0" : "md:ml-auto md:mr-0"}`} />
                                            <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify line-clamp-5 mb-4">
                                                {member.description}
                                            </p>
                                            <Button
                                                onClick={() => handleOpenDetail(member)}
                                                className="bg-kjpp-red hover:bg-kjpp-red/90 text-white"
                                            >
                                                Selengkapnya
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Detail Manajemen Team</DialogTitle>
                        <DialogDescription className="sr-only">
                            Informasi lengkap tentang anggota tim manajemen
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMember && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="relative shrink-0 w-40 h-40 md:w-48 md:h-48">
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-kjpp-red/20 shadow-lg bg-gray-50 flex items-center justify-center">
                                        {selectedMember.image ? (
                                            <Image
                                                src={selectedMember.image}
                                                alt={selectedMember.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 160px, 192px"
                                            />
                                        ) : (
                                            <Users className="w-20 h-20 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold text-kjpp-dark mb-2">
                                        {selectedMember.name}
                                    </h2>
                                    <div className="h-1 w-24 bg-kjpp-red mb-3 mx-auto md:mx-0" />
                                    <p className="text-lg font-medium text-kjpp-red mb-3">
                                        {selectedMember.title}
                                    </p>
                                    {selectedMember.isMappiCert && (
                                        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200">
                                            <Award className="w-4 h-4" />
                                            <span>MAPPI Certified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-kjpp-dark mb-3">Profil</h3>
                                <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                                    {selectedMember.description}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
