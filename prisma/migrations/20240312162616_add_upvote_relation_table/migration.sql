-- CreateTable
CREATE TABLE "UpvotesOnItems" (
    "itemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpvotesOnItems_pkey" PRIMARY KEY ("itemId","userId")
);

-- AddForeignKey
ALTER TABLE "UpvotesOnItems" ADD CONSTRAINT "UpvotesOnItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotesOnItems" ADD CONSTRAINT "UpvotesOnItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
