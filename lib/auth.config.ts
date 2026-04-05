import type { NextAuthConfig } from "next-auth";

/**
 * Edge uyumlu paylaşılan yapılandırma (middleware için bcrypt/prisma içermez).
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "user";
        session.user.name = token.name as string | null | undefined;
        session.user.email =
          typeof token.email === "string"
            ? token.email
            : session.user.email ?? "";
      }
      return session;
    },
  },
};
