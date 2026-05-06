import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyBotSignature } from "@/lib/bot-auth";

const payloadSchema = z.object({
  commandId: z.string().min(1),
  status: z.enum(["success", "failed"]),
  result: z.record(z.string(), z.unknown()).optional(),
  errorMessage: z.string().optional(),
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

  const bot = await prisma.botInstance.findUnique({
    where: { botId: verified.botId },
    select: { id: true },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const command = await prisma.botCommand.findUnique({
    where: { id: parsed.data.commandId },
    select: { id: true, botInstanceId: true, guildLinkId: true },
  });

  if (!command || command.botInstanceId !== bot.id) {
    return NextResponse.json({ error: "Command not found" }, { status: 404 });
  }

  await prisma.botCommand.update({
    where: { id: command.id },
    data: {
      status: parsed.data.status,
      result: parsed.data.result as Prisma.InputJsonValue | undefined,
      errorMessage: parsed.data.errorMessage,
      finishedAt: new Date(),
    },
  });

  await prisma.botEvent.create({
    data: {
      botInstanceId: bot.id,
      guildLinkId: command.guildLinkId ?? undefined,
      level: parsed.data.status === "success" ? "info" : "error",
      message:
        parsed.data.status === "success"
          ? "Command completed"
          : "Command failed",
      metadata: {
        commandId: command.id,
        errorMessage: parsed.data.errorMessage,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
