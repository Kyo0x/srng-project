import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { DashboardClient } from "@/app/[service]/dashboard/ui/dashboard-client";
import { getEligibleGuildsForUser } from "@/lib/discord";
import { prisma } from "@/lib/prisma";

type DashboardPageProps = {
  params: Promise<{ service: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { service } = await params;

  if (service !== "dsbot") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
        <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl md:p-12">
          <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
            Service dashboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {service}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            This service dashboard is not implemented yet.
          </p>
        </section>
      </main>
    );
  }

  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login?next=/dsbot/dashboard");
  }

  const [guilds, guildLink, bot, events] = await Promise.all([
    getEligibleGuildsForUser(session.user.id),
    prisma.guildLink.findFirst({
      orderBy: { createdAt: "desc" },
      include: { settings: true },
    }),
    prisma.botInstance.findFirst({
      orderBy: { updatedAt: "desc" },
    }),
    prisma.botEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  const linkedGuild = guildLink
    ? {
        id: guildLink.id,
        guildId: guildLink.guildId,
        guildName: guildLink.guildName,
      }
    : null;

  const settings = guildLink?.settings
    ? {
        version: guildLink.settings.version,
        updatedAt: guildLink.settings.updatedAt.toISOString(),
        config: guildLink.settings.config,
      }
    : null;

  const botState = bot
    ? {
        displayName: bot.displayName,
        online: bot.online,
        heartbeatMs: bot.heartbeatMs,
        lastSeenAt: bot.lastSeenAt?.toISOString() ?? null,
        appVersion: bot.appVersion,
        hostLabel: bot.hostLabel,
      }
    : null;

  const timeline = events.map((event) => ({
    id: event.id,
    level: event.level,
    message: event.message,
    createdAt: event.createdAt.toISOString(),
  }));

  return (
    <DashboardClient
      userName={session.user.name || session.user.email || "Operator"}
      guilds={guilds}
      linkedGuild={linkedGuild}
      settings={settings}
      botState={botState}
      events={timeline}
    />
  );
}
