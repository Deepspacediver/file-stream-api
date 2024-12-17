/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `node_share_links` table. All the data in the column will be lost.
  - You are about to drop the column `linkHash` on the `node_share_links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link_hash]` on the table `node_share_links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiry_date` to the `node_share_links` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_hash` to the `node_share_links` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "node_share_links_linkHash_key";

-- AlterTable
ALTER TABLE "node_share_links" DROP COLUMN "expiryDate",
DROP COLUMN "linkHash",
ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "link_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "node_share_links_link_hash_key" ON "node_share_links"("link_hash");
