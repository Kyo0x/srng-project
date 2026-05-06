import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";

const payloadSchema = z.object({
  config: z.record(z.string(), z.unknown()),
});

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUserSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guildLink = await prisma.guildLink.findFirst({
    orderBy: { createdAt: "desc" },
    include: { settings: true },
  });

  return NextResponse.json({ settings: guildLink?.settings ?? null });
}

export async function PUT(request: Request) {
  const session = await requireUserSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = payloadSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const guildLink = await prisma.guildLink.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!guildLink) {
    return NextResponse.json({ error: "No linked guild" }, { status: 400 });
  }

  const settings = await prisma.botSettings.upsert({
    where: {
      guildLinkId: guildLink.id,
    },
    update: {
      config: payload.data.config as Prisma.InputJsonValue,
      version: {
        increment: 1,
      },
    },
    create: {
      guildLinkId: guildLink.id,
      config: payload.data.config as Prisma.InputJsonValue,
    },
  });

  await prisma.botEvent.create({
    data: {
      guildLinkId: guildLink.id,
      level: "info",
      message: "Settings updated from dashboard",
      metadata: {
        userId: session.user.id,
        version: settings.version,
      },
    },
  });

  const bot = await prisma.botInstance.findFirst({ orderBy: { createdAt: "asc" } });

  if (bot) {
    await prisma.botCommand.create({
      data: {
        botInstanceId: bot.id,
        guildLinkId: guildLink.id,
        createdById: session.user.id,
        commandType: "config.update",
        payload: {
          guildId: guildLink.guildId,
          config: payload.data.config as Prisma.InputJsonValue,
          version: settings.version,
        } as Prisma.InputJsonValue,
      },
    });
  }

  return NextResponse.json({ settings });
}
