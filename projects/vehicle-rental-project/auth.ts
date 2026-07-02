import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import GoogleProvider from "next-auth/providers/google"
import PostgresAdapter from "@auth/pg-adapter"
import pool from "@/lib/db"
import { ROUTES } from "@/lib/constants"
import { isAuthorizedAdmin } from "@/lib/adminAuth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    Resend({
      from: "noreply@arctictrail.no",
      async sendVerificationRequest({ identifier: email, url }) {
        if (!await isAuthorizedAdmin(email)) {
          throw new Error("Unauthorized email address");
        }

        const emailService = await import("@/lib/email");
        
        try {
          await emailService.sendMagicLinkEmail(email, url);
        } catch (error) {
          console.error("Failed to send magic link email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  pages: {
    signIn: ROUTES.ADMIN_LOGIN,
    verifyRequest: "/auth/verify-request",
    error: ROUTES.ADMIN_LOGIN,
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      return email ? await isAuthorizedAdmin(email) : false;
    },
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id as string;
        session.user.email = user.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/admin`;
    }
  }
})
