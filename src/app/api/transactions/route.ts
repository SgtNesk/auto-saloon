import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  const tx = await prisma.transaction.create({
    data: {
      description: body.description,
      amount: parseFloat(body.amount),
      category: body.category || "altro",
      date: body.date ? new Date(body.date) : new Date(),
      carId: body.carId ? parseInt(body.carId) : null,
    },
  });
  return NextResponse.json(tx, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.transaction.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
