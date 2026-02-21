/*
  Warnings:

  - Added the required column `hasOnlyDefaultVariant` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `sku` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ProductVariant_sku_idx";

-- DropIndex
DROP INDEX "ProductVariant_sku_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "hasOnlyDefaultVariant" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "sku" SET NOT NULL;
