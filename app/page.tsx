export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#f6f8fc_0%,#eef2f8_35%,#e5ebf5_100%)] px-6">
      <section className="w-full max-w-xl rounded-3xl border border-slate-900/10 bg-white/80 p-8 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-12">
        <p className="text-xs font-semibold tracking-[0.26em] text-slate-500">
          SRNG.NO
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Under Construction
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 md:text-base">
          The new SRNG platform is being built right now. Public pages will
          appear here soon.
        </p>
      </section>
    </main>
  );
}
