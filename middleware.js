import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  console.log(verifyToken(token), "token");
  console.log(token, "ttt");

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
