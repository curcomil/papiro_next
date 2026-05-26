import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const app = request.nextUrl.pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${app}/login?error=unauthorized`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/papiro/dashboard/:path*", "/papiro/collection/:path*"],
};
