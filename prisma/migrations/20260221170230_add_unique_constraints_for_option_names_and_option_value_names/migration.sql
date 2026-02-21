/*
  Warnings:

  - A unique constraint covering the columns `[name,productId]` on the table `ProductOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,productOptionId]` on the table `ProductOptionValue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductOptionValue_productOptionId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_name_productId_key" ON "ProductOption"("name", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOptionValue_name_productOptionId_key" ON "ProductOptionValue"("name", "productOptionId");
