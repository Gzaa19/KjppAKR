"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
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
    RefreshCw,
    Save,
    Loader2,
    CheckCircle2,
    Copy
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
import { Badge } from "@/components/ui/badge"

// Types
interface Client {
    id: string
    name: string
    address: string
    type: string
}

interface Project {
    id: string
    projectId: string
    trackingCode: string
    proposalNo: string
    clientId: string
    client: Client
    objectType: string
    objective: string
    address: string
    status: string
    progress: number
    initialMessage: string | null
    createdAt: string
    updatedAt: string
    completedAt: string | null
}

// Status config
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    VERIFIKASI_DOKUMEN: { label: "Verifikasi Dokumen", color: "text-red-600", bgColor: "bg-red-100" },
    INSPEKSI_LAPANGAN: { label: "Inspeksi Lapangan", color: "text-blue-600", bgColor: "bg-blue-100" },
    PROSES_REVIEW: { label: "Proses Review", color: "text-orange-600", bgColor: "bg-orange-100" },
    LAPORAN_FINAL: { label: "Laporan Final", color: "text-green-600", bgColor: "bg-green-100" },
    SELESAI: { label: "Selesai", color: "text-emerald-700", bgColor: "bg-emerald-100" },
}

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const projectId = params.id as string

    const [project, setProject] = React.useState<Project | null>(null)
    const [clients, setClients] = React.useState<Client[]>([])
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [loadingClients, setLoadingClients] = React.useState(true)

    // Form state
    const [formData, setFormData] = React.useState({
        proposalNo: "",
        clientId: "",
        objectType: "",
        reportType: "",
        branch: "",
        objective: "",
        address: "",
        status: "",
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

    // Fetch project data
    React.useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`/api/tracking-projects/${projectId}`)
                const data = await response.json()

                if (data.success) {
                    setProject(data.data)
                    setFormData({
                        proposalNo: data.data.proposalNo,
                        clientId: data.data.clientId,
                        objectType: data.data.objectType,
                        reportType: data.data.reportType,
                        branch: data.data.branch,
                        objective: data.data.objective,
                        address: data.data.address,
                        status: data.data.status,
                        initialMessage: data.data.initialMessage || "",
                    })

                    // Check if values are custom
                    const standardTypes = ["RUMAH_TINGGAL", "RUKO_KANTOR", "TANAH_KOSONG", "GUDANG", "APARTEMEN", "PABRIK"];
                    const standardReportTypes = ["SHORT_REPORT", "FULL_REPORT"];
                    const standardBranches = ["PUSAT", "BANDUNG", "SURABAYA", "PALEMBANG"];

                    if (data.data.objectType && !standardTypes.includes(data.data.objectType)) {
                        setUseCustomObjectType(true);
                    }
                    if (data.data.reportType && !standardReportTypes.includes(data.data.reportType)) {
                        setUseCustomReportType(true);
                    }
                    if (data.data.branch && !standardBranches.includes(data.data.branch)) {
                        setUseCustomBranch(true);
                    }
                } else {
                    toast.error("Proyek tidak ditemukan")
                    router.push("/admin/tracking/projects")
                }
            } catch (error) {
                console.error("Error fetching project:", error)
                toast.error("Gagal memuat data proyek")
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [projectId, router])

    // Fetch clients
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
            } finally {
                setLoadingClients(false)
            }
        }
        fetchClients()
    }, [])

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.proposalNo || !formData.clientId || !formData.objectType || !formData.objective || !formData.address) {
            toast.error("Semua field wajib diisi")
            return
        }

        setSaving(true)
        try {
            const response = await fetch(`/api/tracking-projects/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Proyek berhasil diupdate")
                router.push("/admin/tracking/projects")
            } else {
                toast.error(data.error || "Gagal mengupdate proyek")
            }
        } catch (error) {
            console.error("Error updating project:", error)
            toast.error("Terjadi kesalahan saat mengupdate proyek")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!project) {
        return null
    }

    const currentStatus = statusConfig[formData.status] || statusConfig.VERIFIKASI_DOKUMEN

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
                                <BreadcrumbPage>Edit {project.projectId}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Edit Proyek: {project.projectId}
                        </h1>
                        <Badge className={`${currentStatus.bgColor} ${currentStatus.color} hover:${currentStatus.bgColor}`}>
                            {currentStatus.label}
                        </Badge>
                    </div>
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
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Kode Tracking <span className="text-gray-400 font-normal normal-case">(Read-only)</span>
                            </Label>
                            <div className="flex gap-2">
                                <code className="flex-1 h-11 flex items-center px-3 rounded-md border border-input bg-gray-100 text-sm font-mono font-medium text-gray-900">
                                    {project.trackingCode}
                                </code>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 shrink-0"
                                    onClick={() => {
                                        navigator.clipboard.writeText(project.trackingCode)
                                        toast.success("Kode tracking berhasil disalin!")
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Nama Client <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.clientId}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, clientId: value }))}
                                disabled={loadingClients}
                            >
                                <SelectTrigger className="h-11 bg-gray-50/50">
                                    <SelectValue placeholder={loadingClients ? "Memuat..." : "Pilih Client..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            className="h-[597px] bg-gray-50/50 resize-none p-3"
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-12 w-32"
                        onClick={() => router.push("/admin/tracking/projects")}
                        disabled={saving}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-12 w-48 bg-blue-950 text-white hover:bg-blue-900"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
