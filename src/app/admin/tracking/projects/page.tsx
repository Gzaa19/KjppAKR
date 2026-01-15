"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    Eye,
    RefreshCw,
    Plus,
    Search,
    Loader2,
    Trash2,
    AlertCircle,
    Pencil
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Client {
    id: string
    name: string
    address: string
    type: string
}

interface Project {
    id: string
    projectId: string
    proposalNo: string
    trackingCode: string
    client: Client
    objectType: string
    objective: string
    address: string
    status: string
    progress: number
    createdAt: string
    updatedAt: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

const statusConfig: Record<string, { label: string; color: string; textColor: string }> = {
    VERIFIKASI_DOKUMEN: { label: "Verifikasi Dokumen", color: "bg-red-500", textColor: "text-red-600" },
    INSPEKSI_LAPANGAN: { label: "Inspeksi Lapangan", color: "bg-blue-600", textColor: "text-blue-600" },
    PROSES_REVIEW: { label: "Proses Review", color: "bg-orange-500", textColor: "text-orange-600" },
    LAPORAN_FINAL: { label: "Laporan Final", color: "bg-green-500", textColor: "text-green-600" },
    SELESAI: { label: "Selesai", color: "bg-emerald-600", textColor: "text-emerald-600" },
}

const objectTypeLabels: Record<string, string> = {
    RUMAH_TINGGAL: "Rumah Tinggal",
    RUKO_KANTOR: "Ruko / Kantor",
    TANAH_KOSONG: "Tanah Kosong",
    GUDANG: "Gudang",
    APARTEMEN: "Apartemen",
    PABRIK: "Pabrik",
    LAINNYA: "Lainnya",
}

export default function ProjectsPage() {
    const [projects, setProjects] = React.useState<Project[]>([])
    const [pagination, setPagination] = React.useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = React.useState(true)
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [objectTypeFilter, setObjectTypeFilter] = React.useState("all")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const fetchProjects = React.useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            })

            if (searchQuery) params.append("search", searchQuery)
            if (statusFilter !== "all") params.append("status", statusFilter)
            if (objectTypeFilter !== "all") params.append("objectType", objectTypeFilter)

            const response = await fetch(`/api/tracking-projects?${params}`)
            const data = await response.json()

            if (data.success) {
                setProjects(data.data)
                setPagination(data.pagination)
            } else {
                toast.error("Gagal memuat data proyek")
            }
        } catch (error) {
            console.error("Error fetching projects:", error)
            toast.error("Terjadi kesalahan saat memuat data")
        } finally {
            setLoading(false)
        }
    }, [pagination.page, pagination.limit, searchQuery, statusFilter, objectTypeFilter])

    React.useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }))
    }

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/tracking-projects/${projectToDelete.id}`, {
                method: "DELETE",
            })
            const data = await response.json()

            if (data.success) {
                toast.success("Proyek berhasil dihapus")
                fetchProjects()
            } else {
                toast.error(data.error || "Gagal menghapus proyek")
            }
        } catch (error) {
            console.error("Error deleting project:", error)
            toast.error("Terjadi kesalahan saat menghapus proyek")
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setProjectToDelete(null)
        }
    }

    const handleSearch = React.useMemo(() => {
        let timeout: NodeJS.Timeout
        return (value: string) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setSearchQuery(value)
                setPagination((prev) => ({ ...prev, page: 1 }))
            }, 500)
        }
    }, [])

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Daftar Proyek Tracking</h1>
                <p className="text-gray-600">
                    Kelola dan pantau seluruh data proyek tracking perusahaan untuk keperluan operasional dan logistik secara terpusat.
                </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari proyek..."
                            className="pl-9 w-[320px] bg-white"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value)
                            setPagination((prev) => ({ ...prev, page: 1 }))
                        }}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="VERIFIKASI_DOKUMEN">Verifikasi Dokumen</SelectItem>
                            <SelectItem value="INSPEKSI_LAPANGAN">Inspeksi Lapangan</SelectItem>
                            <SelectItem value="PROSES_REVIEW">Proses Review</SelectItem>
                            <SelectItem value="LAPORAN_FINAL">Laporan Final</SelectItem>
                            <SelectItem value="SELESAI">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={objectTypeFilter}
                        onValueChange={(value) => {
                            setObjectTypeFilter(value)
                            setPagination((prev) => ({ ...prev, page: 1 }))
                        }}
                    >
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="RUMAH_TINGGAL">Rumah Tinggal</SelectItem>
                            <SelectItem value="RUKO_KANTOR">Ruko / Kantor</SelectItem>
                            <SelectItem value="TANAH_KOSONG">Tanah Kosong</SelectItem>
                            <SelectItem value="GUDANG">Gudang</SelectItem>
                            <SelectItem value="APARTEMEN">Apartemen</SelectItem>
                            <SelectItem value="PABRIK">Pabrik</SelectItem>
                            <SelectItem value="LAINNYA">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/admin/tracking/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambahkan Proyek Baru
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border text-card-foreground shadow-sm bg-white">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Belum ada proyek</p>
                        <p className="text-sm">Mulai dengan menambahkan proyek baru</p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6 text-left">ID / Tracking Code</TableHead>
                                    <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6 text-left">Client / Pemohon</TableHead>
                                    <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6 text-left">Tipe Objek</TableHead>
                                    <TableHead className="w-[180px] font-semibold text-xs tracking-wider text-gray-500 uppercase px-6 text-left">Progress</TableHead>
                                    <TableHead className="font-semibold text-xs tracking-wider text-gray-500 uppercase px-6 text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => {
                                    const status = statusConfig[project.status] || {
                                        label: project.status,
                                        color: "bg-gray-500",
                                        textColor: "text-gray-600",
                                    }
                                    return (
                                        <TableRow key={project.id} className="hover:bg-gray-50 border-b">
                                            <TableCell className="py-5 px-6 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-900">{project.projectId}</span>
                                                    <Badge variant="outline" className="w-fit font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        {project.trackingCode}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{project.client.name}</span>
                                                    <span className="text-xs text-gray-500 truncate" title={project.address}>
                                                        {project.address}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top">
                                                <Badge variant="secondary" className="rounded-md font-normal text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase">
                                                    {objectTypeLabels[project.objectType] || project.objectType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top">
                                                <div className="w-full space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className={`font-semibold ${status.textColor}`}>
                                                            {status.label}
                                                        </span>
                                                        <span className="text-gray-500">{project.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${status.color}`}
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 px-6 align-top text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        title="Edit Data Proyek"
                                                    >
                                                        <Link href={`/admin/tracking/projects/${project.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                                                        title="Update Progress"
                                                    >
                                                        <Link href={`/admin/tracking/projects/${project.id}/update`}>
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(project)}
                                                        title="Hapus Proyek"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between px-4 py-4 border-t">
                            <div className="text-sm text-gray-500">
                                Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
                                {pagination.total} proyek
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={pagination.page <= 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pagination.page === pageNum ? "default" : "outline"}
                                            size="icon"
                                            className={`h-8 w-8 ${pagination.page === pageNum
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : ""
                                                }`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Proyek?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus proyek <strong>{projectToDelete?.projectId}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
