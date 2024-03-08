-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "ancestorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ancestorId_fkey" FOREIGN KEY ("ancestorId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
