type DashboardPageProps = {
  params: Promise<{ service: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { service } = await params;

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
          This is the baseline dashboard route for this service. Build each
          product area here with nested routes, APIs, and auth.
        </p>
      </section>
    </main>
  );
}
