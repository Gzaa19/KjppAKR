-- CreateEnum
CREATE TYPE "ClientCategory" AS ENUM ('BANK_BUMN_SWASTA', 'NON_BANK');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "category" "ClientCategory" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_category_idx" ON "clients"("category");

-- CreateIndex
CREATE INDEX "clients_isPublished_idx" ON "clients"("isPublished");

-- CreateIndex
CREATE INDEX "clients_sortOrder_idx" ON "clients"("sortOrder");
