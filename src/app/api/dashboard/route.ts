import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [transactions, cars] = await Promise.all([
    prisma.transaction.findMany({ orderBy: { date: "desc" } }),
    prisma.car.findMany(),
  ]);

  const ricavi = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const costi = transactions.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);

  return NextResponse.json({
    ricavi, costi, margine: ricavi - costi,
    disponibili: cars.filter(c => c.status === "DISPONIBILE").length,
    totaleCars: cars.length,
    transactions: transactions.slice(0, 10),
    cars,
  });
}
