-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'Agent');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'User',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "referralGiftReceived" BOOLEAN NOT NULL DEFAULT false,
    "invitedBySource" TEXT NOT NULL DEFAULT 'SELF',
    "invitedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
