/*
  Warnings:

  - Added the required column `isActive` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
