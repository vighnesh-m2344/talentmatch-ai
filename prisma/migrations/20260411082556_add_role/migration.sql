-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'RECRUITER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
