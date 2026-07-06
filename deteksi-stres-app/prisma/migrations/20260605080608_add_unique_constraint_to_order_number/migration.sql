/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Question_orderNumber_key" ON "Question"("orderNumber");
