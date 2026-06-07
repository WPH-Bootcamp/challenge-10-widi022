import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/profile/:path*"],
};
