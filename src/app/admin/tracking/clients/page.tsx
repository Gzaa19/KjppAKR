"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Search,
    Trash2,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Client = {
    id: string;
    name: string;
    type: string;
    address: string;
    picName: string;
    phone: string;
    email: string;
};

const clientTypes = [
    { value: "all", label: "Semua Tipe" },
    { value: "CORPORATE", label: "PT / Perusahaan" },
    { value: "PERORANGAN", label: "Perorangan" },
    { value: "SME", label: "SME" },
    { value: "INSTANSI", label: "Instansi Pemerintah" },
];

export default function ClientsPage() {
    const [clients, setClients] = React.useState<Client[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("all");
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const fetchClients = React.useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(searchQuery && { search: searchQuery }),
                ...(selectedType !== "all" && { type: selectedType }),
            });

            const response = await fetch(`/api/tracking-clients?${params}`);
            const data = await response.json();

            if (data.success) {
                setClients(data.data);
                setTotalPages(data.pagination.totalPages);
                setTotal(data.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Gagal memuat data klien");
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, selectedType]);

    React.useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`/api/tracking-clients/${deleteId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Klien berhasil dihapus");
                fetchClients();
            } else {
                toast.error(data.error || "Gagal menghapus klien");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            toast.error("Gagal menghapus klien");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Daftar Klien Tracking</h1>
                <p className="text-gray-600">
                    Kelola dan pantau seluruh data klien tracking perusahaan untuk keperluan
                    operasional dan logistik secara terpusat.
                </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Cari berdasarkan nama PT, alamat, atau nama PIC..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 bg-white"
                        />
                    </div>

                    <Select
                        value={selectedType}
                        onValueChange={(value) => {
                            setSelectedType(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full md:w-[200px] bg-white">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            {clientTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button asChild>
                    <Link href="/admin/tracking/clients/new">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah Klien Baru
                    </Link>
                </Button>
            </div>
            <div className="rounded-xl border bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6">
                                Nama Klien
                            </TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6">
                                Alamat Kantor
                            </TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6">
                                Nama PIC
                            </TableHead>
                            <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6">
                                No. HP / WhatsApp
                            </TableHead>
                            <TableHead className="text-center font-semibold text-xs tracking-wider text-gray-500 uppercase px-6">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Tidak ada data klien
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-gray-50 border-b">
                                    <TableCell className="py-5 px-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-gray-900 text-sm">
                                                {client.name}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="w-fit text-[10px] font-medium bg-gray-100 text-gray-600 uppercase px-2 py-0.5"
                                            >
                                                {client.type}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-gray-600 text-sm max-w-xs">
                                        <div className="truncate">
                                            {client.address}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-gray-900 text-sm">
                                        {client.picName}
                                    </TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-2 text-gray-900 text-sm">
                                            <svg
                                                className="w-4 h-4 text-green-600 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <span>{client.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-5 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Link href={`/admin/tracking/clients/${client.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeleteId(client.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-gray-500">
                        Menampilkan {clients.length > 0 ? (page - 1) * 10 + 1 : 0}-
                        {Math.min(page * 10, total)} dari {total} klien
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={page === pageNum ? "default" : "outline"}
                                    size="icon"
                                    className={`h-8 w-8 ${page === pageNum
                                        ? "bg-blue-950 hover:bg-blue-900 text-white"
                                        : ""
                                        }`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                        {totalPages > 3 && <span className="text-gray-500">...</span>}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Klien?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus klien ini? Tindakan ini tidak dapat
                            dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
