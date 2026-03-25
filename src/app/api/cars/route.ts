import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(cars);
}

export async function POST(req: Request) {
  const body = await req.json();
  const car = await prisma.car.create({
    data: {
      brand: body.brand,
      model: body.model,
      year: parseInt(body.year),
      km: parseInt(body.km) || 0,
      fuel: body.fuel,
      color: body.color || null,
      price: parseFloat(body.price),
      costAcquisto: parseFloat(body.costAcquisto) || 0,
      status: body.status || "DISPONIBILE",
      description: body.description || null,
      emoji: body.emoji || "🚗",
      images: Array.isArray(body.images) ? body.images : [],
    },
  });
  return NextResponse.json(car, { status: 201 });
}
