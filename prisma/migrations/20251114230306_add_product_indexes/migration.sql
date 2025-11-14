-- CreateIndex
CREATE INDEX "Product_createdAt_id_idx" ON "Product"("createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
