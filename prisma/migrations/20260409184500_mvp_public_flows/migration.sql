ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MASTER';

CREATE TYPE "ServiceRequestStatus" AS ENUM (
  'OPEN',
  'CLAIMED',
  'IN_PROGRESS',
  'DONE',
  'CANCELLED'
);

ALTER TABLE "User"
  ALTER COLUMN "regionId" DROP NOT NULL;

ALTER TABLE "User"
  ADD COLUMN "avatar_url" TEXT;

CREATE TABLE "MasterProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "region" TEXT,
  "bio" TEXT NOT NULL,
  "experienceText" TEXT NOT NULL,
  "experienceYears" INTEGER,
  "profileImageUrl" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "ratingAverage" DECIMAL(4,2) NOT NULL DEFAULT 0,
  "jobsCompletedCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MasterProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "addressText" TEXT,
  "budgetMin" DECIMAL(12,2),
  "budgetMax" DECIMAL(12,2),
  "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
  "claimedByMasterId" TEXT,
  "claimedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MasterProfile_userId_key" ON "MasterProfile"("userId");
CREATE UNIQUE INDEX "MasterProfile_slug_key" ON "MasterProfile"("slug");
CREATE INDEX "MasterProfile_category_city_idx" ON "MasterProfile"("category", "city");
CREATE INDEX "MasterProfile_isAvailable_idx" ON "MasterProfile"("isAvailable");
CREATE INDEX "ServiceRequest_userId_status_idx" ON "ServiceRequest"("userId", "status");
CREATE INDEX "ServiceRequest_status_city_category_idx" ON "ServiceRequest"("status", "city", "category");
CREATE INDEX "ServiceRequest_claimedByMasterId_status_idx" ON "ServiceRequest"("claimedByMasterId", "status");

ALTER TABLE "MasterProfile"
  ADD CONSTRAINT "MasterProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ServiceRequest"
  ADD CONSTRAINT "ServiceRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ServiceRequest"
  ADD CONSTRAINT "ServiceRequest_claimedByMasterId_fkey"
  FOREIGN KEY ("claimedByMasterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
