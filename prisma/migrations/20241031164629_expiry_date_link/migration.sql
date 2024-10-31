/*
  Warnings:

  - Added the required column `expiryDate` to the `node_share_links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "node_share_links" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;
