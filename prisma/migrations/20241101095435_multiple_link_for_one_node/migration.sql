/*
  Warnings:

  - Added the required column `user_id` to the `node_share_links` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "node_share_links_shared_node_id_key";

-- AlterTable
ALTER TABLE "node_share_links" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "node_share_links" ADD CONSTRAINT "node_share_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
