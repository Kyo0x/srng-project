import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

type VerifiedBotRequest = {
  botId: string;
  bodyText: string;
};

const MAX_SKEW_MS = 5 * 60 * 1000;

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function verifyBotSignature(request: Request): Promise<VerifiedBotRequest | null> {
  const botId = request.headers.get("x-srng-bot-id");
  const timestamp = request.headers.get("x-srng-timestamp");
  const nonce = request.headers.get("x-srng-nonce");
  const signature = request.headers.get("x-srng-signature");

  if (!botId || !timestamp || !nonce || !signature) {
    return null;
  }

  const ts = Number(timestamp);

  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
    return null;
  }

  const existingNonce = await prisma.botRequestNonce.findUnique({
    where: { nonce },
    select: { id: true },
  });

  if (existingNonce) {
    return null;
  }

  const sharedSecret = process.env.DSBOT_SHARED_SECRET;
  const expectedBotId = process.env.DSBOT_BOT_ID;

  if (!sharedSecret || !expectedBotId || botId !== expectedBotId) {
    return null;
  }

  const bodyText = await request.text();
  const toSign = `${timestamp}.${nonce}.${bodyText}`;
  const expected = crypto.createHmac("sha256", sharedSecret).update(toSign).digest("hex");

  if (!timingSafeEqual(expected, signature)) {
    return null;
  }

  await prisma.botRequestNonce.create({
    data: { nonce },
  });

  return { botId, bodyText };
}
