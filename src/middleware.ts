import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminArea && !isAdminLogin) {
    const token = request.cookies.get("admin_token");
    const secret = process.env.NEXTAUTH_SECRET ?? "supersecret_change_in_prod";

    if (!token || token.value !== secret) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
