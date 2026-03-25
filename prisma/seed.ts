import { PrismaClient, CarStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.car.deleteMany();

  const cars = await prisma.car.createMany({
    data: [
      { brand: "BMW", model: "Serie 3 320d", year: 2019, km: 87000, fuel: "Diesel", price: 22500, costAcquisto: 18000, emoji: "🚗", status: CarStatus.DISPONIBILE },
      { brand: "Volkswagen", model: "Golf 8 GTI", year: 2021, km: 34000, fuel: "Benzina", price: 31900, costAcquisto: 27000, emoji: "🏎️", status: CarStatus.DISPONIBILE },
      { brand: "Audi", model: "A4 Avant 2.0 TDI", year: 2020, km: 65000, fuel: "Diesel", price: 28500, costAcquisto: 23500, emoji: "🚙", status: CarStatus.RISERVATO },
      { brand: "Mercedes", model: "Classe A 180", year: 2018, km: 112000, fuel: "Benzina", price: 17800, costAcquisto: 14500, emoji: "🚘", status: CarStatus.VENDUTO },
      { brand: "Toyota", model: "Yaris Cross GR", year: 2022, km: 18000, fuel: "Ibrido", price: 26900, costAcquisto: 23000, emoji: "🚗", status: CarStatus.DISPONIBILE },
    ],
  });

  const allCars = await prisma.car.findMany();

  await prisma.transaction.createMany({
    data: [
      { description: "Vendita Mercedes Classe A", amount: 17800, category: "vendita", carId: allCars.find(c => c.brand === "Mercedes")?.id, date: new Date("2025-02-18") },
      { description: "Acquisto Toyota Yaris Cross", amount: -23000, category: "acquisto", carId: allCars.find(c => c.brand === "Toyota")?.id, date: new Date("2025-02-15") },
      { description: "Carrozzeria BMW Serie 3", amount: -450, category: "riparazione", carId: allCars.find(c => c.brand === "BMW")?.id, date: new Date("2025-02-12") },
      { description: "Vendita Fiat 500X", amount: 14200, category: "vendita", date: new Date("2025-02-08") },
      { description: "Tagliando Audi A4", amount: -280, category: "manutenzione", carId: allCars.find(c => c.brand === "Audi")?.id, date: new Date("2025-02-05") },
      { description: "Pubblicità AutoScout24", amount: -199, category: "marketing", date: new Date("2025-02-01") },
    ],
  });

  console.log(`✅ Seeded ${cars.count} cars and 6 transactions`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
