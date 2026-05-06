import { NextResponse } from "next/server";
import { z } from "zod";

import { getEligibleGuildsForUser } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";

const payloadSchema = z.object({
  guildId: z.string().min(1),
});

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUserSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guildLink = await prisma.guildLink.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      settings: true,
    },
  });

  return NextResponse.json({ guildLink });
}

export async function POST(request: Request) {
  const session = await requireUserSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const guilds = await getEligibleGuildsForUser(session.user.id);
  const guild = guilds.find((entry) => entry.id === parsed.data.guildId);

  if (!guild) {
    return NextResponse.json(
      { error: "Guild not found or no permissions" },
      { status: 403 },
    );
  }

  const guildLink = await prisma.guildLink.upsert({
    where: { guildId: guild.id },
    update: {
      guildName: guild.name,
      linkedById: session.user.id,
    },
    create: {
      guildId: guild.id,
      guildName: guild.name,
      linkedById: session.user.id,
    },
  });

  return NextResponse.json({ guildLink });
}
