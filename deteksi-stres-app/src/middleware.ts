import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }

      if (pathname.startsWith("/user")) {
        return !!token;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
