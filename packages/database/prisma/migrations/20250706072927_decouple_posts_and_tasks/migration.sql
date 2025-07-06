/*
  Warnings:

  - Added the required column `providerId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_integrationId_fkey";

-- AlterTable
ALTER TABLE "Mention" ADD COLUMN     "providerId" INTEGER;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "providerId" INTEGER NOT NULL,
ALTER COLUMN "integrationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "providerId" INTEGER NOT NULL,
ALTER COLUMN "integrationId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Post_userId_providerId_idx" ON "Post"("userId", "providerId");

-- CreateIndex
CREATE INDEX "Post_providerId_createdAt_idx" ON "Post"("providerId", "createdAt");

-- CreateIndex
CREATE INDEX "Task_userId_providerId_idx" ON "Task"("userId", "providerId");

-- CreateIndex
CREATE INDEX "Task_providerId_createdAt_idx" ON "Task"("providerId", "createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
