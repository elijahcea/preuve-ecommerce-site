/*
  Warnings:

  - You are about to drop the column `isAvailableForSale` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailableForSale` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isAvailableForSale",
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "isAvailableForSale";
