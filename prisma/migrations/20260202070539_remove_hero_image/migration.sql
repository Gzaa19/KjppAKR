/*
  Warnings:

  - You are about to drop the `hero_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SekapurSirihImageType" AS ENUM ('MANAGING_PARTNER', 'TEAM_PHOTO');

-- DropTable
DROP TABLE "hero_images";

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sekapur_sirih_images" (
    "id" TEXT NOT NULL,
    "imageType" "SekapurSirihImageType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "managingPartnerName" TEXT,
    "managingPartnerTitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sekapur_sirih_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "sekapur_sirih_images_imageType_idx" ON "sekapur_sirih_images"("imageType");

-- CreateIndex
CREATE INDEX "sekapur_sirih_images_isActive_idx" ON "sekapur_sirih_images"("isActive");
