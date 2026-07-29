import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import type { RoleKey, UserStatus } from "../types/auth.types";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return authorizeRequest(nextUrl, Boolean(auth?.user));
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.status =
          (token.status as UserStatus | undefined) ?? "PENDING";
        session.user.roles = (token.roles as RoleKey[] | undefined) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export function authorizeRequest(
  nextUrl: URL,
  isAuthenticated: boolean,
): boolean | Response {
  const isLoginPage = nextUrl.pathname === "/login";
  const isAuthApi = nextUrl.pathname.startsWith("/api/auth");
  if (isAuthApi) return true;
  if (isLoginPage)
    return isAuthenticated
      ? Response.redirect(new URL("/dashboard", nextUrl))
      : true;
  return isAuthenticated;
}
