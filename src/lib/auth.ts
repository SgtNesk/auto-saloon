import { cookies } from "next/headers";

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token");
  return token?.value === process.env.NEXTAUTH_SECRET;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    throw new Error("UNAUTHORIZED");
  }
}
