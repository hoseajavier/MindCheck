/*
  Warnings:

  - Changed the type of `answers` on the `TestResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB NOT NULL;
