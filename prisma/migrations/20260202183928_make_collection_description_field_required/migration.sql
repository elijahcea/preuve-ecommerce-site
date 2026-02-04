/*
  Warnings:

  - Made the column `description` on table `Collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "description" SET NOT NULL;
