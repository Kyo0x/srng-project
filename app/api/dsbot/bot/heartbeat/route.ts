import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyBotSignature } from "@/lib/bot-auth";

const payloadSchema = z.object({
  latencyMs: z.number().int().nonnegative().optional(),
  uptimeSeconds: z.number().int().nonnegative().optional(),
  memoryMb: z.number().int().nonnegative().optional(),
  guildCount: z.number().int().nonnegative().optional(),
  appVersion: z.string().min(1).optional(),
  hostLabel: z.string().min(1).optional(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const verified = await verifyBotSignature(request);

  if (!verified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(JSON.parse(verified.bodyText || "{}"));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const botInstance = await prisma.botInstance.upsert({
    where: { botId: verified.botId },
    update: {
      online: true,
      lastSeenAt: new Date(),
      heartbeatMs: parsed.data.latencyMs,
      appVersion: parsed.data.appVersion,
      hostLabel: parsed.data.hostLabel,
    },
    create: {
      botId: verified.botId,
      displayName: "DSBot Pi",
      online: true,
      lastSeenAt: new Date(),
      heartbeatMs: parsed.data.latencyMs,
      appVersion: parsed.data.appVersion,
      hostLabel: parsed.data.hostLabel,
    },
  });

  await prisma.botHeartbeat.create({
    data: {
      botInstanceId: botInstance.id,
      latencyMs: parsed.data.latencyMs,
      uptimeSeconds: parsed.data.uptimeSeconds,
      memoryMb: parsed.data.memoryMb,
      guildCount: parsed.data.guildCount,
    },
  });

  return NextResponse.json({ ok: true, serverTime: new Date().toISOString() });
}
