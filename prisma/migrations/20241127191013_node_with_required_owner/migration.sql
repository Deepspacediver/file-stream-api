/*
  Warnings:

  - Made the column `user_id` on table `nodes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "nodes" ALTER COLUMN "user_id" SET NOT NULL;
