import { prisma } from "@/lib/prisma";

const ADMINISTRATOR = BigInt(0x8);
const MANAGE_GUILD = BigInt(0x20);

type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
};

export type EligibleGuild = {
  id: string;
  name: string;
  icon: string | null;
};

function hasGuildAccess(permissionsRaw: string): boolean {
  const permissions = BigInt(permissionsRaw);
  return (
    (permissions & ADMINISTRATOR) === ADMINISTRATOR ||
    (permissions & MANAGE_GUILD) === MANAGE_GUILD
  );
}

export async function getUserDiscordAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "discord",
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      access_token: true,
    },
  });

  return account?.access_token ?? null;
}

export async function getEligibleGuildsForUser(userId: string): Promise<EligibleGuild[]> {
  const accessToken = await getUserDiscordAccessToken(userId);

  if (!accessToken) {
    return [];
  }

  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const guilds = (await response.json()) as DiscordGuild[];

  return guilds
    .filter((guild) => hasGuildAccess(guild.permissions))
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
    }));
}
