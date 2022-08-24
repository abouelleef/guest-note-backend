/*
  Warnings:

  - Added the required column `media` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "media" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_pic" SET DEFAULT 'default';
