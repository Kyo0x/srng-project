import { getServerSession, type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

const discordClientId = process.env.AUTH_DISCORD_ID ?? "";
const discordClientSecret = process.env.AUTH_DISCORD_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    DiscordProvider({
      clientId: discordClientId,
      clientSecret: discordClientSecret,
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
