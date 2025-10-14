-- AlterTable
ALTER TABLE "file" ALTER COLUMN "uploaded_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "folder" ALTER COLUMN "created_by" DROP NOT NULL;
