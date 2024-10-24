-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "folders" (
    "folder_id" SERIAL NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "user_id" INTEGER,
    "parent_folder_id" INTEGER,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("folder_id")
);

-- CreateTable
CREATE TABLE "files" (
    "file_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "link" TEXT NOT NULL,
    "folder_id" INTEGER NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folders_user_id_key" ON "folders"("user_id");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "folders"("folder_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("folder_id") ON DELETE CASCADE ON UPDATE CASCADE;
