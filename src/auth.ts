import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    token: string
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Internal-Secret": process.env.INTERNAL_SECRET ?? "",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account?.providerAccountId,
            }),
          }
        )
        if (!res.ok) return false
        const data = (await res.json()) as { token: string; userId: string }
        ;(user as Record<string, unknown>).backendToken = data.token
        ;(user as Record<string, unknown>).userId = data.userId
        return true
      } catch {
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as Record<string, unknown>
        token.backendToken = u.backendToken as string
        token.userId = u.userId as string
      }
      return token
    },
    async session({ session, token }) {
      session.token = (token.backendToken as string) ?? ""
      session.userId = (token.userId as string) ?? ""
      return session
    },
  },
})
