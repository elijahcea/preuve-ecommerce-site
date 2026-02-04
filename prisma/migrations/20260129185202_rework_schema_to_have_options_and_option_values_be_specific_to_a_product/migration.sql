/*
  Warnings:

  - You are about to drop the column `optionValueId` on the `ProductOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductOptionValue` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OptionValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantOption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productOptionId,slug]` on the table `ProductOptionValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ProductOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `ProductOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productOptionId` to the `ProductOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ProductOptionValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryQuantity` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OptionValue" DROP CONSTRAINT "OptionValue_optionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOptionValue" DROP CONSTRAINT "ProductOptionValue_optionValueId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOptionValue" DROP CONSTRAINT "ProductOptionValue_productId_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_optionValueId_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_variantId_fkey";

-- DropIndex
DROP INDEX "ProductOptionValue_optionValueId_idx";

-- DropIndex
DROP INDEX "ProductOptionValue_productId_idx";

-- DropIndex
DROP INDEX "ProductOptionValue_productId_optionValueId_key";

-- AlterTable
ALTER TABLE "ProductOptionValue" DROP COLUMN "optionValueId",
DROP COLUMN "productId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "productOptionId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "stock",
ADD COLUMN     "inventoryQuantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Option";

-- DropTable
DROP TABLE "OptionValue";

-- DropTable
DROP TABLE "VariantOption";

-- CreateTable
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductOptionValueToProductVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductOptionValueToProductVariant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductOptionValueToProductVariant_B_index" ON "_ProductOptionValueToProductVariant"("B");

-- CreateIndex
CREATE INDEX "ProductOptionValue_productOptionId_idx" ON "ProductOptionValue"("productOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOptionValue_productOptionId_slug_key" ON "ProductOptionValue"("productOptionId", "slug");

-- AddForeignKey
ALTER TABLE "ProductOptionValue" ADD CONSTRAINT "ProductOptionValue_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductOptionValueToProductVariant" ADD CONSTRAINT "_ProductOptionValueToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductOptionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductOptionValueToProductVariant" ADD CONSTRAINT "_ProductOptionValueToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
