"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
};

type LinkedGuild = {
  id: string;
  guildId: string;
  guildName: string;
} | null;

type SettingsShape = {
  version: number;
  updatedAt: string;
  config: unknown;
} | null;

type BotState = {
  displayName: string;
  online: boolean;
  heartbeatMs: number | null;
  lastSeenAt: string | null;
  appVersion: string | null;
  hostLabel: string | null;
} | null;

type EventItem = {
  id: string;
  level: string;
  message: string;
  createdAt: string;
};

type DashboardClientProps = {
  userName: string;
  guilds: Guild[];
  linkedGuild: LinkedGuild;
  settings: SettingsShape;
  botState: BotState;
  events: EventItem[];
};

export function DashboardClient({
  userName,
  guilds,
  linkedGuild,
  settings,
  botState,
  events,
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedGuildId, setSelectedGuildId] = useState(
    linkedGuild?.guildId ?? guilds[0]?.id ?? "",
  );
  const [settingsText, setSettingsText] = useState(
    settings?.config ? JSON.stringify(settings.config, null, 2) : "{}",
  );
  const [notice, setNotice] = useState<string | null>(null);

  const botIndicator = useMemo(() => {
    if (!botState) {
      return "Not connected";
    }

    return botState.online ? "Online" : "Offline";
  }, [botState]);

  function refreshView(message?: string) {
    if (message) {
      setNotice(message);
    }

    startTransition(() => {
      router.refresh();
    });
  }

  async function linkGuild() {
    setNotice(null);

    const response = await fetch("/api/dsbot/guild-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildId: selectedGuildId }),
    });

    if (!response.ok) {
      setNotice("Could not link guild. Verify your Discord permissions.");
      return;
    }

    refreshView("Guild linked.");
  }

  async function saveSettings() {
    setNotice(null);

    let parsed: unknown;

    try {
      parsed = JSON.parse(settingsText);
    } catch {
      setNotice("Settings must be valid JSON.");
      return;
    }

    const response = await fetch("/api/dsbot/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ config: parsed }),
    });

    if (!response.ok) {
      setNotice("Could not save settings.");
      return;
    }

    refreshView("Settings saved and command queued.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 md:py-12">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:flex md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">DSBot Control</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-300">Signed in as {userName}</p>
          </div>
          <div className="mt-4 flex gap-3 md:mt-0">
            <button
              type="button"
              onClick={() => refreshView()}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white/40"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Sign out
            </button>
          </div>
        </header>

        {notice ? (
          <p className="mb-5 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">Bot status</p>
            <p className="mt-4 text-2xl font-semibold">{botIndicator}</p>
            <dl className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex justify-between gap-3">
                <dt>Name</dt>
                <dd>{botState?.displayName || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Last heartbeat</dt>
                <dd>{botState?.lastSeenAt ? new Date(botState.lastSeenAt).toLocaleString() : "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Latency</dt>
                <dd>{botState?.heartbeatMs ? `${botState.heartbeatMs} ms` : "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Host</dt>
                <dd>{botState?.hostLabel || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Version</dt>
                <dd>{botState?.appVersion || "-"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
            <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">Guild link</p>
            <p className="mt-2 text-sm text-slate-300">
              Link one Discord server you manage so DSBot settings can be applied.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedGuildId}
                onChange={(event) => setSelectedGuildId(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-white/40"
              >
                {guilds.map((guild) => (
                  <option key={guild.id} value={guild.id}>
                    {guild.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedGuildId || isPending}
                onClick={linkGuild}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition enabled:hover:bg-slate-200 disabled:opacity-50"
              >
                Link guild
              </button>
            </div>
            {linkedGuild ? (
              <p className="mt-3 text-sm text-emerald-200">
                Linked: {linkedGuild.guildName}
              </p>
            ) : (
              <p className="mt-3 text-sm text-amber-200">No guild linked yet.</p>
            )}
          </section>
        </div>

        <section className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">Settings JSON</p>
          <p className="mt-2 text-sm text-slate-300">
            This config is stored in Neon and pushed to the Pi bot through the command queue.
          </p>
          <textarea
            value={settingsText}
            onChange={(event) => setSettingsText(event.target.value)}
            className="mt-4 min-h-64 w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 font-mono text-sm outline-none focus:border-white/40"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {settings ? `Version ${settings.version}` : "No saved settings yet"}
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={saveSettings}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition enabled:hover:bg-slate-200 disabled:opacity-50"
            >
              Save settings
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">Recent events</p>
          {events.length ? (
            <ul className="mt-4 space-y-3">
              {events.map((event) => (
                <li key={event.id} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
                  <p className="text-sm font-medium text-slate-100">{event.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {event.level.toUpperCase()} - {new Date(event.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-300">No events yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}
