import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getManagementTeams } from "@/actions/management";
import { DeleteManagementButton } from "@/components/admin/management-actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function ManagementPage() {
    const result = await getManagementTeams();
    const teams = result.success ? result.data?.teams || [] : [];

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Tim</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola daftar kepemimpinan dan manajemen KJPP AKR.
                    </p>
                </div>
                <Link href="/admin/management/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Anggota Tim
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari nama..." className="pl-8" />
                </div>
            </div>

            {teams.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada data tim manajemen.</p>
                    <Link href="/admin/management/create" className="mt-4 inline-block">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Anggota Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {teams.map((member) => (
                        <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 mb-4">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-2">
                                                <Users className="w-8 h-8 text-slate-300 mb-1" />
                                                <span className="text-[8px] text-slate-400 text-center leading-tight">Belum ada foto</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-base text-center line-clamp-2">{member.name}</h4>
                                    <p className="text-sm text-muted-foreground text-center line-clamp-1">{member.title}</p>

                                    {member.isMappiCert && (
                                        <Badge variant="outline" className="mt-2 text-[10px] border-primary text-primary">
                                            MAPPI (Cert)
                                        </Badge>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs text-muted-foreground line-clamp-3 text-justify">
                                        {member.description}
                                    </p>

                                    <div className="flex items-center justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/management/${member.id}/edit`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DeleteManagementButton id={member.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
