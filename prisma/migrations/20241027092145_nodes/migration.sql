/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('FILE', 'FOLDER');

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_parent_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_user_id_fkey";

-- DropTable
DROP TABLE "files";

-- DropTable
DROP TABLE "folders";

-- CreateTable
CREATE TABLE "nodes" (
    "node_id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "type" "NodeType" NOT NULL,
    "file_link" TEXT,
    "user_id" INTEGER,
    "parent_node_id" INTEGER,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("node_id")
);

-- CreateTable
CREATE TABLE "node_share_links" (
    "link_id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "shared_node_id" INTEGER NOT NULL,

    CONSTRAINT "node_share_links_pkey" PRIMARY KEY ("link_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nodes_user_id_key" ON "nodes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "node_share_links_shared_node_id_key" ON "node_share_links"("shared_node_id");

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parent_node_id_fkey" FOREIGN KEY ("parent_node_id") REFERENCES "nodes"("node_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_share_links" ADD CONSTRAINT "node_share_links_shared_node_id_fkey" FOREIGN KEY ("shared_node_id") REFERENCES "nodes"("node_id") ON DELETE RESTRICT ON UPDATE CASCADE;
