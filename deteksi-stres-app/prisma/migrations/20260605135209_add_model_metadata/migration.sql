/*
  Warnings:

  - You are about to drop the `ModelTraining` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ModelTraining";

-- CreateTable
CREATE TABLE "ModelMetadata" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelMetadata_pkey" PRIMARY KEY ("id")
);
