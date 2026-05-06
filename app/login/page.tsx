import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerAuthSession();
  const { next } = await searchParams;

  if (session?.user?.id) {
    redirect(next || "/dsbot/dashboard");
  }

  const callbackUrl = encodeURIComponent(next || "/dsbot/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">DSBot</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Continue with Discord to access the dashboard and guild settings.
        </p>
        <div className="mt-8">
          <a
            href={`/api/auth/signin/discord?callbackUrl=${callbackUrl}`}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Continue with Discord
          </a>
        </div>
      </section>
    </main>
  );
}
