import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyBotSignature } from "@/lib/bot-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const verified = await verifyBotSignature(request);

  if (!verified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const botInstance = await prisma.botInstance.findUnique({
    where: { botId: verified.botId },
    select: { id: true },
  });

  if (!botInstance) {
    return NextResponse.json({ command: null });
  }

  const nextCommand = await prisma.botCommand.findFirst({
    where: {
      botInstanceId: botInstance.id,
      status: "pending",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!nextCommand) {
    return NextResponse.json({ command: null });
  }

  await prisma.botCommand.update({
    where: {
      id: nextCommand.id,
    },
    data: {
      status: "running",
      startedAt: new Date(),
    },
  });

  return NextResponse.json({
    command: {
      id: nextCommand.id,
      commandType: nextCommand.commandType,
      payload: nextCommand.payload,
    },
  });
}
