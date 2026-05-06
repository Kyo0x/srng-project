import { NextResponse } from "next/server";

import { getEligibleGuildsForUser } from "@/lib/discord";
import { requireUserSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUserSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guilds = await getEligibleGuildsForUser(session.user.id);
  return NextResponse.json({ guilds });
}
