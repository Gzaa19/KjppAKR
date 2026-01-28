/*
  Warnings:

  - You are about to drop the column `category` on the `clients` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('CORPORATE', 'PERORANGAN', 'SME', 'INSTANSI');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('VERIFIKASI_DOKUMEN', 'INSPEKSI_LAPANGAN', 'PROSES_REVIEW', 'LAPORAN_FINAL', 'SELESAI');

-- CreateEnum
CREATE TYPE "PropertyObjectType" AS ENUM ('RUMAH_TINGGAL', 'RUKO_KANTOR', 'TANAH_KOSONG', 'GUDANG', 'APARTEMEN', 'PABRIK', 'LAINNYA');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- DropIndex
DROP INDEX "clients_category_idx";

-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ClientCategory";

-- CreateTable
CREATE TABLE "client_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "isMappiCert" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "address" TEXT NOT NULL,
    "picName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_projects" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "proposalNo" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "objectType" "PropertyObjectType" NOT NULL,
    "objective" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'VERIFIKASI_DOKUMEN',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "initialMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tracking_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_progress" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "stageId" INTEGER NOT NULL,
    "stageName" TEXT NOT NULL,
    "subStepId" TEXT NOT NULL,
    "subStepName" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_categories_name_key" ON "client_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_categories_slug_key" ON "client_categories"("slug");

-- CreateIndex
CREATE INDEX "client_categories_sortOrder_idx" ON "client_categories"("sortOrder");

-- CreateIndex
CREATE INDEX "client_categories_isActive_idx" ON "client_categories"("isActive");

-- CreateIndex
CREATE INDEX "management_teams_sortOrder_idx" ON "management_teams"("sortOrder");

-- CreateIndex
CREATE INDEX "hero_images_sortOrder_idx" ON "hero_images"("sortOrder");

-- CreateIndex
CREATE INDEX "hero_images_isActive_idx" ON "hero_images"("isActive");

-- CreateIndex
CREATE INDEX "client_contacts_type_idx" ON "client_contacts"("type");

-- CreateIndex
CREATE INDEX "client_contacts_createdAt_idx" ON "client_contacts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_projects_projectId_key" ON "tracking_projects"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_projects_trackingCode_key" ON "tracking_projects"("trackingCode");

-- CreateIndex
CREATE INDEX "tracking_projects_clientId_idx" ON "tracking_projects"("clientId");

-- CreateIndex
CREATE INDEX "tracking_projects_status_idx" ON "tracking_projects"("status");

-- CreateIndex
CREATE INDEX "tracking_projects_createdAt_idx" ON "tracking_projects"("createdAt");

-- CreateIndex
CREATE INDEX "tracking_projects_trackingCode_idx" ON "tracking_projects"("trackingCode");

-- CreateIndex
CREATE INDEX "project_progress_projectId_idx" ON "project_progress"("projectId");

-- CreateIndex
CREATE INDEX "project_progress_status_idx" ON "project_progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "project_progress_projectId_subStepId_key" ON "project_progress"("projectId", "subStepId");

-- CreateIndex
CREATE INDEX "albums_sortOrder_idx" ON "albums"("sortOrder");

-- CreateIndex
CREATE INDEX "clients_categoryId_idx" ON "clients"("categoryId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "client_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_projects" ADD CONSTRAINT "tracking_projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_progress" ADD CONSTRAINT "project_progress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tracking_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
