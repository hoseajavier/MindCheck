/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `DailyMood` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `DailyMood` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyMood_userId_createdAt_key";

-- AlterTable
ALTER TABLE "DailyMood" ADD COLUMN     "date" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyMood_userId_date_key" ON "DailyMood"("userId", "date");
