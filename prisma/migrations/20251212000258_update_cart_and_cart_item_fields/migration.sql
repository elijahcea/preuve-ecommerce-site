/*
  Warnings:

  - You are about to drop the column `subtotalCost` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalTaxAmount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "subtotalCost",
DROP COLUMN "totalCost",
DROP COLUMN "totalQuantity",
DROP COLUMN "totalTaxAmount";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "totalCost",
ALTER COLUMN "quantity" DROP DEFAULT;
