/*
  Warnings:

  - You are about to drop the column `teamSlug` on the `Credit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `Credit` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Credit_teamSlug_key";

-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "teamSlug",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Credit_teamId_key" ON "Credit"("teamId");
