import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/kuisioner/:path*",
    "/profil/:path*",
    "/riwayat/:path*",
    "/hasil/:path*",
    "/dashboard/:path*",
    "/artikel/:path*",
  ],
};
