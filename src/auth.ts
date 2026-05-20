import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    userId: string
    user: DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
          },
        });
        (user as Record<string, unknown>).dbUserId = dbUser.id;
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.dbUserId = (user as Record<string, unknown>).dbUserId as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = (token.dbUserId as string) ?? "";
      return session;
    },
  },
})
