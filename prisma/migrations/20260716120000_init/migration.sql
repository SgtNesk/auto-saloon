-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('DISPONIBILE', 'RISERVATO', 'VENDUTO');

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "km" INTEGER NOT NULL DEFAULT 0,
    "fuel" TEXT NOT NULL,
    "color" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "costAcquisto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "CarStatus" NOT NULL DEFAULT 'DISPONIBILE',
    "description" TEXT,
    "emoji" TEXT NOT NULL DEFAULT '🚗',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'altro',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carId" INTEGER,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_carId_fkey"
FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
