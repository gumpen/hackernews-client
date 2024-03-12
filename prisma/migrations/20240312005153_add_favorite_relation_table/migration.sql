-- CreateTable
CREATE TABLE "FavoritesOnItems" (
    "itemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritesOnItems_pkey" PRIMARY KEY ("itemId","userId")
);

-- AddForeignKey
ALTER TABLE "FavoritesOnItems" ADD CONSTRAINT "FavoritesOnItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnItems" ADD CONSTRAINT "FavoritesOnItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
