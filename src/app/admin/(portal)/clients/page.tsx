import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getClients } from "@/actions/client";
import { ClientActionButtons } from "@/components/admin/client-action-buttons";
import Image from "next/image";

export default async function ClientsPage() {
    const result = await getClients();
    const clients = result.success ? result.data?.clients || [] : [];

    const bankClients = clients.filter((c) => c.category === "BANK_BUMN_SWASTA");
    const nonBankClients = clients.filter((c) => c.category === "NON_BANK");

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Klien</h1>
                <p className="text-gray-600">
                    Kelola daftar klien KJPP AKR.
                </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Cari nama klien..." className="pl-8 bg-white" />
                </div>
                <Link href="/admin/clients/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Klien
                    </Button>
                </Link>
            </div>

            {clients.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada klien. Mulai dengan menambahkan klien baru.</p>
                    <Link href="/admin/clients/create" className="mt-4 inline-block">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Klien Pertama
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-8">
                    {bankClients.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-5 w-5 text-kjpp-red" />
                                <h3 className="text-lg font-bold">Bank BUMN/Swasta</h3>
                                <Badge variant="secondary">{bankClients.length}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {bankClients.map((client) => (
                                    <Card key={client.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="relative w-full aspect-video mb-4 bg-slate-50 rounded-lg overflow-hidden">
                                                <Image
                                                    src={client.logo}
                                                    alt={client.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={client.isPublished ? "default" : "secondary"} className="text-xs">
                                                        {client.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <ClientActionButtons id={client.id} isPublished={client.isPublished} />
                                                </div>
                                                <h4 className="font-bold text-sm line-clamp-2">{client.name}</h4>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {nonBankClients.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-5 w-5 text-kjpp-dark" />
                                <h3 className="text-lg font-bold">Non Bank</h3>
                                <Badge variant="secondary">{nonBankClients.length}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {nonBankClients.map((client) => (
                                    <Card key={client.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="relative w-full aspect-video mb-4 bg-slate-50 rounded-lg overflow-hidden">
                                                <Image
                                                    src={client.logo}
                                                    alt={client.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={client.isPublished ? "default" : "secondary"} className="text-xs">
                                                        {client.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <ClientActionButtons id={client.id} isPublished={client.isPublished} />
                                                </div>
                                                <h4 className="font-bold text-sm line-clamp-2">{client.name}</h4>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
