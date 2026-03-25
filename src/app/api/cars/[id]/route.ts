import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({ where: { id: parseInt(params.id) } });
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const car = await prisma.car.update({
    where: { id: parseInt(params.id) },
    data: {
      ...(body.brand !== undefined && { brand: body.brand }),
      ...(body.model !== undefined && { model: body.model }),
      ...(body.year !== undefined && { year: parseInt(body.year) }),
      ...(body.km !== undefined && { km: parseInt(body.km) }),
      ...(body.fuel !== undefined && { fuel: body.fuel }),
      ...(body.color !== undefined && { color: body.color || null }),
      ...(body.price !== undefined && { price: parseFloat(body.price) }),
      ...(body.costAcquisto !== undefined && { costAcquisto: parseFloat(body.costAcquisto) }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.description !== undefined && { description: body.description || null }),
      ...(body.emoji !== undefined && { emoji: body.emoji }),
    },
  });
  return NextResponse.json(car);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.car.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ ok: true });
}
