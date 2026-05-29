export { default } from "next-auth/middleware";

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