import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
