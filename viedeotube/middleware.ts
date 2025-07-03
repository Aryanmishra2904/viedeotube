import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // allow unauthenticated on homepage and videos
        if (pathname === "/" || pathname.startsWith("/api/video")) {
          return true;
        }

        // protect other routes (like /admin) only if token is present
        if (token) return true;

        // fallback deny
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static files (/_next/*, /favicon.ico, etc.)
     * - public folder assets (/images, /css, etc.)
     * - api routes (if you want to skip them)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|css|api/auth).*)",
  ],
};
