/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "date" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "Record_habitId_date_key" ON "Record"("habitId", "date");
