/*
  Warnings:

  - You are about to drop the column `title` on the `exams` table. All the data in the column will be lost.
  - Added the required column `lectureId` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_uploaderId_fkey";

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "title",
ADD COLUMN     "lectureId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "lectures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "lectures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lectures_name_key" ON "lectures"("name");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
