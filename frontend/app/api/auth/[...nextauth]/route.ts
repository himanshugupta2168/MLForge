import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }) as any

        if (!user) throw new Error("No account found with this email.")
        if (!user.password) throw new Error("This account uses social login. Please sign in with Google or GitHub.")

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) throw new Error("Invalid password.")

        return user
      },
    }),
  ],

  session: { strategy: "jwt" as const },

  callbacks: {
    // Embed user roles + org status into the JWT
    async jwt({ token, user }: any) {
      if (user?.id) {
        token.id = user.id
      }

      if (token.id) {
        // Fetch global role and membership details
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })

        const membership = await prisma.organizationMember.findFirst({
          where: { userId: token.id as string },
          select: { organizationId: true, role: true, status: true },
        })

        token.globalRole = dbUser?.role ?? "USER"
        token.orgId = membership?.organizationId ?? null
        token.hasOrg = !!membership
        token.orgRole = membership?.role ?? null
        token.status = membership?.status ?? null
      }

      return token
    },

    // Expose roles in the session object
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.orgId = token.orgId as string | null
        session.user.hasOrg = token.hasOrg as boolean
        session.user.globalRole = token.globalRole as any
        session.user.orgRole = token.orgRole as any
        session.user.status = token.status as any
      }
      return session
    },
  },

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
