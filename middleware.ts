import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const userCookie = request.cookies.get("user")?.value;

  // belum sign-in
  if (!userCookie) {
    if (path.startsWith("/admin") || path.startsWith("/member")) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    return NextResponse.next();
  }

  let user;
  try {
    user = JSON.parse(decodeURIComponent(userCookie));
  } catch (e) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const role = user.role;

  // ================= ADMIN AREA =================
  if (path.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/member/products", request.url));
    }
  }

  // ================= MEMBER AREA =================
  if (path.startsWith("/member")) {
    if (role !== "member" && role !== "admin") {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
