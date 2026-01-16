import { z } from "zod";

// Enum values for validation
export const projectStatusValues = [
    "VERIFIKASI_DOKUMEN",
    "INSPEKSI_LAPANGAN",
    "PROSES_REVIEW",
    "LAPORAN_FINAL",
    "SELESAI",
] as const;

export const propertyObjectTypeValues = [
    "RUMAH_TINGGAL",
    "RUKO_KANTOR",
    "TANAH_KOSONG",
    "GUDANG",
    "APARTEMEN",
    "PABRIK",
    "LAINNYA",
] as const;

export const progressStatusValues = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

// Create Project Schema
export const createProjectSchema = z.object({
    proposalNo: z
        .string()
        .min(1, "Nomor proposal wajib diisi")
        .max(100, "Nomor proposal maksimal 100 karakter"),
    clientId: z.string().min(1, "Client wajib dipilih"),
    objectType: z.enum(propertyObjectTypeValues, {
        message: "Tipe objek tidak valid",
    }),
    objective: z
        .string()
        .min(3, "Tujuan penilaian minimal 3 karakter")
        .max(500, "Tujuan penilaian maksimal 500 karakter"),
    address: z
        .string()
        .min(10, "Alamat minimal 10 karakter")
        .max(1000, "Alamat maksimal 1000 karakter"),
    initialMessage: z.string().max(2000, "Pesan awal maksimal 2000 karakter").optional().nullable(),
});

// Update Project Schema
export const updateProjectSchema = z.object({
    proposalNo: z
        .string()
        .min(1, "Nomor proposal wajib diisi")
        .max(100, "Nomor proposal maksimal 100 karakter")
        .optional(),
    clientId: z.string().min(1, "Client wajib dipilih").optional(),
    objectType: z
        .enum(propertyObjectTypeValues, {
            message: "Tipe objek tidak valid",
        })
        .optional(),
    objective: z
        .string()
        .min(3, "Tujuan penilaian minimal 3 karakter")
        .max(500, "Tujuan penilaian maksimal 500 karakter")
        .optional(),
    address: z
        .string()
        .min(10, "Alamat minimal 10 karakter")
        .max(1000, "Alamat maksimal 1000 karakter")
        .optional(),
    initialMessage: z.string().max(2000, "Pesan awal maksimal 2000 karakter").optional().nullable(),
    status: z
        .enum(projectStatusValues, {
            message: "Status tidak valid",
        })
        .optional(),
    progress: z.number().int().min(0).max(100, "Progress harus antara 0-100").optional(),
});

// Update Project Progress Schema
export const updateProjectProgressSchema = z.object({
    stageId: z.number().int().min(1).max(5, "Stage ID harus antara 1-5"),
    stageName: z.string().min(1, "Nama stage wajib diisi").max(100, "Nama stage maksimal 100 karakter"),
    subStepId: z.string().min(1, "Sub-step ID wajib diisi").max(10, "Sub-step ID maksimal 10 karakter"),
    subStepName: z
        .string()
        .min(1, "Nama sub-step wajib diisi")
        .max(150, "Nama sub-step maksimal 150 karakter"),
    status: z.enum(progressStatusValues, {
        message: "Status progress tidak valid",
    }),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
});

// Bulk update progress status
export const bulkUpdateProgressSchema = z.object({
    progressUpdates: z.array(
        z.object({
            subStepId: z.string().min(1),
            status: z.enum(progressStatusValues),
            startDate: z.date().optional().nullable(),
            endDate: z.date().optional().nullable(),
        })
    ),
});

// Filter/Search Schema
export const projectFilterSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    status: z.enum([...projectStatusValues, "all" as const]).optional(),
    objectType: z.enum([...propertyObjectTypeValues, "all" as const]).optional(),
});

// Export types
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectProgressInput = z.infer<typeof updateProjectProgressSchema>;
export type BulkUpdateProgressInput = z.infer<typeof bulkUpdateProgressSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
export type ProjectStatus = (typeof projectStatusValues)[number];
export type PropertyObjectType = (typeof propertyObjectTypeValues)[number];
export type ProgressStatus = (typeof progressStatusValues)[number];
