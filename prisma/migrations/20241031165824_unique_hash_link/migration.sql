/*
  Warnings:

  - A unique constraint covering the columns `[linkHash]` on the table `node_share_links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "node_share_links_linkHash_key" ON "node_share_links"("linkHash");
