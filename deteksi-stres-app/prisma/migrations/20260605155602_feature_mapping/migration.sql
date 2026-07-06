/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FeatureMapping` table. All the data in the column will be lost.
  - You are about to drop the column `questionEnd` on the `FeatureMapping` table. All the data in the column will be lost.
  - You are about to drop the column `questionStart` on the `FeatureMapping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeatureMapping" DROP COLUMN "createdAt",
DROP COLUMN "questionEnd",
DROP COLUMN "questionStart";
