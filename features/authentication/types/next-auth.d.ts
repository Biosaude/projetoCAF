import type { DefaultSession } from "next-auth";
import type { RoleKey, UserStatus } from "./auth.types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      status: UserStatus;
      roles: RoleKey[];
    } & DefaultSession["user"];
  }

  interface User {
    status?: UserStatus;
    roles?: RoleKey[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    status?: UserStatus;
    roles?: RoleKey[];
  }
}
