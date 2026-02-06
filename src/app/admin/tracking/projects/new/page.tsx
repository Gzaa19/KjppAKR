"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Building2,
    FolderOpen,
    MessageSquareText,
    Save,
    Loader2,
    CheckCircle2,
    Copy,
    ExternalLink
} from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Types
interface Client {
    id: string
    name: string
    address: string
    type: string
}

export default function NewProjectPage() {
    const router = useRouter()
    const [clients, setClients] = React.useState<Client[]>([])
    const [loading, setLoading] = React.useState(false)
    const [loadingClients, setLoadingClients] = React.useState(true)
    const [successDialogOpen, setSuccessDialogOpen] = React.useState(false)
    const [createdProject, setCreatedProject] = React.useState<{
        projectId: string
        trackingCode: string
    } | null>(null)

    // Form state
    const [formData, setFormData] = React.useState({
        proposalNo: "",
        clientId: "",
        objectType: "",
        reportType: "",
        branch: "",
        objective: "",
        address: "",
        initialMessage: "",
    })

    const [useCustomObjectType, setUseCustomObjectType] = React.useState(false)
    const [useCustomReportType, setUseCustomReportType] = React.useState(false)
    const [useCustomBranch, setUseCustomBranch] = React.useState(false)

    const handleObjectTypeChange = (value: string) => {
        if (value === "LAINNYA") {
            setUseCustomObjectType(true)
            setFormData((prev) => ({ ...prev, objectType: "" }))
        } else {
            setUseCustomObjectType(false)
            setFormData((prev) => ({ ...prev, objectType: value }))
        }
    }

    const handleReportTypeChange = (value: string) => {
        if (value === "LAINNYA") {
            setUseCustomReportType(true)
            setFormData((prev) => ({ ...prev, reportType: "" }))
        } else {
            setUseCustomReportType(false)
            setFormData((prev) => ({ ...prev, reportType: value }))
        }
    }

    const handleBranchChange = (value: string) => {
        if (value === "LAINNYA") {
            setUseCustomBranch(true)
            setFormData((prev) => ({ ...prev, branch: "" }))
        } else {
            setUseCustomBranch(false)
            setFormData((prev) => ({ ...prev, branch: value }))
        }
    }

    // Fetch clients on mount
    React.useEffect(() => {
        async function fetchClients() {
            try {
                const response = await fetch("/api/tracking-clients?limit=100")
                const data = await response.json()
                if (data.success) {
                    setClients(data.data)
                }
            } catch (error) {
                console.error("Error fetching clients:", error)
                toast.error("Gagal memuat data klien")
            } finally {
                setLoadingClients(false)
            }
        }
        fetchClients()
    }, [])

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.proposalNo || !formData.clientId || !formData.objectType || !formData.reportType || !formData.branch || !formData.objective || !formData.address) {
            toast.error("Semua field wajib diisi")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/tracking-projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                setCreatedProject({
                    projectId: data.data.projectId,
                    trackingCode: data.data.trackingCode,
                })
                setSuccessDialogOpen(true)
            } else {
                toast.error(data.error || "Gagal membuat proyek")
            }
        } catch (error) {
            console.error("Error creating project:", error)
            toast.error("Terjadi kesalahan saat membuat proyek")
        } finally {
            setLoading(false)
        }
    }

    // Auto-fill address when client is selected
    const handleClientChange = (clientId: string) => {
        setFormData((prev) => ({ ...prev, clientId }))
        const selectedClient = clients.find((c) => c.id === clientId)
        if (selectedClient && !formData.address) {
            // Only auto-fill if address is empty
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/tracking">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/tracking/projects">Proyek</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tambah Proyek Baru</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Buat Proyek Penilaian</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-900">
                        <Link href="/admin/tracking/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Card 1: Informasi Administrasi */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <FolderOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Informasi Administrasi</h2>
                            <p className="text-sm text-gray-500">Detail proposal dan identitas klien</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="proposal_no" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                No. Proposal <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="proposal_no"
                                placeholder="Contoh: PROP/AKR/2024/I/045"
                                className="h-11 bg-gray-50/50"
                                value={formData.proposalNo}
                                onChange={(e) => setFormData((prev) => ({ ...prev, proposalNo: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Nama Client <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.clientId}
                                onValueChange={handleClientChange}
                                disabled={loadingClients}
                            >
                                <SelectTrigger className="h-11 bg-gray-50/50">
                                    <SelectValue placeholder={loadingClients ? "Memuat..." : "Pilih Client..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.length === 0 ? (
                                        <SelectItem value="no-client" disabled>
                                            Tidak ada klien. Tambahkan klien terlebih dahulu.
                                        </SelectItem>
                                    ) : (
                                        clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {clients.length === 0 && !loadingClients && (
                                <p className="text-xs text-amber-600">
                                    <Link href="/admin/tracking/clients/new" className="underline">
                                        Klik di sini untuk menambahkan klien baru
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 2: Detail Objek Penilaian */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Detail Objek Penilaian</h2>
                            <p className="text-sm text-gray-500">Spesifikasi aset dan tujuan pekerjaan</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="object_type" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Jenis Objek <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={useCustomObjectType ? "LAINNYA" : formData.objectType}
                                    onValueChange={handleObjectTypeChange}
                                >
                                    <SelectTrigger className="h-11 bg-gray-50/50">
                                        <SelectValue placeholder="Pilih Jenis Objek..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RUMAH_TINGGAL">Rumah Tinggal</SelectItem>
                                        <SelectItem value="RUKO_KANTOR">Ruko / Kantor</SelectItem>
                                        <SelectItem value="TANAH_KOSONG">Tanah Kosong</SelectItem>
                                        <SelectItem value="GUDANG">Gudang</SelectItem>
                                        <SelectItem value="APARTEMEN">Apartemen</SelectItem>
                                        <SelectItem value="PABRIK">Pabrik</SelectItem>
                                        <SelectItem value="LAINNYA">Lainnya / Custom</SelectItem>
                                    </SelectContent>
                                </Select>

                                {useCustomObjectType && (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            placeholder="Masukkan jenis objek lainnya..."
                                            className="h-11 bg-gray-50/50"
                                            value={formData.objectType}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, objectType: e.target.value }))}
                                            required={useCustomObjectType}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="report_type" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Jenis Laporan <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={useCustomReportType ? "LAINNYA" : formData.reportType}
                                    onValueChange={handleReportTypeChange}
                                >
                                    <SelectTrigger className="h-11 bg-gray-50/50">
                                        <SelectValue placeholder="Pilih Jenis Laporan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SHORT_REPORT">Short Report</SelectItem>
                                        <SelectItem value="FULL_REPORT">Full Report</SelectItem>
                                        <SelectItem value="LAINNYA">Lainnya / Custom</SelectItem>
                                    </SelectContent>
                                </Select>

                                {useCustomReportType && (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            placeholder="Masukkan jenis laporan lainnya..."
                                            className="h-11 bg-gray-50/50"
                                            value={formData.reportType}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, reportType: e.target.value }))}
                                            required={useCustomReportType}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="objective" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Tujuan Penilaian <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="objective"
                                    placeholder="Contoh: Penjaminan Hutang / Kredit Bank"
                                    className="h-11 bg-gray-50/50"
                                    value={formData.objective}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, objective: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branch" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Cabang <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={useCustomBranch ? "LAINNYA" : formData.branch}
                                    onValueChange={handleBranchChange}
                                >
                                    <SelectTrigger className="h-11 bg-gray-50/50">
                                        <SelectValue placeholder="Pilih Cabang..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUSAT">Pusat (Jakarta)</SelectItem>
                                        <SelectItem value="BANDUNG">Bandung</SelectItem>
                                        <SelectItem value="SURABAYA">Surabaya</SelectItem>
                                        <SelectItem value="PALEMBANG">Palembang</SelectItem>
                                        <SelectItem value="LAINNYA">Lainnya / Custom</SelectItem>
                                    </SelectContent>
                                </Select>

                                {useCustomBranch && (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                        <Input
                                            placeholder="Masukkan cabang lainnya..."
                                            className="h-11 bg-gray-50/50"
                                            value={formData.branch}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, branch: e.target.value }))}
                                            required={useCustomBranch}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Alamat Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="address"
                            placeholder="Masukkan alamat lengkap lokasi properti..."
                            className="h-[132px] bg-gray-50/50 resize-none p-3"
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                            required
                        />
                    </div>
                </div>

                {/* Card 3: Diskusi Proyek */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <MessageSquareText className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Diskusi Proyek</h2>
                            <p className="text-sm text-gray-500">Mulai diskusi atau berikan instruksi awal kepada klien</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                            <p className="text-sm italic text-gray-500">
                                Belum ada diskusi dimulai. Anda dapat mengirimkan pesan pembuka di bawah ini.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pesan Pembuka (Opsional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Contoh: Selamat pagi, kami telah menerima aplikasi Anda. Mohon lengkapi dokumen berikut..."
                                className="min-h-[100px] bg-gray-50/50"
                                value={formData.initialMessage}
                                onChange={(e) => setFormData((prev) => ({ ...prev, initialMessage: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-12 w-32"
                        onClick={() => router.push("/admin/tracking/projects")}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-12 w-48 bg-blue-950 text-white hover:bg-blue-900"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Buat Proyek
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Success Dialog */}
            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Proyek Berhasil Dibuat!</DialogTitle>
                        <DialogDescription className="text-center">
                            Proyek penilaian baru telah berhasil dibuat. Berikan kode tracking berikut kepada klien untuk melacak status proyek.
                        </DialogDescription>
                    </DialogHeader>

                    {createdProject && (
                        <div className="space-y-4 py-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Proyek</p>
                                    <p className="font-semibold text-gray-900">{createdProject.projectId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kode Tracking</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-xl font-bold font-mono text-center tracking-wider">
                                            {createdProject.trackingCode}
                                        </code>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => {
                                                navigator.clipboard.writeText(createdProject.trackingCode)
                                                toast.success("Kode tracking berhasil disalin!")
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm text-amber-800">
                                    <strong>Penting:</strong> Klien dapat melacak status proyek di halaman{" "}
                                    <Link href="/lacak-status" target="_blank" className="underline inline-flex items-center gap-1">
                                        Lacak Status
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>{" "}
                                    menggunakan kode tracking di atas.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSuccessDialogOpen(false)
                                // Reset form
                                setFormData({
                                    proposalNo: "",
                                    clientId: "",
                                    objectType: "",
                                    reportType: "",
                                    branch: "",
                                    objective: "",
                                    address: "",
                                    initialMessage: "",
                                })
                                setCreatedProject(null)
                            }}
                        >
                            Buat Proyek Lainnya
                        </Button>
                        <Button
                            type="button"
                            className="bg-blue-950 hover:bg-blue-900"
                            onClick={() => {
                                setSuccessDialogOpen(false)
                                router.push("/admin/tracking/projects")
                            }}
                        >
                            Lihat Daftar Proyek
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
