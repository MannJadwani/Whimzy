import NextAuth, { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import {z} from "zod"
import { prisma } from "@/lib/prisma"
import { Provider } from '@prisma/client'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
})


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn(params) {
      try {
        const provider = params.account?.provider?.toUpperCase() as Provider;
        await prisma.user.upsert({
          where: { email: params.user.email ?? '' },
          update: {
            name: params.user.name,
            image: params.user.image,
            provider: provider
          },
          create: {
            email: params.user.email ?? '',
            name: params.user.name,
            image: params.user.image,
            provider: provider
          }
        });
      } catch (error) {
        console.log(error)
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
   }
}   

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
