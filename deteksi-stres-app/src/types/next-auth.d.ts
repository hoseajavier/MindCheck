import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    displayName?: string;
    bio?: string;
  }

  interface Session {
    user: {
      id: string;
      displayName?: string;
      bio?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    displayName?: string;
  }
}