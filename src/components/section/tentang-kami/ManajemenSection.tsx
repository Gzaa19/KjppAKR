import { getManagementTeams } from "@/actions/management";
import Image from "next/image";
import { Users } from "lucide-react";

export const ManajemenSection = async () => {
    const result = await getManagementTeams();
    const managementTeams = result.success ? result.data?.teams || [] : [];

    return (
        <main className="relative z-10 mt-[35vh] md:mt-[50vh] bg-bg-1 rounded-t-[3rem] shadow-2xl pt-24 pb-32">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-12 bg-kjpp-red shrink-0" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-kjpp-dark tracking-tight uppercase">
                            Leadership Team
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-3xl ml-6 text-justify">
                        Kantor Jasa Penilai Publik Anas Karim Rivai & Rekan (KJPP AKR) terdiri dari seorang
                        Pemimpin Rekan dan dua orang Rekan yang merupakan pendiri dari KJPP AKR. Adapun
                        Pemimpin Rekan dan Rekan tersebut adalah:
                    </p>
                </div>

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
                                    <div className={`h-1 w-24 bg-red-600 mb-6 mx-auto ${index % 2 === 0 ? "md:mx-0" : "md:ml-auto md:mr-0"}`} />
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};
