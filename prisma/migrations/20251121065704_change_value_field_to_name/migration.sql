/*
  Warnings:

  - You are about to drop the column `value` on the `OptionValue` table. All the data in the column will be lost.
  - Added the required column `name` to the `OptionValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionValue" DROP COLUMN "value",
ADD COLUMN     "name" TEXT NOT NULL;
