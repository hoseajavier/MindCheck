/*
  Warnings:

  - Added the required column `category` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('SNORING_RATE', 'RESPIRATION_RATE', 'BODY_TEMPERATURE', 'LIMB_MOVEMENT', 'BLOOD_OXYGEN', 'EYE_MOVEMENT', 'SLEEPING_HOURS', 'HEART_RATE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "category" "QuestionCategory" NOT NULL;
