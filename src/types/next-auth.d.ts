import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "FARMER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "CUSTOMER" | "FARMER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CUSTOMER" | "FARMER" | "ADMIN";
  }
}