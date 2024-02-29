-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "about" TEXT,
    "created" INTEGER NOT NULL,
    "karma" INTEGER NOT NULL,
    "submitted" INTEGER[],
    "email" TEXT,
    "passwordSalt" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
