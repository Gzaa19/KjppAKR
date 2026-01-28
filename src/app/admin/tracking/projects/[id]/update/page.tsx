"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Folder,
    Lightbulb,
    Save,
    CheckCircle2,
    Circle,
    Loader2,
    ChevronDown,
    ChevronRight
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

interface SubStep {
    id: string
    subStepId: string
    subStepName: string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    startDate: string | null
    endDate: string | null
}

interface Client {
    id: string
    name: string
    address: string
}

interface Project {
    id: string
    projectId: string
    trackingCode: string
    client: Client
    address: string
    progress: number
    projectProgresses: SubStep[]
}

interface MainStage {
    id: number
    name: string
    subSteps: SubStep[]
    expanded: boolean
}

const STAGE_CONFIG = [
    { id: 1, name: "Persiapan & Legalitas", subStepIds: ["1a", "1b", "1c"] },
    { id: 2, name: "Inspeksi Lapangan", subStepIds: ["2a", "2b"] },
    { id: 3, name: "Analisis & Penilaian", subStepIds: ["3a", "3b"] },
    { id: 4, name: "Draft & Konfirmasi", subStepIds: ["4a", "4b"] },
    { id: 5, name: "Laporan Final", subStepIds: ["5a", "5b"] },
]

export default function UpdateProgressPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const [project, setProject] = React.useState<Project | null>(null)
    const [stages, setStages] = React.useState<MainStage[]>([])
    const [notes, setNotes] = React.useState("")
    const [notifyClient, setNotifyClient] = React.useState(true)
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [savingProgress, setSavingProgress] = React.useState(false)

    React.useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`/api/tracking-projects/${projectId}/progress`)
                const data = await response.json()

                if (data.success) {
                    setProject(data.data)
                    setNotes(data.data.initialMessage || "")

                    const groupedStages: MainStage[] = STAGE_CONFIG.map(config => ({
                        id: config.id,
                        name: config.name,
                        expanded: true,
                        subSteps: data.data.projectProgresses
                            .filter((p: SubStep) => config.subStepIds.includes(p.subStepId))
                            .map((p: SubStep) => ({
                                ...p,
                                id: p.subStepId,
                                startDate: p.startDate ? p.startDate.split('T')[0] : null,
                                endDate: p.endDate ? p.endDate.split('T')[0] : null,
                            }))
                    }))

                    setStages(groupedStages)
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

    const toggleStage = (stageId: number) => {
        setStages(prev => prev.map(stage =>
            stage.id === stageId ? { ...stage, expanded: !stage.expanded } : stage
        ))
    }

    // Auto-save progress to API
    const saveProgressToAPI = async (updatedStages: MainStage[]) => {
        if (!project) return
        
        setSavingProgress(true)
        try {
            const allSubSteps = updatedStages.flatMap(s => s.subSteps)
            const progressData = allSubSteps.map(sub => ({
                subStepId: sub.subStepId,
                status: sub.status,
                startDate: sub.startDate,
                endDate: sub.endDate,
            }))

            const response = await fetch(`/api/tracking-projects/${projectId}/progress`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    progress: progressData,
                })
            })

            const data = await response.json()

            if (data.success) {
                // Update project progress from response
                if (data.data) {
                    setProject(data.data)
                }
                toast.success("Progress berhasil diperbarui", { duration: 2000 })
            } else {
                toast.error(data.error || "Gagal menyimpan progress")
            }
        } catch (error) {
            console.error("Error saving progress:", error)
            toast.error("Terjadi kesalahan saat menyimpan progress")
        } finally {
            setSavingProgress(false)
        }
    }

    const updateSubStepStatus = (stageId: number, subStepId: string, newStatus: SubStep["status"]) => {
        const today = new Date().toISOString().split('T')[0]

        const updatedStages = stages.map(stage => {
            if (stage.id === stageId) {
                return {
                    ...stage,
                    subSteps: stage.subSteps.map(sub => {
                        if (sub.subStepId === subStepId) {
                            return {
                                ...sub,
                                status: newStatus,
                                startDate: newStatus !== "PENDING" && !sub.startDate ? today : sub.startDate,
                                endDate: newStatus === "COMPLETED" ? today : (newStatus === "PENDING" ? null : sub.endDate)
                            }
                        }
                        return sub
                    })
                }
            }
            return stage
        })

        setStages(updatedStages)
        // Auto-save progress when status changes
        saveProgressToAPI(updatedStages)
    }

    const updateSubStepDate = (stageId: number, subStepId: string, field: "startDate" | "endDate", value: string) => {
        const updatedStages = stages.map(stage => {
            if (stage.id === stageId) {
                return {
                    ...stage,
                    subSteps: stage.subSteps.map(sub => {
                        if (sub.subStepId === subStepId) {
                            return { ...sub, [field]: value || null }
                        }
                        return sub
                    })
                }
            }
            return stage
        })

        setStages(updatedStages)
        // Auto-save progress when date changes
        saveProgressToAPI(updatedStages)
    }

    const getStageProgress = (stage: MainStage) => {
        const completed = stage.subSteps.filter(s => s.status === "COMPLETED").length
        return { completed, total: stage.subSteps.length }
    }

    const getStageStatus = (stage: MainStage) => {
        const allCompleted = stage.subSteps.every(s => s.status === "COMPLETED")
        const anyInProgress = stage.subSteps.some(s => s.status === "IN_PROGRESS")
        const anyCompleted = stage.subSteps.some(s => s.status === "COMPLETED")

        if (allCompleted) return "completed"
        if (anyInProgress || anyCompleted) return "in-progress"
        return "pending"
    }

    const getOverallProgress = () => {
        const allSubSteps = stages.flatMap(s => s.subSteps)
        if (allSubSteps.length === 0) return { completed: 0, total: 0, percentage: 0 }
        const completed = allSubSteps.filter(s => s.status === "COMPLETED").length
        return { completed, total: allSubSteps.length, percentage: Math.round((completed / allSubSteps.length) * 100) }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const allSubSteps = stages.flatMap(s => s.subSteps)
            const progressData = allSubSteps.map(sub => ({
                subStepId: sub.subStepId,
                status: sub.status,
                startDate: sub.startDate,
                endDate: sub.endDate,
            }))

            const response = await fetch(`/api/tracking-projects/${projectId}/progress`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    progress: progressData,
                    notes: notes,
                })
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Pesan berhasil disimpan")
            } else {
                toast.error(data.error || "Gagal menyimpan pesan")
            }
        } catch (error) {
            console.error("Error saving notes:", error)
            toast.error("Terjadi kesalahan saat menyimpan pesan")
        } finally {
            setSaving(false)
        }
    }

    const overallProgress = getOverallProgress()

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

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
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
                                <BreadcrumbPage>Update Progress</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Perbarui Progress Proyek</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-900">
                        <Link href="/admin/tracking/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke List
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100/80 text-gray-600">
                            <Folder className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg text-gray-900">{project.projectId}</span>
                                <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {project.trackingCode}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{project.client.name} - {project.address}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 border-l pl-8 border-gray-100">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Progress Keseluruhan</p>
                                {savingProgress && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span className="text-[10px]">Menyimpan...</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${overallProgress.percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    {overallProgress.completed}/{overallProgress.total} ({overallProgress.percentage}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 pb-4 border-b bg-gray-50/50">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tahapan Progress Internal</h2>
                    <p className="text-xs text-gray-500 mt-1">Kelola progress setiap kegiatan internal proyek</p>
                </div>

                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <div className="col-span-5">Tahapan / Kegiatan</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Tanggal Mulai</div>
                    <div className="col-span-2">Tanggal Selesai</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-100">
                    {stages.map((stage) => {
                        const stageStatus = getStageStatus(stage)
                        const stageProgress = getStageProgress(stage)

                        return (
                            <div key={stage.id}>
                                <div
                                    className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${stageStatus === "completed" ? "bg-emerald-50/30" :
                                        stageStatus === "in-progress" ? "bg-blue-50/30" : "bg-white"
                                        }`}
                                    onClick={() => toggleStage(stage.id)}
                                >
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="text-gray-400">
                                            {stage.expanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${stageStatus === "completed" ? "bg-emerald-100 text-emerald-700" :
                                            stageStatus === "in-progress" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-500"
                                            }`}>
                                            {stage.id}
                                        </div>
                                        <span className="font-semibold text-gray-900">{stage.name}</span>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <Badge className={`text-xs ${stageStatus === "completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                                            stageStatus === "in-progress" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                                "bg-gray-100 text-gray-500 hover:bg-gray-100"
                                            }`}>
                                            {stageStatus === "completed" ? "Selesai" :
                                                stageStatus === "in-progress" ? "Sedang Proses" : "Belum Mulai"}
                                        </Badge>
                                    </div>
                                    <div className="col-span-4 flex items-center">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="font-medium">{stageProgress.completed}/{stageProgress.total}</span>
                                            <span>kegiatan selesai</span>
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end">
                                        {stageStatus === "completed" && (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        )}
                                        {stageStatus === "in-progress" && (
                                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                        )}
                                    </div>
                                </div>

                                {stage.expanded && (
                                    <div className="bg-gray-50/30">
                                        {stage.subSteps.map((subStep) => (
                                            <div
                                                key={subStep.subStepId}
                                                className={`grid grid-cols-12 gap-4 px-6 py-3 border-t border-gray-100 ${subStep.status === "COMPLETED" ? "bg-emerald-50/20" :
                                                    subStep.status === "IN_PROGRESS" ? "bg-blue-50/20" : ""
                                                    }`}
                                            >
                                                <div className="col-span-5 flex items-center gap-3 pl-14">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${subStep.status === "COMPLETED" ? "bg-emerald-500" :
                                                        subStep.status === "IN_PROGRESS" ? "bg-blue-500" :
                                                            "bg-gray-300"
                                                        }`} />
                                                    <span className={`text-sm ${subStep.status === "PENDING" ? "text-gray-400" : "text-gray-700"
                                                        }`}>
                                                        {subStep.subStepName}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <Select
                                                        value={subStep.status}
                                                        onValueChange={(value) => updateSubStepStatus(stage.id, subStep.subStepId, value as SubStep["status"])}
                                                    >
                                                        <SelectTrigger className={`h-8 text-xs ${subStep.status === "COMPLETED" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                                            subStep.status === "IN_PROGRESS" ? "bg-blue-50 border-blue-200 text-blue-600" :
                                                                "bg-gray-50 border-gray-200 text-gray-400"
                                                            }`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PENDING">
                                                                <div className="flex items-center gap-2">
                                                                    <Circle className="h-3 w-3 text-gray-400" />
                                                                    Belum Mulai
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="IN_PROGRESS">
                                                                <div className="flex items-center gap-2">
                                                                    <Loader2 className="h-3 w-3 text-blue-600" />
                                                                    Sedang Proses
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="COMPLETED">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                    Selesai
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-2">
                                                    <Input
                                                        type="date"
                                                        value={subStep.startDate || ""}
                                                        onChange={(e) => updateSubStepDate(stage.id, subStep.subStepId, "startDate", e.target.value)}
                                                        className={`h-8 text-xs ${subStep.status === "PENDING"
                                                            ? "bg-gray-50 border-gray-100 text-gray-400"
                                                            : "bg-white border-gray-200 text-gray-700"
                                                            }`}
                                                        disabled={subStep.status === "PENDING"}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Input
                                                        type="date"
                                                        value={subStep.endDate || ""}
                                                        onChange={(e) => updateSubStepDate(stage.id, subStep.subStepId, "endDate", e.target.value)}
                                                        className={`h-8 text-xs ${subStep.status === "PENDING"
                                                            ? "bg-gray-50 border-gray-100 text-gray-400"
                                                            : "bg-white border-gray-200 text-gray-700"
                                                            }`}
                                                        disabled={subStep.status === "PENDING"}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex items-center justify-end">
                                                    {subStep.status === "COMPLETED" && (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-red-600">
                        <div className="h-0.5 w-3 bg-red-600 rounded-full"></div>
                        <div className="h-0.5 w-1.5 bg-red-600 rounded-full"></div>
                        <h2 className="text-sm font-bold text-gray-900 ml-1">Catatan Admin</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pesan Untuk Klien</Label>
                            <Textarea
                                className="min-h-[100px] resize-none bg-white text-sm"
                                placeholder="Tulis pesan untuk klien..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="notify"
                                    checked={notifyClient}
                                    onCheckedChange={setNotifyClient}
                                    className="data-[state=checked]:bg-red-500"
                                />
                                <Label htmlFor="notify" className="text-sm font-medium text-gray-700">Kirim Notifikasi ke Klien</Label>
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-red-600 hover:bg-red-700 text-white h-10 font-medium px-6"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Pesan
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 h-fit">
                    <div className="flex gap-3">
                        <div className="mt-0.5 text-blue-600">
                            <Lightbulb className="h-5 w-5 fill-current" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-blue-900">Tips Penggunaan</h3>
                            <ul className="text-xs text-blue-700 leading-relaxed space-y-1">
                                <li>• Klik nama <strong>tahapan utama</strong> untuk expand/collapse</li>
                                <li>• Ubah <strong>status</strong> untuk memperbarui progress kegiatan (otomatis tersimpan)</li>
                                <li>• <strong>Tanggal mulai</strong> otomatis terisi saat status berubah</li>
                                <li>• <strong>Tanggal selesai</strong> otomatis terisi saat status menjadi Selesai</li>
                                <li>• Klik <strong>Simpan Pesan</strong> untuk menyimpan catatan admin</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
