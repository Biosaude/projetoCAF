import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  pages: { signIn: "/auth/sign-in" },
  session: { strategy: "jwt" },
  callbacks: { authorized: async () => true },
});
