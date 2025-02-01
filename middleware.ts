// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Possibly read the path
  const path = req.nextUrl.pathname;

  // If path starts with /ai-chat or /account, etc., 
  // ensure a valid session token
  if (path.startsWith("/ai-chat") || path.startsWith("/account")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Optionally specify matchers, if not using a manual path.startsWith check
export const config = {
  matcher: ["/ai-chat/:path*", "/account/:path*"],
};
