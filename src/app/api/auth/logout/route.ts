import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("admin_token");
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
