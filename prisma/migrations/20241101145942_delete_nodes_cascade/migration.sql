-- DropForeignKey
ALTER TABLE "node_share_links" DROP CONSTRAINT "node_share_links_shared_node_id_fkey";

-- DropForeignKey
ALTER TABLE "node_share_links" DROP CONSTRAINT "node_share_links_user_id_fkey";

-- AddForeignKey
ALTER TABLE "node_share_links" ADD CONSTRAINT "node_share_links_shared_node_id_fkey" FOREIGN KEY ("shared_node_id") REFERENCES "nodes"("node_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_share_links" ADD CONSTRAINT "node_share_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
