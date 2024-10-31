/*
  Warnings:

  - You are about to drop the column `link` on the `node_share_links` table. All the data in the column will be lost.
  - Added the required column `linkHash` to the `node_share_links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "node_share_links" DROP COLUMN "link",
ADD COLUMN     "linkHash" TEXT NOT NULL;
